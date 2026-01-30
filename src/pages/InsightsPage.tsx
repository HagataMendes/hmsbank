import { Link } from 'react-router-dom';
import { Lightbulb, Sparkles, Filter } from 'lucide-react';
import { useFinancial } from '@/contexts/FinancialContext';
import { InsightCard } from '@/components/ui/InsightCard';
import { useState } from 'react';

export default function InsightsPage() {
  const { insights } = useFinancial();
  const [filter, setFilter] = useState<'all' | 'alert' | 'pattern' | 'economy' | 'summary'>('all');

  const filteredInsights = filter === 'all' 
    ? insights 
    : insights.filter(i => i.type === filter);

  const filterOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'alert', label: 'Alertas' },
    { value: 'pattern', label: 'Padrões' },
    { value: 'economy', label: 'Economia' },
    { value: 'summary', label: 'Resumos' },
  ];

  return (
    <div className="space-y-8 pt-12 lg:pt-0">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg btg-gradient-primary flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Insights</h1>
            <p className="text-muted-foreground">Análises e padrões identificados</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-muted-foreground" />
        {filterOptions.map(option => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value as typeof filter)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === option.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-muted'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Insights List */}
      {filteredInsights.length > 0 ? (
        <div className="space-y-4">
          {filteredInsights.map((insight, index) => (
            <div key={insight.id} style={{ animationDelay: `${index * 100}ms` }}>
              <InsightCard insight={insight} />
            </div>
          ))}
        </div>
      ) : (
        <div className="btg-card flex flex-col items-center justify-center text-center py-16">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
            <Lightbulb className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {filter === 'all' ? 'Nenhum insight disponível' : `Nenhum insight do tipo "${filterOptions.find(o => o.value === filter)?.label}"`}
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            {filter === 'all' 
              ? 'Gere uma análise financeira para receber insights personalizados sobre seus gastos'
              : 'Tente alterar o filtro ou gere uma nova análise'}
          </p>
          {filter === 'all' && (
            <Link to="/analysis" className="btg-button-primary flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Gerar Análise
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
