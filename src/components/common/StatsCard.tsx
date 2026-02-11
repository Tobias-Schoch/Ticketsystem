import { ReactNode } from 'react';
import { Card } from '../ui/Card';
import { cn } from '../../utils/cn';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  subtitle?: string;
  color?: 'sage' | 'calm' | 'sand' | 'warmth' | 'green' | 'pink';
}

export function StatsCard({ title, value, icon, subtitle, color = 'sage' }: StatsCardProps) {
  const colorClasses = {
    sage: 'bg-sage-100 dark:bg-sage-800/50 text-sage-600 dark:text-sage-300',
    calm: 'bg-calm-100 dark:bg-calm-900/50 text-calm-600 dark:text-calm-300',
    sand: 'bg-sand-200 dark:bg-sand-900/50 text-sand-700 dark:text-sand-300',
    warmth: 'bg-warmth-100 dark:bg-warmth-900/50 text-warmth-600 dark:text-warmth-300',
    green: 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300',
    pink: 'bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-300',
  };

  return (
    <Card hover className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-sage-500 dark:text-sage-400 font-medium">{title}</p>
          <p className="mt-3 text-3xl font-semibold text-sage-800 dark:text-sage-100">
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs text-sage-400 dark:text-sage-500">
              {subtitle}
            </p>
          )}
        </div>
        <div className={cn('p-3 rounded-2xl', colorClasses[color])}>
          {icon}
        </div>
      </div>
      {/* Subtle decorative gradient */}
      <div className={cn(
        'absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-20 dark:opacity-10 blur-2xl',
        color === 'sage' && 'bg-sage-400',
        color === 'calm' && 'bg-calm-400',
        color === 'sand' && 'bg-sand-400',
        color === 'warmth' && 'bg-warmth-400',
        color === 'green' && 'bg-green-400',
        color === 'pink' && 'bg-pink-400',
      )} />
    </Card>
  );
}
