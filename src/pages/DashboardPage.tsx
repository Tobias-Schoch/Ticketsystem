import { DashboardStats, RecentActivity, QuickActions } from '../features/dashboard';
import { useAuth } from '../hooks/useAuth';
import { Sparkles } from 'lucide-react';

export function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0];

  const getMotivationalMessage = () => {
    const messages = [
      'Ein guter Tag, um Großartiges zu schaffen',
      'Schritt für Schritt ans Ziel',
      'Du machst das wunderbar',
      'Jede Aufgabe bringt dich weiter',
      'Heute ist ein guter Tag',
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-warmth-50 via-sand-50 to-sand-100 dark:from-warmth-900/30 dark:via-sage-900/50 dark:to-sage-900/30 rounded-3xl p-8 border border-sand-200 dark:border-sage-700">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-warmth-600 dark:text-warmth-400 mb-2">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Deine Übersicht</span>
          </div>
          <h1 className="text-2xl font-semibold text-sage-800 dark:text-sage-100">
            Hallo {firstName}!
          </h1>
          <p className="text-sage-500 dark:text-sage-400 mt-1">
            {getMotivationalMessage()}
          </p>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-warmth-200/30 dark:bg-warmth-700/20 rounded-full blur-2xl" />
        <div className="absolute bottom-0 right-20 w-24 h-24 bg-sand-300/30 dark:bg-sage-700/20 rounded-full blur-2xl" />
      </div>

      {/* Stats */}
      <DashboardStats />

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
}
