import sharp from 'sharp';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'crypto';
import { prisma } from '../config/database';
import { s3Client, storageConfig, uploadConfig } from '../config/storage';
import { NotFoundError, ForbiddenError, BadRequestError } from '../utils/errors';
import { validateImageMagicBytes } from '../middlewares/upload.middleware';
import logger from '../utils/logger';

interface ProcessedImage {
  buffer: Buffer;
  mimeType: string;
  width: number;
  height: number;
}

interface ImageRecord {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  storageKey: string;
  createdAt: Date;
}

export class ImageService {
  async processImage(buffer: Buffer, originalMimeType: string): Promise<ProcessedImage> {
    // Validate magic bytes
    if (!validateImageMagicBytes(buffer, originalMimeType)) {
      throw new BadRequestError('Invalid image file - content does not match file type');
    }

    // Get image metadata
    const metadata = await sharp(buffer).metadata();

    // Resize if needed and convert to JPEG for optimization
    let processedBuffer: Buffer;
    let outputMimeType = 'image/jpeg';

    const needsResize =
      (metadata.width && metadata.width > uploadConfig.maxDimension) ||
      (metadata.height && metadata.height > uploadConfig.maxDimension);

    let sharpInstance = sharp(buffer);

    if (needsResize) {
      sharpInstance = sharpInstance.resize(uploadConfig.maxDimension, uploadConfig.maxDimension, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    // Convert to JPEG with quality optimization (except for PNG with transparency)
    if (originalMimeType === 'image/png' && metadata.hasAlpha) {
      processedBuffer = await sharpInstance.png({ quality: uploadConfig.quality }).toBuffer();
      outputMimeType = 'image/png';
    } else if (originalMimeType === 'image/gif') {
      // Keep GIF as is (may be animated)
      processedBuffer = buffer;
      outputMimeType = 'image/gif';
    } else {
      processedBuffer = await sharpInstance
        .jpeg({ quality: uploadConfig.quality, progressive: true })
        .toBuffer();
    }

    // Get final dimensions
    const finalMetadata = await sharp(processedBuffer).metadata();

    return {
      buffer: processedBuffer,
      mimeType: outputMimeType,
      width: finalMetadata.width || 0,
      height: finalMetadata.height || 0,
    };
  }

  async uploadToStorage(
    buffer: Buffer,
    filename: string,
    mimeType: string
  ): Promise<{ storageKey: string; url: string }> {
    const ext = mimeType.split('/')[1];
    const storageKey = `images/${uuidv4()}.${ext}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: storageConfig.bucket,
        Key: storageKey,
        Body: buffer,
        ContentType: mimeType,
        CacheControl: 'public, max-age=31536000', // 1 year cache
      })
    );

    const url = storageConfig.publicUrl
      ? `${storageConfig.publicUrl}/${storageKey}`
      : `${storageConfig.endpoint}/${storageConfig.bucket}/${storageKey}`;

    return { storageKey, url };
  }

  async deleteFromStorage(storageKey: string): Promise<void> {
    try {
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: storageConfig.bucket,
          Key: storageKey,
        })
      );
    } catch (error) {
      logger.error('Failed to delete image from storage:', error);
    }
  }

  async uploadTicketImages(
    files: Express.Multer.File[],
    ticketId: string,
    uploaderId: string
  ): Promise<ImageRecord[]> {
    // Check if ticket exists
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      select: { id: true, _count: { select: { images: true } } },
    });

    if (!ticket) {
      throw new NotFoundError('Ticket not found');
    }

    // Check total image limit
    if (ticket._count.images + files.length > uploadConfig.maxFiles) {
      throw new BadRequestError(
        `Maximum ${uploadConfig.maxFiles} images per ticket. Current: ${ticket._count.images}`
      );
    }

    const uploadedImages: ImageRecord[] = [];

    for (const file of files) {
      try {
        // Process image
        const processed = await this.processImage(file.buffer, file.mimetype);

        // Upload to storage
        const { storageKey, url } = await this.uploadToStorage(
          processed.buffer,
          file.originalname,
          processed.mimeType
        );

        // Save to database
        const image = await prisma.image.create({
          data: {
            url,
            filename: file.originalname,
            mimeType: processed.mimeType,
            size: processed.buffer.length,
            storageKey,
            ticketId,
            uploadedBy: uploaderId,
          },
          select: {
            id: true,
            url: true,
            filename: true,
            mimeType: true,
            size: true,
            storageKey: true,
            createdAt: true,
          },
        });

        uploadedImages.push(image);
      } catch (error) {
        logger.error(`Failed to upload image ${file.originalname}:`, error);
        throw error;
      }
    }

    return uploadedImages;
  }

  async deleteImage(imageId: string, userId: string, isAdmin: boolean): Promise<void> {
    const image = await prisma.image.findUnique({
      where: { id: imageId },
      select: { id: true, uploadedBy: true, storageKey: true },
    });

    if (!image) {
      throw new NotFoundError('Image not found');
    }

    // Check permission: only uploader or admin can delete
    const canDelete = isAdmin || image.uploadedBy === userId;

    if (!canDelete) {
      throw new ForbiddenError('You do not have permission to delete this image');
    }

    // Delete from storage
    await this.deleteFromStorage(image.storageKey);

    // Delete from database
    await prisma.image.delete({ where: { id: imageId } });
  }

  async uploadAvatar(file: Express.Multer.File, userId: string): Promise<string> {
    // Process image
    const processed = await this.processImage(file.buffer, file.mimetype);

    // Resize avatar to smaller dimensions
    const avatarBuffer = await sharp(processed.buffer)
      .resize(200, 200, { fit: 'cover' })
      .jpeg({ quality: 85 })
      .toBuffer();

    // Upload to storage
    const storageKey = `avatars/${userId}.jpg`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: storageConfig.bucket,
        Key: storageKey,
        Body: avatarBuffer,
        ContentType: 'image/jpeg',
        CacheControl: 'public, max-age=86400', // 1 day cache (avatars may change)
      })
    );

    const url = storageConfig.publicUrl
      ? `${storageConfig.publicUrl}/${storageKey}`
      : `${storageConfig.endpoint}/${storageConfig.bucket}/${storageKey}`;

    return url;
  }
}

export const imageService = new ImageService();
