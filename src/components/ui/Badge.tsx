import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';
import type { TicketPriority, TicketStatus } from '../../types';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'priority' | 'status';
  priority?: TicketPriority;
  status?: TicketStatus;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', priority, status, children, ...props }, ref) => {
    const baseStyles = cn(
      'inline-flex items-center gap-1.5 px-3 py-1 rounded-full',
      'text-xs font-medium tracking-wide'
    );

    const priorityStyles: Record<TicketPriority, string> = {
      critical: 'bg-warmth-100 dark:bg-warmth-900/40 text-warmth-700 dark:text-warmth-300 border border-warmth-200 dark:border-warmth-800',
      high: 'bg-sand-200 dark:bg-sand-900/40 text-sand-800 dark:text-sand-300 border border-sand-300 dark:border-sand-700',
      medium: 'bg-sage-100 dark:bg-sage-800/50 text-sage-700 dark:text-sage-300 border border-sage-200 dark:border-sage-700',
      low: 'bg-calm-100 dark:bg-calm-900/40 text-calm-700 dark:text-calm-300 border border-calm-200 dark:border-calm-700',
    };

    const statusStyles: Record<TicketStatus, string> = {
      open: 'bg-calm-100 dark:bg-calm-900/40 text-calm-700 dark:text-calm-300 border border-calm-200 dark:border-calm-700',
      'in-progress': 'bg-sage-100 dark:bg-sage-800/50 text-sage-700 dark:text-sage-300 border border-sage-200 dark:border-sage-700',
      review: 'bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800',
      done: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800',
    };

    let variantStyles = 'bg-sage-100 dark:bg-sage-800/50 text-sage-700 dark:text-sage-300 border border-sage-200 dark:border-sage-700';

    if (variant === 'priority' && priority) {
      variantStyles = priorityStyles[priority];
    } else if (variant === 'status' && status) {
      variantStyles = statusStyles[status];
    }

    return (
      <span
        ref={ref}
        className={cn(baseStyles, variantStyles, className)}
        {...props}
      >
        {/* Status dot for visual indication */}
        {(variant === 'priority' || variant === 'status') && (
          <span
            className={cn(
              'w-1.5 h-1.5 rounded-full',
              variant === 'priority' && priority === 'critical' && 'bg-warmth-500',
              variant === 'priority' && priority === 'high' && 'bg-sand-600',
              variant === 'priority' && priority === 'medium' && 'bg-sage-500',
              variant === 'priority' && priority === 'low' && 'bg-calm-500',
              variant === 'status' && status === 'open' && 'bg-calm-500',
              variant === 'status' && status === 'in-progress' && 'bg-sage-500',
              variant === 'status' && status === 'review' && 'bg-pink-500',
              variant === 'status' && status === 'done' && 'bg-green-500'
            )}
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
export type { BadgeProps };
