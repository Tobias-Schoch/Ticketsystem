import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  KanbanSquare,
  TicketIcon,
  Plus,
  ChevronLeft,
  Ticket,
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useUIStore } from '../stores/uiStore';
import { ROUTES } from '../constants';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  end?: boolean;
}

function NavItem({ to, icon, label, collapsed, end = false }: NavItemProps) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-150',
          'hover:scale-[1.02] active:scale-[0.98]',
          collapsed && 'justify-center px-3',
          isActive
            ? 'bg-warmth-100 dark:bg-warmth-900/50 text-warmth-700 dark:text-warmth-300 shadow-soft animate-bounce'
            : 'text-sage-500 dark:text-sage-400 hover:text-warmth-600 dark:hover:text-warmth-400 hover:bg-warmth-50 dark:hover:bg-warmth-900/20'
        )
      }
    >
      {icon}
      {!collapsed && <span className="text-sm font-medium">{label}</span>}
    </NavLink>
  );
}

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col bg-white/50 dark:bg-sage-900/50 backdrop-blur-xl border-r border-sage-100 dark:border-sage-700 transition-all duration-500',
        sidebarOpen ? 'w-64' : 'w-20'
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-20 px-4 border-b border-sage-100 dark:border-sage-700">
        {sidebarOpen && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-warmth-400 to-warmth-500 rounded-2xl flex items-center justify-center shadow-soft">
              <Ticket className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-semibold text-sage-800 dark:text-sage-100 block">Aufgaben</span>
              <span className="text-xs text-sage-400 dark:text-sage-500">Achtsam organisiert</span>
            </div>
          </div>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-sage-400 hover:text-sage-600 dark:hover:text-sage-200 rounded-xl hover:bg-sage-50 dark:hover:bg-sage-800 transition-all duration-150 hover:scale-110 active:scale-95"
        >
          <ChevronLeft className={cn('h-5 w-5 transition-transform duration-300', !sidebarOpen && 'rotate-180')} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <NavItem
          to={ROUTES.DASHBOARD}
          icon={<LayoutDashboard className="h-5 w-5" />}
          label="Übersicht"
          collapsed={!sidebarOpen}
          end
        />
        <NavItem
          to={ROUTES.BOARD}
          icon={<KanbanSquare className="h-5 w-5" />}
          label="Board"
          collapsed={!sidebarOpen}
        />
        <NavItem
          to={ROUTES.TICKETS}
          icon={<TicketIcon className="h-5 w-5" />}
          label="Alle Aufgaben"
          collapsed={!sidebarOpen}
          end
        />
        <NavItem
          to={ROUTES.TICKET_NEW}
          icon={<Plus className="h-5 w-5" />}
          label="Neue Aufgabe"
          collapsed={!sidebarOpen}
        />
      </nav>

      {/* Decorative element */}
      {sidebarOpen && (
        <div className="p-4 mx-4 mb-4 rounded-2xl bg-gradient-to-br from-warmth-50 to-sand-100 dark:from-warmth-900/30 dark:to-sage-800/30 border border-sand-200 dark:border-sage-700">
          <p className="text-xs text-sage-500 dark:text-sage-400 text-center leading-relaxed">
            "Ordnung bringt Ruhe in den Geist"
          </p>
        </div>
      )}
    </aside>
  );
}
