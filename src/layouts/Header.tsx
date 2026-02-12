import { useState, useRef, useEffect } from 'react';
import { Sun, Moon, LogOut, Menu, Ticket, User, Users, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useUIStore } from '../stores/uiStore';
import { Avatar } from '../components/ui/Avatar';
import { ROUTES } from '../constants';

export function Header() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { setMobileNavOpen } = useUIStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Guten Morgen';
    if (hour < 18) return 'Guten Tag';
    return 'Guten Abend';
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="relative z-40 h-20 bg-white/50 dark:bg-sage-900/50 backdrop-blur-xl border-b border-sage-100 dark:border-sage-700 flex items-center justify-between px-6">
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileNavOpen(true)}
        className="lg:hidden p-2 text-sage-500 dark:text-sage-400 hover:text-sage-700 dark:hover:text-sage-200 hover:bg-sage-50 dark:hover:bg-sage-800 rounded-xl transition-all"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Greeting - Desktop */}
      <div className="hidden lg:flex items-center gap-2 text-sage-600 dark:text-sage-300">
        <Ticket className="h-4 w-4 text-warmth-400" />
        <span className="text-sm">{getGreeting()}</span>
      </div>

      {/* User Menu */}
      {user && (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 pl-3 pr-2 py-2 rounded-2xl hover:bg-sage-50 dark:hover:bg-sage-800 transition-all cursor-pointer group"
          >
            <Avatar src={user.avatarUrl} name={user.name} size="md" />
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-sage-800 dark:text-sage-100">
                {user.name}
              </p>
              <p className="text-xs text-sage-400 dark:text-sage-500">
                {user.role === 'administrator' ? 'Administrator' : user.role === 'teamLead' ? 'Team-Lead' : 'Team-Mitglied'}
              </p>
            </div>
            <ChevronDown className={`h-4 w-4 text-sage-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-56 max-w-56 bg-white dark:bg-sage-800 rounded-2xl shadow-lg border border-sage-100 dark:border-sage-700 py-2 z-50 animate-fade-in">
              {/* Profile Link */}
              <Link
                to={ROUTES.PROFILE}
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sage-700 dark:text-sage-200 hover:bg-sage-50 dark:hover:bg-sage-700 transition-colors"
              >
                <User className="h-4 w-4 text-sage-400" />
                <span className="text-sm font-medium">Mein Profil</span>
              </Link>

              {/* Admin Link - only for teamLead and administrator */}
              {(user.role === 'teamLead' || user.role === 'administrator') && (
                <Link
                  to={ROUTES.ADMIN}
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sage-700 dark:text-sage-200 hover:bg-sage-50 dark:hover:bg-sage-700 transition-colors"
                >
                  <Users className="h-4 w-4 text-sage-400" />
                  <span className="text-sm font-medium">Team verwalten</span>
                </Link>
              )}

              {/* Divider */}
              <div className="my-2 border-t border-sage-100 dark:border-sage-700" />

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-between px-4 py-3 text-sage-700 dark:text-sage-200 hover:bg-sage-50 dark:hover:bg-sage-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {isDark ? (
                    <Sun className="h-4 w-4 text-warmth-400" />
                  ) : (
                    <Moon className="h-4 w-4 text-sage-400" />
                  )}
                  <span className="text-sm font-medium">
                    {isDark ? 'Light Mode' : 'Dark Mode'}
                  </span>
                </div>
                <div className={`w-10 h-6 rounded-full transition-colors ${isDark ? 'bg-warmth-400' : 'bg-sage-200 dark:bg-sage-600'} relative`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${isDark ? 'translate-x-5' : 'translate-x-1'}`} />
                </div>
              </button>

              {/* Divider */}
              <div className="my-2 border-t border-sage-100 dark:border-sage-700" />

              {/* Logout */}
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Abmelden</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
