import { useEffect, useCallback, ReactNode, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from './Button';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
}: DialogProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  const handleClose = useCallback(() => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      setIsAnimatingOut(false);
      setIsVisible(false);
      onClose();
    }, 200);
  }, [onClose]);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    },
    [handleClose]
  );

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscape]);

  if (!isVisible && !isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={cn(
          'absolute inset-0 bg-sage-900/20 dark:bg-black/40 backdrop-blur-sm',
          isAnimatingOut ? 'animate-fade-out' : 'animate-fade-in'
        )}
        onClick={handleClose}
      />

      {/* Dialog */}
      <div
        className={cn(
          'relative w-full rounded-3xl',
          'bg-white/95 dark:bg-sage-800/95 backdrop-blur-xl',
          'border border-sage-100 dark:border-sage-700',
          'shadow-soft-lg',
          sizeClasses[size],
          isAnimatingOut ? 'animate-scale-out' : 'animate-pop'
        )}
      >
        {/* Header */}
        {(title || description) && (
          <div
            className={cn(
              'px-5 sm:px-8 pt-5 sm:pt-8 pb-3 sm:pb-4 pr-12',
              !isAnimatingOut && 'animate-fade-in'
            )}
            style={{ animationDelay: '50ms' }}
          >
            {title && (
              <h2 className="text-lg sm:text-xl font-semibold text-sage-800 dark:text-sage-100">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 sm:mt-2 text-sm text-sage-500 dark:text-sage-400">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Close button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 sm:top-6 right-4 sm:right-6 h-9 w-9 p-0 rounded-full"
          onClick={handleClose}
        >
          <X className="h-5 w-5" />
        </Button>

        {/* Content */}
        <div
          className={cn(
            'px-5 sm:px-8 pb-5 sm:pb-8',
            !isAnimatingOut && 'animate-fade-in'
          )}
          style={{ animationDelay: '100ms' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

interface DialogFooterProps {
  children: ReactNode;
  className?: string;
}

export function DialogFooter({ children, className }: DialogFooterProps) {
  return (
    <div className={cn('flex justify-end gap-3 mt-8', className)}>
      {children}
    </div>
  );
}
