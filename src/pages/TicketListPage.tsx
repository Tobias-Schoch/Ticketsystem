import { Link } from 'react-router-dom';
import { Plus, TicketIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { TicketFilters, TicketList } from '../features/tickets';
import { ROUTES } from '../constants';

export function TicketListPage() {
  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="relative overflow-hidden flex-1 bg-gradient-to-br from-warmth-50 via-sand-50 to-sand-100 dark:from-warmth-900/30 dark:via-sage-900/50 dark:to-sage-900/30 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-sand-200 dark:border-sage-700">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-warmth-600 dark:text-warmth-400 mb-1 sm:mb-2">
              <TicketIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Aufgaben</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold text-sage-800 dark:text-sage-100">
              Alle Aufgaben
            </h1>
            <p className="text-sage-500 dark:text-sage-400 mt-1 text-sm sm:text-base">
              Hier findest du alle Aufgaben deines Teams
            </p>
          </div>
          <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-warmth-200/30 dark:bg-warmth-700/20 rounded-full blur-2xl" />
        </div>

        <Link to={ROUTES.TICKET_NEW} className="sm:flex-shrink-0">
          <Button className="w-full sm:w-auto h-12 sm:h-14 px-4 sm:px-6">
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
