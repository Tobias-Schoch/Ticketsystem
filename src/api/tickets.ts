import { api } from './client';
import type { Ticket, TicketStatus, TicketPriority, Comment, TicketImage } from '../types';

// Backend uses underscores, frontend uses hyphens
type BackendTicketStatus = 'open' | 'in_progress' | 'review' | 'done';

function toBackendStatus(status: TicketStatus): BackendTicketStatus {
  return status === 'in-progress' ? 'in_progress' : status as BackendTicketStatus;
}

function toFrontendStatus(status: BackendTicketStatus): TicketStatus {
  return status === 'in_progress' ? 'in-progress' : status as TicketStatus;
}

// Backend response types
interface BackendTicketResponse {
  id: string;
  title: string;
  description: string;
  status: BackendTicketStatus;
  priority: TicketPriority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  creatorId: string;
  creator: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
  assigneeId: string | null;
  assignee: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  } | null;
  comments?: BackendCommentResponse[];
  images?: BackendImageResponse[];
  _count?: {
    comments: number;
    images: number;
  };
}

interface BackendCommentResponse {
  id: string;
  content: string;
  createdAt: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
}

interface BackendImageResponse {
  id: string;
  url: string;
  filename: string;
  createdAt: string;
}

// Transform backend response to frontend format
function transformTicket(ticket: BackendTicketResponse): Ticket {
  return {
    id: ticket.id,
    title: ticket.title,
    description: ticket.description,
    status: toFrontendStatus(ticket.status),
    priority: ticket.priority,
    dueDate: ticket.dueDate,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
    creatorId: ticket.creatorId,
    assigneeId: ticket.assigneeId,
    comments: ticket.comments?.map((c) => ({
      id: c.id,
      ticketId: ticket.id,
      authorId: c.authorId,
      content: c.content,
      createdAt: c.createdAt,
    })) || [],
    images: ticket.images?.map((img) => ({
      id: img.id,
      url: img.url,
      name: img.filename,
      createdAt: img.createdAt,
    })) || [],
  };
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  priority?: TicketPriority;
  dueDate?: string | null;
  assigneeId?: string | null;
}

export interface UpdateTicketRequest {
  title?: string;
  description?: string;
  priority?: TicketPriority;
  dueDate?: string | null;
  assigneeId?: string | null;
}

export interface TicketFiltersParams {
  status?: TicketStatus;
  priority?: TicketPriority;
  assigneeId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const ticketsApi = {
  getAll: async (params?: TicketFiltersParams): Promise<Ticket[]> => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', toBackendStatus(params.status));
    if (params?.priority) searchParams.set('priority', params.priority);
    if (params?.assigneeId) searchParams.set('assigneeId', params.assigneeId);
    if (params?.search) searchParams.set('search', params.search);
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));

    const query = searchParams.toString();
    // sendPaginated returns { success, data: [...], total, page, limit, totalPages }
    // handleResponse extracts data.data which is the array directly
    const tickets = await api.get<BackendTicketResponse[]>(
      `/tickets${query ? `?${query}` : ''}`
    );

    return (tickets || []).map(transformTicket);
  },

  getById: async (id: string): Promise<Ticket> => {
    // sendSuccess returns { success, data: { ticket: {...} } }
    const response = await api.get<{ ticket: BackendTicketResponse }>(`/tickets/${id}`);
    return transformTicket(response.ticket);
  },

  create: async (data: CreateTicketRequest): Promise<Ticket> => {
    const response = await api.post<{ ticket: BackendTicketResponse }>('/tickets', data);
    return transformTicket(response.ticket);
  },

  update: async (id: string, data: UpdateTicketRequest): Promise<Ticket> => {
    const response = await api.patch<{ ticket: BackendTicketResponse }>(`/tickets/${id}`, data);
    return transformTicket(response.ticket);
  },

  updateStatus: async (id: string, status: TicketStatus): Promise<Ticket> => {
    const response = await api.patch<{ ticket: BackendTicketResponse }>(`/tickets/${id}/status`, {
      status: toBackendStatus(status),
    });
    return transformTicket(response.ticket);
  },

  delete: (id: string) => api.delete<null>(`/tickets/${id}`),

  // Comments
  addComment: async (ticketId: string, content: string): Promise<Comment> => {
    const response = await api.post<{ comment: BackendCommentResponse }>(
      `/tickets/${ticketId}/comments`,
      { content }
    );
    return {
      id: response.comment.id,
      ticketId,
      authorId: response.comment.authorId,
      content: response.comment.content,
      createdAt: response.comment.createdAt,
    };
  },

  deleteComment: (ticketId: string, commentId: string) =>
    api.delete<null>(`/tickets/${ticketId}/comments/${commentId}`),

  // Images
  uploadImages: async (ticketId: string, formData: FormData): Promise<TicketImage[]> => {
    const response = await api.upload<{ images: BackendImageResponse[] }>(
      `/images/tickets/${ticketId}`,
      formData
    );
    return response.images.map((img) => ({
      id: img.id,
      url: img.url,
      name: img.filename,
      createdAt: img.createdAt,
    }));
  },

  deleteImage: (imageId: string) => api.delete<null>(`/images/${imageId}`),
};
