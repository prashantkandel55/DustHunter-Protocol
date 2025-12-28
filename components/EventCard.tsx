
import React from 'react';
import { AlertTriangle, ShieldCheck, Eye, Zap, Info } from 'lucide-react';
import { SecurityEvent, ThreatLevel } from '../types';

interface EventCardProps {
  event: SecurityEvent;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const getIcon = () => {
    switch (event.type) {
      case 'DUSTING': return <Zap size={18} className="text-yellow-400" />;
      case 'APPROVAL': return <ShieldCheck size={18} className="text-blue-400" />;
      case 'PHISHING': return <AlertTriangle size={18} className="text-red-500" />;
      case 'WATCHER': return <Eye size={18} className="text-purple-400" />;
      default: return <Info size={18} className="text-gray-400" />;
    }
  };

  const getSeverityColor = (level: ThreatLevel) => {
    switch (level) {
      case ThreatLevel.CRITICAL: return 'bg-red-900/30 text-red-400 border-red-500/50';
      case ThreatLevel.HIGH: return 'bg-orange-900/30 text-orange-400 border-orange-500/50';
      case ThreatLevel.MEDIUM: return 'bg-yellow-900/30 text-yellow-400 border-yellow-500/50';
      default: return 'bg-blue-900/30 text-blue-400 border-blue-500/50';
    }
  };

  return (
    <div className={`p-4 rounded-xl border ${getSeverityColor(event.severity)} transition-all hover:scale-[1.01]`}>
      <div className="flex items-start gap-3">
        <div className="mt-1">{getIcon()}</div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <h4 className="font-semibold text-sm uppercase tracking-wider">{event.type}</h4>
            <span className="text-[10px] opacity-70">{event.timestamp}</span>
          </div>
          <p className="text-sm opacity-90">{event.description}</p>
          {event.txHash && (
            <div className="mt-2 flex items-center gap-1">
              <span className="text-[10px] font-mono opacity-50 truncate max-w-[150px]">TX: {event.txHash}</span>
              <button className="text-[10px] underline hover:text-white transition-colors">View Explorer</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
