import { Eye, EyeOff, Shield, ShieldCheck, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AccountHeaderProps {
  balance: number;
  accountNumber: string;
  agency: string;
  userName: string;
}

export function AccountHeader({ balance, accountNumber, agency, userName }: AccountHeaderProps) {
  const [showBalance, setShowBalance] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`AG ${agency} | CC ${accountNumber}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="btg-card">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left side - Welcome and balance */}
        <div className="space-y-3">
          <div>
            <p className="text-muted-foreground text-sm">Bem-vindo(a) de volta a sua conta BTG PACTUAL</p>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Olá, {userName}</h1>
          </div>
          
          {/* Balance */}
          <div className="flex items-center gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Saldo disponível</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {showBalance ? `R$ ${balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'R$ ••••••'}
                </span>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                >
                  {showBalance ? (
                    <EyeOff className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Eye className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Account info and security */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Account info */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border border-border">
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Agência</p>
              <p className="text-sm font-mono font-medium text-foreground">{agency}</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Conta</p>
              <p className="text-sm font-mono font-medium text-foreground">{accountNumber}</p>
            </div>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors ml-1"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Copy className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          </div>

          {/* Security indicator */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <div>
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Conexão Segura</p>
              <p className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70">SSL 256-bit</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
