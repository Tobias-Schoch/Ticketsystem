import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { authLimiter, passwordChangeLimiter, refreshLimiter } from '../middlewares/rateLimit.middleware';
import { loginSchema, changePasswordSchema } from '../validators/auth.validator';

const router = Router();

// POST /api/v1/auth/login
router.post(
  '/login',
  authLimiter,
  validate({ body: loginSchema }),
  authController.login.bind(authController)
);

// POST /api/v1/auth/logout
router.post(
  '/logout',
  authenticate,
  authController.logout.bind(authController)
);

// POST /api/v1/auth/refresh
router.post(
  '/refresh',
  refreshLimiter,
  authController.refresh.bind(authController)
);

// GET /api/v1/auth/me
router.get(
  '/me',
  authenticate,
  authController.me.bind(authController)
);

// POST /api/v1/auth/change-password
router.post(
  '/change-password',
  authenticate,
  passwordChangeLimiter,
  validate({ body: changePasswordSchema }),
  authController.changePassword.bind(authController)
);

export default router;
