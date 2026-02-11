import { Router } from 'express';
import { ticketController } from '../controllers/ticket.controller';
import { commentController } from '../controllers/comment.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  createTicketSchema,
  updateTicketSchema,
  updateStatusSchema,
  ticketIdParamSchema,
  ticketFilterSchema,
} from '../validators/ticket.validator';
import {
  createCommentSchema,
  commentIdParamSchema,
  ticketIdParamSchema as commentTicketIdParamSchema,
} from '../validators/comment.validator';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Ticket routes
// GET /api/v1/tickets
router.get(
  '/',
  validate({ query: ticketFilterSchema }),
  ticketController.getAll.bind(ticketController)
);

// GET /api/v1/tickets/:id
router.get(
  '/:id',
  validate({ params: ticketIdParamSchema }),
  ticketController.getById.bind(ticketController)
);

// POST /api/v1/tickets
router.post(
  '/',
  validate({ body: createTicketSchema }),
  ticketController.create.bind(ticketController)
);

// PATCH /api/v1/tickets/:id
router.patch(
  '/:id',
  validate({ params: ticketIdParamSchema, body: updateTicketSchema }),
  ticketController.update.bind(ticketController)
);

// PATCH /api/v1/tickets/:id/status
router.patch(
  '/:id/status',
  validate({ params: ticketIdParamSchema, body: updateStatusSchema }),
  ticketController.updateStatus.bind(ticketController)
);

// DELETE /api/v1/tickets/:id
router.delete(
  '/:id',
  validate({ params: ticketIdParamSchema }),
  ticketController.delete.bind(ticketController)
);

// Comment routes (nested under tickets)
// GET /api/v1/tickets/:ticketId/comments
router.get(
  '/:ticketId/comments',
  validate({ params: commentTicketIdParamSchema }),
  commentController.getByTicketId.bind(commentController)
);

// POST /api/v1/tickets/:ticketId/comments
router.post(
  '/:ticketId/comments',
  validate({ params: commentTicketIdParamSchema, body: createCommentSchema }),
  commentController.create.bind(commentController)
);

// DELETE /api/v1/tickets/:ticketId/comments/:commentId
router.delete(
  '/:ticketId/comments/:commentId',
  validate({ params: commentIdParamSchema }),
  commentController.delete.bind(commentController)
);

export default router;
