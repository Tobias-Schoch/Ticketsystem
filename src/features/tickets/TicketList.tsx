import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TicketIcon } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { EmptyState } from '../../components/common/EmptyState';
import { useTicketStore } from '../../stores/ticketStore';
import { useUserStore } from '../../stores/userStore';
import { formatRelativeTime } from '../../utils/dateUtils';
import { STATUS_LABELS, PRIORITY_LABELS, ROUTES } from '../../constants';

export function TicketList() {
  const storeTickets = useTicketStore((state) => state.tickets);
  const filters = useTicketStore((state) => state.filters);
  const getUserById = useUserStore((state) => state.getUserById);

  const tickets = useMemo(() => {
    return storeTickets.filter((ticket) => {
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
  }, [storeTickets, filters]);

  if (tickets.length === 0) {
    return (
      <EmptyState
        icon={<TicketIcon className="h-12 w-12" />}
        title="Keine Aufgaben gefunden"
        description="Es gibt keine Aufgaben, die deinen Filterkriterien entsprechen."
        action={{
          label: 'Neue Aufgabe erstellen',
          onClick: () => window.location.href = ROUTES.TICKET_NEW,
        }}
      />
    );
  }

  return (
    <div className="space-y-3">
      {tickets.map((ticket) => {
        const assignee = ticket.assigneeId ? getUserById(ticket.assigneeId) : null;
        const creator = getUserById(ticket.creatorId);

        return (
          <Link key={ticket.id} to={`/aufgaben/${ticket.id}`}>
            <Card className="hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                {/* Status indicator */}
                <div
                  className={`w-1 h-16 rounded-full ${
                    ticket.status === 'open'
                      ? 'bg-cyan-500'
                      : ticket.status === 'in-progress'
                      ? 'bg-blue-500'
                      : ticket.status === 'review'
                      ? 'bg-purple-500'
                      : 'bg-green-500'
                  }`}
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        {ticket.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mt-1">
                        {ticket.description}
                      </p>
                    </div>

                    {assignee && (
                      <Avatar src={assignee.avatarUrl} name={assignee.name} size="sm" />
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-3">
                    <Badge variant="status" status={ticket.status}>
                      {STATUS_LABELS[ticket.status]}
                    </Badge>
                    <Badge variant="priority" priority={ticket.priority}>
                      {PRIORITY_LABELS[ticket.priority]}
                    </Badge>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {formatRelativeTime(ticket.updatedAt)}
                    </span>
                    {creator && (
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        von {creator.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
