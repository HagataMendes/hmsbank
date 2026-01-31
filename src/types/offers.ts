// MVP 2 - Ofertas Inteligentes Types

export interface CommercialScore {
  investment: number;
  credit: number;
  planning: number;
  protection: number;
  consumption: number;
}

export interface FinancialProduct {
  id: string;
  name: string;
  category: 'investment' | 'credit' | 'protection' | 'planning' | 'consumption';
  type: string;
  riskLevel: 'low' | 'medium' | 'high';
  minValue: number;
  estimatedReturn?: number;
  description: string;
  benefits: string[];
  compatibility: number;
  conversionProbability: number;
}

export interface PriorityOffer {
  product: FinancialProduct;
  reason: string;
  userProfile: string;
  suggestedValue: number;
  estimatedReturn?: number;
  horizon?: string;
  conversionTriggers: string[];
}

export interface QuickSimulation {
  productId: string;
  value: number;
  term: number;
  estimatedReturn: number;
  monthlyReturn?: number;
}

export const FINANCIAL_PRODUCTS: FinancialProduct[] = [
  {
    id: 'cdb-btg',
    name: 'CDB BTG Pactual',
    category: 'investment',
    type: 'Renda Fixa',
    riskLevel: 'low',
    minValue: 1000,
    estimatedReturn: 13.5,
    description: 'CDB com rentabilidade competitiva e liquidez diária',
    benefits: ['Liquidez D+0', 'Garantido pelo FGC', 'Rentabilidade acima da poupança'],
    compatibility: 0,
    conversionProbability: 0,
  },
  {
    id: 'tesouro-selic',
    name: 'Tesouro Selic',
    category: 'investment',
    type: 'Tesouro Direto',
    riskLevel: 'low',
    minValue: 100,
    estimatedReturn: 13.25,
    description: 'Título público federal com baixo risco',
    benefits: ['Baixo risco', 'Liquidez diária', 'Garantia do Tesouro Nacional'],
    compatibility: 0,
    conversionProbability: 0,
  },
  {
    id: 'fundo-rf',
    name: 'Fundo de Renda Fixa',
    category: 'investment',
    type: 'Fundos',
    riskLevel: 'low',
    minValue: 500,
    estimatedReturn: 12.8,
    description: 'Fundo com gestão profissional em renda fixa',
    benefits: ['Gestão profissional', 'Diversificação', 'Baixa volatilidade'],
    compatibility: 0,
    conversionProbability: 0,
  },
  {
    id: 'previdencia',
    name: 'Previdência Privada',
    category: 'planning',
    type: 'Previdência',
    riskLevel: 'medium',
    minValue: 200,
    estimatedReturn: 10.5,
    description: 'Planejamento de longo prazo com benefícios fiscais',
    benefits: ['Benefício fiscal', 'Planejamento sucessório', 'Portabilidade'],
    compatibility: 0,
    conversionProbability: 0,
  },
  {
    id: 'credito-pessoal',
    name: 'Crédito Pessoal',
    category: 'credit',
    type: 'Crédito',
    riskLevel: 'medium',
    minValue: 5000,
    description: 'Crédito com taxas competitivas',
    benefits: ['Taxas reduzidas', 'Sem garantia', 'Aprovação rápida'],
    compatibility: 0,
    conversionProbability: 0,
  },
  {
    id: 'credito-estruturado',
    name: 'Crédito com Garantia',
    category: 'credit',
    type: 'Crédito Estruturado',
    riskLevel: 'low',
    minValue: 20000,
    description: 'Crédito com garantia de investimentos',
    benefits: ['Menores taxas', 'Prazo estendido', 'Flexibilidade'],
    compatibility: 0,
    conversionProbability: 0,
  },
  {
    id: 'cartao-premium',
    name: 'Cartão BTG+ Black',
    category: 'consumption',
    type: 'Cartão',
    riskLevel: 'low',
    minValue: 0,
    description: 'Cartão premium com benefícios exclusivos',
    benefits: ['Cashback', 'Sala VIP', 'Seguros inclusos'],
    compatibility: 0,
    conversionProbability: 0,
  },
  {
    id: 'seguro-vida',
    name: 'Seguro de Vida',
    category: 'protection',
    type: 'Proteção',
    riskLevel: 'low',
    minValue: 50,
    description: 'Proteção financeira para você e sua família',
    benefits: ['Cobertura ampla', 'Assistências inclusas', 'Valor acessível'],
    compatibility: 0,
    conversionProbability: 0,
  },
];
