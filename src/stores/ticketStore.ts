import { create } from 'zustand';
import type { Ticket, TicketStatus, TicketImage, TicketFilters } from '../types';
import { ticketsApi, ApiError } from '../api';

interface TicketState {
  tickets: Ticket[];
  filters: TicketFilters;
  isLoading: boolean;
  error: string | null;

  // CRUD operations
  loadTickets: () => Promise<void>;
  createTicket: (
    ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'images'>
  ) => Promise<Ticket>;
  updateTicket: (id: string, updates: Partial<Ticket>) => Promise<void>;
  deleteTicket: (id: string) => Promise<void>;

  // Status management
  updateStatus: (id: string, status: TicketStatus) => Promise<void>;

  // Comments
  addComment: (ticketId: string, content: string) => Promise<void>;
  deleteComment: (ticketId: string, commentId: string) => Promise<void>;

  // Images
  uploadImages: (ticketId: string, files: File[]) => Promise<TicketImage[]>;
  removeImage: (ticketId: string, imageId: string) => Promise<void>;

  // Filters
  setFilters: (filters: Partial<TicketFilters>) => void;
  resetFilters: () => void;

  // Selectors
  getTicketById: (id: string) => Ticket | undefined;
  getFilteredTickets: () => Ticket[];
  getTicketsByStatus: (status: TicketStatus) => Ticket[];

  // Refresh
  refreshTicket: (id: string) => Promise<void>;
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
  error: null,

  loadTickets: async () => {
    try {
      set({ isLoading: true, error: null });
      const tickets = await ticketsApi.getAll();
      set({ tickets, isLoading: false });
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Fehler beim Laden der Tickets';
      set({ error: message, isLoading: false });
    }
  },

  createTicket: async (ticketData) => {
    try {
      const newTicket = await ticketsApi.create({
        title: ticketData.title,
        description: ticketData.description,
        priority: ticketData.priority,
        dueDate: ticketData.dueDate,
        assigneeId: ticketData.assigneeId,
      });

      set((state) => ({
        tickets: [...state.tickets, newTicket],
      }));

      return newTicket;
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Fehler beim Erstellen des Tickets';
      throw new Error(message);
    }
  },

  updateTicket: async (id, updates) => {
    try {
      const updatedTicket = await ticketsApi.update(id, {
        title: updates.title,
        description: updates.description,
        priority: updates.priority,
        dueDate: updates.dueDate,
        assigneeId: updates.assigneeId,
      });

      set((state) => ({
        tickets: state.tickets.map((ticket) =>
          ticket.id === id ? updatedTicket : ticket
        ),
      }));
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Fehler beim Aktualisieren des Tickets';
      throw new Error(message);
    }
  },

  deleteTicket: async (id) => {
    try {
      await ticketsApi.delete(id);
      set((state) => ({
        tickets: state.tickets.filter((ticket) => ticket.id !== id),
      }));
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Fehler beim Löschen des Tickets';
      throw new Error(message);
    }
  },

  updateStatus: async (id, status) => {
    try {
      const updatedTicket = await ticketsApi.updateStatus(id, status);
      set((state) => ({
        tickets: state.tickets.map((ticket) =>
          ticket.id === id ? updatedTicket : ticket
        ),
      }));
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Fehler beim Aktualisieren des Status';
      throw new Error(message);
    }
  },

  addComment: async (ticketId, content) => {
    try {
      const comment = await ticketsApi.addComment(ticketId, content);
      set((state) => ({
        tickets: state.tickets.map((ticket) =>
          ticket.id === ticketId
            ? { ...ticket, comments: [...ticket.comments, comment] }
            : ticket
        ),
      }));
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Fehler beim Hinzufügen des Kommentars';
      throw new Error(message);
    }
  },

  deleteComment: async (ticketId, commentId) => {
    try {
      await ticketsApi.deleteComment(ticketId, commentId);
      set((state) => ({
        tickets: state.tickets.map((ticket) =>
          ticket.id === ticketId
            ? {
                ...ticket,
                comments: ticket.comments.filter((c) => c.id !== commentId),
              }
            : ticket
        ),
      }));
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Fehler beim Löschen des Kommentars';
      throw new Error(message);
    }
  },

  uploadImages: async (ticketId, files) => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('images', file);
      });

      const images = await ticketsApi.uploadImages(ticketId, formData);

      set((state) => ({
        tickets: state.tickets.map((ticket) =>
          ticket.id === ticketId
            ? { ...ticket, images: [...ticket.images, ...images] }
            : ticket
        ),
      }));

      return images;
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Fehler beim Hochladen der Bilder';
      throw new Error(message);
    }
  },

  removeImage: async (ticketId, imageId) => {
    try {
      await ticketsApi.deleteImage(imageId);
      set((state) => ({
        tickets: state.tickets.map((ticket) =>
          ticket.id === ticketId
            ? {
                ...ticket,
                images: ticket.images.filter((img) => img.id !== imageId),
              }
            : ticket
        ),
      }));
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Fehler beim Löschen des Bildes';
      throw new Error(message);
    }
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

  refreshTicket: async (id) => {
    try {
      const ticket = await ticketsApi.getById(id);
      set((state) => ({
        tickets: state.tickets.map((t) => (t.id === id ? ticket : t)),
      }));
    } catch (error) {
      console.error('Failed to refresh ticket:', error);
    }
  },
}));
