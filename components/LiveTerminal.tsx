
import React, { useEffect, useRef, useState } from 'react';
import { Terminal, Cpu, Wifi, ShieldAlert } from 'lucide-react';

interface LogEntry {
  id: number;
  text: string;
  type: 'info' | 'warn' | 'error' | 'success';
  timestamp: string;
}

const LiveTerminal: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const addLog = (text: string, type: LogEntry['type'] = 'info') => {
    const newLog: LogEntry = {
      id: Date.now() + Math.random(),
      text,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setLogs(prev => [...prev.slice(-20), newLog]);
  };

  useEffect(() => {
    const messages = [
      "Establishing neural uplink to Ethereum Mainnet...",
      "Bypassing node rate limits via shadow proxy...",
      "Scraping Etherscan for recent dusting signatures...",
      "Analyzing transaction entropy on current target...",
      "Cross-referencing address with known Inferno Drainer clusters...",
      "Deep-scanning 48h block history for Zero-Transfer poisoning...",
      "Memory pool integrity check: NOMINAL",
      "Intercepting pending broadcast packets...",
      "Warning: High frequency of small-value transfers detected.",
      "Threat Vector detected: Address Poisoning via vanity contract.",
      "Neural weights updated for current wallet profile.",
      "Surveillance ping successful. Response time: 42ms."
    ];

    const interval = setInterval(() => {
      const msg = messages[Math.floor(Math.random() * messages.length)];
      addLog(msg, msg.includes('Warning') || msg.includes('Threat') ? 'warn' : 'info');
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="glass-card rounded-2xl border border-white/5 bg-black/60 overflow-hidden flex flex-col h-48 group">
      <div className="p-3 border-b border-white/5 bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal size={12} className="text-cyan-500" />
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Tactical Recon Log</span>
        </div>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50" />
          <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
        </div>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-1 scroll-smooth">
        {logs.map((log) => (
          <div key={log.id} className="flex gap-3 items-start animate-in fade-in slide-in-from-left-2 duration-300">
            <span className="text-[8px] font-mono text-slate-600 shrink-0 mt-0.5">[{log.timestamp}]</span>
            <span className={`text-[10px] font-mono leading-tight ${
              log.type === 'warn' ? 'text-yellow-500' : 
              log.type === 'error' ? 'text-red-500' : 
              log.type === 'success' ? 'text-green-500' : 
              'text-cyan-500/80'
            }`}>
              {log.type === 'warn' ? '> WARNING: ' : '> '}
              {log.text}
            </span>
          </div>
        ))}
        {logs.length === 0 && <div className="text-[10px] font-mono text-slate-700">Awaiting initial handshake...</div>}
      </div>
    </div>
  );
};

export default LiveTerminal;
