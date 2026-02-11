import { Filter, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { SearchInput } from '../../components/common/SearchInput';
import { UserSelect } from '../../components/common/UserSelect';
import { useTicketStore } from '../../stores/ticketStore';
import { STATUSES, PRIORITIES } from '../../constants';

export function TicketFilters() {
  const { filters, setFilters, resetFilters } = useTicketStore();

  const hasFilters =
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.assigneeId !== 'all' ||
    filters.search !== '';

  return (
    <div className="space-y-4">
      {/* Search */}
      <SearchInput
        value={filters.search}
        onChange={(e) => setFilters({ search: e.target.value })}
        onClear={() => setFilters({ search: '' })}
        placeholder="Suche nach Aufgaben..."
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 text-sage-500 dark:text-sage-400 bg-sage-50 dark:bg-sage-800 px-3 py-1.5 rounded-full">
          <Filter className="h-4 w-4" />
          <span className="text-sm">Filter</span>
        </div>

        <Select
          value={filters.status}
          onChange={(e) => setFilters({ status: e.target.value as typeof filters.status })}
          options={[
            { value: 'all', label: 'Alle Status' },
            ...STATUSES.map((s) => ({ value: s.value, label: s.label })),
          ]}
        />

        <Select
          value={filters.priority}
          onChange={(e) => setFilters({ priority: e.target.value as typeof filters.priority })}
          options={[
            { value: 'all', label: 'Alle Prioritäten' },
            ...PRIORITIES.map((p) => ({ value: p.value, label: p.label })),
          ]}
        />

        <UserSelect
          value={filters.assigneeId}
          onChange={(value) => setFilters({ assigneeId: value as typeof filters.assigneeId })}
          includeAll
          includeUnassigned
          placeholder="Zugewiesen an"
        />

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="text-warmth-500">
            <X className="h-4 w-4 mr-1" />
            Zurücksetzen
          </Button>
        )}
      </div>
    </div>
  );
}
