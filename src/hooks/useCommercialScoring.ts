import { useMemo } from 'react';
import { useFinancial } from '@/contexts/FinancialContext';
import { CommercialScore, FinancialProduct, PriorityOffer, FINANCIAL_PRODUCTS } from '@/types/offers';

export function useCommercialScoring() {
  const { analysis, expenses, insights, alerts } = useFinancial();

  const commercialScores = useMemo((): CommercialScore => {
    if (!analysis) {
      return { investment: 0, credit: 0, planning: 0, protection: 0, consumption: 0 };
    }

    const { organizationScore, evolution, potentialSavings, totalExpenses } = analysis;
    
    // Score de Investimento: baseado em organização e economia potencial
    const investmentScore = Math.min(100, 
      (organizationScore * 0.4) + 
      (evolution?.status === 'positive' ? 30 : evolution?.status === 'stable' ? 15 : 0) +
      (potentialSavings > 500 ? 30 : potentialSavings > 200 ? 15 : 5)
    );

    // Score de Crédito: baseado em estabilidade e previsibilidade
    const creditScore = Math.min(100,
      (organizationScore * 0.5) +
      (evolution?.status !== 'risk' ? 25 : 0) +
      (alerts.filter(a => a.status === 'active').length === 0 ? 25 : 10)
    );

    // Score de Planejamento: baseado em consistência de dados
    const validMonths = expenses.filter(e => 
      Object.values(e).some(v => typeof v === 'number' && v > 0)
    ).length;
    const planningScore = Math.min(100,
      (validMonths * 20) +
      (organizationScore * 0.3) +
      (evolution?.status === 'positive' ? 20 : 10)
    );

    // Score de Proteção: baseado em gastos com dependentes
    const hasSchoolExpenses = expenses.some(e => e.escola > 0);
    const protectionScore = Math.min(100,
      (hasSchoolExpenses ? 40 : 20) +
      (organizationScore * 0.4) +
      (totalExpenses > 5000 ? 20 : 10)
    );

    // Score de Consumo: baseado em padrões de lazer e gastos
    const avgLeisure = expenses.reduce((sum, e) => sum + e.lazer, 0) / expenses.length;
    const consumptionScore = Math.min(100,
      (avgLeisure > 500 ? 40 : avgLeisure > 200 ? 25 : 15) +
      (organizationScore * 0.3) +
      30
    );

    return {
      investment: Math.round(investmentScore),
      credit: Math.round(creditScore),
      planning: Math.round(planningScore),
      protection: Math.round(protectionScore),
      consumption: Math.round(consumptionScore),
    };
  }, [analysis, expenses, alerts]);

  const rankedProducts = useMemo((): FinancialProduct[] => {
    if (!analysis) return FINANCIAL_PRODUCTS;

    return FINANCIAL_PRODUCTS.map(product => {
      let compatibility = 0;
      let conversionProbability = 0;

      switch (product.category) {
        case 'investment':
          compatibility = commercialScores.investment;
          conversionProbability = Math.min(95, compatibility * 0.8 + 15);
          break;
        case 'credit':
          compatibility = commercialScores.credit;
          conversionProbability = Math.min(90, compatibility * 0.7 + 10);
          break;
        case 'planning':
          compatibility = commercialScores.planning;
          conversionProbability = Math.min(85, compatibility * 0.75 + 10);
          break;
        case 'protection':
          compatibility = commercialScores.protection;
          conversionProbability = Math.min(80, compatibility * 0.7 + 15);
          break;
        default:
          compatibility = commercialScores.consumption;
          conversionProbability = Math.min(90, compatibility * 0.8 + 20);
      }

      return { ...product, compatibility, conversionProbability };
    }).sort((a, b) => b.conversionProbability - a.conversionProbability);
  }, [analysis, commercialScores]);

  const priorityOffer = useMemo((): PriorityOffer | null => {
    if (!analysis || rankedProducts.length === 0) return null;

    const topProduct = rankedProducts[0];
    const { organizationScore, evolution, potentialSavings } = analysis;

    const reasons: string[] = [];
    const triggers: string[] = [];

    if (organizationScore >= 70) {
      reasons.push('Alta organização financeira identificada');
      triggers.push('Perfil organizado = maior chance de sucesso');
    }
    if (evolution?.status === 'positive') {
      reasons.push('Evolução positiva nos últimos meses');
      triggers.push('Momento financeiro favorável');
    }
    if (potentialSavings > 300) {
      reasons.push(`Economia potencial de R$ ${potentialSavings} identificada`);
      triggers.push('Capacidade de poupança comprovada');
    }

    const suggestedValue = topProduct.category === 'investment' 
      ? Math.max(topProduct.minValue, potentialSavings * 2)
      : topProduct.minValue;

    return {
      product: topProduct,
      reason: reasons.join('. ') || 'Produto recomendado com base no seu perfil',
      userProfile: organizationScore >= 70 ? 'Investidor Organizado' : 
                   organizationScore >= 50 ? 'Investidor em Desenvolvimento' : 
                   'Investidor Iniciante',
      suggestedValue,
      estimatedReturn: topProduct.estimatedReturn 
        ? suggestedValue * (topProduct.estimatedReturn / 100) 
        : undefined,
      horizon: topProduct.category === 'planning' ? '10+ anos' : '12 meses',
      conversionTriggers: triggers.length > 0 ? triggers : ['Oferta personalizada para você'],
    };
  }, [analysis, rankedProducts]);

  const crossSellProducts = useMemo((): FinancialProduct[] => {
    if (!priorityOffer) return [];
    return rankedProducts
      .filter(p => p.id !== priorityOffer.product.id)
      .slice(0, 3);
  }, [rankedProducts, priorityOffer]);

  return {
    commercialScores,
    rankedProducts,
    priorityOffer,
    crossSellProducts,
    hasData: !!analysis,
  };
}
