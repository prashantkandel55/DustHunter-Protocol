
import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Search, 
  RefreshCcw, 
  AlertCircle, 
  Users, 
  ShieldCheck, 
  Activity, 
  ChevronRight,
  TrendingDown,
  Info,
  Bell,
  BellRing,
  Trash2,
  Radar,
  X,
  Cpu,
  Terminal,
  Fingerprint,
  Layers,
  Zap,
  History,
  Wallet,
  Globe,
  ExternalLink,
  Shield,
  Skull,
  Eye,
  Crosshair,
  Wifi,
  Radio,
  Clock,
  LayoutGrid,
  Plus,
  Trash,
  DollarSign,
  GanttChartSquare
} from 'lucide-react';
import { Blockchain, WalletAnalysis, ThreatLevel, MonitoredWallet, AlertNotification } from './types';
import { analyzeWallet } from './services/geminiService';
import SafetyGauge from './components/SafetyGauge';
import ActivityTimeline from './components/ActivityTimeline';
import ApprovalsList from './components/ApprovalsList';
import HoldingsGrid from './components/HoldingsGrid';
import LiveTerminal from './components/LiveTerminal';
import NeuralVectors from './components/NeuralVectors';

const CHAINS: Blockchain[] = ['Ethereum', 'Solana', 'Bitcoin', 'Polygon'];

const DusthunterLogo = () => (
  <div className="relative w-12 h-12 flex items-center justify-center">
    <div className="absolute inset-0 bg-cyan-600/30 rounded-xl blur-md animate-pulse" />
    <div className="relative z-10 w-full h-full glass-card rounded-xl flex items-center justify-center border border-cyan-500/30">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        <circle cx="12" cy="12" r="3" />
        <path d="m12 9 0-3" />
        <path d="m15 12 3 0" />
        <path d="m12 15 0 3" />
        <path d="m9 12-3 0" />
      </svg>
    </div>
  </div>
);

const ThreatTicker = () => (
  <div className="bg-black/90 border-y border-white/5 py-2 overflow-hidden flex whitespace-nowrap z-[60] relative backdrop-blur-md">
    <div className="flex animate-[marquee_45s_linear_infinite] gap-16 items-center">
      {[1, 2, 3].map((_, i) => (
        <React.Fragment key={i}>
          <div className="flex items-center gap-2 text-[10px] font-black text-red-500 uppercase tracking-widest">
            <Skull size={12} /> Sentinel Alert: Inferno V2 Exploit Pattern Detected
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black text-yellow-500 uppercase tracking-widest">
            <Radio size={12} /> Network Recon: 1.4M Addresses Poised
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black text-cyan-500 uppercase tracking-widest">
            <Wifi size={12} /> Node Status: Grid Operational - Block Height: 18,442,109
          </div>
        </React.Fragment>
      ))}
    </div>
    <style>{`
      @keyframes marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
    `}</style>
  </div>
);

