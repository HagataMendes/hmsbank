// MVP 3 - Família Types

export interface FamilyMember {
  id: string;
  name: string;
  relationship: 'spouse' | 'child' | 'dependent';
  birthDate?: string;
  hasLinkedProfile: boolean;
  monthlyIncome?: number;
  monthlyExpenses?: number;
}

export interface FamilyNucleus {
  id: string;
  mainUserId: string;
  members: FamilyMember[];
  createdAt: Date;
}

export interface FamilyIntelligence {
  familyScore: number;
  behavioralProfile: 'conservative' | 'moderate' | 'aggressive';
  stability: 'high' | 'medium' | 'low';
  predictability: 'high' | 'medium' | 'low';
  riskLevel: 'low' | 'medium' | 'high';
  evolutionTrend: 'positive' | 'stable' | 'negative';
}

export interface FamilyDashboardData {
  totalIncome: number;
  totalExpenses: number;
  totalInvestments: number;
  totalReserves: number;
  patrimony: number;
  savingsRate: number;
}

export interface FamilyGoal {
  id: string;
  title: string;
  category: 'education' | 'housing' | 'retirement' | 'patrimony' | 'protection' | 'travel';
  targetValue: number;
  currentValue: number;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  progress: number;
}

export interface FamilyOffer {
  id: string;
  productName: string;
  productType: string;
  objective: string;
  familyProfile: string;
  compatibility: number;
  suggestedValue: number;
  timeHorizon: string;
  estimatedReturn?: number;
  riskLevel: 'low' | 'medium' | 'high';
  benefits: string[];
}

export const DEFAULT_FAMILY_GOALS: Omit<FamilyGoal, 'id' | 'currentValue' | 'progress'>[] = [
  {
    title: 'Educação dos Filhos',
    category: 'education',
    targetValue: 150000,
    deadline: '2030',
    priority: 'high',
  },
  {
    title: 'Casa Própria',
    category: 'housing',
    targetValue: 500000,
    deadline: '2028',
    priority: 'high',
  },
  {
    title: 'Aposentadoria',
    category: 'retirement',
    targetValue: 2000000,
    deadline: '2045',
    priority: 'medium',
  },
  {
    title: 'Reserva de Emergência',
    category: 'patrimony',
    targetValue: 50000,
    deadline: '2025',
    priority: 'high',
  },
];
