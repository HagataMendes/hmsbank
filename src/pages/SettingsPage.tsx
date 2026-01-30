import { Settings, Mail, Bell, Zap } from 'lucide-react';
import { useFinancial } from '@/contexts/FinancialContext';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { settings, updateSettings } = useFinancial();

  return (
    <div className="space-y-8 pt-12 lg:pt-0">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg btg-gradient-primary flex items-center justify-center">
          <Settings className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground">Personalize sua experiência</p>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Email Notifications */}
        <div className="btg-card">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">Notificações por E-mail</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Receba análises e insights diretamente no seu e-mail
                  </p>
                </div>
                <button
                  onClick={() => updateSettings({ emailNotifications: !settings.emailNotifications })}
                  className={cn(
                    "w-12 h-6 rounded-full transition-colors relative",
                    settings.emailNotifications ? 'bg-primary' : 'bg-muted'
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform",
                      settings.emailNotifications ? 'translate-x-7' : 'translate-x-1'
                    )}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Frequency */}
        <div className="btg-card">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Frequência de Notificações</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Com que frequência você deseja receber atualizações
              </p>
              <div className="flex flex-wrap gap-2">
                {(['daily', 'weekly', 'monthly'] as const).map(freq => (
                  <button
                    key={freq}
                    onClick={() => updateSettings({ notificationFrequency: freq })}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      settings.notificationFrequency === freq
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-muted'
                    )}
                  >
                    {freq === 'daily' ? 'Diário' : freq === 'weekly' ? 'Semanal' : 'Mensal'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Automations */}
        <div className="btg-card">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">Automações</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Permite que análises sejam enviadas automaticamente para integrações externas
                  </p>
                </div>
                <button
                  onClick={() => updateSettings({ automationsEnabled: !settings.automationsEnabled })}
                  className={cn(
                    "w-12 h-6 rounded-full transition-colors relative",
                    settings.automationsEnabled ? 'bg-primary' : 'bg-muted'
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform",
                      settings.automationsEnabled ? 'translate-x-7' : 'translate-x-1'
                    )}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="btg-card border-primary/20 bg-primary/5">
          <h3 className="font-semibold text-foreground mb-2">Sobre suas preferências</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Suas configurações são salvas automaticamente. As notificações por e-mail e automações 
            podem ser desativadas a qualquer momento. Respeitamos sua privacidade e você tem 
            controle total sobre como seus dados são utilizados.
          </p>
        </div>
      </div>
    </div>
  );
}
