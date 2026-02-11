import path from 'path';

export const storageConfig = {
  localStoragePath: path.join(process.cwd(), 'uploads'),
};

export const uploadConfig = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxFiles: 5,
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxDimension: 1200,
  quality: 80,
};
