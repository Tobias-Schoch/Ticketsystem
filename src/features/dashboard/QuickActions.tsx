import { Link } from 'react-router-dom';
import { Plus, KanbanSquare, TicketIcon, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { ROUTES } from '../../constants';
import { cn } from '../../utils/cn';

export function QuickActions() {
  const actions = [
    {
      label: 'Neue Aufgabe',
      description: 'Erstelle eine neue Aufgabe für dein Team',
      icon: Plus,
      to: ROUTES.TICKET_NEW,
      gradient: 'from-warmth-400 to-warmth-500',
    },
    {
      label: 'Board öffnen',
      description: 'Sieh alle Aufgaben auf einen Blick',
      icon: KanbanSquare,
      to: ROUTES.BOARD,
      gradient: 'from-calm-400 to-calm-500',
    },
    {
      label: 'Alle Aufgaben',
      description: 'Durchsuche und filtere alle Aufgaben',
      icon: TicketIcon,
      to: ROUTES.TICKETS,
      gradient: 'from-sand-400 to-sand-500',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-xl">Was möchtest du tun?</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {actions.map((action) => (
          <Link
            key={action.label}
            to={action.to}
            className="group relative overflow-hidden p-5 rounded-2xl border border-sage-100 dark:border-sage-700 bg-white/50 dark:bg-sage-800/50 hover:bg-white dark:hover:bg-sage-800 hover:shadow-soft hover:-translate-y-1 transition-all duration-300"
          >
            <div className={cn(
              'w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4 shadow-soft group-hover:scale-110 transition-transform',
              action.gradient
            )}>
              <action.icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-sage-800 dark:text-sage-100 group-hover:text-sage-900 dark:group-hover:text-white">
                {action.label}
              </p>
              <p className="text-sm text-sage-400 dark:text-sage-500 mt-1">
                {action.description}
              </p>
            </div>
            <ArrowRight className="absolute bottom-5 right-5 h-4 w-4 text-sage-300 dark:text-sage-600 group-hover:text-sage-500 dark:group-hover:text-sage-400 group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
