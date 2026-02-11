import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { cn } from '../../utils/cn';
import { SortableTicketCard } from './SortableTicketCard';
import type { Ticket, TicketStatus } from '../../types';

interface KanbanColumnProps {
  id: TicketStatus;
  title: string;
  tickets: Ticket[];
  emoji: string;
}

export function KanbanColumn({ id, title, tickets, emoji }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex flex-col w-80 min-w-[320px]">
      {/* Column header */}
      <div className="flex items-center gap-3 mb-4 px-2">
        <span className="text-xl">{emoji}</span>
        <div>
          <h3 className="font-semibold text-sage-800 dark:text-sage-100">{title}</h3>
          <span className="text-xs text-sage-400 dark:text-sage-500">
            {tickets.length} {tickets.length === 1 ? 'Aufgabe' : 'Aufgaben'}
          </span>
        </div>
      </div>

      {/* Column content */}
      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 p-3 rounded-3xl min-h-[300px] transition-all duration-300',
          isOver
            ? 'bg-calm-50 dark:bg-calm-900/30 ring-2 ring-calm-300 dark:ring-calm-600 ring-dashed'
            : 'bg-sage-50/30 dark:bg-sage-800/30'
        )}
      >
        <SortableContext items={tickets.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3 stagger-list">
            {tickets.map((ticket, index) => (
              <div
                key={ticket.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <SortableTicketCard ticket={ticket} />
              </div>
            ))}
            {tickets.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-sage-400 dark:text-sage-500 text-sm">Keine Aufgaben</p>
                <p className="text-sage-300 dark:text-sage-600 text-xs mt-1">
                  Ziehe eine Aufgabe hierher
                </p>
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}
