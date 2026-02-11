import { Router } from 'express';
import { imageController } from '../controllers/image.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { uploadTicketImages, uploadAvatar } from '../middlewares/upload.middleware';
import { uploadLimiter } from '../middlewares/rateLimit.middleware';
import { validate } from '../middlewares/validate.middleware';
import { z } from 'zod';

const router = Router();

// All routes require authentication
router.use(authenticate);

const ticketIdParamSchema = z.object({
  ticketId: z.string().uuid('Invalid ticket ID'),
});

const imageIdParamSchema = z.object({
  imageId: z.string().uuid('Invalid image ID'),
});

// POST /api/v1/images/tickets/:ticketId
router.post(
  '/tickets/:ticketId',
  uploadLimiter,
  validate({ params: ticketIdParamSchema }),
  uploadTicketImages,
  imageController.uploadTicketImages.bind(imageController)
);

// DELETE /api/v1/images/:imageId
router.delete(
  '/:imageId',
  validate({ params: imageIdParamSchema }),
  imageController.deleteImage.bind(imageController)
);

// POST /api/v1/images/avatar
router.post(
  '/avatar',
  uploadLimiter,
  uploadAvatar,
  imageController.uploadAvatar.bind(imageController)
);

export default router;
