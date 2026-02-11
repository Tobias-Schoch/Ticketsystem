import type { User } from '../types';
import { hashPassword } from '../utils/passwordGenerator';

export interface UserWithPassword extends User {
  passwordHash: string;
}

export const mockUsers: UserWithPassword[] = [
  {
    id: 'user-1',
    email: 'anna@beispiel.de',
    name: 'Anna Bergmann',
    avatarUrl: null,
    role: 'admin',
    isActive: true,
    createdAt: '2024-01-01T10:00:00.000Z',
    passwordHash: hashPassword('anna123'),
  },
  {
    id: 'user-2',
    email: 'max@beispiel.de',
    name: 'Max Müller',
    avatarUrl: null,
    role: 'member',
    isActive: true,
    createdAt: '2024-01-15T10:00:00.000Z',
    passwordHash: hashPassword('max123'),
  },
  {
    id: 'user-3',
    email: 'lisa@beispiel.de',
    name: 'Lisa Schmidt',
    avatarUrl: null,
    role: 'member',
    isActive: true,
    createdAt: '2024-02-01T10:00:00.000Z',
    passwordHash: hashPassword('lisa123'),
  },
  {
    id: 'user-4',
    email: 'tom@beispiel.de',
    name: 'Tom Weber',
    avatarUrl: null,
    role: 'member',
    isActive: true,
    createdAt: '2024-02-15T10:00:00.000Z',
    passwordHash: hashPassword('tom123'),
  },
  {
    id: 'user-5',
    email: 'sarah@beispiel.de',
    name: 'Sarah Fischer',
    avatarUrl: null,
    role: 'member',
    isActive: true,
    createdAt: '2024-03-01T10:00:00.000Z',
    passwordHash: hashPassword('sarah123'),
  },
];
