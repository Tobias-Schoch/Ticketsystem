import { z } from 'zod';
import xss from 'xss';

const sanitizeString = (value: string) => xss(value.trim());

export const createTicketSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be at most 200 characters')
    .transform(sanitizeString),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(10000, 'Description must be at most 10000 characters')
    .transform(sanitizeString),
  priority: z.enum(['critical', 'high', 'medium', 'low']).optional().default('medium'),
  dueDate: z
    .string()
    .datetime()
    .transform((v) => new Date(v))
    .optional()
    .nullable(),
  assigneeId: z.string().uuid('Invalid assignee ID').optional().nullable(),
});

export const updateTicketSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be at most 200 characters')
    .transform(sanitizeString)
    .optional(),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(10000, 'Description must be at most 10000 characters')
    .transform(sanitizeString)
    .optional(),
  status: z.enum(['open', 'in_progress', 'review', 'done']).optional(),
  priority: z.enum(['critical', 'high', 'medium', 'low']).optional(),
  dueDate: z
    .string()
    .datetime()
    .transform((v) => new Date(v))
    .optional()
    .nullable(),
  assigneeId: z.string().uuid('Invalid assignee ID').optional().nullable(),
});

export const updateStatusSchema = z.object({
  status: z.enum(['open', 'in_progress', 'review', 'done']),
});

export const ticketIdParamSchema = z.object({
  id: z.string().uuid('Invalid ticket ID'),
});

export const ticketFilterSchema = z.object({
  status: z.enum(['open', 'in_progress', 'review', 'done']).optional(),
  priority: z.enum(['critical', 'high', 'medium', 'low']).optional(),
  creatorId: z.string().uuid().optional(),
  assigneeId: z.string().uuid().optional(),
  search: z.string().max(100).optional(),
  page: z.string().transform((v) => parseInt(v, 10)).pipe(z.number().min(1)).optional().default('1'),
  limit: z.string().transform((v) => parseInt(v, 10)).pipe(z.number().min(1).max(100)).optional().default('20'),
  sortBy: z.enum(['createdAt', 'updatedAt', 'dueDate', 'priority']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type UpdateTicketInput = z.infer<typeof updateTicketSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
export type TicketFilterInput = z.infer<typeof ticketFilterSchema>;
