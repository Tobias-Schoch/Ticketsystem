import { UserRole } from '@prisma/client';
import { prisma } from '../config/database';
import { hashPassword } from '../utils/password';
import { NotFoundError, ConflictError, BadRequestError } from '../utils/errors';
import { emailService } from './email.service';
import { CreateUserInput } from '../validators/user.validator';
import { UserResponse } from '../types';
import crypto from 'crypto';

export class AdminService {
  async createUser(input: CreateUserInput, loginUrl: string): Promise<UserResponse> {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw new ConflictError('Email already in use');
    }

    // Generate temporary password or use provided one
    const temporaryPassword = input.password || this.generateTemporaryPassword();
    const passwordHash = await hashPassword(temporaryPassword);

    const user = await prisma.user.create({
      data: {
        email: input.email,
        name: input.name,
        passwordHash,
        role: input.role as UserRole,
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Send invitation email
    try {
      await emailService.sendInvitation(
        user.email,
        user.name,
        temporaryPassword,
        loginUrl
      );
    } catch (error) {
      // Log error but don't fail the user creation
      console.error('Failed to send invitation email:', error);
    }

    return user;
  }

  async changeRole(userId: string, role: UserRole, adminId: string): Promise<UserResponse> {
    // Prevent admin from changing their own role
    if (userId === adminId) {
      throw new BadRequestError('Cannot change your own role');
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  async deactivateUser(userId: string, adminId: string): Promise<UserResponse> {
    // Prevent admin from deactivating themselves
    if (userId === adminId) {
      throw new BadRequestError('Cannot deactivate your own account');
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (!user.isActive) {
      throw new BadRequestError('User is already deactivated');
    }

    // Revoke all refresh tokens
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  async activateUser(userId: string): Promise<UserResponse> {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.isActive) {
      throw new BadRequestError('User is already active');
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isActive: true },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  async getAllUsers(): Promise<UserResponse[]> {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return users;
  }

  private generateTemporaryPassword(): string {
    // Generate a secure temporary password
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%^&*';
    let password = '';

    // Ensure at least one of each required character type
    password += 'ABCDEFGHJKLMNPQRSTUVWXYZ'[crypto.randomInt(24)]; // uppercase
    password += 'abcdefghjkmnpqrstuvwxyz'[crypto.randomInt(23)]; // lowercase
    password += '23456789'[crypto.randomInt(8)]; // number
    password += '!@#$%^&*'[crypto.randomInt(8)]; // special

    // Fill rest with random chars
    for (let i = 0; i < 8; i++) {
      password += chars[crypto.randomInt(chars.length)];
    }

    // Shuffle the password
    return password.split('').sort(() => crypto.randomInt(3) - 1).join('');
  }
}

export const adminService = new AdminService();
