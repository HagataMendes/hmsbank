import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  BarChart3,
  PieChart,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useFinancial } from '@/contexts/FinancialContext';
import { StatCard } from '@/components/ui/StatCard';
import { EvolutionCard } from '@/components/ui/EvolutionCard';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { cn } from '@/lib/utils';

export default function FinancialDashboard() {
  const { analysis, expenses } = useFinancial();

  if (!analysis) {
    return (
      <div className="space-y-8 pt-12 lg:pt-0">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg btg-gradient-primary flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Análise Financeira</h1>
        </div>

        <div className="btg-card flex flex-col items-center justify-center text-center py-16">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
            <BarChart3 className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Nenhuma análise disponível
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Insira seus dados financeiros e gere uma análise para visualizar seu dashboard completo
          </p>
          <Link to="/analysis" className="btg-button-primary flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Gerar Primeira Análise
          </Link>
        </div>
      </div>
    );
  }

  const categoryBreakdown = [
    { name: 'Água', key: 'agua', color: 'bg-blue-500' },
    { name: 'Luz', key: 'luz', color: 'bg-yellow-500' },
    { name: 'Mercado', key: 'mercado', color: 'bg-green-500' },
    { name: 'Escola', key: 'escola', color: 'bg-purple-500' },
    { name: 'Aluguel', key: 'aluguel', color: 'bg-orange-500' },
    { name: 'Transporte', key: 'transporte', color: 'bg-red-500' },
    { name: 'Lazer', key: 'lazer', color: 'bg-pink-500' },
    { name: 'Outros', key: 'outros', color: 'bg-gray-500' },
  ];

  const lastMonthExpenses = expenses.filter(e => 
    e.agua + e.luz + e.mercado + e.escola + e.aluguel + e.transporte + e.lazer + e.outros > 0
  ).pop();

  const getCategoryValue = (key: string) => {
    if (!lastMonthExpenses) return 0;
    return lastMonthExpenses[key as keyof typeof lastMonthExpenses] as number;
  };

  return (
    <div className="space-y-8 pt-12 lg:pt-0">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg btg-gradient-primary flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Análise Financeira</h1>
            <p className="text-sm text-muted-foreground">
              Gerada em {analysis.createdAt.toLocaleDateString('pt-BR', { 
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
        
        <Link to="/analysis" className="btg-button-primary flex items-center gap-2 w-fit">
          <Sparkles className="w-5 h-5" />
          Nova Análise
        </Link>
      </div>

      {/* Summary */}
      <div className="btg-card btg-gradient-primary text-primary-foreground">
        <p className="text-primary-foreground/80 text-sm mb-2">Resumo da Análise</p>
        <p className="text-lg leading-relaxed">{analysis.summary}</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Gasto Total"
          value={`R$ ${analysis.totalExpenses.toLocaleString('pt-BR')}`}
          icon={TrendingUp}
        />
        <StatCard
          title="Maior Categoria"
          value={analysis.biggestCategory.name}
          subtitle={`R$ ${analysis.biggestCategory.value.toLocaleString('pt-BR')} (${analysis.biggestCategory.percentage}%)`}
          icon={PieChart}
        />
        <StatCard
          title="Economia Potencial"
          value={`R$ ${analysis.potentialSavings.toLocaleString('pt-BR')}`}
          subtitle="Com base nos padrões identificados"
          icon={TrendingDown}
          variant="success"
        />
        <div className="btg-card flex flex-col items-center justify-center">
          <p className="text-sm text-muted-foreground mb-2">Índice de Organização</p>
          <ScoreRing score={analysis.organizationScore} size="md" />
        </div>
      </div>

      {/* Evolução Financeira */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Evolução Financeira
        </h2>
        <EvolutionCard evolution={analysis.evolution} />
      </div>

      {/* Comparativo Mensal */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Comparativo Mensal
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {analysis.monthlyComparison.map((month, index) => (
            <div key={month.month} className="btg-card animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <p className="text-sm font-medium text-muted-foreground mb-1">{month.month}</p>
              <p className="text-2xl font-bold text-foreground">
                R$ {month.total.toLocaleString('pt-BR')}
              </p>
              {index > 0 && (
                <div className={cn(
                  'flex items-center gap-1 mt-2 text-sm',
                  month.changePercentage < 0 ? 'text-success' : month.changePercentage > 0 ? 'text-destructive' : 'text-muted-foreground'
                )}>
                  {month.changePercentage < 0 ? (
                    <TrendingDown className="w-4 h-4" />
                  ) : month.changePercentage > 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <Minus className="w-4 h-4" />
                  )}
                  <span>
                    {month.changePercentage > 0 ? '+' : ''}{month.changePercentage.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Breakdown por Categoria */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <PieChart className="w-5 h-5 text-primary" />
          Distribuição por Categoria
        </h2>
        <div className="btg-card">
          <div className="space-y-4">
            {categoryBreakdown.map(category => {
              const value = getCategoryValue(category.key);
              const percentage = analysis.totalExpenses > 0 
                ? (value / analysis.totalExpenses) * 100 
                : 0;
              
              return (
                <div key={category.key} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{category.name}</span>
                    <span className="text-muted-foreground">
                      R$ {value.toLocaleString('pt-BR')} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={cn('h-full rounded-full transition-all duration-500', category.color)}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Link para Insights */}
      <Link 
        to="/insights" 
        className="btg-card-hover flex items-center justify-between group"
      >
        <div>
          <h3 className="font-semibold text-foreground">Ver Todos os Insights</h3>
          <p className="text-sm text-muted-foreground">{analysis.insights.length} insights gerados</p>
        </div>
        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </Link>
    </div>
  );
}
