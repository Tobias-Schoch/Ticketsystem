import { ReactNode } from 'react';
import { Button } from '../ui/Button';
import { Sparkles } from 'lucide-react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="relative">
        <div className="text-sage-300 mb-6">{icon}</div>
        <Sparkles className="absolute -top-2 -right-2 h-5 w-5 text-calm-400 animate-float" />
      </div>
      <h3 className="text-lg font-semibold text-sage-800 mb-2">
        {title}
      </h3>
      <p className="text-sm text-sage-500 max-w-sm mb-8 leading-relaxed">
        {description}
      </p>
      {action && (
        <Button onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  );
}
