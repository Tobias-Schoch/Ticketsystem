import { z } from 'zod';
import xss from 'xss';

const sanitizeString = (value: string) => xss(value.trim());

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters')
    .transform(sanitizeString)
    .optional(),
  email: z
    .string()
    .email('Invalid email address')
    .transform(sanitizeString)
    .transform((v) => v.toLowerCase())
    .optional(),
});

export const createUserSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .transform(sanitizeString)
    .transform((v) => v.toLowerCase()),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters')
    .transform(sanitizeString),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  role: z.enum(['admin', 'member']).optional().default('member'),
});

export const changeRoleSchema = z.object({
  role: z.enum(['admin', 'member']),
});

export const userIdParamSchema = z.object({
  id: z.string().uuid('Invalid user ID'),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type ChangeRoleInput = z.infer<typeof changeRoleSchema>;
