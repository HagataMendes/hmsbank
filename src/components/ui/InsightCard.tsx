import { cn } from '@/lib/utils';
import { Insight } from '@/types/financial';
import { AlertTriangle, TrendingUp, PiggyBank, FileText } from 'lucide-react';

interface InsightCardProps {
  insight: Insight;
  className?: string;
}

export function InsightCard({ insight, className }: InsightCardProps) {
  const typeConfig = {
    alert: {
      icon: AlertTriangle,
      bgClass: 'bg-warning/5 border-warning/20',
      iconClass: 'bg-warning/10 text-warning',
      badge: 'btg-badge-warning',
    },
    pattern: {
      icon: TrendingUp,
      bgClass: 'bg-info/5 border-info/20',
      iconClass: 'bg-info/10 text-info',
      badge: 'btg-badge-info',
    },
    economy: {
      icon: PiggyBank,
      bgClass: 'bg-success/5 border-success/20',
      iconClass: 'bg-success/10 text-success',
      badge: 'btg-badge-success',
    },
    summary: {
      icon: FileText,
      bgClass: 'bg-primary/5 border-primary/20',
      iconClass: 'bg-primary/10 text-primary',
      badge: 'bg-primary/10 text-primary',
    },
  };

  const config = typeConfig[insight.type];
  const Icon = config.icon;

  const relevanceLabels = {
    high: 'Alta relevância',
    medium: 'Média relevância',
    low: 'Baixa relevância',
  };

  return (
    <div className={cn(
      'btg-card border animate-fade-in',
      config.bgClass,
      className
    )}>
      <div className="flex items-start gap-4">
        <div className={cn('p-3 rounded-xl', config.iconClass)}>
          <Icon className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className={cn('btg-badge', config.badge)}>
              {insight.type === 'alert' ? 'Alerta' : 
               insight.type === 'pattern' ? 'Padrão' :
               insight.type === 'economy' ? 'Economia' : 'Resumo'}
            </span>
            <span className="btg-badge bg-muted text-muted-foreground">
              {insight.category}
            </span>
            <span className="text-xs text-muted-foreground">
              {relevanceLabels[insight.relevance]}
            </span>
          </div>
          
          <h3 className="font-semibold text-foreground mb-1">
            {insight.title}
          </h3>
          
          <p className="text-sm text-muted-foreground leading-relaxed">
            {insight.description}
          </p>
          
          <p className="text-xs text-muted-foreground mt-3">
            {insight.date.toLocaleDateString('pt-BR', { 
              day: '2-digit', 
              month: 'long', 
              year: 'numeric' 
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
