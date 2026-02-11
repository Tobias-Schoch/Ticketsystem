import { TicketStatus, TicketPriority, Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { NotFoundError, ForbiddenError } from '../utils/errors';
import { CreateTicketInput, UpdateTicketInput, TicketFilterInput } from '../validators/ticket.validator';
import { TicketResponse, TicketListResponse } from '../types';

export class TicketService {
  private selectFields = {
    id: true,
    title: true,
    description: true,
    status: true,
    priority: true,
    dueDate: true,
    createdAt: true,
    updatedAt: true,
    creatorId: true,
    assigneeId: true,
    creator: {
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
      },
    },
    assignee: {
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
      },
    },
    _count: {
      select: {
        comments: true,
        images: true,
      },
    },
  };

  async findAll(filters: TicketFilterInput): Promise<TicketListResponse> {
    const {
      status,
      priority,
      creatorId,
      assigneeId,
      search,
      page,
      limit,
      sortBy,
      sortOrder,
    } = filters;

    const where: Prisma.TicketWhereInput = {};

    if (status) where.status = status as TicketStatus;
    if (priority) where.priority = priority as TicketPriority;
    if (creatorId) where.creatorId = creatorId;
    if (assigneeId) where.assigneeId = assigneeId;

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy: Prisma.TicketOrderByWithRelationInput = {};

    if (sortBy === 'priority') {
      // Custom priority ordering: critical > high > medium > low
      orderBy.priority = sortOrder;
    } else {
      orderBy[sortBy as keyof Prisma.TicketOrderByWithRelationInput] = sortOrder;
    }

    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        select: this.selectFields,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.ticket.count({ where }),
    ]);

    return {
      tickets: tickets as unknown as TicketResponse[],
      total,
      page,
      limit,
    };
  }

  async findById(id: string): Promise<TicketResponse> {
    const ticket = await prisma.ticket.findUnique({
      where: { id },
      select: {
        ...this.selectFields,
        creatorId: true,
        assigneeId: true,
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            authorId: true,
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
        images: {
          select: {
            id: true,
            url: true,
            filename: true,
            mimeType: true,
            size: true,
            createdAt: true,
          },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundError('Ticket not found');
    }

    return ticket as unknown as TicketResponse;
  }

  async create(input: CreateTicketInput, creatorId: string): Promise<TicketResponse> {
    const ticket = await prisma.ticket.create({
      data: {
        title: input.title,
        description: input.description,
        priority: input.priority as TicketPriority,
        dueDate: input.dueDate,
        creatorId,
        assigneeId: input.assigneeId,
      },
      select: this.selectFields,
    });

    return ticket as unknown as TicketResponse;
  }

  async update(
    id: string,
    input: UpdateTicketInput,
    userId: string,
    isAdmin: boolean
  ): Promise<TicketResponse> {
    const ticket = await prisma.ticket.findUnique({
      where: { id },
      select: { creatorId: true, assigneeId: true },
    });

    if (!ticket) {
      throw new NotFoundError('Ticket not found');
    }

    // Check permission: only creator, assignee, or admin can update
    const canUpdate =
      isAdmin ||
      ticket.creatorId === userId ||
      ticket.assigneeId === userId;

    if (!canUpdate) {
      throw new ForbiddenError('You do not have permission to update this ticket');
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: {
        title: input.title,
        description: input.description,
        status: input.status as TicketStatus,
        priority: input.priority as TicketPriority,
        dueDate: input.dueDate,
        assigneeId: input.assigneeId,
      },
      select: this.selectFields,
    });

    return updatedTicket as unknown as TicketResponse;
  }

  async updateStatus(
    id: string,
    status: TicketStatus,
    userId: string,
    isAdmin: boolean
  ): Promise<TicketResponse> {
    const ticket = await prisma.ticket.findUnique({
      where: { id },
      select: { creatorId: true, assigneeId: true },
    });

    if (!ticket) {
      throw new NotFoundError('Ticket not found');
    }

    // Check permission: only creator, assignee, or admin can update status
    const canUpdate =
      isAdmin ||
      ticket.creatorId === userId ||
      ticket.assigneeId === userId;

    if (!canUpdate) {
      throw new ForbiddenError('You do not have permission to update this ticket');
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: { status },
      select: this.selectFields,
    });

    return updatedTicket as unknown as TicketResponse;
  }

  async delete(id: string, userId: string, isAdmin: boolean): Promise<void> {
    const ticket = await prisma.ticket.findUnique({
      where: { id },
      select: { creatorId: true },
    });

    if (!ticket) {
      throw new NotFoundError('Ticket not found');
    }

    // Check permission: only creator or admin can delete
    const canDelete = isAdmin || ticket.creatorId === userId;

    if (!canDelete) {
      throw new ForbiddenError('You do not have permission to delete this ticket');
    }

    await prisma.ticket.delete({ where: { id } });
  }
}

export const ticketService = new TicketService();
