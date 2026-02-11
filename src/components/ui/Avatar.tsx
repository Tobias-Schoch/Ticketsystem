import { cn } from '../../utils/cn';

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

// Nature-inspired color palette for avatars
function getColorFromName(name: string): string {
  const colors = [
    'bg-gradient-to-br from-calm-400 to-calm-500', // Teal
    'bg-gradient-to-br from-sage-400 to-sage-500', // Sage
    'bg-gradient-to-br from-sand-400 to-sand-500', // Sand
    'bg-gradient-to-br from-warmth-400 to-warmth-500', // Warmth
    'bg-gradient-to-br from-pink-400 to-pink-500', // Rose
    'bg-gradient-to-br from-amber-400 to-amber-500', // Amber
    'bg-gradient-to-br from-emerald-400 to-emerald-500', // Emerald
    'bg-gradient-to-br from-violet-400 to-violet-500', // Violet
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

  if (src) {
    return (
      <img
        src={src}
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
