import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { 
  MonthlyExpenses, 
  FinancialAnalysis, 
  Insight, 
  Alert, 
  ChatMessage,
  UserSettings,
  EvolutionStatus,
  MonthlyComparison
} from '@/types/financial';

interface FinancialContextType {
  expenses: MonthlyExpenses[];
  setExpenses: (expenses: MonthlyExpenses[]) => void;
  analysis: FinancialAnalysis | null;
  setAnalysis: (analysis: FinancialAnalysis | null) => void;
  insights: Insight[];
  alerts: Alert[];
  chatMessages: ChatMessage[];
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (value: boolean) => void;
  generateAnalysis: () => Promise<void>;
  resolveAlert: (alertId: string) => void;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

const getDefaultMonths = (): MonthlyExpenses[] => {
  const months = ['Janeiro 2025', 'Fevereiro 2025', 'Março 2025', 'Abril 2025'];
  return months.map(month => ({
    month,
    agua: 0,
    luz: 0,
    mercado: 0,
    escola: 0,
    aluguel: 0,
    transporte: 0,
    lazer: 0,
    outros: 0,
  }));
};

export function FinancialProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<MonthlyExpenses[]>(getDefaultMonths());
  const [analysis, setAnalysis] = useState<FinancialAnalysis | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    emailNotifications: true,
    notificationFrequency: 'weekly',
    automationsEnabled: true,
  });

  const addChatMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };
    setChatMessages(prev => [...prev, newMessage]);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const resolveAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: 'resolved' as const, resolvedAt: new Date() }
        : alert
    ));
  }, []);

  const calculateTotalExpenses = (data: MonthlyExpenses): number => {
    return data.agua + data.luz + data.mercado + data.escola + 
           data.aluguel + data.transporte + data.lazer + data.outros;
  };

  const findBiggestCategory = (data: MonthlyExpenses) => {
    const categories = [
      { name: 'Água', value: data.agua },
      { name: 'Luz', value: data.luz },
      { name: 'Mercado', value: data.mercado },
      { name: 'Escola', value: data.escola },
      { name: 'Aluguel', value: data.aluguel },
      { name: 'Transporte', value: data.transporte },
      { name: 'Lazer', value: data.lazer },
      { name: 'Outros', value: data.outros },
    ];
    
    const total = calculateTotalExpenses(data);
    const biggest = categories.reduce((max, cat) => cat.value > max.value ? cat : max, categories[0]);
    
    return {
      name: biggest.name,
      value: biggest.value,
      percentage: total > 0 ? Math.round((biggest.value / total) * 100) : 0,
    };
  };

  const calculateEvolution = (data: MonthlyExpenses[]): EvolutionStatus => {
    if (data.length < 2) {
      return {
        status: 'stable',
        message: 'Insira mais meses para análise de evolução',
        categoriesImproving: [],
        categoriesStable: [],
        categoriesAtRisk: [],
        trend: 'stable',
      };
    }

    const validData = data.filter(d => calculateTotalExpenses(d) > 0);
    if (validData.length < 2) {
      return {
        status: 'stable',
        message: 'Dados insuficientes para análise de evolução',
        categoriesImproving: [],
        categoriesStable: [],
        categoriesAtRisk: [],
        trend: 'stable',
      };
    }

    const lastMonth = validData[validData.length - 1];
    const previousMonth = validData[validData.length - 2];

    const categories = ['agua', 'luz', 'mercado', 'escola', 'aluguel', 'transporte', 'lazer', 'outros'] as const;
    const improving: string[] = [];
    const stable: string[] = [];
    const atRisk: string[] = [];

    const categoryLabels: Record<string, string> = {
      agua: 'Água', luz: 'Luz', mercado: 'Mercado', escola: 'Escola',
      aluguel: 'Aluguel', transporte: 'Transporte', lazer: 'Lazer', outros: 'Outros'
    };

    categories.forEach(cat => {
      const current = lastMonth[cat];
      const previous = previousMonth[cat];
      const change = previous > 0 ? ((current - previous) / previous) * 100 : 0;

      if (change < -5) improving.push(categoryLabels[cat]);
      else if (change > 10) atRisk.push(categoryLabels[cat]);
      else stable.push(categoryLabels[cat]);
    });

    const totalCurrent = calculateTotalExpenses(lastMonth);
    const totalPrevious = calculateTotalExpenses(previousMonth);
    const totalChange = totalPrevious > 0 ? ((totalCurrent - totalPrevious) / totalPrevious) * 100 : 0;

    let status: 'positive' | 'stable' | 'risk';
    let trend: 'up' | 'stable' | 'down';
    let message: string;

    if (totalChange < -5) {
      status = 'positive';
      trend = 'up';
      message = `Evolução positiva! Seus gastos reduziram ${Math.abs(totalChange).toFixed(1)}% em relação ao mês anterior.`;
    } else if (totalChange > 10) {
      status = 'risk';
      trend = 'down';
      message = `Atenção: Seus gastos aumentaram ${totalChange.toFixed(1)}% em relação ao mês anterior.`;
    } else {
      status = 'stable';
      trend = 'stable';
      message = `Seus gastos estão estáveis, com variação de ${totalChange > 0 ? '+' : ''}${totalChange.toFixed(1)}%.`;
    }

    return { status, message, categoriesImproving: improving, categoriesStable: stable, categoriesAtRisk: atRisk, trend };
  };

  const generateInsights = (data: MonthlyExpenses[]): Insight[] => {
    const newInsights: Insight[] = [];
    const validData = data.filter(d => calculateTotalExpenses(d) > 0);

    if (validData.length === 0) return [];

    const lastMonth = validData[validData.length - 1];
    const total = calculateTotalExpenses(lastMonth);
    const biggest = findBiggestCategory(lastMonth);

    // Insight principal
    newInsights.push({
      id: crypto.randomUUID(),
      type: 'summary',
      category: 'Geral',
      title: 'Resumo do Mês',
      description: `Seu gasto total em ${lastMonth.month} foi de R$ ${total.toLocaleString('pt-BR')}. A categoria ${biggest.name} representa ${biggest.percentage}% do total.`,
      date: new Date(),
      relevance: 'high',
    });

    // Análise por categoria
    if (lastMonth.lazer > total * 0.15) {
      newInsights.push({
        id: crypto.randomUUID(),
        type: 'pattern',
        category: 'Lazer',
        title: 'Gastos com Lazer Elevados',
        description: `Seus gastos com lazer representam ${((lastMonth.lazer / total) * 100).toFixed(1)}% do orçamento total. Padrão identificado nos dados inseridos.`,
        date: new Date(),
        relevance: 'medium',
      });
    }

    // Comparação entre meses
    if (validData.length >= 2) {
      const previousMonth = validData[validData.length - 2];
      const previousTotal = calculateTotalExpenses(previousMonth);
      const change = previousTotal > 0 ? ((total - previousTotal) / previousTotal) * 100 : 0;

      if (Math.abs(change) > 5) {
        newInsights.push({
          id: crypto.randomUUID(),
          type: change > 0 ? 'alert' : 'economy',
          category: 'Comparativo',
          title: change > 0 ? 'Aumento nos Gastos' : 'Redução nos Gastos',
          description: `Comparando ${lastMonth.month} com ${previousMonth.month}, houve ${change > 0 ? 'aumento' : 'redução'} de ${Math.abs(change).toFixed(1)}% nos gastos totais.`,
          date: new Date(),
          relevance: Math.abs(change) > 15 ? 'high' : 'medium',
        });
      }
    }

    // Padrões de consumo fixo
    const fixedExpenses = lastMonth.aluguel + lastMonth.escola;
    const variableExpenses = total - fixedExpenses;
    
    newInsights.push({
      id: crypto.randomUUID(),
      type: 'pattern',
      category: 'Estrutura',
      title: 'Composição do Orçamento',
      description: `Gastos fixos (aluguel + escola): R$ ${fixedExpenses.toLocaleString('pt-BR')} (${((fixedExpenses / total) * 100).toFixed(1)}%). Gastos variáveis: R$ ${variableExpenses.toLocaleString('pt-BR')} (${((variableExpenses / total) * 100).toFixed(1)}%).`,
      date: new Date(),
      relevance: 'low',
    });

    return newInsights;
  };

  const generateAlerts = (data: MonthlyExpenses[]): Alert[] => {
    const newAlerts: Alert[] = [];
    const validData = data.filter(d => calculateTotalExpenses(d) > 0);

    if (validData.length < 2) return [];

    const lastMonth = validData[validData.length - 1];
    const previousMonth = validData[validData.length - 2];

    const categories = [
      { key: 'mercado', label: 'Mercado' },
      { key: 'lazer', label: 'Lazer' },
      { key: 'transporte', label: 'Transporte' },
      { key: 'luz', label: 'Luz' },
    ] as const;

    categories.forEach(({ key, label }) => {
      const current = lastMonth[key];
      const previous = previousMonth[key];
      
      if (previous > 0) {
        const change = ((current - previous) / previous) * 100;
        
        if (change > 20) {
          newAlerts.push({
            id: crypto.randomUUID(),
            title: `Aumento significativo em ${label}`,
            description: `Os gastos com ${label} aumentaram ${change.toFixed(1)}% em relação ao mês anterior.`,
            category: label,
            severity: change > 40 ? 'high' : 'medium',
            status: 'active',
            createdAt: new Date(),
          });
        }
      }
    });

    return newAlerts;
  };

  const calculateMonthlyComparison = (data: MonthlyExpenses[]): MonthlyComparison[] => {
    return data.map((month, index) => {
      const total = calculateTotalExpenses(month);
      const previousTotal = index > 0 ? calculateTotalExpenses(data[index - 1]) : total;
      const change = total - previousTotal;
      const changePercentage = previousTotal > 0 ? (change / previousTotal) * 100 : 0;

      return {
        month: month.month,
        total,
        change: index === 0 ? 0 : change,
        changePercentage: index === 0 ? 0 : changePercentage,
      };
    });
  };

  const sendToWebhook = async (analysisData: FinancialAnalysis) => {
    try {
      const webhookUrl = 'https://hagatamendes29.app.n8n.cloud/webhook-test/lovable-financial-analysis';
      
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify({
          analysis: analysisData,
          expenses: expenses,
          timestamp: new Date().toISOString(),
          user: 'Hágata Mendes',
        }),
      });
      
      console.log('Webhook enviado com sucesso');
    } catch (error) {
      console.error('Erro ao enviar webhook:', error);
    }
  };

  const generateAnalysis = useCallback(async () => {
    setIsAnalyzing(true);

    // Simular processamento
    await new Promise(resolve => setTimeout(resolve, 2000));

    const validExpenses = expenses.filter(e => calculateTotalExpenses(e) > 0);
    
    if (validExpenses.length === 0) {
      setIsAnalyzing(false);
      return;
    }

    const lastMonth = validExpenses[validExpenses.length - 1];
    const total = calculateTotalExpenses(lastMonth);
    const biggest = findBiggestCategory(lastMonth);
    const evolution = calculateEvolution(expenses);
    const newInsights = generateInsights(expenses);
    const newAlerts = generateAlerts(expenses);
    const monthlyComparison = calculateMonthlyComparison(expenses);

    // Calcular score de organização
    const fixedExpensesRatio = (lastMonth.aluguel + lastMonth.escola) / total;
    const hasConsistentData = validExpenses.length >= 2;
    let score = 50;
    
    if (fixedExpensesRatio > 0.3 && fixedExpensesRatio < 0.6) score += 20;
    if (hasConsistentData) score += 15;
    if (evolution.status === 'positive') score += 15;
    if (newAlerts.filter(a => a.severity === 'high').length === 0) score += 10;
    
    score = Math.min(100, Math.max(0, score));

    // Calcular economia potencial baseada em padrões
    const potentialSavings = Math.round(
      (lastMonth.lazer > total * 0.15 ? lastMonth.lazer * 0.2 : 0) +
      (lastMonth.mercado > total * 0.25 ? lastMonth.mercado * 0.1 : 0)
    );

    const newAnalysis: FinancialAnalysis = {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      summary: `Análise completa dos seus gastos em ${lastMonth.month}. ${evolution.message}`,
      totalExpenses: total,
      biggestCategory: biggest,
      organizationScore: score,
      potentialSavings,
      insights: newInsights,
      alerts: newAlerts,
      evolution,
      monthlyComparison,
    };

    setAnalysis(newAnalysis);
    setInsights(newInsights);
    setAlerts(prev => [...newAlerts, ...prev.filter(a => a.status === 'resolved')]);

    // Enviar para webhook
    await sendToWebhook(newAnalysis);

    setIsAnalyzing(false);
  }, [expenses]);

  return (
    <FinancialContext.Provider value={{
      expenses,
      setExpenses,
      analysis,
      setAnalysis,
      insights,
      alerts,
      chatMessages,
      addChatMessage,
      settings,
      updateSettings,
      isAnalyzing,
      setIsAnalyzing,
      generateAnalysis,
      resolveAlert,
    }}>
      {children}
    </FinancialContext.Provider>
  );
}

export function useFinancial() {
  const context = useContext(FinancialContext);
  if (context === undefined) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
}
