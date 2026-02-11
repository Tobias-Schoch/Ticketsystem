import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { sendSuccess, sendNoContent } from '../utils/response';
import { cookieConfig, COOKIE_NAMES } from '../config/jwt';
import { LoginInput, ChangePasswordInput } from '../validators/auth.validator';

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = req.body as LoginInput;
      const { tokens, user } = await authService.login(input);

      // Set cookies
      res.cookie(COOKIE_NAMES.ACCESS_TOKEN, tokens.accessToken, cookieConfig.access);
      res.cookie(COOKIE_NAMES.REFRESH_TOKEN, tokens.refreshToken, cookieConfig.refresh);

      sendSuccess(res, { user }, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken = req.cookies[COOKIE_NAMES.REFRESH_TOKEN];

      if (refreshToken) {
        await authService.logout(refreshToken);
      }

      // Clear cookies
      res.clearCookie(COOKIE_NAMES.ACCESS_TOKEN, cookieConfig.clear);
      res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN, { ...cookieConfig.clear, path: '/api/v1/auth/refresh' });

      sendSuccess(res, null, 'Logout successful');
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken = req.cookies[COOKIE_NAMES.REFRESH_TOKEN];

      if (!refreshToken) {
        res.status(401).json({
          success: false,
          error: 'Refresh token not found',
        });
        return;
      }

      const { tokens, user } = await authService.refresh(refreshToken);

      // Set new cookies
      res.cookie(COOKIE_NAMES.ACCESS_TOKEN, tokens.accessToken, cookieConfig.access);
      res.cookie(COOKIE_NAMES.REFRESH_TOKEN, tokens.refreshToken, cookieConfig.refresh);

      sendSuccess(res, { user }, 'Token refreshed');
    } catch (error) {
      // Clear cookies on refresh failure
      res.clearCookie(COOKIE_NAMES.ACCESS_TOKEN, cookieConfig.clear);
      res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN, { ...cookieConfig.clear, path: '/api/v1/auth/refresh' });
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await authService.getCurrentUser(req.user!.id);
      sendSuccess(res, { user });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = req.body as ChangePasswordInput;
      await authService.changePassword(req.user!.id, input);

      // Clear cookies to force re-login
      res.clearCookie(COOKIE_NAMES.ACCESS_TOKEN, cookieConfig.clear);
      res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN, { ...cookieConfig.clear, path: '/api/v1/auth/refresh' });

      sendSuccess(res, null, 'Password changed successfully. Please log in again.');
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
