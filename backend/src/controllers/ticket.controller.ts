import { Request, Response, NextFunction } from 'express';
import { ticketService } from '../services/ticket.service';
import { sendSuccess, sendCreated, sendNoContent, sendPaginated } from '../utils/response';
import { CreateTicketInput, UpdateTicketInput, TicketFilterInput } from '../validators/ticket.validator';
import { TicketStatus } from '@prisma/client';

export class TicketController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = req.query as unknown as TicketFilterInput;
      const { tickets, total, page, limit } = await ticketService.findAll(filters);

      sendPaginated(res, tickets, total, page, limit);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const ticket = await ticketService.findById(id);

      sendSuccess(res, { ticket });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = req.body as CreateTicketInput;
      const ticket = await ticketService.create(input, req.user!.id);

      sendCreated(res, { ticket }, 'Ticket created successfully');
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const input = req.body as UpdateTicketInput;
      const isAdmin = req.user!.role === 'admin';

      const ticket = await ticketService.update(id, input, req.user!.id, isAdmin);

      sendSuccess(res, { ticket }, 'Ticket updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body as { status: TicketStatus };
      const isAdmin = req.user!.role === 'admin';

      const ticket = await ticketService.updateStatus(id, status, req.user!.id, isAdmin);

      sendSuccess(res, { ticket }, 'Ticket status updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const isAdmin = req.user!.role === 'admin';

      await ticketService.delete(id, req.user!.id, isAdmin);

      sendNoContent(res);
    } catch (error) {
      next(error);
    }
  }
}

export const ticketController = new TicketController();
