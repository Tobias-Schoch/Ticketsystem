import { cn } from '../../utils/cn';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className,
  variant = 'text',
  width,
  height,
}: SkeletonProps) {
  const variantStyles = {
    text: 'h-4 rounded-lg',
    circular: 'rounded-full',
    rectangular: 'rounded-2xl',
  };

  return (
    <div
      className={cn('skeleton bg-sage-100/50', variantStyles[variant], className)}
      style={{
        width: width,
        height: height,
      }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white/50 rounded-3xl p-6 space-y-4 border border-sage-100/50">
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height={16} />
          <Skeleton width="40%" height={12} />
        </div>
      </div>
      <Skeleton height={80} variant="rectangular" />
      <div className="flex gap-2">
        <Skeleton width={80} height={28} variant="rectangular" />
        <Skeleton width={100} height={28} variant="rectangular" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
