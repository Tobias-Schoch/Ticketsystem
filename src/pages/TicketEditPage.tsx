import { useParams, Navigate } from 'react-router-dom';
import { Edit } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { TicketForm } from '../features/tickets';
import { useTicketStore } from '../stores/ticketStore';
import { SkeletonCard } from '../components/ui/Skeleton';
import { ROUTES } from '../constants';

export function TicketEditPage() {
  const { id } = useParams<{ id: string }>();
  const { getTicketById, isLoading } = useTicketStore();

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <SkeletonCard />
      </div>
    );
  }

  const ticket = id ? getTicketById(id) : undefined;

  if (!ticket) {
    return <Navigate to={ROUTES.TICKETS} replace />;
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-calm-50 via-sage-50 to-sage-100 dark:from-calm-900/30 dark:via-sage-900/50 dark:to-sage-900/30 rounded-2xl sm:rounded-3xl p-5 sm:p-8 mb-4 sm:mb-6 border border-sage-200 dark:border-sage-700">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-calm-600 dark:text-calm-400 mb-1 sm:mb-2">
            <Edit className="h-4 w-4" />
            <span className="text-sm font-medium">Bearbeiten</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold text-sage-800 dark:text-sage-100">
            Aufgabe bearbeiten
          </h1>
          <p className="text-sage-500 dark:text-sage-400 mt-1 text-sm sm:text-base">
            {ticket.title}
          </p>
        </div>
        <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-calm-200/30 dark:bg-calm-700/20 rounded-full blur-2xl" />
      </div>

      <Card>
        <TicketForm
          mode="edit"
          ticketId={ticket.id}
          initialData={{
            title: ticket.title,
            description: ticket.description,
            priority: ticket.priority,
            assigneeId: ticket.assigneeId,
            dueDate: ticket.dueDate,
          }}
        />
      </Card>
    </div>
  );
}
