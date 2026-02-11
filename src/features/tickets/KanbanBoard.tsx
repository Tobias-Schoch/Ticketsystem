import { useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useState } from 'react';
import { KanbanColumn } from './KanbanColumn';
import { TicketCard } from './TicketCard';
import { useTicketStore } from '../../stores/ticketStore';
import { useToast } from '../../stores/toastStore';
import { STATUSES } from '../../constants';
import type { Ticket, TicketStatus } from '../../types';

const COLUMN_CONFIG: Record<TicketStatus, { emoji: string }> = {
  'open': { emoji: '🌱' },
  'in-progress': { emoji: '🌿' },
  'review': { emoji: '🌸' },
  'done': { emoji: '🌳' },
};

export function KanbanBoard() {
  const { getFilteredTickets, updateStatus, getTicketById } = useTicketStore();
  const toast = useToast();
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const tickets = getFilteredTickets();

  const getTicketsByStatus = useCallback(
    (status: TicketStatus) => {
      const filtered = tickets.filter((t) => t.status === status);

      // Hide completed tasks older than 7 days from the board
      if (status === 'done') {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        return filtered.filter((t) => {
          const updatedDate = new Date(t.updatedAt);
          return updatedDate >= sevenDaysAgo;
        });
      }

      return filtered;
    },
    [tickets]
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const ticket = getTicketById(event.active.id as string);
      if (ticket) {
        setActiveTicket(ticket);
      }
    },
    [getTicketById]
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveTicket(null);

      if (!over) return;

      const ticketId = active.id as string;
      const newStatus = over.id as TicketStatus;

      // Check if dropped on a column
      if (STATUSES.some((s) => s.value === newStatus)) {
        const ticket = getTicketById(ticketId);
        if (ticket && ticket.status !== newStatus) {
          try {
            await updateStatus(ticketId, newStatus);
            const messages = {
              'open': 'Aufgabe ist jetzt offen',
              'in-progress': 'Du bist dran!',
              'review': 'Bereit zur Überprüfung',
              'done': 'Geschafft!',
            };
            toast.success(messages[newStatus]);
          } catch {
            toast.error('Status konnte nicht geändert werden');
          }
        }
      }
    },
    [getTicketById, updateStatus, toast]
  );

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth min-w-0">
          {STATUSES.map((status) => (
            <KanbanColumn
              key={status.value}
              id={status.value}
              title={status.label}
              emoji={COLUMN_CONFIG[status.value].emoji}
              tickets={getTicketsByStatus(status.value)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTicket ? <TicketCard ticket={activeTicket} isDragging /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
