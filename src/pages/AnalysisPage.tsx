import { ExpenseInputForm } from '@/components/analysis/ExpenseInputForm';
import { LineChart } from 'lucide-react';

export default function AnalysisPage() {
  return (
    <div className="space-y-8 pt-12 lg:pt-0">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg btg-gradient-primary flex items-center justify-center">
            <LineChart className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Gerar Análise</h1>
        </div>
        <p className="text-muted-foreground">
          Insira seus dados financeiros dos últimos meses para gerar uma análise completa com IA
        </p>
      </div>

      {/* Form */}
      <ExpenseInputForm />
    </div>
  );
}
