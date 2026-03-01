import { Wifi, Copy, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface BankCardProps {
  type: 'credit' | 'debit';
  variant: 'platinum' | 'black' | 'gold';
  lastDigits: string;
  holderName: string;
  expiryDate: string;
  isHidden?: boolean;
}

export function BankCard({ 
  type, 
  variant, 
  lastDigits, 
  holderName, 
  expiryDate,
  isHidden = false 
}: BankCardProps) {
  const [showDetails, setShowDetails] = useState(!isHidden);

  const variantStyles = {
    platinum: 'bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800',
    black: 'bg-gradient-to-br from-zinc-900 via-zinc-800 to-black',
    gold: 'bg-gradient-to-br from-amber-600 via-yellow-500 to-amber-700',
  };

  const variantLabel = {
    platinum: 'PLATINUM',
    black: 'BLACK',
    gold: 'GOLD',
  };

  return (
    <div className={cn(
      'relative w-full max-w-[340px] aspect-[1.586/1] rounded-2xl p-5 text-white shadow-xl overflow-hidden',
      variantStyles[variant]
    )}>
      {/* Chip and contactless */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {/* Chip */}
          <div className="w-10 h-7 rounded bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center">
            <div className="w-6 h-4 border border-yellow-600/50 rounded-sm" />
          </div>
          <Wifi className="w-5 h-5 rotate-90 opacity-60" />
        </div>
        
        {/* Card type badge */}
        <div className="text-right">
          <p className="text-[10px] tracking-widest opacity-70">HMSBANK</p>
          <p className="text-xs font-bold tracking-wider">{variantLabel[variant]}</p>
        </div>
      </div>

      {/* Card number */}
      <div className="mt-6">
        <p className="text-lg tracking-[0.2em] font-mono">
          •••• •••• •••• {showDetails ? lastDigits : '••••'}
        </p>
      </div>

      {/* Card details */}
      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-[10px] opacity-60 tracking-wider">TITULAR</p>
          <p className="text-sm font-medium tracking-wide uppercase">
            {showDetails ? holderName : '•••••••••••'}
          </p>
        </div>
        
        <div className="text-right">
          <p className="text-[10px] opacity-60 tracking-wider">VALIDADE</p>
          <p className="text-sm font-medium tracking-wide">
            {showDetails ? expiryDate : '••/••'}
          </p>
        </div>
      </div>

      {/* Card type indicator */}
      <div className="absolute bottom-4 right-4">
        <p className="text-[10px] opacity-50 tracking-wider uppercase">{type}</p>
      </div>

      {/* Toggle visibility button */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      >
        {showDetails ? (
          <EyeOff className="w-4 h-4" />
        ) : (
          <Eye className="w-4 h-4" />
        )}
      </button>

      {/* Decorative circles */}
      <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-white/5" />
      <div className="absolute -bottom-16 -right-16 w-32 h-32 rounded-full bg-white/5" />
    </div>
  );
}
