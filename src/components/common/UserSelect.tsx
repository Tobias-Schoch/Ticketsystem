import { useUserStore } from '../../stores/userStore';
import { Select, type SelectOption } from '../ui/Select';

interface UserSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  includeUnassigned?: boolean;
  includeAll?: boolean;
  error?: string;
}

export function UserSelect({
  value,
  onChange,
  label,
  placeholder = 'Benutzer auswählen',
  includeUnassigned = false,
  includeAll = false,
  error,
}: UserSelectProps) {
  const users = useUserStore((state) => state.users);

  const options: SelectOption[] = [];

  if (includeAll) {
    options.push({ value: 'all', label: 'Alle Benutzer' });
  }

  if (includeUnassigned) {
    options.push({ value: '', label: 'Nicht zugewiesen' });
  }

  users
    .filter((user) => user.isActive)
    .forEach((user) => {
      options.push({ value: user.id, label: user.name });
    });

  return (
    <Select
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      options={options}
      placeholder={placeholder}
      error={error}
    />
  );
}
