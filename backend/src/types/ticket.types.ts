import { TicketStatus, TicketPriority } from '@prisma/client';

export interface CreateTicketInput {
  title: string;
  description: string;
  priority?: TicketPriority;
  dueDate?: Date;
  assigneeId?: string;
}

export interface UpdateTicketInput {
  title?: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  dueDate?: Date | null;
  assigneeId?: string | null;
}

export interface TicketFilterOptions {
  status?: TicketStatus;
  priority?: TicketPriority;
  creatorId?: string;
  assigneeId?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'dueDate' | 'priority';
  sortOrder?: 'asc' | 'desc';
}

export interface TicketResponse {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  creator: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
  assignee: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  } | null;
  _count?: {
    comments: number;
    images: number;
  };
}

export interface TicketListResponse {
  tickets: TicketResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateCommentInput {
  content: string;
}

export interface CommentResponse {
  id: string;
  content: string;
  createdAt: Date;
  author: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
}
