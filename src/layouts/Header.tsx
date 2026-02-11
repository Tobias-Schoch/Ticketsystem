import { Sun, Moon, LogOut, Menu, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useUIStore } from '../stores/uiStore';
import { Avatar } from '../components/ui/Avatar';

export function Header() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { setMobileNavOpen } = useUIStore();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Guten Morgen';
    if (hour < 18) return 'Guten Tag';
    return 'Guten Abend';
  };

  return (
    <header className="h-20 bg-white/50 dark:bg-sage-900/50 backdrop-blur-xl border-b border-sage-100 dark:border-sage-700 flex items-center justify-between px-6">
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileNavOpen(true)}
        className="lg:hidden p-2 text-sage-500 dark:text-sage-400 hover:text-sage-700 dark:hover:text-sage-200 hover:bg-sage-50 dark:hover:bg-sage-800 rounded-xl transition-all"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Greeting - Desktop */}
      <div className="hidden lg:flex items-center gap-2 text-sage-600 dark:text-sage-300">
        <Sparkles className="h-4 w-4 text-calm-500 dark:text-calm-400" />
        <span className="text-sm">{getGreeting()}</span>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="h-12 w-12 flex items-center justify-center rounded-2xl bg-sage-100 dark:bg-sage-800 hover:bg-sage-200 dark:hover:bg-sage-700 transition-all"
        >
          {isDark ? (
            <Sun className="h-6 w-6 text-warmth-400" />
          ) : (
            <Moon className="h-6 w-6 text-sage-600" />
          )}
        </button>

        {/* User info */}
        {user && (
          <div className="flex items-center gap-3 pl-3 ml-1 border-l border-sage-200 dark:border-sage-700">
            <Avatar src={user.avatarUrl} name={user.name} size="md" />
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-sage-800 dark:text-sage-100">
                {user.name}
              </p>
              <p className="text-xs text-sage-400 dark:text-sage-500">
                {user.role === 'admin' ? 'Team-Lead' : 'Team-Mitglied'}
              </p>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={logout}
          className="h-12 w-12 flex items-center justify-center rounded-2xl bg-sage-100 dark:bg-sage-800 hover:bg-warmth-100 dark:hover:bg-warmth-900/50 text-sage-500 dark:text-sage-400 hover:text-warmth-600 dark:hover:text-warmth-400 transition-all"
        >
          <LogOut className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
}
