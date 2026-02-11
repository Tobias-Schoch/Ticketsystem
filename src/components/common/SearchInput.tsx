import { InputHTMLAttributes } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onClear?: () => void;
}

export function SearchInput({ className, value, onClear, ...props }: SearchInputProps) {
  return (
    <div className="relative group">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-sage-400 dark:text-sage-500 transition-colors duration-150 group-focus-within:text-warmth-500 dark:group-focus-within:text-warmth-400" />
      <input
        type="text"
        value={value}
        className={cn(
          'w-full h-12 pl-12 pr-12 rounded-2xl text-sm',
          'bg-white/60 dark:bg-sage-800/60 backdrop-blur-sm',
          'border-2 border-sand-200 dark:border-sage-700',
          'text-sage-800 dark:text-sage-100 placeholder:text-sage-400 dark:placeholder:text-sage-500',
          'focus:outline-none focus:border-warmth-400 dark:focus:border-warmth-500',
          'focus:ring-4 focus:ring-warmth-100/80 dark:focus:ring-warmth-900/50',
          'transition-all duration-150',
          className
        )}
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-sage-400 dark:text-sage-500 hover:text-warmth-500 dark:hover:text-warmth-400 transition-colors duration-150 hover:scale-110 active:scale-95"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
