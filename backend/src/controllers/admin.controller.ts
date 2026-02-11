import { Request, Response, NextFunction } from 'express';
import { adminService } from '../services/admin.service';
import { auditService } from '../services/audit.service';
import { sendSuccess, sendCreated, sendPaginated } from '../utils/response';
import { CreateUserInput, ChangeRoleInput } from '../validators/user.validator';

export class AdminController {
  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = req.body as CreateUserInput;
      const loginUrl = `${req.headers.origin || process.env.CORS_ORIGIN}/login`;

      const user = await adminService.createUser(input, loginUrl);
      sendCreated(res, { user }, 'User created successfully');
    } catch (error) {
      next(error);
    }
  }

  async changeRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { role } = req.body as ChangeRoleInput;

      const user = await adminService.changeRole(id, role, req.user!.id);
      sendSuccess(res, { user }, 'User role updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deactivateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const user = await adminService.deactivateUser(id, req.user!.id);
      sendSuccess(res, { user }, 'User deactivated successfully');
    } catch (error) {
      next(error);
    }
  }

  async activateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const user = await adminService.activateUser(id);
      sendSuccess(res, { user }, 'User activated successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await adminService.getAllUsers();
      sendSuccess(res, { users });
    } catch (error) {
      next(error);
    }
  }

  async getAuditLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        page = '1',
        limit = '50',
        action,
        entityType,
        actorId,
        startDate,
        endDate,
      } = req.query;

      const { logs, total } = await auditService.getLogs({
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
        action: action as string,
        entityType: entityType as string,
        actorId: actorId as string,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
      });

      sendPaginated(
        res,
        logs,
        total,
        parseInt(page as string, 10),
        parseInt(limit as string, 10)
      );
    } catch (error) {
      next(error);
    }
  }
}

export const adminController = new AdminController();
