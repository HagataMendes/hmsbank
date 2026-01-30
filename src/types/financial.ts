export interface MonthlyExpenses {
  month: string;
  agua: number;
  luz: number;
  mercado: number;
  escola: number;
  aluguel: number;
  transporte: number;
  lazer: number;
  outros: number;
}

export interface FinancialAnalysis {
  id: string;
  createdAt: Date;
  summary: string;
  totalExpenses: number;
  biggestCategory: {
    name: string;
    value: number;
    percentage: number;
  };
  organizationScore: number;
  potentialSavings: number;
  insights: Insight[];
  alerts: Alert[];
  evolution: EvolutionStatus;
  monthlyComparison: MonthlyComparison[];
}

export interface Insight {
  id: string;
  type: 'alert' | 'pattern' | 'economy' | 'summary';
  category: string;
  title: string;
  description: string;
  date: Date;
  relevance: 'high' | 'medium' | 'low';
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  category: string;
  severity: 'high' | 'medium' | 'low';
  status: 'active' | 'resolved';
  createdAt: Date;
  resolvedAt?: Date;
}

export interface EvolutionStatus {
  status: 'positive' | 'stable' | 'risk';
  message: string;
  categoriesImproving: string[];
  categoriesStable: string[];
  categoriesAtRisk: string[];
  trend: 'up' | 'stable' | 'down';
}

export interface MonthlyComparison {
  month: string;
  total: number;
  change: number;
  changePercentage: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface UserSettings {
  emailNotifications: boolean;
  notificationFrequency: 'daily' | 'weekly' | 'monthly';
  automationsEnabled: boolean;
}

export const EXPENSE_CATEGORIES = [
  { key: 'agua', label: 'Água', icon: 'Droplets' },
  { key: 'luz', label: 'Luz', icon: 'Zap' },
  { key: 'mercado', label: 'Mercado', icon: 'ShoppingCart' },
  { key: 'escola', label: 'Escola', icon: 'GraduationCap' },
  { key: 'aluguel', label: 'Aluguel', icon: 'Home' },
  { key: 'transporte', label: 'Transporte', icon: 'Car' },
  { key: 'lazer', label: 'Lazer', icon: 'Gamepad2' },
  { key: 'outros', label: 'Outros', icon: 'MoreHorizontal' },
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number]['key'];
