import { 
  Users, 
  Home, 
  GraduationCap, 
  Heart,
  Target,
  PiggyBank,
  TrendingUp,
  Shield,
  Plus,
  ArrowRight,
  Sparkles,
  CheckCircle
} from 'lucide-react';
import { useFamilyIntelligence } from '@/hooks/useFamilyIntelligence';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { Link } from 'react-router-dom';

const goalIcons = {
  education: GraduationCap,
  housing: Home,
  retirement: PiggyBank,
  patrimony: TrendingUp,
  protection: Shield,
  travel: Target,
};

const relationshipLabels = {
  spouse: 'Cônjuge',
  child: 'Filho(a)',
  dependent: 'Dependente',
};

export default function FamilyPage() {
  const { 
    familyMembers,
    familyIntelligence,
    familyDashboard,
    familyGoals,
    familyOffers,
    priorityFamilyOffer,
    hasData 
  } = useFamilyIntelligence();

  const stabilityColors = {
    high: 'text-success',
    medium: 'text-warning',
    low: 'text-destructive',
  };

  const stabilityLabels = {
    high: 'Alta',
    medium: 'Média',
    low: 'Baixa',
  };

  if (!hasData) {
    return (
      <div className="space-y-8 pt-12 lg:pt-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Família</h1>
          <p className="text-muted-foreground mt-1">Gestão financeira familiar integrada</p>
        </div>
        
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Configure seu núcleo familiar</h3>
            <p className="text-muted-foreground text-center max-w-md mb-4">
              Para usar o módulo Família, primeiro gere uma análise financeira individual.
            </p>
            <Link to="/analysis">
              <Button className="hms-button-primary">
                Gerar Análise <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 pt-12 lg:pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Família</h1>
          <p className="text-muted-foreground mt-1">Gestão e planejamento financeiro familiar</p>
        </div>
        <Button variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Membro
        </Button>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Núcleo Familiar
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-primary/30">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full hms-gradient-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">HM</span>
                </div>
                <div>
                  <p className="font-semibold">Hágata Mendes</p>
                  <Badge variant="secondary">Titular</Badge>
                </div>
              </div>
              <div className="text-sm space-y-1">
                <p className="text-muted-foreground">Renda: <span className="text-foreground">R$ 12.000</span></p>
                <p className="text-muted-foreground">Perfil vinculado</p>
              </div>
            </CardContent>
          </Card>

          {familyMembers.map((member) => (
            <Card key={member.id}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground font-bold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">{member.name}</p>
                    <Badge variant="outline">{relationshipLabels[member.relationship]}</Badge>
                  </div>
                </div>
                <div className="text-sm space-y-1">
                  {member.monthlyIncome && (
                    <p className="text-muted-foreground">
                      Renda: <span className="text-foreground">R$ {member.monthlyIncome.toLocaleString('pt-BR')}</span>
                    </p>
                  )}
                  {member.monthlyExpenses && (
                    <p className="text-muted-foreground">
                      Gastos: <span className="text-foreground">R$ {member.monthlyExpenses.toLocaleString('pt-BR')}</span>
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Score Familiar</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ScoreRing score={familyIntelligence.familyScore} size="lg" />
            <div className="mt-4 grid grid-cols-2 gap-4 w-full text-sm">
              <div>
                <p className="text-muted-foreground">Estabilidade</p>
                <p className={`font-medium ${stabilityColors[familyIntelligence.stability]}`}>
                  {stabilityLabels[familyIntelligence.stability]}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Previsibilidade</p>
                <p className={`font-medium ${stabilityColors[familyIntelligence.predictability]}`}>
                  {stabilityLabels[familyIntelligence.predictability]}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Consolidado Familiar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Renda Total</p>
                <p className="text-xl font-bold text-success">
                  R$ {familyDashboard.totalIncome.toLocaleString('pt-BR')}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gastos Totais</p>
                <p className="text-xl font-bold">
                  R$ {familyDashboard.totalExpenses.toLocaleString('pt-BR')}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Taxa de Poupança</p>
                <p className="text-xl font-bold text-primary">
                  {familyDashboard.savingsRate}%
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Investimentos</p>
                <p className="text-xl font-bold">
                  R$ {familyDashboard.totalInvestments.toLocaleString('pt-BR')}/mês
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reserva</p>
                <p className="text-xl font-bold">
                  R$ {familyDashboard.totalReserves.toLocaleString('pt-BR')}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Patrimônio</p>
                <p className="text-xl font-bold text-primary">
                  R$ {familyDashboard.patrimony.toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Metas Familiares
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {familyGoals.map((goal) => {
            const Icon = goalIcons[goal.category];
            return (
              <Card key={goal.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{goal.title}</h4>
                        <p className="text-sm text-muted-foreground">Meta: {goal.deadline}</p>
                      </div>
                    </div>
                    <Badge variant={goal.priority === 'high' ? 'default' : 'outline'}>
                      {goal.priority === 'high' ? 'Alta' : goal.priority === 'medium' ? 'Média' : 'Baixa'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>R$ {goal.currentValue.toLocaleString('pt-BR')}</span>
                      <span className="text-muted-foreground">R$ {goal.targetValue.toLocaleString('pt-BR')}</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground text-right">{goal.progress}% completo</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {priorityFamilyOffer && (
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-destructive" />
                Oferta Prioritária para sua Família
              </CardTitle>
              <Badge className="bg-success text-success-foreground">
                {priorityFamilyOffer.compatibility}% compatibilidade
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold mb-2">{priorityFamilyOffer.productName}</h3>
                <p className="text-muted-foreground mb-4">{priorityFamilyOffer.objective}</p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Perfil Familiar</span>
                    <span className="font-medium">{priorityFamilyOffer.familyProfile}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Valor Sugerido</span>
                    <span className="font-medium">R$ {priorityFamilyOffer.suggestedValue.toLocaleString('pt-BR')}/mês</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Horizonte</span>
                    <span className="font-medium">{priorityFamilyOffer.timeHorizon}</span>
                  </div>
                  {priorityFamilyOffer.estimatedReturn && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Retorno Estimado</span>
                      <span className="font-medium text-success">{priorityFamilyOffer.estimatedReturn}% a.a.</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <p className="text-sm font-medium mb-2">Benefícios:</p>
                  <ul className="space-y-2">
                    {priorityFamilyOffer.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-success" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-4 space-y-2">
                  <Button className="w-full hms-button-primary text-lg py-6">
                    <Sparkles className="w-5 h-5 mr-2" />
                    INVESTIR PARA A FAMÍLIA
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Proteção e crescimento para todos
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="text-lg font-semibold mb-4">Outras Ofertas para sua Família</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {familyOffers.slice(1).map((offer) => (
            <Card key={offer.id} className="hover:border-primary/30 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{offer.productName}</h4>
                    <p className="text-sm text-muted-foreground">{offer.productType}</p>
                  </div>
                  <Badge variant="outline">{offer.compatibility}%</Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">{offer.objective}</p>
                
                <Button variant="outline" className="w-full">
                  Conhecer <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
