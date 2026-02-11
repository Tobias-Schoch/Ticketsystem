import { useCallback } from 'react';
import { useTicketStore } from '../stores/ticketStore';
import { useToast } from '../stores/toastStore';
import type { Ticket, TicketStatus, TicketPriority, TicketImage } from '../types';

export function useTickets() {
  const store = useTicketStore();
  const toast = useToast();

  const createTicket = useCallback(
    (data: {
      title: string;
      description: string;
      priority: TicketPriority;
      assigneeId: string | null;
      creatorId: string;
      dueDate: string | null;
      images: TicketImage[];
    }) => {
      const ticket = store.createTicket({
        ...data,
        status: 'open',
      });
      toast.success('Aufgabe erfolgreich erstellt');
      return ticket;
    },
    [store, toast]
  );

  const updateTicket = useCallback(
    (id: string, updates: Partial<Ticket>) => {
      store.updateTicket(id, updates);
      toast.success('Aufgabe aktualisiert');
    },
    [store, toast]
  );

  const deleteTicket = useCallback(
    (id: string) => {
      store.deleteTicket(id);
      toast.success('Aufgabe gelöscht');
    },
    [store, toast]
  );

  const updateStatus = useCallback(
    (id: string, status: TicketStatus) => {
      store.updateStatus(id, status);
    },
    [store]
  );

  const addComment = useCallback(
    (ticketId: string, authorId: string, content: string) => {
      store.addComment(ticketId, authorId, content);
      toast.success('Kommentar hinzugefügt');
    },
    [store, toast]
  );

  return {
    tickets: store.tickets,
    filters: store.filters,
    isLoading: store.isLoading,
    createTicket,
    updateTicket,
    deleteTicket,
    updateStatus,
    addComment,
    deleteComment: store.deleteComment,
    setFilters: store.setFilters,
    resetFilters: store.resetFilters,
    getTicketById: store.getTicketById,
    getFilteredTickets: store.getFilteredTickets,
    getTicketsByStatus: store.getTicketsByStatus,
  };
}
