import { S3Client } from '@aws-sdk/client-s3';

export const storageConfig = {
  endpoint: process.env.STORAGE_ENDPOINT || '',
  accessKeyId: process.env.STORAGE_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY || '',
  bucket: process.env.STORAGE_BUCKET || 'ticketsystem-images',
  publicUrl: process.env.STORAGE_PUBLIC_URL || '',
  region: process.env.STORAGE_REGION || 'auto',
};

export const s3Client = new S3Client({
  endpoint: storageConfig.endpoint,
  region: storageConfig.region,
  credentials: {
    accessKeyId: storageConfig.accessKeyId,
    secretAccessKey: storageConfig.secretAccessKey,
  },
  forcePathStyle: true,
});

export const uploadConfig = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxFiles: 5,
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxDimension: 1200,
  quality: 80,
};
