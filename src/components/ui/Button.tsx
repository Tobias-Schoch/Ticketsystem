import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'soft';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = cn(
      'inline-flex items-center justify-center font-medium',
      'rounded-full transition-all duration-150',
      'focus:outline-none focus-visible:ring-4 focus-visible:ring-warmth-200',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100',
      'hover:scale-[1.02] active:scale-[0.95]'
    );

    const variants = {
      primary: cn(
        'bg-gradient-to-r from-warmth-400 to-warmth-500 text-white',
        'hover:from-warmth-500 hover:to-warmth-600',
        'shadow-soft hover:shadow-lg hover:shadow-warmth-500/25'
      ),
      secondary: cn(
        'bg-sand-100 dark:bg-sage-700 text-sage-700 dark:text-sage-200',
        'hover:bg-sand-200 dark:hover:bg-sage-600',
        'border border-sand-300 dark:border-sage-600',
        'hover:shadow-md'
      ),
      ghost: cn(
        'text-sage-600 dark:text-sage-300 hover:text-warmth-600 dark:hover:text-warmth-400',
        'hover:bg-warmth-50 dark:hover:bg-warmth-900/20',
        'relative overflow-hidden'
      ),
      danger: cn(
        'bg-gradient-to-r from-red-400 to-red-500 text-white',
        'hover:from-red-500 hover:to-red-600',
        'shadow-soft hover:shadow-lg hover:shadow-red-500/25'
      ),
      soft: cn(
        'bg-white/60 dark:bg-sage-800/60 backdrop-blur-sm text-sage-700 dark:text-sage-200',
        'border border-sand-200 dark:border-sage-700',
        'hover:bg-white/80 dark:hover:bg-sage-700/80 hover:border-sand-300 dark:hover:border-sage-600',
        'hover:shadow-md'
      ),
    };

    const sizes = {
      sm: 'h-9 px-4 text-sm gap-1.5',
      md: 'h-11 px-6 text-sm gap-2',
      lg: 'h-13 px-8 text-base gap-2.5',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps };
