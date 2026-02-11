import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/admin.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createUserSchema, changeRoleSchema, userIdParamSchema } from '../validators/user.validator';

const router = Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

// GET /api/v1/admin/users
router.get('/users', adminController.getAllUsers.bind(adminController));

// POST /api/v1/admin/users
router.post(
  '/users',
  validate({ body: createUserSchema }),
  adminController.createUser.bind(adminController)
);

// PATCH /api/v1/admin/users/:id/role
router.patch(
  '/users/:id/role',
  validate({ params: userIdParamSchema, body: changeRoleSchema }),
  adminController.changeRole.bind(adminController)
);

// PATCH /api/v1/admin/users/:id/deactivate
router.patch(
  '/users/:id/deactivate',
  validate({ params: userIdParamSchema }),
  adminController.deactivateUser.bind(adminController)
);

// PATCH /api/v1/admin/users/:id/activate
router.patch(
  '/users/:id/activate',
  validate({ params: userIdParamSchema }),
  adminController.activateUser.bind(adminController)
);

// GET /api/v1/admin/audit-logs
router.get('/audit-logs', adminController.getAuditLogs.bind(adminController));

export default router;
