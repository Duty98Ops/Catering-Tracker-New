import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export const AnimatedChartPreview: React.FC = () => {
  const [hasBurst, setHasBurst] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasBurst(true);
    }, 1400);
    return () => clearTimeout(timer);
  }, []);

  const pathD = 'M 0,38 Q 40,32 70,22 T 140,25 T 190,12 T 240,6';
  const areaD = 'M 0,38 Q 40,32 70,22 T 140,25 T 190,12 T 240,6 L 240,44 L 0,44 Z';

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#22D3EE] animate-pulse" />
          <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
            Efisiensi Pengadaan
          </span>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
          +14.2% Hemat
        </span>
      </div>

      {/* Miniature SVG Chart Container */}
      <div className="relative pt-1 pb-2">
        <svg className="w-full h-12 overflow-visible" viewBox="0 0 240 44">
          <defs>
            <linearGradient id="neonGlowGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.45" />
              <stop offset="70%" stopColor="#2563FF" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#080D1C" stopOpacity="0" />
            </linearGradient>
            <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Area Fill that fades in as line completes */}
          <motion.path
            d={areaD}
            fill="url(#neonGlowGrad)"
            initial={{ opacity: 0 }}
            animate={{ opacity: hasBurst ? 1 : 0.2 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />

          {/* Glowing Line Drawing Itself with dashoffset */}
          <motion.path
            d={pathD}
            fill="none"
            stroke="#22D3EE"
            strokeWidth="2.5"
            strokeLinecap="round"
            filter="url(#laserGlow)"
            initial={{ pathLength: 0, strokeDashoffset: 1 }}
            animate={{ pathLength: 1, strokeDashoffset: 0 }}
            transition={{
              duration: 1.4,
              ease: [0.16, 1, 0.3, 1],
            }}
          />

          {/* First Data Point */}
          <circle cx="70" cy="22" r="3" fill="#FFFFFF" />
          <circle cx="70" cy="22" r="6" fill="#22D3EE" opacity="0.35" className="animate-pulse" />

          {/* Peak Point: Micro Particle Burst when line reaches top */}
          <circle cx="240" cy="6" r="3.5" fill="#FFFFFF" />
          {hasBurst && (
            <>
              {/* Expanding Shockwave Rings */}
              <circle
                cx="240"
                cy="6"
                r="10"
                fill="none"
                stroke="#22D3EE"
                strokeWidth="1.5"
                className="animate-ping opacity-80"
              />
              <circle
                cx="240"
                cy="6"
                r="16"
                fill="none"
                stroke="#38BDF8"
                strokeWidth="1"
                className="animate-ping opacity-40"
              />
              {/* Micro particle sparkles */}
              <circle cx="236" cy="2" r="1" fill="#FFFFFF" className="animate-ping" />
              <circle cx="244" cy="10" r="1.2" fill="#22D3EE" className="animate-ping" />
            </>
          )}
        </svg>
      </div>

      {/* Category Tags */}
      <div className="flex items-center gap-1.5 pt-1 border-t border-slate-800/80 text-[10px] text-slate-400">
        <span className="px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-300 font-medium">
          Protein (45%)
        </span>
        <span className="px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-300 font-medium">
          Sayur (25%)
        </span>
        <span className="px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-300 font-medium">
          Bumbu (18%)
        </span>
      </div>
    </div>
  );
};
