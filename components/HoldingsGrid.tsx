
import React, { useState, useEffect, useMemo } from 'react';
import { TokenHolding } from '../types';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  ShieldCheck, 
  ShieldAlert, 
  MoreHorizontal, 
  Layers,
  Activity,
  ArrowUpRight,
  BarChart3,
  Globe,
  Zap
} from 'lucide-react';
import { fetchLivePrices, LivePriceData } from '../services/priceService';

interface HoldingsGridProps {
  holdings: TokenHolding[];
}

const TokenIcon: React.FC<{ symbol: string; size?: string }> = ({ symbol, size = "w-10 h-10" }) => {
  const [error, setError] = useState(false);
  const iconUrl = `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${symbol.toLowerCase()}.png`;

  if (error) {
    return (
      <div className={`${size} rounded-xl bg-slate-800 flex items-center justify-center border border-white/10 shadow-inner`}>
        <span className="text-[10px] font-black text-slate-500 tracking-tighter uppercase">{symbol.slice(0, 2)}</span>
      </div>
    );
  }
  return (
    <div className="relative">
      <img src={iconUrl} onError={() => setError(true)} className={`${size} rounded-xl object-contain p-1.5 bg-slate-900 border border-white/10 shadow-lg shadow-black/40`} />
      <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/5 pointer-events-none" />
    </div>
  );
};

