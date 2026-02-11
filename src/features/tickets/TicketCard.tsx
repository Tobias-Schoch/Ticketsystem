import { Link } from 'react-router-dom';
import { MessageSquare, Image as ImageIcon, User, Calendar } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { cn } from '../../utils/cn';
import { useUserStore } from '../../stores/userStore';
import { formatRelativeTime, formatDueDate, isOverdue } from '../../utils/dateUtils';
import { PRIORITY_LABELS } from '../../constants';
import type { Ticket } from '../../types';

interface TicketCardProps {
  ticket: Ticket;
  isDragging?: boolean;
}

export function TicketCard({ ticket, isDragging = false }: TicketCardProps) {
  const getUserById = useUserStore((state) => state.getUserById);
  const assignee = ticket.assigneeId ? getUserById(ticket.assigneeId) : null;

  const priorityColors = {
    critical: 'bg-warmth-400',
    high: 'bg-sand-400',
    medium: 'bg-sage-400',
    low: 'bg-calm-400',
  };

  return (
    <Link to={`/aufgaben/${ticket.id}`} className="block group">
      <Card
        className={cn(
          'cursor-pointer transition-all duration-300',
          'hover:shadow-xl hover:-translate-y-2 hover:border-warmth-200/50 dark:hover:border-warmth-700/50',
          isDragging && 'opacity-80 rotate-3 scale-105 shadow-xl ring-2 ring-warmth-400/50'
        )}
        padding="sm"
      >
        {/* Priority indicator bar */}
        <div className="flex items-center gap-2 mb-3">
          <div className={cn('w-8 h-1 rounded-full', priorityColors[ticket.priority])} />
          <span className="text-xs text-sage-400 dark:text-sage-500">{formatRelativeTime(ticket.updatedAt)}</span>
        </div>

        {/* Title */}
        <h3 className="font-medium text-sage-800 dark:text-sage-100 line-clamp-2 mb-2 text-base transition-colors duration-150 group-hover:text-warmth-600 dark:group-hover:text-warmth-400">
          {ticket.title}
        </h3>

        {/* Description preview */}
        {ticket.description && (
          <p className="text-sm text-sage-400 dark:text-sage-500 line-clamp-2 mb-4">
            {ticket.description}
          </p>
        )}

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="priority" priority={ticket.priority}>
            {PRIORITY_LABELS[ticket.priority]}
          </Badge>

          {/* Indicators */}
          <div className="flex items-center gap-2">
            {ticket.dueDate && (
              <div className={cn(
                'flex items-center gap-1 text-xs',
                ticket.status !== 'done' && isOverdue(ticket.dueDate)
                  ? 'text-warmth-500'
                  : 'text-sage-400 dark:text-sage-500'
              )}>
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDueDate(ticket.dueDate)}</span>
              </div>
            )}
            {ticket.comments.length > 0 && (
              <div className="flex items-center gap-1 text-sage-400 dark:text-sage-500 text-xs">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>{ticket.comments.length}</span>
              </div>
            )}
            {ticket.images.length > 0 && (
              <div className="flex items-center gap-1 text-sage-400 dark:text-sage-500 text-xs">
                <ImageIcon className="h-3.5 w-3.5" />
                <span>{ticket.images.length}</span>
              </div>
            )}
          </div>

          {/* Assignee - push to end */}
          <div className="ml-auto">
            {assignee ? (
              <Avatar src={assignee.avatarUrl} name={assignee.name} size="sm" />
            ) : (
              <div className="h-8 w-8 rounded-full bg-sage-100 dark:bg-sage-700 flex items-center justify-center">
                <User className="h-4 w-4 text-sage-400 dark:text-sage-500" />
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
