import { useState, useMemo } from 'react';
import { Calculator, TrendingUp, Calendar, DollarSign, X } from 'lucide-react';
import { FinancialProduct } from '@/types/offers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ProductSimulatorProps {
  product: FinancialProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductSimulator({ product, isOpen, onClose }: ProductSimulatorProps) {
  const [investmentValue, setInvestmentValue] = useState(1000);
  const [termMonths, setTermMonths] = useState(12);

  const simulation = useMemo(() => {
    if (!product) return null;

    const annualRate = product.estimatedReturn || 12;
    const monthlyRate = annualRate / 100 / 12;
    
    const finalValue = investmentValue * Math.pow(1 + monthlyRate, termMonths);
    const totalReturn = finalValue - investmentValue;
    const percentageReturn = ((finalValue / investmentValue) - 1) * 100;
    const monthlyReturn = totalReturn / termMonths;

    if (product.category === 'credit') {
      const creditRate = 1.99;
      const monthlyPayment = investmentValue * (creditRate / 100 * Math.pow(1 + creditRate / 100, termMonths)) / 
                             (Math.pow(1 + creditRate / 100, termMonths) - 1);
      const totalPayment = monthlyPayment * termMonths;
      const totalInterest = totalPayment - investmentValue;

      return {
        type: 'credit',
        requestedValue: investmentValue,
        monthlyPayment,
        totalPayment,
        totalInterest,
        effectiveRate: creditRate * 12,
        termMonths,
      };
    }

    return {
      type: 'investment',
      initialValue: investmentValue,
      finalValue,
      totalReturn,
      percentageReturn,
      monthlyReturn,
      annualRate,
      termMonths,
    };
  }, [product, investmentValue, termMonths]);

  if (!product) return null;

  const isCredit = product.category === 'credit';
  const minValue = product.minValue || 100;
  const maxValue = isCredit ? 100000 : 50000;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            Simular {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="flex-1">
              <p className="font-medium">{product.name}</p>
              <p className="text-sm text-muted-foreground">{product.type}</p>
            </div>
            <Badge variant={product.riskLevel === 'low' ? 'secondary' : 'outline'}>
              Risco {product.riskLevel === 'low' ? 'Baixo' : product.riskLevel === 'medium' ? 'Médio' : 'Alto'}
            </Badge>
          </div>

          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              {isCredit ? 'Valor do crédito' : 'Valor do investimento'}
            </Label>
            <div className="flex gap-3">
              <Input
                type="number"
                value={investmentValue}
                onChange={(e) => setInvestmentValue(Math.max(minValue, Number(e.target.value)))}
                className="text-lg font-semibold"
                min={minValue}
                max={maxValue}
              />
            </div>
            <Slider
              value={[investmentValue]}
              onValueChange={([value]) => setInvestmentValue(value)}
              min={minValue}
              max={maxValue}
              step={100}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>R$ {minValue.toLocaleString('pt-BR')}</span>
              <span>R$ {maxValue.toLocaleString('pt-BR')}</span>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Prazo em meses
            </Label>
            <div className="flex gap-2">
              {[6, 12, 24, 36, 60].map((months) => (
                <Button
                  key={months}
                  variant={termMonths === months ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTermMonths(months)}
                  className="flex-1"
                >
                  {months}m
                </Button>
              ))}
            </div>
          </div>

          {simulation && (
            <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Resultado da Simulação
                </CardTitle>
              </CardHeader>
              <CardContent>
                {simulation.type === 'investment' ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Valor Inicial</p>
                        <p className="text-lg font-semibold">
                          R$ {simulation.initialValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Valor Final</p>
                        <p className="text-lg font-semibold text-success">
                          R$ {simulation.finalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="h-px bg-border" />
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-xs text-muted-foreground">Rendimento Total</p>
                        <p className="font-semibold text-success">
                          R$ {simulation.totalReturn.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Retorno %</p>
                        <p className="font-semibold text-success">
                          +{simulation.percentageReturn.toFixed(2)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Rend. Mensal</p>
                        <p className="font-semibold">
                          R$ {simulation.monthlyReturn.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <p className="text-sm text-muted-foreground">Taxa anual estimada</p>
                      <p className="text-xl font-bold text-primary">{simulation.annualRate}% a.a.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Valor Solicitado</p>
                        <p className="text-lg font-semibold">
                          R$ {simulation.requestedValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Parcela Mensal</p>
                        <p className="text-lg font-semibold text-primary">
                          R$ {simulation.monthlyPayment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="h-px bg-border" />
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-xs text-muted-foreground">Total a Pagar</p>
                        <p className="font-semibold">
                          R$ {simulation.totalPayment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Total de Juros</p>
                        <p className="font-semibold text-warning">
                          R$ {simulation.totalInterest.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <p className="text-sm text-muted-foreground">Taxa efetiva anual</p>
                      <p className="text-xl font-bold text-primary">{simulation.effectiveRate.toFixed(2)}% a.a.</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Button className="w-full hms-button-primary text-lg py-6">
            {isCredit ? 'SOLICITAR CRÉDITO' : 'INVESTIR AGORA'}
          </Button>
          
          <p className="text-xs text-center text-muted-foreground">
            Simulação para fins ilustrativos. Rentabilidade passada não garante rentabilidade futura.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
