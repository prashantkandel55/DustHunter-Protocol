
import React, { useState, useMemo } from 'react';
import { 
  ShieldX, 
  AlertCircle, 
  AlertTriangle, 
  Calendar, 
  Hash, 
  CheckCircle2, 
  ShieldAlert, 
  Filter, 
  ShieldCheck, 
  ExternalLink, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Info,
  Lock,
  Unlock
} from 'lucide-react';
import { TokenApproval, ThreatLevel } from '../types';

interface ApprovalsListProps {
  approvals: TokenApproval[];
}

const TokenIcon: React.FC<{ symbol: string; name: string }> = ({ symbol, name }) => {
  const [error, setError] = useState(false);
  const iconUrl = `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${symbol.toLowerCase()}.png`;

  if (error || !symbol) {
    return (
      <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-white/10 shrink-0 shadow-inner">
        <span className="text-[10px] font-black text-slate-500 tracking-tighter">
          {symbol?.slice(0, 2).toUpperCase() || '??'}
        </span>
      </div>
    );
  }

  return (
    <div className="relative shrink-0">
      <img
        src={iconUrl}
        alt={name}
        className="w-10 h-10 rounded-xl border border-white/10 bg-slate-950 object-contain p-1.5 shadow-lg shadow-black/40"
        onError={() => setError(true)}
      />
      <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/5 pointer-events-none" />
    </div>
  );
};

const ApprovalsList: React.FC<ApprovalsListProps> = ({ approvals }) => {
  const [filter, setFilter] = useState<string>('ALL');
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const filteredApprovals = useMemo(() => {
    if (filter === 'ALL') return approvals;
    return approvals.filter(app => app.riskLevel === filter);
  }, [approvals, filter]);

  const getCardStyles = (level: ThreatLevel, isExpanded: boolean) => {
    const base = "glass-card rounded-2xl p-5 transition-all duration-300 relative overflow-hidden cursor-pointer group";
    const expandedBase = isExpanded ? "border-cyan-500/30 ring-1 ring-cyan-500/10" : "hover:border-white/20";
    
    let borderStyles = "border-white/5";
    if (level === ThreatLevel.CRITICAL) borderStyles = isExpanded ? "border-red-500/50" : "border-red-500/20";
    if (level === ThreatLevel.HIGH) borderStyles = isExpanded ? "border-orange-500/50" : "border-orange-500/20";

    return `${base} ${expandedBase} ${borderStyles}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <ShieldCheck size={16} className="text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white">Permission Scrutiny</h3>
            <p className="text-[10px] text-slate-500 font-mono">{filteredApprovals.length} ACTIVE ALLOWANCES</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/50 p-1.5 rounded-xl border border-white/5">
          <Filter size={12} className="ml-2 text-slate-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-transparent text-[10px] font-black rounded px-2 py-1 text-slate-300 focus:outline-none appearance-none cursor-pointer uppercase tracking-widest"
          >
            <option value="ALL">All Levels</option>
            <option value={ThreatLevel.CRITICAL}>Critical</option>
            <option value={ThreatLevel.HIGH}>High</option>
            <option value={ThreatLevel.MEDIUM}>Medium</option>
            <option value={ThreatLevel.LOW}>Low</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {filteredApprovals.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center glass-card rounded-3xl border-dashed border-white/10">
            <ShieldCheck size={48} className="text-green-500/20 mb-6" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Grid Integrity Nominal</p>
          </div>
        ) : (
          filteredApprovals.map((app, idx) => {
            const isExpanded = expandedIndex === idx;
            const isUnlimited = app.allowance.toLowerCase().includes('unlimited');
            
            return (
              <div 
                key={idx} 
                className={getCardStyles(app.riskLevel, isExpanded)}
                onClick={() => toggleExpand(idx)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <TokenIcon symbol={app.tokenSymbol} name={app.tokenName} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-white text-sm tracking-tight">{app.tokenName}</span>
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest ${
                          app.riskLevel === ThreatLevel.CRITICAL ? 'bg-red-500 text-white' :
                          app.riskLevel === ThreatLevel.HIGH ? 'bg-orange-500/20 text-orange-400' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {app.riskLevel}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{app.tokenSymbol}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`text-sm font-black flex items-center gap-2 justify-end ${
                      isUnlimited ? 'text-red-500' : 'text-slate-300'
                    }`}>
                      {isUnlimited && <AlertTriangle size={14} className="animate-pulse" />}
                      {app.allowance}
                    </div>
                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">
                      Target Allowance
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                      <Calendar size={10} /> Sequence Updated
                    </div>
                    <div className="text-[10px] font-mono text-slate-300">{app.lastUpdated}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                      {app.isVerified ? <Lock size={10} className="text-green-500" /> : <Unlock size={10} className="text-red-500" />} Status
                    </div>
                    <div className={`text-[10px] font-black uppercase tracking-widest ${app.isVerified ? 'text-green-500' : 'text-red-500'}`}>
                      {app.isVerified ? 'Verified' : 'Exposed'}
                    </div>
                  </div>
                  <div className="col-span-2 p-3 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Contract Vector</div>
                      <div className="text-[10px] font-mono text-slate-400 truncate max-w-[150px]">{app.contractAddress}</div>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleCopy(app.contractAddress); }}
                      className="p-2 text-slate-600 hover:text-cyan-400 transition-colors"
                    >
                      {copiedAddress === app.contractAddress ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-6 pt-6 border-t border-white/5 animate-in slide-in-from-top-2">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        <div className="text-[9px] font-black text-cyan-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <Info size={12} /> Intelligence Summary
                        </div>
                        <p className="text-xs leading-relaxed text-slate-400 font-medium italic">
                          "{app.riskReason}"
                        </p>
                      </div>
                      <div className="shrink-0 flex items-center">
                        <button className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-red-950/50 flex items-center gap-2 group">
                          <ShieldX size={16} className="group-hover:rotate-12 transition-transform" />
                          Execute Revoke Logic
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="pt-6">
        <button className="w-full py-4 glass-card border-white/5 text-slate-500 hover:text-cyan-400 text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl transition-all flex items-center justify-center gap-3">
          <ExternalLink size={16} /> Global Permission Registry
        </button>
      </div>
    </div>
  );
};

export default ApprovalsList;
