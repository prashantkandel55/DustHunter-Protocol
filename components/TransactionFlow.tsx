
import React from 'react';
import { ArrowRight, Box, MoveRight, ExternalLink } from 'lucide-react';

interface TransactionFlowProps {
  from: string;
  to: string;
  amount: string;
  token: string;
  txHash: string;
  isIncoming: boolean;
}

const TransactionFlow: React.FC<TransactionFlowProps> = ({ from, to, amount, token, txHash, isIncoming }) => {
  const shorten = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="relative p-4 rounded-xl bg-black/40 border border-white/5 overflow-hidden group">
      {/* Animated Flow Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className={`absolute inset-0 bg-gradient-to-r ${isIncoming ? 'from-green-500/20 to-transparent' : 'from-transparent to-red-500/20'} animate-pulse`} />
      </div>

      <div className="flex flex-col gap-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Box size={14} className="text-slate-500" />
            <span className="text-[10px] font-mono text-slate-500 truncate max-w-[120px]">{txHash}</span>
          </div>
          <button className="p-1 hover:text-cyan-400 text-slate-600 transition-colors">
            <ExternalLink size={12} />
          </button>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 flex flex-col gap-1">
            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Source</div>
            <div className={`text-xs font-mono font-bold p-2 rounded bg-white/5 border border-white/5 ${isIncoming ? 'text-slate-300' : 'text-cyan-400 border-cyan-500/20'}`}>
              {shorten(from)}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center px-2">
            <div className={`text-[10px] font-black mb-1 ${isIncoming ? 'text-green-400' : 'text-red-400'}`}>
              {isIncoming ? '+' : '-'}{amount} {token}
            </div>
            <div className="relative w-12 h-px bg-slate-800">
               <div className={`absolute top-1/2 -translate-y-1/2 ${isIncoming ? 'right-0' : 'left-0'} animate-[bounce_1s_infinite]`}>
                  <MoveRight size={14} className={isIncoming ? 'text-green-500' : 'text-red-500'} />
               </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-1 text-right">
            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Destination</div>
            <div className={`text-xs font-mono font-bold p-2 rounded bg-white/5 border border-white/5 ${isIncoming ? 'text-cyan-400 border-cyan-500/20' : 'text-slate-300'}`}>
              {shorten(to)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionFlow;
