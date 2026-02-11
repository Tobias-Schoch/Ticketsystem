import { prisma } from '../config/database';
import { tokenService } from './token.service';
import { hashPassword, verifyPassword } from '../utils/password';
import { UnauthorizedError, BadRequestError, NotFoundError } from '../utils/errors';
import { TokenPair, UserPayload } from '../types';
import { LoginInput, ChangePasswordInput } from '../validators/auth.validator';

export class AuthService {
  async login(input: LoginInput): Promise<{ tokens: TokenPair; user: UserPayload }> {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Account is deactivated');
    }

    const isValidPassword = await verifyPassword(input.password, user.passwordHash);

    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const tokens = await tokenService.generateTokenPair(user.id, user.email, user.role);

    return {
      tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    };
  }

  async logout(refreshToken: string): Promise<void> {
    await tokenService.revokeRefreshToken(refreshToken);
  }

  async logoutAll(userId: string): Promise<void> {
    await tokenService.revokeAllUserTokens(userId);
  }

  async refresh(refreshToken: string): Promise<{ tokens: TokenPair; user: UserPayload }> {
    const payload = await tokenService.validateRefreshToken(refreshToken);

    // Fetch fresh user data
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Account is deactivated');
    }

    // Revoke old refresh token (token rotation)
    await tokenService.revokeRefreshToken(refreshToken);

    // Generate new token pair
    const tokens = await tokenService.generateTokenPair(user.id, user.email, user.role);

    return {
      tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    };
  }

  async getCurrentUser(userId: string): Promise<UserPayload> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
        isActive: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Account is deactivated');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatarUrl: user.avatarUrl,
    };
  }

  async changePassword(userId: string, input: ChangePasswordInput): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isValidPassword = await verifyPassword(input.currentPassword, user.passwordHash);

    if (!isValidPassword) {
      throw new BadRequestError('Current password is incorrect');
    }

    const newPasswordHash = await hashPassword(input.newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });

    // Revoke all refresh tokens to force re-login on other devices
    await tokenService.revokeAllUserTokens(userId);
  }
}

export const authService = new AuthService();