const HoldingsGrid: React.FC<HoldingsGridProps> = ({ holdings }) => {
  const [livePrices, setLivePrices] = useState<Record<string, LivePriceData>>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Sync live prices on mount and every 30 seconds
  useEffect(() => {
    const updatePrices = async () => {
      setIsUpdating(true);
      const prices = await fetchLivePrices(holdings.map(h => ({ symbol: h.symbol, name: h.name })));
      setLivePrices(prev => ({ ...prev, ...prices }));
      setTimeout(() => setIsUpdating(false), 2000);
    };

    updatePrices();
    const interval = setInterval(updatePrices, 30000);
    return () => clearInterval(interval);
  }, [holdings]);

  // Derived data with live calculations
  const augmentedHoldings = useMemo(() => {
    return holdings.map(h => {
      const live = livePrices[h.symbol.toUpperCase()];
      if (!live) return h;

      // Calculate new USD value based on live price and original balance
      // Note: We need the numeric balance. Extracting it from string if necessary.
      const numericBalance = parseFloat(h.balance.replace(/[^0-9.]/g, '')) || 0;
      
      return {
        ...h,
        usdValue: live.price * numericBalance,
        change24h: live.change24h
      };
    });
  }, [holdings, livePrices]);

  const totalValue = augmentedHoldings.reduce((acc, h) => acc + h.usdValue, 0);

  return (
    <div className="space-y-8">
      {/* Tactical Portfolio HUD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-cyan-500/5 border border-cyan-500/20 flex flex-col justify-between shadow-2xl backdrop-blur-sm group hover:bg-cyan-500/10 transition-colors relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
             <Activity size={40} className={`text-cyan-500/10 transition-all ${isUpdating ? 'animate-pulse' : ''}`} />
          </div>
          <div className="text-[11px] font-black text-cyan-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
            <DollarSign size={14} /> Total Net Reach
          </div>
          <div className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
            ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            {isUpdating && <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />}
          </div>
        </div>
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col justify-between shadow-2xl backdrop-blur-sm group hover:bg-white/10 transition-colors">
          <div className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
            <PieChart size={14} /> Target Assets
          </div>
          <div className="text-3xl font-black text-white tracking-tighter">
            {holdings.length} Signals
          </div>
        </div>
        <div className="p-6 rounded-3xl bg-green-500/5 border border-green-500/20 flex flex-col justify-between shadow-2xl backdrop-blur-sm group hover:bg-green-500/10 transition-colors">
          <div className="text-[11px] font-black text-green-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
            <Layers size={14} /> Dominant Position
          </div>
          <div className="text-2xl font-black text-white truncate max-w-[200px]">
            {augmentedHoldings[0]?.name || 'RECON PENDING'}
          </div>
        </div>
      </div>

      {/* Modern Data Matrix */}
      <div className="overflow-hidden rounded-3xl border border-white/5 bg-slate-950/40 backdrop-blur-xl shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="p-6 text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Engagement Asset</th>
                <th className="p-6 text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Volume Matrix</th>
                <th className="p-6 text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] text-right">Valuation (Live)</th>
                <th className="p-6 text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] text-right">Integrity Index</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {augmentedHoldings.map((token, idx) => {
                const isExpanded = expandedRow === token.symbol;
                const liveData = livePrices[token.symbol.toUpperCase()];

                return (
                  <React.Fragment key={idx}>
                    <tr 
                      onClick={() => setExpandedRow(isExpanded ? null : token.symbol)}
                      className={`group hover:bg-white/5 transition-all cursor-pointer ${isExpanded ? 'bg-white/[0.03]' : ''}`}
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <TokenIcon symbol={token.symbol} />
                          <div>
                            <div className="text-sm font-black text-slate-100 tracking-tight flex items-center gap-2">
                              {token.name}
                              {liveData && <div className="w-1 h-1 rounded-full bg-cyan-500 animate-pulse" title="Live Price" />}
                            </div>
                            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{token.symbol} • {token.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="text-xs font-mono font-bold text-slate-300">{token.balance}</div>
                        <div className={`text-[10px] font-black flex items-center gap-1.5 mt-1.5 transition-colors duration-500 ${token.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {token.change24h >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                          {token.change24h.toFixed(2)}%
                        </div>
                      </td>
                      <td className="p-6 text-right">
                        <div className="text-base font-black text-white transition-all duration-1000">
                          ${token.usdValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-[9px] text-slate-600 uppercase font-black tracking-widest mt-1 flex items-center justify-end gap-1.5">
                          {liveData ? (
                            <>
                              <Zap size={10} className="text-cyan-500" />
                              Oracle: ${liveData.price.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                            </>
                          ) : (
                            'Grounded Estimate'
                          )}
                        </div>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex flex-col items-end gap-2">
                          <div className="w-24 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5 shadow-inner">
                            <div 
                              className={`h-full rounded-full transition-all duration-1000 ${
                                token.riskScore > 70 ? 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]' : 
                                token.riskScore > 40 ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]' : 
                                'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'
                              }`}
                              style={{ width: `${token.riskScore}%` }}
                            />
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${
                              token.riskScore > 70 ? 'text-cyan-500' : 
                              token.riskScore > 40 ? 'text-yellow-500' : 
                              'text-red-500'
                            }`}>
                              SIG: {token.riskScore}
                            </span>
                            {token.riskScore > 70 ? <ShieldCheck size={14} className="text-cyan-500" /> : <ShieldAlert size={14} className="text-red-500" />}
                          </div>
                        </div>
                      </td>
                    </tr>
                    
                    {isExpanded && (
                      <tr className="animate-in slide-in-from-top-2 duration-300">
                        <td colSpan={4} className="p-0 border-b border-white/5 bg-slate-900/20">
                           <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                              <div className="space-y-4">
                                 <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                                    <BarChart3 size={14} /> Market Depth Summary
                                 </div>
                                 <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                                    <div className="flex justify-between items-center text-[10px]">
                                       <span className="text-slate-500 font-bold uppercase">24h Volume</span>
                                       <span className="text-white font-mono">---</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px]">
                                       <span className="text-slate-500 font-bold uppercase">Volatility</span>
                                       <span className={`font-mono ${Math.abs(token.change24h) > 10 ? 'text-orange-400' : 'text-cyan-400'}`}>
                                          {Math.abs(token.change24h) > 10 ? 'High' : 'Nominal'}
                                       </span>
                                    </div>
                                 </div>
                              </div>
                              <div className="space-y-4">
                                 <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                                    <Globe size={14} /> Asset Intelligence
                                 </div>
                                 <p className="text-[11px] text-slate-400 italic leading-relaxed">
                                    Asset classification: {token.category}. Intelligence suggests {token.riskScore > 70 ? 'high institutional confidence' : 'speculative risk exposure'} in the current block range.
                                 </p>
                              </div>
                              <div className="flex items-center justify-end">
                                 <button className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2">
                                    <ArrowUpRight size={14} /> Full Market Recon
                                 </button>
                              </div>
                           </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-6">
        <div className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/5 rounded-2xl">
           <div className={`w-2 h-2 rounded-full ${isUpdating ? 'bg-cyan-500 shadow-[0_0_8px_#06b6d4]' : 'bg-slate-700'}`} />
           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              {isUpdating ? 'Oracle Synchronizing...' : 'Oracle Standby - 30s Refresh'}
           </span>
        </div>
        <button className="px-8 py-3 bg-white/5 border border-white/10 hover:border-cyan-500/30 text-slate-500 hover:text-cyan-400 text-[10px] font-black uppercase tracking-[0.5em] rounded-2xl transition-all flex items-center gap-3 group">
          <MoreHorizontal size={16} className="group-hover:rotate-90 transition-transform" /> Sync Extended Inventory
        </button>
      </div>
    </div>
  );
};

export default HoldingsGrid;
