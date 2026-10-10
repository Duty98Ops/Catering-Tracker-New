import React from 'react';

interface RadarStatusBadgeProps {
  label?: string;
  className?: string;
}

export const RadarStatusBadge: React.FC<RadarStatusBadgeProps> = ({
  label = 'Sistem Aktif',
  className = '',
}) => {
  return (
    <div className={`inline-flex items-center gap-2 text-emerald-400 font-medium ${className}`}>
      <div className="relative flex items-center justify-center w-3.5 h-3.5">
        {/* Core Dot */}
        <span className="w-2 h-2 rounded-full bg-emerald-400 z-10 shadow-[0_0_8px_#34d399]" />
        
        {/* Continuous Radar Ripple Wave 1 */}
        <span className="absolute inset-0 rounded-full bg-emerald-400/50 animate-ping opacity-75" />

        {/* Continuous Radar Wave 2 with Delay */}
        <span
          className="absolute -inset-1 rounded-full border border-emerald-400/40 animate-pulse"
          style={{ animationDuration: '2s' }}
        />
      </div>
      <span className="text-[11px] tracking-wide text-emerald-300 font-semibold">{label}</span>
    </div>
  );
};
