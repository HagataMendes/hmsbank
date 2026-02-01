import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  LineChart, 
  Lightbulb, 
  Bell, 
  Settings, 
  MessageCircle,
  Menu,
  X,
  Moon,
  Sun,
  TrendingUp,
  Sparkles,
  Users,
  ExternalLink
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Gerar Análise', href: '/analysis', icon: LineChart },
  { name: 'Análise Financeira', href: '/financial-dashboard', icon: TrendingUp },
  { name: 'Insights', href: '/insights', icon: Lightbulb },
  { name: 'Alertas', href: '/alerts', icon: Bell },
  { name: 'Ofertas Inteligentes', href: '/smart-offers', icon: Sparkles },
  { name: 'Família', href: '/family', icon: Users },
  { name: 'Configurações', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-primary text-primary-foreground btg-shadow-md"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 h-full w-64 bg-sidebar z-50 transition-transform duration-300 flex flex-col",
        "lg:translate-x-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg btg-gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-sidebar-foreground">BTG PACTUAL</h1>
                <p className="text-xs text-sidebar-foreground/60">AG ***29 Conta 290501</p>
              </div>
            </div>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden text-sidebar-foreground/60 hover:text-sidebar-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                    isActive 
                      ? "bg-sidebar-accent text-sidebar-primary font-medium" 
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom actions */}
          <div className="p-4 border-t border-sidebar-border space-y-2">
            <Link
              to="/chat"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-all duration-200"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Assistente IA</span>
            </Link>
            
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-all duration-200"
            >
              {theme === 'light' ? (
                <>
                  <Moon className="w-5 h-5" />
                  <span>Modo Escuro</span>
                </>
              ) : (
                <>
                  <Sun className="w-5 h-5" />
                  <span>Modo Claro</span>
                </>
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border space-y-3">
            <a 
              href="https://www.btgpactual.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-xs text-sidebar-primary hover:underline"
            >
              Conheça mais sobre o BTG PACTUAL
              <ExternalLink className="w-3 h-3" />
            </a>
            <div className="text-center">
              <p className="text-xs text-sidebar-foreground/50">
                Desenvolvido por{' '}
                <a 
                  href="https://www.linkedin.com/in/hagatamendes/?locale=en_US"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sidebar-primary hover:underline inline-flex items-center gap-1"
                >
                  Hágata Mendes
                  <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
