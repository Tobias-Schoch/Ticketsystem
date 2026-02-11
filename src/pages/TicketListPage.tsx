import { Link } from 'react-router-dom';
import { Plus, TicketIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { TicketFilters, TicketList } from '../features/tickets';
import { ROUTES } from '../constants';

export function TicketListPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="relative overflow-hidden flex-1 mr-4 bg-gradient-to-br from-warmth-50 via-sand-50 to-sand-100 dark:from-warmth-900/30 dark:via-sage-900/50 dark:to-sage-900/30 rounded-3xl p-8 border border-sand-200 dark:border-sage-700">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-warmth-600 dark:text-warmth-400 mb-2">
              <TicketIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Aufgaben</span>
            </div>
            <h1 className="text-2xl font-semibold text-sage-800 dark:text-sage-100">
              Alle Aufgaben
            </h1>
            <p className="text-sage-500 dark:text-sage-400 mt-1">
              Hier findest du alle Aufgaben deines Teams
            </p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-warmth-200/30 dark:bg-warmth-700/20 rounded-full blur-2xl" />
        </div>

        <Link to={ROUTES.TICKET_NEW}>
          <Button className="h-14 px-6">
            <Plus className="h-5 w-5 mr-2" />
            Neue Aufgabe
          </Button>
        </Link>
      </div>

      <TicketFilters />

      <TicketList />
    </div>
  );
}
