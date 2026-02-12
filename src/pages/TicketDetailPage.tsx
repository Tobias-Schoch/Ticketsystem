import { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { TicketDetail } from '../features/tickets';
import { useTicketStore } from '../stores/ticketStore';
import { SkeletonCard } from '../components/ui/Skeleton';
import { ROUTES } from '../constants';

export function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getTicketById, refreshTicket, isLoading } = useTicketStore();

  // Refresh ticket to load full data including comments
  useEffect(() => {
    if (id) {
      refreshTicket(id);
    }
  }, [id, refreshTicket]);

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
