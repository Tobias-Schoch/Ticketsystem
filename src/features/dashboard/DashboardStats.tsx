import { TicketIcon, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { StatsCard } from '../../components/common/StatsCard';
import { useTicketStore } from '../../stores/ticketStore';

export function DashboardStats() {
  const tickets = useTicketStore((state) => state.tickets);

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === 'open').length,
    inProgress: tickets.filter((t) => t.status === 'in-progress').length,
    done: tickets.filter((t) => t.status === 'done').length,
    critical: tickets.filter((t) => t.priority === 'critical' && t.status !== 'done').length,
  };

  const completionRate = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Alle Aufgaben"
        value={stats.total}
        icon={<TicketIcon className="h-5 w-5" />}
        color="sage"
        subtitle="Insgesamt"
      />
      <StatsCard
        title="Offen"
        value={stats.open}
        icon={<Clock className="h-5 w-5" />}
        color="calm"
        subtitle="Warten auf dich"
      />
      <StatsCard
        title="In Arbeit"
        value={stats.inProgress}
        icon={<TrendingUp className="h-5 w-5" />}
        color="sand"
        subtitle="Aktuell aktiv"
      />
      <StatsCard
        title="Geschafft"
        value={stats.done}
        icon={<CheckCircle className="h-5 w-5" />}
        color="green"
        subtitle={`${completionRate}% erledigt`}
      />
    </div>
  );
}
