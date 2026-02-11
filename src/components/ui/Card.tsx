import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'subtle';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', hover = false, children, ...props }, ref) => {
    const paddingClasses = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    const variantClasses = {
      default: cn(
        'bg-white/70 dark:bg-sage-800/70 backdrop-blur-xl',
        'border border-sand-200/50 dark:border-sage-700/50',
        'shadow-soft'
      ),
      elevated: cn(
        'bg-white/80 dark:bg-sage-800/80 backdrop-blur-xl',
        'border border-sand-200/50 dark:border-sage-700/50',
        'shadow-soft-lg'
      ),
      subtle: cn(
        'bg-sand-50/50 dark:bg-sage-900/50',
        'border border-sand-200/30 dark:border-sage-700/30'
      ),
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-3xl transition-all duration-300',
          variantClasses[variant],
          paddingClasses[padding],
          hover && 'hover:shadow-xl hover:-translate-y-2 cursor-pointer hover:border-warmth-200/50 dark:hover:border-warmth-700/50',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1', className)}
      {...props}
    />
  )
);

CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'text-lg font-semibold text-sage-800 dark:text-sage-100',
        'transition-colors duration-150 group-hover:text-warmth-600 dark:group-hover:text-warmth-400',
        className
      )}
      {...props}
    />
  )
);

CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-sage-500 dark:text-sage-400', className)}
      {...props}
    />
  )
);

CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props} />
  )
);

CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center pt-6', className)}
      {...props}
    />
  )
);

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
export type { CardProps };
