import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  variant = 'default',
  className 
}: StatCardProps) {
  const variants = {
    default: 'btg-card',
    primary: 'btg-card bg-primary text-primary-foreground',
    success: 'btg-card border-success/20 bg-success/5',
    warning: 'btg-card border-warning/20 bg-warning/5',
    danger: 'btg-card border-destructive/20 bg-destructive/5',
  };

  const iconVariants = {
    default: 'bg-primary/10 text-primary',
    primary: 'bg-primary-foreground/20 text-primary-foreground',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-destructive/10 text-destructive',
  };

  return (
    <div className={cn(variants[variant], 'animate-fade-in', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={cn(
            "text-sm font-medium",
            variant === 'primary' ? 'text-primary-foreground/80' : 'text-muted-foreground'
          )}>
            {title}
          </p>
          <p className={cn(
            "text-2xl font-bold mt-1",
            variant === 'primary' ? 'text-primary-foreground' : 'text-foreground'
          )}>
            {value}
          </p>
          {subtitle && (
            <p className={cn(
              "text-xs mt-1",
              variant === 'primary' ? 'text-primary-foreground/60' : 'text-muted-foreground'
            )}>
              {subtitle}
            </p>
          )}
          {trend && (
            <div className={cn(
              "flex items-center gap-1 mt-2 text-sm font-medium",
              trend.isPositive ? 'text-success' : 'text-destructive'
            )}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-muted-foreground font-normal">vs mês anterior</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={cn(
            "p-3 rounded-xl",
            iconVariants[variant]
          )}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
