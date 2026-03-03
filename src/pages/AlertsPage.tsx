import { Link } from 'react-router-dom';
import { Bell, Sparkles, CheckCircle } from 'lucide-react';
import { useFinancial } from '@/contexts/FinancialContext';
import { AlertCard } from '@/components/ui/AlertCard';
import { useState } from 'react';

export default function AlertsPage() {
  const { alerts, resolveAlert } = useFinancial();
  const [showResolved, setShowResolved] = useState(false);

  const activeAlerts = alerts.filter(a => a.status === 'active');
  const resolvedAlerts = alerts.filter(a => a.status === 'resolved');

  return (
    <div className="space-y-8 pt-12 lg:pt-0">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg hms-gradient-primary flex items-center justify-center">
            <Bell className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Alertas</h1>
            <p className="text-muted-foreground">
              {activeAlerts.length} alerta(s) ativo(s)
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Alertas Ativos</h2>
        {activeAlerts.length > 0 ? (
          <div className="space-y-4">
            {activeAlerts.map((alert, index) => (
              <div key={alert.id} style={{ animationDelay: `${index * 100}ms` }}>
                <AlertCard alert={alert} onResolve={resolveAlert} />
              </div>
            ))}
          </div>
        ) : (
          <div className="hms-card flex flex-col items-center justify-center text-center py-12">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Tudo em ordem!</h3>
            <p className="text-sm text-muted-foreground">
              Não há alertas ativos no momento
            </p>
          </div>
        )}
      </div>

      {resolvedAlerts.length > 0 && (
        <div>
          <button
            onClick={() => setShowResolved(!showResolved)}
            className="flex items-center gap-2 text-lg font-semibold text-foreground mb-4"
          >
            <span>Histórico de Alertas</span>
            <span className="text-sm font-normal text-muted-foreground">
              ({resolvedAlerts.length})
            </span>
          </button>
          
          {showResolved && (
            <div className="space-y-4">
              {resolvedAlerts.map((alert, index) => (
                <div key={alert.id} style={{ animationDelay: `${index * 100}ms` }}>
                  <AlertCard alert={alert} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {alerts.length === 0 && (
        <div className="hms-card flex flex-col items-center justify-center text-center py-16">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
            <Bell className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Nenhum alerta registrado
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Gere uma análise financeira para que o sistema possa identificar possíveis alertas
          </p>
          <Link to="/analysis" className="hms-button-primary flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Gerar Análise
          </Link>
        </div>
      )}
    </div>
  );
}
