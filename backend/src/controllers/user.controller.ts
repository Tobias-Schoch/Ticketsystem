import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';
import { sendSuccess } from '../utils/response';
import { UpdateUserInput } from '../validators/user.validator';

export class UserController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await userService.findAll();
      sendSuccess(res, { users });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = await userService.findById(id);
      sendSuccess(res, { user });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const input = req.body as UpdateUserInput;
      const isAdmin = req.user!.role === 'admin';

      const user = await userService.update(id, input, req.user!.id, isAdmin);
      sendSuccess(res, { user }, 'User updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateAvatar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      // Only allow users to update their own avatar
      if (id !== req.user!.id) {
        res.status(403).json({
          success: false,
          error: 'You can only update your own avatar',
        });
        return;
      }

      // Avatar URL should be set by the image upload process
      const { avatarUrl } = req.body;

      if (!avatarUrl) {
        res.status(400).json({
          success: false,
          error: 'Avatar URL is required',
        });
        return;
      }

      const user = await userService.updateAvatar(id, avatarUrl);
      sendSuccess(res, { user }, 'Avatar updated successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
