import { useState } from 'react';
import { 
  TrendingUp, 
  Shield, 
  CreditCard, 
  Target,
  Wallet,
  ArrowRight,
  Star,
  Zap,
  CheckCircle,
  BarChart3,
  Sparkles,
  Calculator
} from 'lucide-react';
import { useCommercialScoring } from '@/hooks/useCommercialScoring';
import { FinancialProduct } from '@/types/offers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { ProductSimulator } from '@/components/offers/ProductSimulator';
import { Link } from 'react-router-dom';

export default function SmartOffersPage() {
  const { 
    commercialScores, 
    rankedProducts, 
    priorityOffer, 
    crossSellProducts,
    hasData 
  } = useCommercialScoring();

  const [selectedProduct, setSelectedProduct] = useState<FinancialProduct | null>(null);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  const openSimulator = (product: FinancialProduct) => {
    setSelectedProduct(product);
    setIsSimulatorOpen(true);
  };

  const closeSimulator = () => {
    setIsSimulatorOpen(false);
    setSelectedProduct(null);
  };

  if (!hasData) {
    return (
      <div className="space-y-8 pt-12 lg:pt-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Ofertas Inteligentes</h1>
          <p className="text-muted-foreground mt-1">Produtos personalizados para seu perfil</p>
        </div>
        
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Nenhuma análise disponível</h3>
            <p className="text-muted-foreground text-center max-w-md mb-4">
              Para gerar ofertas personalizadas, primeiro insira seus dados financeiros e gere uma análise.
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

  const scoreCards = [
    { label: 'Investimento', value: commercialScores.investment, icon: TrendingUp, color: 'text-success' },
    { label: 'Crédito', value: commercialScores.credit, icon: CreditCard, color: 'text-info' },
    { label: 'Planejamento', value: commercialScores.planning, icon: Target, color: 'text-primary' },
    { label: 'Proteção', value: commercialScores.protection, icon: Shield, color: 'text-warning' },
    { label: 'Consumo', value: commercialScores.consumption, icon: Wallet, color: 'text-secondary-foreground' },
  ];

  return (
    <div className="space-y-8 pt-12 lg:pt-0">
      <ProductSimulator 
        product={selectedProduct} 
        isOpen={isSimulatorOpen} 
        onClose={closeSimulator} 
      />

      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Ofertas Inteligentes</h1>
        <p className="text-muted-foreground mt-1">Produtos personalizados com base no seu perfil comportamental</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Scores de Propensão
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {scoreCards.map((score) => (
            <Card key={score.label} className="text-center">
              <CardContent className="pt-6">
                <score.icon className={`w-8 h-8 mx-auto mb-2 ${score.color}`} />
                <div className="text-2xl font-bold">{score.value}%</div>
                <div className="text-sm text-muted-foreground">{score.label}</div>
                <Progress value={score.value} className="mt-2 h-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {priorityOffer && (
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-warning fill-warning" />
                Oferta Prioritária
              </CardTitle>
              <Badge className="bg-success text-success-foreground">
                {priorityOffer.product.conversionProbability}% compatibilidade
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold mb-2">{priorityOffer.product.name}</h3>
                <p className="text-muted-foreground mb-4">{priorityOffer.product.description}</p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Seu Perfil</span>
                    <span className="font-medium">{priorityOffer.userProfile}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Valor Sugerido</span>
                    <span className="font-medium">R$ {priorityOffer.suggestedValue.toLocaleString('pt-BR')}</span>
                  </div>
                  {priorityOffer.estimatedReturn && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Retorno Estimado</span>
                      <span className="font-medium text-success">R$ {priorityOffer.estimatedReturn.toLocaleString('pt-BR')}/ano</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Nível de Risco</span>
                    <Badge variant={priorityOffer.product.riskLevel === 'low' ? 'secondary' : 'outline'}>
                      {priorityOffer.product.riskLevel === 'low' ? 'Baixo' : 
                       priorityOffer.product.riskLevel === 'medium' ? 'Médio' : 'Alto'}
                    </Badge>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-3 mb-4">
                  <p className="text-sm font-medium mb-2">Motivo da recomendação:</p>
                  <p className="text-sm text-muted-foreground">{priorityOffer.reason}</p>
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <p className="text-sm font-medium mb-2">Gatilhos de Conversão:</p>
                  <ul className="space-y-2">
                    {priorityOffer.conversionTriggers.map((trigger, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-success" />
                        {trigger}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-4 space-y-2">
                  <Button 
                    className="w-full hms-button-primary text-lg py-6"
                    onClick={() => openSimulator(priorityOffer.product)}
                  >
                    <Calculator className="w-5 h-5 mr-2" />
                    SIMULAR AGORA
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Simulação interativa sem compromisso
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="text-lg font-semibold mb-4">Ranking de Produtos</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rankedProducts.slice(0, 6).map((product, index) => (
            <Card key={product.id} className="hover:border-primary/30 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <Badge variant="outline" className="mb-2">#{index + 1}</Badge>
                    <h4 className="font-semibold">{product.name}</h4>
                    <p className="text-sm text-muted-foreground">{product.type}</p>
                  </div>
                  <ScoreRing score={product.compatibility} size="sm" />
                </div>
                
                <div className="space-y-2 text-sm mb-4">
                  {product.estimatedReturn && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Retorno</span>
                      <span className="text-success font-medium">{product.estimatedReturn}% a.a.</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valor mínimo</span>
                    <span>R$ {product.minValue.toLocaleString('pt-BR')}</span>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => openSimulator(product)}
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Simular
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {crossSellProducts.length > 0 && (
        <div className="bg-muted/30 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Produtos Complementares</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {crossSellProducts.map((product) => (
              <Card key={product.id}>
                <CardContent className="pt-4">
                  <h4 className="font-medium mb-1">{product.name}</h4>
                  <p className="text-xs text-muted-foreground mb-3">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{product.compatibility}% match</Badge>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => openSimulator(product)}
                    >
                      Simular
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
