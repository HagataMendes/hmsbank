import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb,
  ArrowRight,
  Sparkles,
  CreditCard
} from 'lucide-react';
import { useFinancial } from '@/contexts/FinancialContext';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { InsightCard } from '@/components/ui/InsightCard';
import { EvolutionCard } from '@/components/ui/EvolutionCard';
import { AccountHeader } from '@/components/dashboard/AccountHeader';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { BankCard } from '@/components/dashboard/BankCard';

export default function Dashboard() {
  const { analysis, insights, alerts } = useFinancial();

  const activeAlerts = alerts.filter(a => a.status === 'active');
  const latestInsight = insights[0];

  // Simulated balance for demo
  const accountBalance = 45892.47;

  return (
    <div className="space-y-6 pt-12 lg:pt-0">
      {/* Account Header with Balance and Security */}
      <AccountHeader 
        balance={accountBalance}
        accountNumber="290501"
        agency="0029"
        userName="Hágata Mendes"
      />

      {/* Quick Actions - Banking Operations */}
      <div>
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          Operações Rápidas
        </h3>
        <QuickActions />
      </div>

      {/* Cards Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Meus Cartões
          </h3>
          <button className="text-sm text-primary hover:text-primary/80 flex items-center gap-1">
            Gerenciar <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BankCard 
            type="credit"
            variant="black"
            lastDigits="4589"
            holderName="Hágata Mendes"
            expiryDate="12/28"
          />
          <BankCard 
            type="debit"
            variant="platinum"
            lastDigits="7823"
            holderName="Hágata Mendes"
            expiryDate="08/27"
          />
        </div>
      </div>

      {/* Score e Insight Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score de Organização */}
        <div className="btg-card flex flex-col items-center justify-center text-center">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            Índice de Organização Financeira
          </h3>
          <ScoreRing score={analysis?.organizationScore || 0} size="lg" />
          <p className="text-sm text-muted-foreground mt-4 max-w-[200px]">
            {analysis?.organizationScore 
              ? analysis.organizationScore >= 70 
                ? 'Excelente organização financeira!'
                : analysis.organizationScore >= 50 
                  ? 'Boa organização, com espaço para melhorias'
                  : 'Oportunidades de organização identificadas'
              : 'Gere uma análise para ver seu índice'}
          </p>
        </div>

        {/* Insight Principal */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              Insight Principal
            </h3>
            <Link 
              to="/insights"
              className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
            >
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {latestInsight ? (
            <InsightCard insight={latestInsight} />
          ) : (
            <div className="btg-card flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Lightbulb className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">
                Nenhum insight disponível ainda
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Gere uma análise para receber insights personalizados
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Evolução Financeira */}
      {analysis?.evolution && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Evolução Financeira
            </h3>
          </div>
          <EvolutionCard evolution={analysis.evolution} />
        </div>
      )}

      {/* Banner Informativo Investimentos */}
      <div className="btg-card border-primary/20 bg-primary/5">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-xl btg-gradient-primary flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">
              Educação Financeira
            </h3>
            <p className="text-sm text-muted-foreground">
              Organize suas finanças e entenda melhor seus padrões de consumo. 
              Este é o primeiro passo para uma vida financeira mais equilibrada.
            </p>
          </div>
          <Link 
            to="/insights"
            className="btg-button-secondary whitespace-nowrap"
          >
            Ver Insights
          </Link>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/analysis" className="btg-card-hover group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Gerar Análise</h4>
              <p className="text-sm text-muted-foreground">Inserir novos dados</p>
            </div>
          </div>
        </Link>

        <Link to="/alerts" className="btg-card-hover group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center group-hover:bg-warning/20 transition-colors">
              <AlertTriangle className="w-6 h-6 text-warning" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Alertas</h4>
              <p className="text-sm text-muted-foreground">{activeAlerts.length} ativos</p>
            </div>
          </div>
        </Link>

        <Link to="/chat" className="btg-card-hover group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center group-hover:bg-info/20 transition-colors">
              <Lightbulb className="w-6 h-6 text-info" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Assistente IA</h4>
              <p className="text-sm text-muted-foreground">Tire suas dúvidas</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
