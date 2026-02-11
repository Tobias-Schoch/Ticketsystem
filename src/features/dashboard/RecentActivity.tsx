import { Link } from 'react-router-dom';
import { MessageSquare, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { useTicketStore } from '../../stores/ticketStore';
import { useUserStore } from '../../stores/userStore';
import { formatRelativeTime } from '../../utils/dateUtils';
import { PRIORITY_LABELS, STATUS_LABELS } from '../../constants';

export function RecentActivity() {
  const tickets = useTicketStore((state) => state.tickets);
  const getUserById = useUserStore((state) => state.getUserById);

  // Get recent tickets sorted by update time
  const recentTickets = [...tickets]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  if (recentTickets.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Clock className="h-12 w-12 text-sage-200 dark:text-sage-700 mx-auto mb-4" />
          <p className="text-sage-500 dark:text-sage-400">Noch keine Aktivitäten</p>
          <p className="text-sm text-sage-400 dark:text-sage-500 mt-1">
            Erstelle deine erste Aufgabe, um loszulegen
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-sage-400 dark:text-sage-500" />
          Letzte Aktivitäten
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {recentTickets.map((ticket) => {
          const creator = getUserById(ticket.creatorId);
          const hasComments = ticket.comments.length > 0;

          return (
            <Link
              key={ticket.id}
              to={`/aufgaben/${ticket.id}`}
              className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 -mx-2 rounded-xl sm:rounded-2xl hover:bg-sage-50/50 dark:hover:bg-sage-800/50 transition-all duration-300 group"
            >
              {creator && (
                <Avatar src={creator.avatarUrl} name={creator.name} size="sm" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sage-800 dark:text-sage-100 truncate group-hover:text-calm-600 dark:group-hover:text-calm-400 transition-colors text-sm sm:text-base">
                  {ticket.title}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2">
                  <Badge variant="status" status={ticket.status}>
                    {STATUS_LABELS[ticket.status]}
                  </Badge>
                  <Badge variant="priority" priority={ticket.priority}>
                    {PRIORITY_LABELS[ticket.priority]}
                  </Badge>
                  <span className="text-xs text-sage-400 dark:text-sage-500">
                    {formatRelativeTime(ticket.updatedAt)}
                  </span>
                </div>
              </div>
              {hasComments && (
                <div className="flex items-center gap-1 text-sage-400 dark:text-sage-500 bg-sage-50 dark:bg-sage-800 px-2 py-1 rounded-full flex-shrink-0">
                  <MessageSquare className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
                  <span className="text-xs">{ticket.comments.length}</span>
                </div>
              )}
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
