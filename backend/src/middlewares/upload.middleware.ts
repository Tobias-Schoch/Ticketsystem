import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import { uploadConfig } from '../config/storage';
import { BadRequestError } from '../utils/errors';

// File filter to validate MIME types
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback
) => {
  if (uploadConfig.allowedMimeTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(
      new BadRequestError(
        `Invalid file type. Allowed types: ${uploadConfig.allowedMimeTypes.join(', ')}`
      )
    );
  }
};

// Memory storage for processing before uploading to S3
const storage = multer.memoryStorage();

// Create multer instance for ticket images
export const uploadTicketImages = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: uploadConfig.maxFileSize,
    files: uploadConfig.maxFiles,
  },
}).array('images', uploadConfig.maxFiles);

// Create multer instance for single avatar upload
export const uploadAvatar = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: uploadConfig.maxFileSize,
    files: 1,
  },
}).single('avatar');

// Magic bytes signatures for image validation
const MAGIC_BYTES: Record<string, number[]> = {
  'image/jpeg': [0xff, 0xd8, 0xff],
  'image/png': [0x89, 0x50, 0x4e, 0x47],
  'image/gif': [0x47, 0x49, 0x46],
  'image/webp': [0x52, 0x49, 0x46, 0x46], // RIFF
};

// Validate file by checking magic bytes
export const validateImageMagicBytes = (buffer: Buffer, mimeType: string): boolean => {
  const signature = MAGIC_BYTES[mimeType];

  if (!signature) {
    return false;
  }

  // Check if buffer starts with expected magic bytes
  for (let i = 0; i < signature.length; i++) {
    if (buffer[i] !== signature[i]) {
      return false;
    }
  }

  // Additional check for WebP (needs "WEBP" after RIFF header)
  if (mimeType === 'image/webp') {
    const webpSignature = [0x57, 0x45, 0x42, 0x50]; // WEBP
    for (let i = 0; i < webpSignature.length; i++) {
      if (buffer[8 + i] !== webpSignature[i]) {
        return false;
      }
    }
  }

  return true;
};
