import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TicketCard } from './TicketCard';
import type { Ticket } from '../../types';

interface SortableTicketCardProps {
  ticket: Ticket;
}

export function SortableTicketCard({ ticket }: SortableTicketCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: ticket.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <TicketCard ticket={ticket} isDragging={isDragging} />
    </div>
  );
}
