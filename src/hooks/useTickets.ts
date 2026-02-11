import { useCallback } from 'react';
import { useTicketStore } from '../stores/ticketStore';
import { useToast } from '../stores/toastStore';
import type { Ticket, TicketStatus, TicketPriority } from '../types';

export function useTickets() {
  const store = useTicketStore();
  const toast = useToast();

  const createTicket = useCallback(
    async (data: {
      title: string;
      description: string;
      priority: TicketPriority;
      assigneeId: string | null;
      creatorId: string;
      dueDate: string | null;
    }) => {
      try {
        const ticket = await store.createTicket({
          ...data,
          status: 'open',
          images: [],
        });
        toast.success('Aufgabe erfolgreich erstellt');
        return ticket;
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Fehler beim Erstellen');
        throw error;
      }
    },
    [store, toast]
  );

  const updateTicket = useCallback(
    async (id: string, updates: Partial<Ticket>) => {
      try {
        await store.updateTicket(id, updates);
        toast.success('Aufgabe aktualisiert');
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Fehler beim Aktualisieren');
        throw error;
      }
    },
    [store, toast]
  );

  const deleteTicket = useCallback(
    async (id: string) => {
      try {
        await store.deleteTicket(id);
        toast.success('Aufgabe gelöscht');
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Fehler beim Löschen');
        throw error;
      }
    },
    [store, toast]
  );

  const updateStatus = useCallback(
    async (id: string, status: TicketStatus) => {
      try {
        await store.updateStatus(id, status);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Fehler beim Status-Update');
        throw error;
      }
    },
    [store, toast]
  );

  const addComment = useCallback(
    async (ticketId: string, content: string) => {
      try {
        await store.addComment(ticketId, content);
        toast.success('Kommentar hinzugefügt');
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Fehler beim Hinzufügen');
        throw error;
      }
    },
    [store, toast]
  );

  const deleteComment = useCallback(
    async (ticketId: string, commentId: string) => {
      try {
        await store.deleteComment(ticketId, commentId);
        toast.success('Kommentar gelöscht');
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Fehler beim Löschen');
        throw error;
      }
    },
    [store, toast]
  );

  const uploadImages = useCallback(
    async (ticketId: string, files: File[]) => {
      try {
        const images = await store.uploadImages(ticketId, files);
        toast.success('Bilder hochgeladen');
        return images;
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Fehler beim Hochladen');
        throw error;
      }
    },
    [store, toast]
  );

  const removeImage = useCallback(
    async (ticketId: string, imageId: string) => {
      try {
        await store.removeImage(ticketId, imageId);
        toast.success('Bild entfernt');
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Fehler beim Entfernen');
        throw error;
      }
    },
    [store, toast]
  );

  return {
    tickets: store.tickets,
    filters: store.filters,
    isLoading: store.isLoading,
    error: store.error,
    createTicket,
    updateTicket,
    deleteTicket,
    updateStatus,
    addComment,
    deleteComment,
    uploadImages,
    removeImage,
    setFilters: store.setFilters,
    resetFilters: store.resetFilters,
    getTicketById: store.getTicketById,
    getFilteredTickets: store.getFilteredTickets,
    getTicketsByStatus: store.getTicketsByStatus,
    refreshTicket: store.refreshTicket,
  };
}
