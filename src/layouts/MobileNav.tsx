import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  KanbanSquare,
  TicketIcon,
  Plus,
  User,
  Shield,
  X,
  Leaf,
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useAuth } from '../hooks/useAuth';
import { useUIStore } from '../stores/uiStore';
import { ROUTES } from '../constants';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  end?: boolean;
}

function NavItem({ to, icon, label, onClick, end = false }: NavItemProps) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-150',
          'hover:scale-[1.02] active:scale-[0.98]',
          isActive
            ? 'bg-warmth-100 dark:bg-warmth-900/50 text-warmth-700 dark:text-warmth-300 shadow-soft'
            : 'text-sage-500 dark:text-sage-400 hover:text-warmth-600 dark:hover:text-warmth-400 hover:bg-warmth-50 dark:hover:bg-warmth-900/20'
        )
      }
    >
      {icon}
      <span className="text-base font-medium">{label}</span>
    </NavLink>
  );
}

export function MobileNav() {
  const { isAdmin } = useAuth();
  const { mobileNavOpen, setMobileNavOpen } = useUIStore();

  useEffect(() => {
    if (mobileNavOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileNavOpen]);

  if (!mobileNavOpen) return null;

  const closeNav = () => setMobileNavOpen(false);

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-sage-900/20 dark:bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={closeNav}
      />

      {/* Sidebar */}
      <div className="absolute inset-y-0 left-0 w-80 bg-white/95 dark:bg-sage-900/95 backdrop-blur-xl shadow-soft-lg animate-slide-in-left">
        {/* Header */}
        <div className="flex items-center justify-between h-20 px-5 border-b border-sage-100 dark:border-sage-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-warmth-400 to-warmth-500 rounded-2xl flex items-center justify-center">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-semibold text-sage-800 dark:text-sage-100 block">Aufgaben</span>
              <span className="text-xs text-sage-400 dark:text-sage-500">Achtsam organisiert</span>
            </div>
          </div>
          <button
            onClick={closeNav}
            className="p-2 text-sage-400 hover:text-sage-600 dark:hover:text-sage-200 rounded-xl hover:bg-sage-50 dark:hover:bg-sage-800 transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          <NavItem
            to={ROUTES.DASHBOARD}
            icon={<LayoutDashboard className="h-5 w-5" />}
            label="Übersicht"
            onClick={closeNav}
            end
          />
          <NavItem
            to={ROUTES.BOARD}
            icon={<KanbanSquare className="h-5 w-5" />}
            label="Board"
            onClick={closeNav}
          />
          <NavItem
            to={ROUTES.TICKETS}
            icon={<TicketIcon className="h-5 w-5" />}
            label="Alle Aufgaben"
            onClick={closeNav}
            end
          />
          <NavItem
            to={ROUTES.TICKET_NEW}
            icon={<Plus className="h-5 w-5" />}
            label="Neue Aufgabe"
            onClick={closeNav}
          />

          <div className="pt-4 mt-4 border-t border-sage-100 dark:border-sage-700" />

          <NavItem
            to={ROUTES.PROFILE}
            icon={<User className="h-5 w-5" />}
            label="Mein Profil"
            onClick={closeNav}
          />

          {isAdmin && (
            <NavItem
              to={ROUTES.ADMIN}
              icon={<Shield className="h-5 w-5" />}
              label="Team verwalten"
              onClick={closeNav}
            />
          )}
        </nav>
      </div>
    </div>
  );
}
