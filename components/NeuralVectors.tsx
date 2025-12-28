
import React from 'react';
import { ShieldAlert, Zap, Skull, MessageSquare, Target } from 'lucide-react';
import { ThreatLevel } from '../types';

interface Vector {
  name: string;
  score: number;
  type: string;
}

interface NeuralVectorsProps {
  vectors?: Vector[];
}

const NeuralVectors: React.FC<NeuralVectorsProps> = ({ vectors }) => {
  const defaultVectors = [
    { name: 'Dusting Vulnerability', score: 85, type: 'Dusting' },
    { name: 'Poisoning Resistance', score: 42, type: 'Poisoning' },
    { name: 'Phishing Exposure', score: 12, type: 'Phishing' },
    { name: 'Vanity Address Risk', score: 95, type: 'Recon' },
  ];

  const displayVectors = vectors || defaultVectors;

  const getIcon = (type: string) => {
    switch(type) {
      case 'Dusting': return <Zap size={14} />;
      case 'Poisoning': return <Skull size={14} />;
      case 'Phishing': return <MessageSquare size={14} />;
      default: return <Target size={14} />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShieldAlert size={14} className="text-orange-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Neural Attack Vectors</span>
        </div>
        <span className="text-[8px] font-mono text-slate-600">v4.2-AUGMENTED</span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {displayVectors.map((v, i) => (
          <div key={i} className="p-3 glass-card rounded-xl border border-white/5 hover:border-white/10 transition-all">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${v.score > 70 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                  {getIcon(v.type)}
                </div>
                <span className="text-[10px] font-bold text-white uppercase tracking-tight">{v.name}</span>
              </div>
              <span className={`text-[10px] font-black ${v.score > 70 ? 'text-green-500' : 'text-red-500'}`}>{v.score}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden flex">
              <div 
                className={`h-full transition-all duration-1000 ${v.score > 70 ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`}
                style={{ width: `${v.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NeuralVectors;
