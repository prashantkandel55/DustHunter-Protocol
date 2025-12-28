
import React from 'react';

interface SafetyGaugeProps {
  score: number;
}

const SafetyGauge: React.FC<SafetyGaugeProps> = ({ score }) => {
  const radius = 75;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s > 80) return '#22d3ee'; // Cyan
    if (s > 50) return '#fbbf24'; // Amber
    return '#f87171'; // Red
  };

  const color = getColor(score);

  return (
    <div className="relative w-72 h-72 mx-auto flex items-center justify-center group">
      {/* Pulse Outer Boundary */}
      <div className="absolute inset-0 rounded-full border border-white/5 animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite] opacity-20" />
      
      {/* Background Track and Main Ring */}
      <svg className="absolute w-full h-full transform -rotate-90 scale-110">
        {/* Outer Tech Ring */}
        <circle
          cx="144"
          cy="144"
          r={radius + 25}
          stroke="rgba(255,255,255,0.03)"
          strokeWidth="1"
          fill="transparent"
          strokeDasharray="2, 10"
        />
        {/* Main Track */}
        <circle
          cx="144"
          cy="144"
          r={radius}
          stroke="rgba(255,255,255,0.03)"
          strokeWidth="20"
          fill="transparent"
        />
        {/* Progress Fill */}
        <circle
          cx="144"
          cy="144"
          r={radius}
          stroke={color}
          strokeWidth="16"
          fill="transparent"
          strokeDasharray={circumference}
          style={{
            strokeDashoffset: offset,
            transition: 'stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1), stroke 1s ease-in-out',
            filter: `drop-shadow(0 0 15px ${color}aa)`
          }}
          strokeLinecap="butt"
        />
        {/* Digital Segment Marks */}
        {[...Array(12)].map((_, i) => (
          <line
            key={i}
            x1="144" y1="50" x2="144" y2="60"
            stroke="white"
            strokeOpacity="0.1"
            strokeWidth="2"
            transform={`rotate(${i * 30}, 144, 144)`}
          />
        ))}
      </svg>
      
      {/* Center Tactical Display */}
      <div className="text-center z-10 p-8 glass-card rounded-full border border-white/10 shadow-2xl backdrop-blur-3xl group-hover:scale-105 transition-transform duration-500">
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mb-2">Defense Score</div>
        <div className="text-7xl font-black tracking-tighter transition-colors duration-1000 flex items-baseline justify-center" style={{ color }}>
          {score}<span className="text-2xl opacity-40 ml-1">%</span>
        </div>
        <div className="mt-4 flex gap-1 justify-center">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i} 
              className="w-2 h-4 rounded-sm transition-all duration-700"
              style={{ 
                backgroundColor: score > (i * 12.5) ? color : 'rgba(255,255,255,0.03)',
                boxShadow: score > (i * 12.5) ? `0 0 10px ${color}` : 'none'
              }}
            />
          ))}
        </div>
      </div>

      {/* Decorative Rotating Elements */}
      <div className="absolute inset-0 border border-cyan-500/5 rounded-full animate-[spin_60s_linear_infinite]" />
      <div className="absolute inset-8 border border-dashed border-white/5 rounded-full animate-[spin_30s_linear_infinite_reverse]" />
      
      {/* Scanning HUD Overlay */}
      <div className="absolute top-1/2 left-0 right-0 h-1 bg-cyan-500/20 blur-sm animate-[scan_3s_ease-in-out_infinite] pointer-events-none" />
      <style>{`
        @keyframes scan {
          0%, 100% { transform: translateY(-80px); opacity: 0; }
          50% { transform: translateY(80px); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default SafetyGauge;
