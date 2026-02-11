import { prisma } from '../config/database';
import { NotFoundError, ConflictError } from '../utils/errors';
import { UserResponse, UpdateUserInput } from '../types';

export class UserService {
  async findAll(includeInactive: boolean = false, includeAdministrators: boolean = false): Promise<UserResponse[]> {
    const users = await prisma.user.findMany({
      where: {
        ...(includeInactive ? {} : { isActive: true }),
        ...(includeAdministrators ? {} : { role: { not: 'administrator' } }),
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
      orderBy: { name: 'asc' },
    });

    return users;
  }

  async findById(id: string): Promise<UserResponse> {
    const user = await prisma.user.findUnique({
      where: { id },
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

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<UserResponse | null> {
    const user = await prisma.user.findUnique({
      where: { email },
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

    return user;
  }

  async update(id: string, input: UpdateUserInput, requesterId: string, isAdmin: boolean): Promise<UserResponse> {
    // Only allow self-update or admin update
    if (id !== requesterId && !isAdmin) {
      throw new NotFoundError('User not found');
    }

    const existingUser = await prisma.user.findUnique({ where: { id } });

    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    // Email changes are only allowed for administrators
    if (input.email && input.email !== existingUser.email) {
      const requester = await prisma.user.findUnique({ where: { id: requesterId } });

      if (!requester || requester.role !== 'administrator') {
        throw new ConflictError('Only administrators can change email addresses');
      }

      const emailExists = await prisma.user.findUnique({
        where: { email: input.email },
      });

      if (emailExists) {
        throw new ConflictError('Email already in use');
      }
    }

    const user = await prisma.user.update({
      where: { id },
      data: input,
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

    return user;
  }

  async updateAvatar(id: string, avatarUrl: string): Promise<UserResponse> {
    const user = await prisma.user.update({
      where: { id },
      data: { avatarUrl },
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

    return user;
  }
}

export const userService = new UserService();
