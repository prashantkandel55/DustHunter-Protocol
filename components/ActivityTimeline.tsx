
import React, { useState, useMemo } from 'react';
import { SecurityEvent, ThreatLevel } from '../types';
import { 
  Eye, 
  ArrowUpRight, 
  Copy, 
  Check, 
  ExternalLink, 
  AlertCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Info,
  ShieldAlert,
  ArrowRightLeft,
  Link2Off,
  Skull,
  ShieldX,
  Target,
  Zap,
  Search,
  AlertOctagon,
  Fingerprint,
  TrendingUp
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface ActivityTimelineProps {
  events: SecurityEvent[];
  walletAddress: string;
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ events, walletAddress }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [hideSpam, setHideSpam] = useState(false);
  const [hideFailed, setHideFailed] = useState(false);

  // Prepare chart data for threat trend visualization
  const chartData = useMemo(() => {
    return [...events]
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .map(e => ({
        time: e.timestamp,
        displayTime: new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        level: e.severity === ThreatLevel.CRITICAL ? 4 : 
               e.severity === ThreatLevel.HIGH ? 3 : 
               e.severity === ThreatLevel.MEDIUM ? 2 : 1,
        type: e.type,
      }));
  }, [events]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const shorten = (addr: string) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : 'N/A';

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'DUSTING': return <Zap size={14} className="text-yellow-400" />;
      case 'POISONING': return <Skull size={14} className="text-purple-500" />;
      case 'PHISHING': return <AlertOctagon size={14} className="text-red-500" />;
      case 'EXPLOIT_LINK': return <Link2Off size={14} className="text-red-500" />;
      case 'WATCHER': return <Eye size={14} className="text-cyan-400" />;
      case 'TRANSFER': return <ArrowUpRight size={14} className="text-blue-400" />;
      case 'SWAP': return <ArrowRightLeft size={14} className="text-green-400" />;
      case 'APPROVAL': return <ShieldX size={14} className="text-orange-400" />;
      default: return <Info size={14} className="text-slate-400" />;
    }
  };

  const getActionBadge = (type: string, severity: ThreatLevel) => {
    const isHostile = ['DUSTING', 'PHISHING', 'POISONING', 'EXPLOIT_LINK'].includes(type) || severity === ThreatLevel.CRITICAL;
    
    let colorClass = "bg-white/5 text-slate-400 border-white/5";
    if (type === 'DUSTING') colorClass = "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    if (type === 'PHISHING' || type === 'EXPLOIT_LINK') colorClass = "bg-red-500/10 text-red-500 border-red-500/20";
    if (type === 'POISONING') colorClass = "bg-purple-500/10 text-purple-500 border-purple-500/20";
    if (type === 'TRANSFER') colorClass = "bg-blue-500/10 text-blue-400 border-blue-500/20";
    if (type === 'SWAP') colorClass = "bg-green-500/10 text-green-500 border-green-500/20";
    if (type === 'APPROVAL') colorClass = "bg-orange-500/10 text-orange-500 border-orange-500/20";

    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${colorClass}`}>
        {getEventIcon(type)}
        {type}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Tactical Threat Trend Visualization */}
      <div className="glass-card rounded-3xl p-6 border border-white/5 bg-slate-950/40 relative overflow-hidden group">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <TrendingUp size={16} className="text-red-400" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Intensity Matrix</h3>
              <p className="text-[10px] text-slate-500 font-mono">Temporal Threat Propagation</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4]" />
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Scan</span>
            </div>
          </div>
        </div>
        
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
              <defs>
                <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="hostilePulse" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="glass-card p-3 rounded-xl border border-white/10 shadow-2xl backdrop-blur-xl">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{data.time}</p>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-black uppercase ${data.level >= 3 ? 'text-red-400' : 'text-cyan-400'}`}>
                            {data.type} detected
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area 
                type="monotone" 
                dataKey="level" 
                stroke="#06b6d4" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorLevel)" 
                animationDuration={2000}
              />
              <ReferenceLine y={3} stroke="#ef4444" strokeDasharray="3 3" opacity={0.2} label={{ position: 'right', value: 'ALERT', fill: '#ef4444', fontSize: 8, fontWeight: 'bold' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Decorative Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_120%,rgba(6,182,212,0.05),transparent)] opacity-50" />
      </div>

      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 rounded-lg">
            <Fingerprint size={16} className="text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white">Security Ledger Matrix</h3>
            <p className="text-[10px] text-slate-500 font-mono">Monitoring {shorten(walletAddress)} in real-time</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-900/50 p-1 rounded-xl border border-white/5">
          <button 
            onClick={() => setHideSpam(!hideSpam)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group ${hideSpam ? 'bg-cyan-900/20' : ''}`}
          >
            <Info size={12} className={`${hideSpam ? 'text-cyan-400' : 'text-slate-500'} group-hover:text-cyan-400`} />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hide Dusting</span>
            <div className={`w-8 h-4 rounded-full relative transition-colors ${hideSpam ? 'bg-cyan-600' : 'bg-slate-700'}`}>
              <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${hideSpam ? 'left-4.5' : 'left-0.5'}`} />
            </div>
          </button>
          <div className="w-px h-4 bg-white/10" />
          <button 
            onClick={() => setHideFailed(!hideFailed)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group ${hideFailed ? 'bg-red-900/20' : ''}`}
          >
            <AlertCircle size={12} className={`${hideFailed ? 'text-red-400' : 'text-slate-500'} group-hover:text-red-400`} />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hide Critical</span>
            <div className={`w-8 h-4 rounded-full relative transition-colors ${hideFailed ? 'bg-cyan-600' : 'bg-slate-700'}`}>
              <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${hideFailed ? 'left-4.5' : 'left-0.5'}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="glass-card rounded-2xl overflow-hidden shadow-2xl border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-900/80 border-b border-white/5">
                <th className="p-4 w-12 text-center text-slate-600"><Search size={14} /></th>
                <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Signature</th>
                <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]"><Clock size={12} className="inline mr-1 text-cyan-500" /> Timestamp</th>
                <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Combat Action</th>
                <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Counterparty</th>
                <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Payload</th>
                <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Analysis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {events
                .filter(e => !(hideSpam && e.type === 'DUSTING'))
                .filter(e => !(hideFailed && e.severity === ThreatLevel.CRITICAL))
                .map((event) => {
                  const isExpanded = expandedId === event.id;
                  const isHostile = ['DUSTING', 'PHISHING', 'POISONING', 'EXPLOIT_LINK'].includes(event.type) || event.severity === ThreatLevel.CRITICAL;
                  
                  return (
                    <React.Fragment key={event.id}>
                      <tr 
                        className={`group transition-colors cursor-pointer ${isExpanded ? 'bg-white/[0.05]' : 'hover:bg-white/[0.03]'} ${isHostile ? 'bg-red-500/[0.02]' : ''}`}
                        onClick={() => toggleExpand(event.id)}
                      >
                        <td className="p-4 text-center">
                          <button className={`transition-colors ${isHostile ? 'text-red-500' : 'text-slate-600 group-hover:text-cyan-400'}`}>
                            {isHostile ? <AlertCircle size={14} /> : <Eye size={14} />}
                          </button>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {isHostile && <ShieldAlert size={14} className="text-red-500 animate-pulse shrink-0" />}
                            <span className={`text-xs font-mono transition-colors truncate max-w-[180px] ${isHostile ? 'text-red-400 font-black' : 'text-cyan-400 hover:text-cyan-300'}`}>
                              {event.txHash || event.id}
                            </span>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleCopy(event.txHash || event.id); }} 
                              className="text-slate-600 hover:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              {copiedId === (event.txHash || event.id) ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                            </button>
                          </div>
                        </td>
                        <td className="p-4 text-[11px] font-medium text-slate-400 whitespace-nowrap">
                          {event.timestamp}
                        </td>
                        <td className="p-4">
                          {getActionBadge(event.type, event.severity)}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-mono ${isHostile && event.from !== walletAddress ? 'text-red-300/80' : 'text-slate-300'}`}>
                              {shorten(event.from === walletAddress ? event.to : event.from)}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[8px] font-black ${
                              isHostile ? 'bg-red-500/20 border-red-500/30 text-red-400' : 'bg-cyan-600/20 border-cyan-500/30 text-cyan-400'
                            }`}>D</div>
                            <span className={`text-xs font-black ${isHostile ? 'text-red-200' : 'text-white'}`}>
                              {event.amount || '0.00'} <span className="text-[10px] text-slate-500 font-normal">{event.token || 'ETH'}</span>
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end">
                             {isExpanded ? <ChevronUp size={14} className="text-cyan-400" /> : <ChevronDown size={14} className="text-slate-600 group-hover:text-slate-400" />}
                          </div>
                        </td>
                      </tr>
                      
                      {/* Expansion Row - Generalized and Hostile Aware */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={7} className={`p-0 border-b border-white/5 ${isHostile ? 'bg-red-950/10' : 'bg-slate-900/30'}`}>
                            <div className="p-6 animate-in slide-in-from-top-2 duration-300">
                              <div className="flex flex-col md:flex-row gap-8">
                                {/* Tactical Description */}
                                <div className="flex-1 space-y-4">
                                  <div className="flex items-center gap-3 mb-2">
                                    <div className={`p-2 rounded-lg ${isHostile ? 'bg-red-500/20' : 'bg-white/5'}`}>
                                      {isHostile ? <Skull size={18} className="text-red-500" /> : <Info size={18} className="text-cyan-400" />}
                                    </div>
                                    <h4 className={`text-xs font-black uppercase tracking-widest ${isHostile ? 'text-red-400' : 'text-white'}`}>
                                      {isHostile ? 'Threat Intelligence Detail' : 'Operational Insight'}
                                    </h4>
                                  </div>
                                  <p className={`text-sm leading-relaxed font-medium ${isHostile ? 'text-red-200/80' : 'text-slate-400'}`}>
                                    {event.description}
                                  </p>
                                  {event.attackSignature && (
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
                                      <ShieldAlert size={14} className="text-red-500" />
                                      <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">Vector SIG: {event.attackSignature}</span>
                                    </div>
                                  )}
                                </div>

                                {/* Threat Profile Card */}
                                <div className="w-full md:w-80 space-y-4 shrink-0">
                                  <div className={`p-5 rounded-2xl border shadow-2xl relative overflow-hidden ${
                                    isHostile ? 'bg-red-950/20 border-red-500/30' : 'bg-slate-800/40 border-white/5'
                                  }`}>
                                    <div className="absolute top-0 right-0 p-4 opacity-5">
                                      {isHostile ? <Target size={64} className="text-red-500" /> : <Eye size={64} className="text-cyan-500" />}
                                    </div>
                                    <div className="relative z-10">
                                      <h5 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2 ${isHostile ? 'text-red-500' : 'text-slate-500'}`}>
                                        {isHostile ? <AlertCircle size={14} /> : <ShieldAlert size={14} />} Asset Recon Profile
                                      </h5>
                                      <div className="space-y-3">
                                        <div className="flex justify-between items-center text-[10px]">
                                          <span className="text-slate-500 font-bold uppercase tracking-widest">Severity Index</span>
                                          <span className={`font-black uppercase ${event.severity === ThreatLevel.CRITICAL ? 'text-red-500' : 'text-cyan-400'}`}>
                                            {event.severity}
                                          </span>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px]">
                                          <span className="text-slate-500 font-bold uppercase tracking-widest">Source Entity</span>
                                          <span className="text-slate-300 font-black uppercase">{event.from === walletAddress ? 'Internal' : 'External Recon'}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px]">
                                          <span className="text-slate-500 font-bold uppercase tracking-widest">Network Impact</span>
                                          <span className="text-slate-300 font-black uppercase">{isHostile ? 'High Risk' : 'Nominal'}</span>
                                        </div>
                                      </div>
                                      <div className="mt-6">
                                        {isHostile ? (
                                          <button className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-red-950/50 flex items-center justify-center gap-2">
                                            <ShieldX size={14} /> Terminate Engagement
                                          </button>
                                        ) : (
                                          <button className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                                            <ExternalLink size={14} /> Inspect In Explorer
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
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
      
      <div className="text-center">
        <button className="text-[10px] font-black text-slate-500 hover:text-cyan-400 uppercase tracking-[0.4em] transition-all flex items-center gap-2 mx-auto group">
          <ChevronDown size={14} className="group-hover:translate-y-1 transition-transform" />
          Poll Historical Block States
        </button>
      </div>
    </div>
  );
};

export default ActivityTimeline;
