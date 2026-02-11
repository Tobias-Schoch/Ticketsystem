import { prisma } from '../config/database';
import { NotFoundError, ForbiddenError } from '../utils/errors';
import { CreateCommentInput } from '../validators/comment.validator';
import { CommentResponse } from '../types';

export class CommentService {
  private selectFields = {
    id: true,
    content: true,
    createdAt: true,
    author: {
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
      },
    },
  };

  async findByTicketId(ticketId: string): Promise<CommentResponse[]> {
    // Check if ticket exists
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      select: { id: true },
    });

    if (!ticket) {
      throw new NotFoundError('Ticket not found');
    }

    const comments = await prisma.comment.findMany({
      where: { ticketId },
      select: this.selectFields,
      orderBy: { createdAt: 'asc' },
    });

    return comments as CommentResponse[];
  }

  async create(
    ticketId: string,
    input: CreateCommentInput,
    authorId: string
  ): Promise<CommentResponse> {
    // Check if ticket exists
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      select: { id: true },
    });

    if (!ticket) {
      throw new NotFoundError('Ticket not found');
    }

    const comment = await prisma.comment.create({
      data: {
        content: input.content,
        ticketId,
        authorId,
      },
      select: this.selectFields,
    });

    return comment as CommentResponse;
  }

  async delete(
    ticketId: string,
    commentId: string,
    userId: string,
    isAdmin: boolean
  ): Promise<void> {
    const comment = await prisma.comment.findFirst({
      where: {
        id: commentId,
        ticketId,
      },
      select: { authorId: true },
    });

    if (!comment) {
      throw new NotFoundError('Comment not found');
    }

    // Check permission: only author or admin can delete
    const canDelete = isAdmin || comment.authorId === userId;

    if (!canDelete) {
      throw new ForbiddenError('You do not have permission to delete this comment');
    }

    await prisma.comment.delete({ where: { id: commentId } });
  }
}

export const commentService = new CommentService();
