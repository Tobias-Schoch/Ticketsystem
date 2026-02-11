import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { updateUserSchema, userIdParamSchema } from '../validators/user.validator';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/v1/users
router.get('/', userController.getAll.bind(userController));

// GET /api/v1/users/:id
router.get(
  '/:id',
  validate({ params: userIdParamSchema }),
  userController.getById.bind(userController)
);

// PATCH /api/v1/users/:id
router.patch(
  '/:id',
  validate({ params: userIdParamSchema, body: updateUserSchema }),
  userController.update.bind(userController)
);

// PATCH /api/v1/users/:id/avatar
router.patch(
  '/:id/avatar',
  validate({ params: userIdParamSchema }),
  userController.updateAvatar.bind(userController)
);

export default router;
