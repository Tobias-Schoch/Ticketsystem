import { cn } from '../../utils/cn';
import { getBackendUrl } from '../../api/client';

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

// Warm color palette for avatars
function getColorFromName(name: string): string {
  const colors = [
    'bg-gradient-to-br from-warmth-400 to-warmth-500', // Terracotta
    'bg-gradient-to-br from-calm-400 to-calm-500', // Dusty Rose
    'bg-gradient-to-br from-amber-400 to-amber-500', // Amber
    'bg-gradient-to-br from-orange-400 to-orange-500', // Orange
    'bg-gradient-to-br from-rose-400 to-rose-500', // Rose
    'bg-gradient-to-br from-sand-500 to-sand-600', // Sand
    'bg-gradient-to-br from-yellow-500 to-yellow-600', // Gold
    'bg-gradient-to-br from-red-400 to-red-500', // Coral
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const sizeClasses = {
    sm: 'h-9 w-9 text-xs',
    md: 'h-11 w-11 text-sm',
    lg: 'h-14 w-14 text-base',
    xl: 'h-20 w-20 text-xl',
  };

  const imageUrl = getBackendUrl(src);

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={cn(
          'rounded-full object-cover ring-2 ring-white dark:ring-sage-700 shadow-soft',
          sizeClasses[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center text-white font-medium shadow-soft ring-2 ring-white/50 dark:ring-sage-700/50',
        sizeClasses[size],
        getColorFromName(name),
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}
