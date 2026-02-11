import { SelectHTMLAttributes, forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, ...props }, ref) => {
    return (
      <div className="w-full group">
        {label && (
          <label className="block text-sm font-medium text-sage-600 dark:text-sage-300 mb-2 transition-colors duration-150 group-focus-within:text-warmth-600 dark:group-focus-within:text-warmth-400">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              'w-full h-12 px-4 pr-12 rounded-2xl text-sm appearance-none cursor-pointer',
              'bg-white/60 dark:bg-sage-800/60 backdrop-blur-sm',
              'border-2 border-sand-200 dark:border-sage-700',
              'text-sage-800 dark:text-sage-100',
              'focus:outline-none focus:border-warmth-400 dark:focus:border-warmth-500',
              'focus:ring-4 focus:ring-warmth-100/80 dark:focus:ring-warmth-900/50',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'transition-all duration-150',
              error && 'border-calm-300 focus:border-calm-400 focus:ring-calm-100/80 animate-shake',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value} className="dark:bg-sage-800">
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-sage-400 dark:text-sage-500 pointer-events-none transition-colors duration-150 group-focus-within:text-warmth-500 dark:group-focus-within:text-warmth-400" />
        </div>
        {error && (
          <p className="mt-2 text-sm text-calm-500 animate-fade-in">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };
export type { SelectProps, SelectOption };
