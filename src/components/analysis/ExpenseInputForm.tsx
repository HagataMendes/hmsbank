import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Droplets, 
  Zap, 
  ShoppingCart, 
  GraduationCap, 
  Home, 
  Car, 
  Gamepad2, 
  MoreHorizontal,
  Loader2,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useFinancial } from '@/contexts/FinancialContext';
import { MonthlyExpenses } from '@/types/financial';
import { cn } from '@/lib/utils';

const categoryIcons = {
  agua: Droplets,
  luz: Zap,
  mercado: ShoppingCart,
  escola: GraduationCap,
  aluguel: Home,
  transporte: Car,
  lazer: Gamepad2,
  outros: MoreHorizontal,
};

const categoryLabels: Record<string, string> = {
  agua: 'Água',
  luz: 'Luz',
  mercado: 'Mercado',
  escola: 'Escola',
  aluguel: 'Aluguel',
  transporte: 'Transporte',
  lazer: 'Lazer',
  outros: 'Outros',
};

export function ExpenseInputForm() {
  const navigate = useNavigate();
  const { expenses, setExpenses, generateAnalysis, isAnalyzing } = useFinancial();
  const [expandedMonths, setExpandedMonths] = useState<Set<number>>(new Set([0]));

  const toggleMonth = (index: number) => {
    setExpandedMonths(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const updateExpense = (monthIndex: number, category: keyof MonthlyExpenses, value: string) => {
    const numValue = parseFloat(value) || 0;
    setExpenses(expenses.map((expense, idx) => 
      idx === monthIndex 
        ? { ...expense, [category]: numValue }
        : expense
    ));
  };

  const calculateTotal = (expense: MonthlyExpenses): number => {
    return expense.agua + expense.luz + expense.mercado + expense.escola +
           expense.aluguel + expense.transporte + expense.lazer + expense.outros;
  };

  const handleGenerateAnalysis = async () => {
    await generateAnalysis();
    navigate('/financial-dashboard');
  };

  const categories = ['agua', 'luz', 'mercado', 'escola', 'aluguel', 'transporte', 'lazer', 'outros'] as const;

  return (
    <div className="space-y-6">
      {/* Botão principal */}
      <div className="btg-card p-6 btg-gradient-primary text-primary-foreground">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold mb-1">Análise Completa com IA</h2>
            <p className="text-primary-foreground/80 text-sm">
              Insira seus gastos e gere insights personalizados
            </p>
          </div>
          <button
            onClick={handleGenerateAnalysis}
            disabled={isAnalyzing}
            className="btg-button-secondary flex items-center justify-center gap-2 min-w-[200px]"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analisando...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Gerar Análise Completa
              </>
            )}
          </button>
        </div>
      </div>

      {/* Formulário de gastos por mês */}
      <div className="space-y-4">
        {expenses.map((monthData, monthIndex) => {
          const isExpanded = expandedMonths.has(monthIndex);
          const total = calculateTotal(monthData);

          return (
            <div key={monthData.month} className="btg-card animate-fade-in" style={{ animationDelay: `${monthIndex * 100}ms` }}>
              <button
                onClick={() => toggleMonth(monthIndex)}
                className="w-full flex items-center justify-between p-4 -m-6 mb-0 hover:bg-muted/30 rounded-t-xl transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg btg-gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                    {monthData.month.substring(0, 3).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-foreground">{monthData.month}</h3>
                    <p className="text-sm text-muted-foreground">
                      Total: R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </button>

              {isExpanded && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-4 border-t border-border">
                  {categories.map(category => {
                    const Icon = categoryIcons[category];
                    return (
                      <div key={category} className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <Icon className="w-4 h-4" />
                          {categoryLabels[category]}
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                            R$
                          </span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={monthData[category] || ''}
                            onChange={(e) => updateExpense(monthIndex, category, e.target.value)}
                            placeholder="0,00"
                            className="btg-input pl-10"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Segundo botão para gerar análise */}
      <div className="flex justify-center">
        <button
          onClick={handleGenerateAnalysis}
          disabled={isAnalyzing}
          className="btg-button-primary flex items-center gap-2 text-lg px-8 py-4"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processando análise...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Gerar Análise Completa
            </>
          )}
        </button>
      </div>
    </div>
  );
}
