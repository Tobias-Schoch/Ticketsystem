import { Outlet } from 'react-router-dom';
import { Ticket } from 'lucide-react';
import { ToastContainer } from '../components/feedback/ToastContainer';

export function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-warmth-200/30 dark:bg-warmth-800/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-sand-200/30 dark:bg-sand-800/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sand-200/20 dark:bg-sand-900/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-warmth-400 to-warmth-500 rounded-3xl flex items-center justify-center shadow-soft-lg mb-4">
            <Ticket className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-sage-800 dark:text-sage-100">
            Aufgaben
          </h1>
          <p className="text-sage-400 dark:text-sage-500 text-sm mt-1">
            Achtsam organisiert
          </p>
        </div>

        {/* Content */}
        <div className="bg-white/70 dark:bg-sage-800/70 backdrop-blur-xl rounded-3xl p-8 shadow-soft-lg border border-sage-100/50 dark:border-sage-700/50">
          <Outlet />
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-sage-400 dark:text-sage-500 mt-8">
          Bringe Ruhe in deinen Arbeitsalltag
        </p>
      </div>

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
}
