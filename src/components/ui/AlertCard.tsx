import { cn } from '@/lib/utils';
import { Alert } from '@/types/financial';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface AlertCardProps {
  alert: Alert;
  onResolve?: (id: string) => void;
  className?: string;
}

export function AlertCard({ alert, onResolve, className }: AlertCardProps) {
  const severityConfig = {
    high: {
      bgClass: 'bg-destructive/5 border-destructive/20',
      iconClass: 'bg-destructive/10 text-destructive',
      badge: 'hms-badge-danger',
    },
    medium: {
      bgClass: 'bg-warning/5 border-warning/20',
      iconClass: 'bg-warning/10 text-warning',
      badge: 'hms-badge-warning',
    },
    low: {
      bgClass: 'bg-info/5 border-info/20',
      iconClass: 'bg-info/10 text-info',
      badge: 'hms-badge-info',
    },
  };

  const config = severityConfig[alert.severity];
  const isResolved = alert.status === 'resolved';

  return (
    <div className={cn(
      'hms-card border animate-fade-in',
      isResolved ? 'bg-muted/30 border-border' : config.bgClass,
      className
    )}>
      <div className="flex items-start gap-4">
        <div className={cn(
          'p-3 rounded-xl',
          isResolved ? 'bg-success/10 text-success' : config.iconClass
        )}>
          {isResolved ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertTriangle className="w-5 h-5" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className={cn(
              'hms-badge',
              isResolved ? 'hms-badge-success' : config.badge
            )}>
              {isResolved ? 'Resolvido' : 
               alert.severity === 'high' ? 'Alta Prioridade' :
               alert.severity === 'medium' ? 'Média Prioridade' : 'Baixa Prioridade'}
            </span>
            <span className="hms-badge bg-muted text-muted-foreground">
              {alert.category}
            </span>
          </div>
          
          <h3 className={cn(
            "font-semibold mb-1",
            isResolved ? 'text-muted-foreground' : 'text-foreground'
          )}>
            {alert.title}
          </h3>
          
          <p className="text-sm text-muted-foreground leading-relaxed">
            {alert.description}
          </p>
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {alert.createdAt.toLocaleDateString('pt-BR', { 
                  day: '2-digit', 
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            
            {!isResolved && onResolve && (
              <button
                onClick={() => onResolve(alert.id)}
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Marcar como resolvido
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
