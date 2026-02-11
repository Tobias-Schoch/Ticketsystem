import { Card } from '../components/ui/Card';
import { TicketForm } from '../features/tickets';
import { Plus, Sparkles } from 'lucide-react';

export function CreateTicketPage() {
  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-warmth-50 via-sand-50 to-sand-100 dark:from-warmth-900/30 dark:via-sage-900/50 dark:to-sage-900/30 rounded-3xl p-8 mb-6 border border-sand-200 dark:border-sage-700">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-warmth-600 dark:text-warmth-400 mb-2">
            <Plus className="h-4 w-4" />
            <span className="text-sm font-medium">Neue Aufgabe</span>
          </div>
          <h1 className="text-2xl font-semibold text-sage-800 dark:text-sage-100">
            Was möchtest du festhalten?
          </h1>
          <p className="text-sage-500 dark:text-sage-400 mt-1">
            Beschreibe die Aufgabe so gut wie möglich
          </p>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-warmth-200/30 dark:bg-warmth-700/20 rounded-full blur-2xl" />
        <Sparkles className="absolute bottom-4 right-8 h-6 w-6 text-warmth-300 dark:text-warmth-600 animate-float" />
      </div>

      <Card>
        <TicketForm mode="create" />
      </Card>
    </div>
  );
}