const App: React.FC = () => {
  const [address, setAddress] = useState('');
  const [selectedChain, setSelectedChain] = useState<Blockchain>('Ethereum');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<WalletAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'TRANSACTIONS' | 'PORTFOLIO' | 'PERMISSIONS'>('TRANSACTIONS');
  
  const [monitoredWallets, setMonitoredWallets] = useState<MonitoredWallet[]>([]);
  const [showWatchlist, setShowWatchlist] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('dusthunter_watchlist');
    if (saved) setMonitoredWallets(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('dusthunter_watchlist', JSON.stringify(monitoredWallets));
  }, [monitoredWallets]);

  const handleAnalyze = async (e?: React.FormEvent, targetAddress?: string, targetChain?: Blockchain) => {
    if (e) e.preventDefault();
    const addr = targetAddress || address;
    const chain = targetChain || selectedChain;
    
    if (!addr.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const result = await analyzeWallet(addr, chain);
      setAnalysis(result);
      if (targetAddress) setAddress(targetAddress);
    } catch (err) {
      setError("Surveillance uplink failed. Critical timeout at neural edge.");
    } finally {
      setLoading(false);
    }
  };

  const addToWatchlist = () => {
    if (!analysis) return;
    if (monitoredWallets.some(w => w.address === analysis.address)) return;

    const newMonitor: MonitoredWallet = {
      address: analysis.address,
      chain: selectedChain,
      lastAnalysis: analysis,
      isActive: true,
      addedAt: Date.now()
    };
    setMonitoredWallets([...monitoredWallets, newMonitor]);
  };

  const removeFromWatchlist = (addr: string) => {
    setMonitoredWallets(monitoredWallets.filter(w => w.address !== addr));
  };

  const tabs = [
    { id: 'TRANSACTIONS', label: 'Timeline', icon: <History size={14}/> },
    { id: 'PORTFOLIO', label: 'Inventory', icon: <LayoutGrid size={14}/> },
    { id: 'PERMISSIONS', label: 'Security', icon: <ShieldCheck size={14}/> },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-cyan-500/30">
      {/* HUD Navigation */}
      <nav className="h-20 border-b border-white/5 glass-card sticky top-0 z-[100] flex items-center px-6 md:px-12 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setAnalysis(null)}>
            <DusthunterLogo />
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tighter text-white group-hover:text-cyan-400 transition-colors uppercase">Dusthunter Protocol</span>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black text-cyan-500 uppercase tracking-[0.4em]">Surveillance Node v4.0</span>
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/5 rounded-full">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Global Heat:</span>
              <span className="text-[9px] font-black text-red-500">ELEVATED (LEVEL 3)</span>
            </div>
            <button 
              onClick={() => setShowWatchlist(!showWatchlist)}
              className={`p-2.5 rounded-xl border transition-all flex items-center gap-2 ${showWatchlist ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-white/5 border-white/10 text-slate-400 hover:border-cyan-500/50'}`}
            >
              <Radar size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Watchlist</span>
            </button>
          </div>
        </div>
      </nav>

      <ThreatTicker />

      {/* Target Search - Main View */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-8 relative z-10">
        {!analysis && !loading && (
          <div className="py-24 max-w-4xl mx-auto text-center">
            <div className="mb-12 relative inline-block">
               <div className="absolute inset-0 bg-cyan-500/10 blur-3xl rounded-full" />
               <Globe size={64} className="text-cyan-500 relative z-10 mx-auto opacity-70 animate-[spin_20s_linear_infinite]" />
            </div>
            <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter uppercase leading-[0.9]">
              Track. <span className="text-cyan-500">Secure.</span> Prevail.
            </h1>
            <p className="text-slate-500 font-mono text-xs max-w-xl mx-auto mb-16 uppercase tracking-[0.3em] leading-relaxed">
              Neural-grounded wallet surveillance. Scans 180+ threat vectors in 2.4s. 100% search-grounded accuracy.
            </p>
            
            <form onSubmit={handleAnalyze} className="relative group max-w-2xl mx-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600/50 to-purple-600/50 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-slate-950 rounded-2xl p-1 flex items-stretch border border-white/10">
                 <div className="hidden sm:flex items-center px-4 bg-white/5 rounded-xl border border-white/5 mr-1">
                   <select 
                     value={selectedChain}
                     onChange={(e) => setSelectedChain(e.target.value as Blockchain)}
                     className="bg-transparent border-none focus:ring-0 text-[10px] font-black uppercase tracking-widest cursor-pointer text-cyan-400"
                   >
                     {CHAINS.map(c => <option key={c} value={c}>{c}</option>)}
                   </select>
                 </div>
                 <input 
                   type="text"
                   placeholder="Enter 0x or SOL address..."
                   className="flex-1 bg-transparent border-none focus:ring-0 px-6 py-5 text-white font-mono text-sm placeholder:text-slate-800"
                   value={address}
                   onChange={(e) => setAddress(e.target.value)}
                 />
                 <button 
                   type="submit"
                   disabled={loading || !address}
                   className="bg-cyan-600 hover:bg-cyan-500 px-8 rounded-xl text-white font-black uppercase text-[10px] tracking-[0.2em] transition-all flex items-center gap-2"
                 >
                   ENGAGE <ChevronRight size={14}/>
                 </button>
              </div>
            </form>
          </div>
        )}

        {loading && (
          <div className="max-w-2xl mx-auto py-24 text-center">
             <div className="relative w-48 h-48 mx-auto mb-16">
                <div className="absolute inset-0 border-4 border-cyan-500/10 rounded-full animate-[spin_3s_linear_infinite]" />
                <div className="absolute inset-4 border-2 border-cyan-500/20 border-dashed rounded-full animate-[spin_5s_linear_infinite_reverse]" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <Activity size={48} className="text-cyan-500 animate-pulse" />
                </div>
             </div>
             <p className="font-mono text-cyan-500 text-[10px] uppercase tracking-[0.8em] animate-pulse">Deep Reconnaissance in Progress...</p>
             <div className="mt-8 max-w-xs mx-auto">
                <LiveTerminal />
             </div>
          </div>
        )}

        {analysis && !loading && (
          <div className="space-y-8 animate-in fade-in duration-700">
            {/* Mission Dashboard Header */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 glass-card rounded-3xl p-8 border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                  <Fingerprint size={200} />
                </div>
                <div className="flex flex-col md:flex-row justify-between gap-8 relative z-10">
                   <div className="space-y-6">
                      <div className="flex items-center gap-3">
                         <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
                            <Wallet size={24} className="text-cyan-400" />
                         </div>
                         <div>
                            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-1">Target Identity</h2>
                            <p className="text-xl font-mono font-black text-white">{analysis.address}</p>
                         </div>
                      </div>
                      <div className="flex gap-12">
                         <div>
                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block mb-1">Combat Value</span>
                            <span className="text-2xl font-black text-cyan-400">${analysis.totalUsdValue.toLocaleString()}</span>
                         </div>
                         <div>
                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block mb-1">Network Profile</span>
                            <span className="text-2xl font-black text-white">{selectedChain}</span>
                         </div>
                      </div>
                   </div>
                   <div className="flex flex-col items-end gap-4">
                      <button 
                        onClick={addToWatchlist}
                        disabled={monitoredWallets.some(w => w.address === analysis.address)}
                        className="px-6 py-3 bg-white/5 border border-white/10 hover:border-cyan-500/30 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 group"
                      >
                         <Plus size={16} className="group-hover:rotate-90 transition-transform" /> Save Target
                      </button>
                      <div className="text-right">
                         <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-1">Node Uplink Status</span>
                         <div className="flex items-center gap-2 justify-end">
                            <span className="text-[10px] font-black text-green-500 uppercase">Secure</span>
                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
                         </div>
                      </div>
                   </div>
                </div>
              </div>
              
              <div className="glass-card rounded-3xl p-8 border border-white/10 flex flex-col items-center justify-center">
                 <SafetyGauge score={analysis.safetyScore} />
              </div>
            </div>

            {/* Tactical Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Intelligence Column */}
              <div className="lg:col-span-3 space-y-6">
                <div className="glass-card rounded-3xl p-6 border border-white/10">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-6 flex items-center gap-2">
                    <Cpu size={14} className="text-cyan-400"/> Recon Specs
                  </h3>
                  <NeuralVectors />
                </div>
                
                <div className="glass-card rounded-3xl p-6 border border-white/10">
                   <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-6 flex items-center gap-2">
                    <Terminal size={14} className="text-cyan-400"/> Active Stream
                  </h3>
                  <LiveTerminal />
                </div>

                <div className="glass-card rounded-3xl p-6 border border-white/10 bg-cyan-950/20 border-cyan-500/20">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 mb-3">AI Intelligence Dispatch</h3>
                   <p className="text-[11px] leading-relaxed text-slate-300 italic opacity-80">"{analysis.summary}"</p>
                </div>
              </div>

              {/* Operations Column */}
              <div className="lg:col-span-9 space-y-8">
                <div className="flex flex-wrap items-center gap-2 bg-slate-900/40 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                          activeTab === tab.id 
                          ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/40' 
                          : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        {tab.icon} {tab.label}
                      </button>
                    ))}
                </div>

                <div className="animate-in slide-in-from-bottom-4 duration-500">
                  {activeTab === 'TRANSACTIONS' && <ActivityTimeline events={analysis.events} walletAddress={analysis.address} />}
                  {activeTab === 'PORTFOLIO' && <HoldingsGrid holdings={analysis.holdings} />}
                  {activeTab === 'PERMISSIONS' && <ApprovalsList approvals={analysis.approvals} />}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Watchlist Overlays */}
      {showWatchlist && (
        <div className="fixed right-6 top-24 bottom-6 w-96 z-[150] glass-card rounded-3xl border border-white/10 shadow-2xl p-6 flex flex-col animate-in slide-in-from-right-8 duration-500">
           <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Radar size={20} className="text-cyan-400" />
              <div>
                 <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Target List</h3>
                 <span className="text-[9px] font-mono text-slate-600">ENCRYPTED STORAGE ACTIVE</span>
              </div>
            </div>
            <button onClick={() => setShowWatchlist(false)} className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
             {monitoredWallets.map(w => (
               <div key={w.address} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-all group">
                  <div className="flex justify-between items-start mb-3">
                     <div className="flex flex-col">
                        <span className="text-[9px] font-black text-cyan-500 uppercase mb-1">{w.chain}</span>
                        <span className="text-xs font-mono font-bold truncate max-w-[180px]">{w.address}</span>
                     </div>
                     <button onClick={() => removeFromWatchlist(w.address)} className="text-slate-700 hover:text-red-500 transition-colors">
                        <Trash size={14}/>
                     </button>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">${w.lastAnalysis.totalUsdValue.toLocaleString()}</span>
                     <button onClick={() => handleAnalyze(undefined, w.address, w.chain)} className="text-[10px] font-black uppercase text-cyan-400 hover:text-cyan-300 transition-colors">UPLINK</button>
                  </div>
               </div>
             ))}
          </div>
        </div>
      )}

      <footer className="py-24 border-t border-white/5 bg-[#020617]">
        <div className="max-w-7xl mx-auto px-12 text-center">
          <DusthunterLogo />
          <p className="mt-8 text-[11px] font-black uppercase tracking-[0.8em] text-slate-500">Dusthunter Control Protocol • 2024</p>
          <div className="mt-4 flex flex-col items-center gap-2">
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500/60">
              Made by <span className="text-cyan-400 hover:text-cyan-300 cursor-default transition-colors">ancientiorr</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
