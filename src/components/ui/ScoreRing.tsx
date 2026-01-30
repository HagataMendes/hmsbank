import { cn } from '@/lib/utils';

interface ScoreRingProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function ScoreRing({ score, size = 'md', showLabel = true, className }: ScoreRingProps) {
  const sizes = {
    sm: { container: 'w-16 h-16', text: 'text-lg', stroke: 4 },
    md: { container: 'w-24 h-24', text: 'text-2xl', stroke: 6 },
    lg: { container: 'w-32 h-32', text: 'text-3xl', stroke: 8 },
  };

  const { container, text, stroke } = sizes[size];
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score >= 70) return 'text-success';
    if (score >= 40) return 'text-warning';
    return 'text-destructive';
  };

  const getStrokeColor = () => {
    if (score >= 70) return 'stroke-success';
    if (score >= 40) return 'stroke-warning';
    return 'stroke-destructive';
  };

  return (
    <div className={cn('relative inline-flex items-center justify-center', container, className)}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-muted"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={cn('transition-all duration-1000 ease-out', getStrokeColor())}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn('font-bold', text, getColor())}>{score}</span>
        {showLabel && <span className="text-xs text-muted-foreground">pontos</span>}
      </div>
    </div>
  );
}
