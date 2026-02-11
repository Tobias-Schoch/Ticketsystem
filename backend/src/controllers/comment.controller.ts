import { Request, Response, NextFunction } from 'express';
import { commentService } from '../services/comment.service';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/response';
import { CreateCommentInput } from '../validators/comment.validator';

const hasElevatedRole = (role: string) => role === 'teamLead' || role === 'administrator';

export class CommentController {
  async getByTicketId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { ticketId } = req.params;
      const comments = await commentService.findByTicketId(ticketId);

      sendSuccess(res, { comments });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { ticketId } = req.params;
      const input = req.body as CreateCommentInput;

      const comment = await commentService.create(ticketId, input, req.user!.id);

      sendCreated(res, { comment }, 'Comment added successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { ticketId, commentId } = req.params;
      const isAdmin = hasElevatedRole(req.user!.role);

      await commentService.delete(ticketId, commentId, req.user!.id, isAdmin);

      sendNoContent(res);
    } catch (error) {
      next(error);
    }
  }
}

export const commentController = new CommentController();
