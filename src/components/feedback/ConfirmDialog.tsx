import { Dialog, DialogFooter } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { AlertTriangle, HelpCircle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Bestätigen',
  cancelLabel = 'Abbrechen',
  variant = 'default',
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${
          variant === 'danger' ? 'bg-warmth-100' : 'bg-calm-100'
        }`}>
          {variant === 'danger' ? (
            <AlertTriangle className="h-7 w-7 text-warmth-500" />
          ) : (
            <HelpCircle className="h-7 w-7 text-calm-500" />
          )}
        </div>
        <h3 className="text-lg font-semibold text-sage-800 mb-2">{title}</h3>
        <p className="text-sm text-sage-500 leading-relaxed">{description}</p>
      </div>

      <DialogFooter className="justify-center">
        <Button variant="ghost" onClick={onClose} disabled={isLoading}>
          {cancelLabel}
        </Button>
        <Button
          variant={variant === 'danger' ? 'danger' : 'primary'}
          onClick={onConfirm}
          isLoading={isLoading}
        >
          {confirmLabel}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
