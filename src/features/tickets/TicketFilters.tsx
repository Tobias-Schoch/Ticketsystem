import { CircleDot, Flag, User, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { SearchInput } from '../../components/common/SearchInput';
import { useTicketStore } from '../../stores/ticketStore';
import { useUserStore } from '../../stores/userStore';
import { STATUSES, PRIORITIES } from '../../constants';
import { cn } from '../../utils/cn';

interface CompactSelectProps {
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

function CompactSelect({ icon, value, onChange, options }: CompactSelectProps) {
  const isDefault = value === 'all' || value === '';

  return (
    <div className="relative group">
      <div className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-sage-400 dark:text-sage-500 transition-colors duration-150 group-focus-within:text-warmth-500 dark:group-focus-within:text-warmth-400 pointer-events-none">
        {icon}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'h-9 sm:h-10 pl-8 sm:pl-9 pr-7 sm:pr-8 rounded-lg sm:rounded-xl text-xs sm:text-sm appearance-none cursor-pointer',
          'bg-white/60 dark:bg-sage-800/60 backdrop-blur-sm',
          'border border-sand-200 dark:border-sage-700',
          'text-sage-700 dark:text-sage-200',
          'focus:outline-none focus:border-warmth-400 dark:focus:border-warmth-500',
          'focus:ring-2 focus:ring-warmth-100/80 dark:focus:ring-warmth-900/50',
          'transition-all duration-150',
          !isDefault && 'border-warmth-300 dark:border-warmth-700 bg-warmth-50/50 dark:bg-warmth-900/20'
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="dark:bg-sage-800">
            {option.label}
          </option>
        ))}
      </select>
      <svg
        className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-sage-400 dark:text-sage-500 pointer-events-none"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}

export function TicketFilters() {
  const { filters, setFilters, resetFilters } = useTicketStore();
  const users = useUserStore((state) => state.users);

  const hasFilters =
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.assigneeId !== 'all' ||
    filters.search !== '';

  const activeFilterCount = [
    filters.status !== 'all',
    filters.priority !== 'all',
    filters.assigneeId !== 'all',
  ].filter(Boolean).length;

  const userOptions = [
    { value: 'all', label: 'Alle' },
    { value: '', label: 'Offen' },
    ...users.filter(u => u.isActive).map(u => ({ value: u.id, label: u.name.split(' ')[0] })),
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
      {/* Search - grows to fill space */}
      <div className="flex-1 min-w-0">
        <SearchInput
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
          onClear={() => setFilters({ search: '' })}
          placeholder="Suche..."
        />
      </div>

      {/* Compact Filters */}
      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
        <CompactSelect
          icon={<CircleDot className="h-4 w-4" />}
          value={filters.status}
          onChange={(value) => setFilters({ status: value as typeof filters.status })}
          options={[
            { value: 'all', label: 'Status' },
            ...STATUSES.map((s) => ({ value: s.value, label: s.label })),
          ]}
        />

        <CompactSelect
          icon={<Flag className="h-4 w-4" />}
          value={filters.priority}
          onChange={(value) => setFilters({ priority: value as typeof filters.priority })}
          options={[
            { value: 'all', label: 'Priorität' },
            ...PRIORITIES.map((p) => ({ value: p.value, label: p.label })),
          ]}
        />

        <CompactSelect
          icon={<User className="h-4 w-4" />}
          value={filters.assigneeId}
          onChange={(value) => setFilters({ assigneeId: value as typeof filters.assigneeId })}
          options={userOptions}
        />

        {/* Reset button */}
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="h-9 sm:h-10 px-2 sm:px-3 text-warmth-500 hover:text-warmth-600 dark:text-warmth-400 dark:hover:text-warmth-300 whitespace-nowrap"
          >
            <X className="h-4 w-4" />
            {activeFilterCount > 0 && (
              <span className="ml-1 text-xs bg-warmth-100 dark:bg-warmth-900/50 text-warmth-600 dark:text-warmth-400 px-1.5 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
