import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, hint, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full group">
        {label && (
          <label className="block text-sm font-medium text-sage-600 dark:text-sage-300 mb-2 transition-colors duration-150 group-focus-within:text-warmth-600 dark:group-focus-within:text-warmth-400">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sage-400 dark:text-sage-500 transition-colors duration-150 group-focus-within:text-warmth-500 dark:group-focus-within:text-warmth-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={cn(
              'w-full h-12 px-4 rounded-2xl text-sm',
              'bg-white/60 dark:bg-sage-800/60 backdrop-blur-sm',
              'border-2 border-sand-200 dark:border-sage-700',
              'text-sage-800 dark:text-sage-100 placeholder:text-sage-400 dark:placeholder:text-sage-500',
              'focus:outline-none focus:border-warmth-400 dark:focus:border-warmth-500',
              'focus:ring-4 focus:ring-warmth-100/80 dark:focus:ring-warmth-900/50',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'transition-all duration-150',
              icon && 'pl-12',
              error && 'border-calm-300 focus:border-calm-400 focus:ring-calm-100/80 animate-shake',
              className
            )}
            {...props}
          />
        </div>
        {hint && !error && (
          <p className="mt-2 text-xs text-sage-400 dark:text-sage-500">{hint}</p>
        )}
        {error && (
          <p className="mt-2 text-sm text-calm-500 flex items-center gap-1 animate-fade-in">
            <span className="inline-block w-1 h-1 rounded-full bg-calm-500" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
export type { InputProps };
