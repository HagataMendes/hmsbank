import { useState, useMemo, useCallback } from 'react';
import { useFinancial } from '@/contexts/FinancialContext';
import { 
  FamilyMember, 
  FamilyNucleus, 
  FamilyIntelligence, 
  FamilyDashboardData,
  FamilyGoal,
  FamilyOffer,
  DEFAULT_FAMILY_GOALS 
} from '@/types/family';

const INITIAL_FAMILY_MEMBERS: FamilyMember[] = [
  {
    id: '1',
    name: 'Carlos Mendes',
    relationship: 'spouse',
    hasLinkedProfile: true,
    monthlyIncome: 8500,
    monthlyExpenses: 3200,
  },
  {
    id: '2',
    name: 'Sofia Mendes',
    relationship: 'child',
    birthDate: '2015-03-15',
    hasLinkedProfile: false,
    monthlyExpenses: 1500,
  },
  {
    id: '3',
    name: 'Lucas Mendes',
    relationship: 'child',
    birthDate: '2018-08-22',
    hasLinkedProfile: false,
    monthlyExpenses: 1200,
  },
];

export function useFamilyIntelligence() {
  const { analysis, expenses } = useFinancial();
  
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(INITIAL_FAMILY_MEMBERS);
  const [familyGoals, setFamilyGoals] = useState<FamilyGoal[]>(() => 
    DEFAULT_FAMILY_GOALS.map((goal, index) => ({
      ...goal,
      id: `goal-${index}`,
      currentValue: Math.round(goal.targetValue * Math.random() * 0.4),
      progress: 0,
    })).map(goal => ({
      ...goal,
      progress: Math.round((goal.currentValue / goal.targetValue) * 100),
    }))
  );

  const familyNucleus = useMemo((): FamilyNucleus => ({
    id: 'family-1',
    mainUserId: 'hagata-mendes',
    members: familyMembers,
    createdAt: new Date(),
  }), [familyMembers]);

  const familyDashboard = useMemo((): FamilyDashboardData => {
    // User's data from analysis
    const userIncome = 12000; // Simulated main user income
    const userExpenses = analysis?.totalExpenses || 0;

    // Aggregate family data
    const membersIncome = familyMembers.reduce((sum, m) => sum + (m.monthlyIncome || 0), 0);
    const membersExpenses = familyMembers.reduce((sum, m) => sum + (m.monthlyExpenses || 0), 0);

    const totalIncome = userIncome + membersIncome;
    const totalExpenses = userExpenses + membersExpenses;
    const totalInvestments = Math.round(totalIncome * 0.15); // Simulated
    const totalReserves = Math.round(totalIncome * 3); // Simulated 3 months reserve
    const patrimony = totalInvestments * 12 + totalReserves;
    const savingsRate = totalIncome > 0 
      ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) 
      : 0;

    return {
      totalIncome,
      totalExpenses,
      totalInvestments,
      totalReserves,
      patrimony,
      savingsRate,
    };
  }, [analysis, familyMembers]);

  const familyIntelligence = useMemo((): FamilyIntelligence => {
    const { savingsRate } = familyDashboard;
    const userScore = analysis?.organizationScore || 50;
    const evolutionStatus = analysis?.evolution?.status || 'stable';

    // Family score is aggregated from individual data
    const familyScore = Math.min(100, Math.round(
      userScore * 0.6 + // Main user weight
      (savingsRate > 20 ? 25 : savingsRate > 10 ? 15 : 5) +
      (evolutionStatus === 'positive' ? 15 : evolutionStatus === 'stable' ? 10 : 0)
    ));

    // Behavioral profile based on savings and risk
    const behavioralProfile = savingsRate > 25 ? 'conservative' : 
                              savingsRate > 10 ? 'moderate' : 'aggressive';

    // Stability based on consistency
    const hasChildren = familyMembers.some(m => m.relationship === 'child');
    const stability = userScore >= 70 ? 'high' : userScore >= 50 ? 'medium' : 'low';
    const predictability = evolutionStatus === 'positive' ? 'high' : 
                           evolutionStatus === 'stable' ? 'medium' : 'low';

    // Risk level
    const riskLevel = savingsRate < 10 || evolutionStatus === 'risk' ? 'high' :
                      savingsRate < 20 ? 'medium' : 'low';

    return {
      familyScore,
      behavioralProfile,
      stability,
      predictability,
      riskLevel,
      evolutionTrend: evolutionStatus === 'positive' ? 'positive' : 
                      evolutionStatus === 'stable' ? 'stable' : 'negative',
    };
  }, [analysis, familyDashboard, familyMembers]);

  const familyOffers = useMemo((): FamilyOffer[] => {
    const { familyScore, behavioralProfile, stability } = familyIntelligence;
    const { totalIncome, savingsRate } = familyDashboard;

    const offers: FamilyOffer[] = [
      {
        id: 'prev-familia',
        productName: 'Previdência Familiar',
        productType: 'Previdência',
        objective: 'Aposentadoria e educação dos filhos',
        familyProfile: behavioralProfile === 'conservative' ? 'Família Conservadora' : 'Família Moderada',
        compatibility: Math.min(95, familyScore + 10),
        suggestedValue: Math.round(totalIncome * 0.1),
        timeHorizon: '15-20 anos',
        estimatedReturn: 10.5,
        riskLevel: 'medium',
        benefits: ['Benefício fiscal PGBL/VGBL', 'Planejamento sucessório', 'Renda futura garantida'],
      },
      {
        id: 'invest-familia',
        productName: 'Carteira Familiar Diversificada',
        productType: 'Investimentos',
        objective: 'Construção de patrimônio familiar',
        familyProfile: 'Família em Crescimento',
        compatibility: familyScore,
        suggestedValue: Math.round(totalIncome * 0.15),
        timeHorizon: '5-10 anos',
        estimatedReturn: 12.8,
        riskLevel: 'medium',
        benefits: ['Diversificação', 'Gestão profissional', 'Liquidez parcial'],
      },
      {
        id: 'protecao-familia',
        productName: 'Proteção Familiar Completa',
        productType: 'Seguros',
        objective: 'Proteção financeira da família',
        familyProfile: stability === 'high' ? 'Família Estável' : 'Família em Desenvolvimento',
        compatibility: Math.min(90, familyScore + 5),
        suggestedValue: Math.round(totalIncome * 0.02),
        timeHorizon: 'Renovação anual',
        riskLevel: 'low',
        benefits: ['Cobertura por morte e invalidez', 'Assistência 24h', 'Diárias hospitalares'],
      },
      {
        id: 'credito-familia',
        productName: 'Crédito Familiar',
        productType: 'Crédito',
        objective: 'Realização de sonhos da família',
        familyProfile: 'Família com Capacidade',
        compatibility: stability === 'high' ? 85 : 60,
        suggestedValue: totalIncome * 6,
        timeHorizon: '24-48 meses',
        riskLevel: savingsRate > 15 ? 'low' : 'medium',
        benefits: ['Taxas reduzidas', 'Carência disponível', 'Parcelas fixas'],
      },
    ];

    return offers.sort((a, b) => b.compatibility - a.compatibility);
  }, [familyIntelligence, familyDashboard]);

  const priorityFamilyOffer = useMemo(() => familyOffers[0], [familyOffers]);

  const addFamilyMember = useCallback((member: Omit<FamilyMember, 'id'>) => {
    setFamilyMembers(prev => [...prev, { ...member, id: crypto.randomUUID() }]);
  }, []);

  const removeFamilyMember = useCallback((memberId: string) => {
    setFamilyMembers(prev => prev.filter(m => m.id !== memberId));
  }, []);

  const updateGoalProgress = useCallback((goalId: string, currentValue: number) => {
    setFamilyGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, currentValue, progress: Math.round((currentValue / goal.targetValue) * 100) }
        : goal
    ));
  }, []);

  return {
    familyNucleus,
    familyMembers,
    familyIntelligence,
    familyDashboard,
    familyGoals,
    familyOffers,
    priorityFamilyOffer,
    addFamilyMember,
    removeFamilyMember,
    updateGoalProgress,
    hasData: !!analysis,
  };
}
