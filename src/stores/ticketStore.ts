import { create } from 'zustand';
import type { Ticket, TicketStatus, Comment, TicketImage, TicketFilters } from '../types';
import { STORAGE_KEYS } from '../constants';
import { getStorageItem, setStorageItem } from '../utils/storage';
import { generateId, getNow } from '../utils/dateUtils';

interface TicketState {
  tickets: Ticket[];
  filters: TicketFilters;
  isLoading: boolean;

  // CRUD operations
  loadTickets: () => void;
  createTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => Ticket;
  updateTicket: (id: string, updates: Partial<Ticket>) => void;
  deleteTicket: (id: string) => void;

  // Status management
  updateStatus: (id: string, status: TicketStatus) => void;

  // Comments
  addComment: (ticketId: string, authorId: string, content: string) => void;
  deleteComment: (ticketId: string, commentId: string) => void;

  // Images
  addImages: (ticketId: string, images: TicketImage[]) => void;
  removeImage: (ticketId: string, imageId: string) => void;

  // Filters
  setFilters: (filters: Partial<TicketFilters>) => void;
  resetFilters: () => void;

  // Selectors
  getTicketById: (id: string) => Ticket | undefined;
  getFilteredTickets: () => Ticket[];
  getTicketsByStatus: (status: TicketStatus) => Ticket[];
}

const defaultFilters: TicketFilters = {
  status: 'all',
  priority: 'all',
  assigneeId: 'all',
  search: '',
};

export const useTicketStore = create<TicketState>((set, get) => ({
  tickets: [],
  filters: defaultFilters,
  isLoading: true,

  loadTickets: () => {
    const savedTickets = getStorageItem<Ticket[]>(STORAGE_KEYS.TICKETS) || [];
    set({ tickets: savedTickets, isLoading: false });
  },

  createTicket: (ticketData) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: generateId(),
      comments: [],
      createdAt: getNow(),
      updatedAt: getNow(),
    };

    set((state) => {
      const updatedTickets = [...state.tickets, newTicket];
      setStorageItem(STORAGE_KEYS.TICKETS, updatedTickets);
      return { tickets: updatedTickets };
    });

    return newTicket;
  },

  updateTicket: (id, updates) => {
    set((state) => {
      const updatedTickets = state.tickets.map((ticket) =>
        ticket.id === id
          ? { ...ticket, ...updates, updatedAt: getNow() }
          : ticket
      );
      setStorageItem(STORAGE_KEYS.TICKETS, updatedTickets);
      return { tickets: updatedTickets };
    });
  },

  deleteTicket: (id) => {
    set((state) => {
      const updatedTickets = state.tickets.filter((ticket) => ticket.id !== id);
      setStorageItem(STORAGE_KEYS.TICKETS, updatedTickets);
      return { tickets: updatedTickets };
    });
  },

  updateStatus: (id, status) => {
    get().updateTicket(id, { status });
  },

  addComment: (ticketId, authorId, content) => {
    const comment: Comment = {
      id: generateId(),
      ticketId,
      authorId,
      content,
      createdAt: getNow(),
    };

    set((state) => {
      const updatedTickets = state.tickets.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              comments: [...ticket.comments, comment],
              updatedAt: getNow(),
            }
          : ticket
      );
      setStorageItem(STORAGE_KEYS.TICKETS, updatedTickets);
      return { tickets: updatedTickets };
    });
  },

  deleteComment: (ticketId, commentId) => {
    set((state) => {
      const updatedTickets = state.tickets.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              comments: ticket.comments.filter((c) => c.id !== commentId),
              updatedAt: getNow(),
            }
          : ticket
      );
      setStorageItem(STORAGE_KEYS.TICKETS, updatedTickets);
      return { tickets: updatedTickets };
    });
  },

  addImages: (ticketId, images) => {
    set((state) => {
      const updatedTickets = state.tickets.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              images: [...ticket.images, ...images],
              updatedAt: getNow(),
            }
          : ticket
      );
      setStorageItem(STORAGE_KEYS.TICKETS, updatedTickets);
      return { tickets: updatedTickets };
    });
  },

  removeImage: (ticketId, imageId) => {
    set((state) => {
      const updatedTickets = state.tickets.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              images: ticket.images.filter((img) => img.id !== imageId),
              updatedAt: getNow(),
            }
          : ticket
      );
      setStorageItem(STORAGE_KEYS.TICKETS, updatedTickets);
      return { tickets: updatedTickets };
    });
  },

  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
  },

  resetFilters: () => {
    set({ filters: defaultFilters });
  },

  getTicketById: (id) => {
    return get().tickets.find((ticket) => ticket.id === id);
  },

  getFilteredTickets: () => {
    const { tickets, filters } = get();

    return tickets.filter((ticket) => {
      // Status filter
      if (filters.status !== 'all' && ticket.status !== filters.status) {
        return false;
      }

      // Priority filter
      if (filters.priority !== 'all' && ticket.priority !== filters.priority) {
        return false;
      }

      // Assignee filter
      if (filters.assigneeId !== 'all') {
        if (filters.assigneeId === '' && ticket.assigneeId !== null) {
          return false;
        }
        if (filters.assigneeId !== '' && ticket.assigneeId !== filters.assigneeId) {
          return false;
        }
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesTitle = ticket.title.toLowerCase().includes(searchLower);
        const matchesDescription = ticket.description.toLowerCase().includes(searchLower);
        if (!matchesTitle && !matchesDescription) {
          return false;
        }
      }

      return true;
    });
  },

  getTicketsByStatus: (status) => {
    return get().getFilteredTickets().filter((ticket) => ticket.status === status);
  },
}));
