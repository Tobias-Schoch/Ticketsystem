import { useParams, Navigate } from 'react-router-dom';
import { TicketDetail } from '../features/tickets';
import { useTicketStore } from '../stores/ticketStore';
import { SkeletonCard } from '../components/ui/Skeleton';
import { ROUTES } from '../constants';

export function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getTicketById, isLoading } = useTicketStore();

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <SkeletonCard />
      </div>
    );
  }

  const ticket = id ? getTicketById(id) : undefined;

  if (!ticket) {
    return <Navigate to={ROUTES.TICKETS} replace />;
  }

  return (
    <div className="animate-fade-in">
      <TicketDetail ticket={ticket} />
    </div>
  );
}
