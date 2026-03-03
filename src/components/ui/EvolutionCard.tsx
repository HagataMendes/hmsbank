import { cn } from '@/lib/utils';
import { EvolutionStatus } from '@/types/financial';
import { TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface EvolutionCardProps {
  evolution: EvolutionStatus;
  className?: string;
}

export function EvolutionCard({ evolution, className }: EvolutionCardProps) {
  const statusConfig = {
    positive: {
      icon: TrendingUp,
      emoji: '🟢',
      bgClass: 'bg-success/5 border-success/20',
      iconClass: 'bg-success/10 text-success',
      label: 'Evolução Positiva',
    },
    stable: {
      icon: Minus,
      emoji: '🟡',
      bgClass: 'bg-warning/5 border-warning/20',
      iconClass: 'bg-warning/10 text-warning',
      label: 'Estável',
    },
    risk: {
      icon: TrendingDown,
      emoji: '🔴',
      bgClass: 'bg-destructive/5 border-destructive/20',
      iconClass: 'bg-destructive/10 text-destructive',
      label: 'Em Risco',
    },
  };

  const config = statusConfig[evolution.status];
  const Icon = config.icon;

  return (
    <div className={cn(
      'hms-card border animate-fade-in',
      config.bgClass,
      className
    )}>
      <div className="flex items-start gap-4 mb-4">
        <div className={cn('p-3 rounded-xl', config.iconClass)}>
          <Icon className="w-6 h-6" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{config.emoji}</span>
            <h3 className="font-semibold text-foreground">{config.label}</h3>
          </div>
          <p className="text-sm text-muted-foreground">{evolution.message}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {evolution.categoriesImproving.length > 0 && (
          <div className="p-4 rounded-lg bg-success/5 border border-success/10">
            <div className="flex items-center gap-2 mb-2">
              <ArrowUpRight className="w-4 h-4 text-success" />
              <span className="text-xs font-medium text-success">Em Evolução</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {evolution.categoriesImproving.map(cat => (
                <span key={cat} className="text-xs px-2 py-1 rounded-full bg-success/10 text-success">
                  {cat}
                </span>
              ))}
            </div>
          </div>
        )}

        {evolution.categoriesStable.length > 0 && (
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Minus className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Estáveis</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {evolution.categoriesStable.map(cat => (
                <span key={cat} className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                  {cat}
                </span>
              ))}
            </div>
          </div>
        )}

        {evolution.categoriesAtRisk.length > 0 && (
          <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/10">
            <div className="flex items-center gap-2 mb-2">
              <ArrowDownRight className="w-4 h-4 text-destructive" />
              <span className="text-xs font-medium text-destructive">Atenção</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {evolution.categoriesAtRisk.map(cat => (
                <span key={cat} className="text-xs px-2 py-1 rounded-full bg-destructive/10 text-destructive">
                  {cat}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
