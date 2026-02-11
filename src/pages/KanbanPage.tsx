import { KanbanBoard, TicketFilters } from '../features/tickets';
import { KanbanSquare } from 'lucide-react';

export function KanbanPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-sand-100 via-sand-50 to-warmth-50 dark:from-sage-900/30 dark:via-sage-900/50 dark:to-warmth-900/30 rounded-3xl p-8 border border-sand-200 dark:border-sage-700">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-warmth-600 dark:text-warmth-400 mb-2">
            <KanbanSquare className="h-4 w-4" />
            <span className="text-sm font-medium">Board</span>
          </div>
          <h1 className="text-2xl font-semibold text-sage-800 dark:text-sage-100">
            Dein Aufgaben-Board
          </h1>
          <p className="text-sage-500 dark:text-sage-400 mt-1">
            Ziehe Aufgaben zwischen den Spalten, um den Status zu ändern
          </p>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-warmth-200/30 dark:bg-warmth-700/20 rounded-full blur-2xl" />
      </div>

      <TicketFilters />

      <KanbanBoard />
    </div>
  );
}
