import { QrCode, ArrowUpRight, Barcode, CreditCard, Receipt, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';

const actions = [
  { 
    name: 'Pix', 
    icon: QrCode, 
    color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    description: 'Transferir' 
  },
  { 
    name: 'TED/DOC', 
    icon: ArrowUpRight, 
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    description: 'Enviar' 
  },
  { 
    name: 'Pagar', 
    icon: Barcode, 
    color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
    description: 'Boletos' 
  },
  { 
    name: 'Cartões', 
    icon: CreditCard, 
    color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    description: 'Gerenciar' 
  },
  { 
    name: 'Extrato', 
    icon: Receipt, 
    color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
    description: 'Consultar' 
  },
  { 
    name: 'Recarga', 
    icon: Smartphone, 
    color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
    description: 'Celular' 
  },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
      {actions.map((action) => (
        <button
          key={action.name}
          className="btg-card-hover flex flex-col items-center justify-center py-4 px-2 gap-2 group"
        >
          <div className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110',
            action.color
          )}>
            <action.icon className="w-5 h-5" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">{action.name}</p>
            <p className="text-xs text-muted-foreground">{action.description}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
