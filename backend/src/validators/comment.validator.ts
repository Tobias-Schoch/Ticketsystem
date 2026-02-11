import { z } from 'zod';
import xss from 'xss';

const sanitizeString = (value: string) => xss(value.trim());

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(5000, 'Comment must be at most 5000 characters')
    .transform(sanitizeString),
});

export const commentIdParamSchema = z.object({
  ticketId: z.string().uuid('Invalid ticket ID'),
  commentId: z.string().uuid('Invalid comment ID'),
});

export const ticketIdParamSchema = z.object({
  ticketId: z.string().uuid('Invalid ticket ID'),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
