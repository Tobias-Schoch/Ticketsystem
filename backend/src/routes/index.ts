import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import adminRoutes from './admin.routes';
import ticketRoutes from './ticket.routes';
import imageRoutes from './image.routes';
import { generalLimiter } from '../middlewares/rateLimit.middleware';

const router = Router();

// Apply general rate limiting to all routes
router.use(generalLimiter);

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);
router.use('/tickets', ticketRoutes);
router.use('/images', imageRoutes);

export default router;
