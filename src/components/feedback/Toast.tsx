import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '../../utils/cn';
import type { Toast as ToastType, ToastType as ToastVariant } from '../../types';

interface ToastProps {
  toast: ToastType;
  onClose: (id: string) => void;
}

const icons: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle className="h-5 w-5 text-green-500" />,
  error: <XCircle className="h-5 w-5 text-warmth-500" />,
  info: <Info className="h-5 w-5 text-calm-500" />,
  warning: <AlertTriangle className="h-5 w-5 text-sand-600" />,
};

const bgColors: Record<ToastVariant, string> = {
  success: 'bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-800',
  error: 'bg-warmth-50 border-warmth-200 dark:bg-warmth-900/30 dark:border-warmth-800',
  info: 'bg-calm-50 border-calm-200 dark:bg-calm-900/30 dark:border-calm-800',
  warning: 'bg-sand-100 border-sand-300 dark:bg-sand-900/30 dark:border-sand-700',
};

const progressColors: Record<ToastVariant, string> = {
  success: 'bg-green-400',
  error: 'bg-warmth-400',
  info: 'bg-calm-400',
  warning: 'bg-sand-500',
};

export function Toast({ toast, onClose }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);
  const duration = toast.duration || 4000;

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, duration - 200);

    const closeTimer = setTimeout(() => {
      onClose(toast.id);
    }, duration);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(closeTimer);
    };
  }, [toast, onClose, duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(toast.id), 200);
  };

  return (
    <div
      className={cn(
        'relative flex items-center gap-3 px-5 py-4 rounded-2xl border shadow-soft overflow-hidden',
        'backdrop-blur-xl',
        bgColors[toast.type],
        isExiting ? 'animate-slide-down' : 'animate-slide-up'
      )}
    >
      <div className="flex-shrink-0">
        {icons[toast.type]}
      </div>
      <p className="text-sm text-sage-700 dark:text-sage-200 flex-1 font-medium">
        {toast.message}
      </p>
      <button
        onClick={handleClose}
        className="flex-shrink-0 text-sage-400 hover:text-sage-600 dark:hover:text-sage-200 transition-colors duration-150 hover:scale-110 active:scale-95"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/5 dark:bg-white/5">
        <div
          className={cn('h-full animate-progress', progressColors[toast.type])}
          style={{ animationDuration: `${duration}ms` }}
        />
      </div>
    </div>
  );
}
