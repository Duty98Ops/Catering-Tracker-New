import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChefHat, Check, Sparkles } from 'lucide-react';

interface PortalTransitionOverlayProps {
  isVisible: boolean;
  title?: string;
  subtitle?: string;
  onTransitionComplete: () => void;
}

export const PortalTransitionOverlay: React.FC<PortalTransitionOverlayProps> = ({
  isVisible,
  title = 'Autentikasi Terverifikasi',
  subtitle = 'Menyiapkan ruang kerja operasional katering Anda...',
  onTransitionComplete,
}) => {
  const [phase, setPhase] = useState<'entering' | 'verifying' | 'unveiling' | 'idle'>('idle');

  useEffect(() => {
    if (!isVisible) {
      setPhase('idle');
      return;
    }

    setPhase('entering');

    // Phase 1: Portal expands & verification ring draws (0ms - 500ms)
    const t1 = setTimeout(() => {
      setPhase('verifying');
    }, 450);

    // Phase 2: Complete progress & trigger app state change (950ms)
    const t2 = setTimeout(() => {
      setPhase('unveiling');
      onTransitionComplete();
    }, 950);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isVisible, onTransitionComplete]);

  if (!isVisible && phase === 'idle') return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] bg-[#050814] flex flex-col items-center justify-center p-6 select-none overflow-hidden"
        >
          {/* Ambient Cosmic Portal Lighting */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#2563FF]/20 blur-[140px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full bg-[#22D3EE]/25 blur-[90px] pointer-events-none" />

          {/* Radial Subtle Grid Matrix */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
              backgroundSize: '28px 28px',
            }}
          />

          {/* Expanding Shockwave Rings */}
          <motion.div
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: [0.3, 1.8, 3.2], opacity: [0, 0.5, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
            className="absolute w-64 h-64 rounded-full border border-cyan-400/30 pointer-events-none"
          />
          <motion.div
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: [0.3, 1.8, 3.2], opacity: [0, 0.5, 0] }}
            transition={{ duration: 1.4, delay: 0.4, repeat: Infinity, ease: 'easeOut' }}
            className="absolute w-64 h-64 rounded-full border border-blue-500/25 pointer-events-none"
          />

          {/* Central Holographic Emblem & Status */}
          <motion.div
            initial={{ scale: 0.82, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{
              type: 'spring',
              stiffness: 280,
              damping: 22,
              mass: 0.7,
            }}
            className="relative z-10 flex flex-col items-center text-center max-w-md w-full"
          >
            {/* Holographic Glowing Badge */}
            <div className="relative mb-7">
              {/* Spinning Ambient Glow Halo */}
              <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-[#2563FF] via-[#22D3EE] to-[#8B5CF6] opacity-60 blur-xl animate-pulse" />

              {/* Central Circle with Neon Ring */}
              <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#0F172A] via-[#1E293B] to-[#0A1128] border border-cyan-500/40 shadow-[0_0_50px_rgba(34,211,238,0.45)] flex items-center justify-center ring-1 ring-white/20 backdrop-blur-xl">
                {/* SVG Animated Circular Progress Track */}
                <svg className="absolute inset-0 w-full h-full -rotate-90 p-1" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="3.5"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke="#22D3EE"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeDasharray="276"
                    initial={{ strokeDashoffset: 276 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                  />
                </svg>

                {/* Animated Icon: Chef Hat morphs to Glowing Check */}
                <AnimatePresence mode="wait">
                  {phase === 'verifying' || phase === 'unveiling' ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                      className="relative flex items-center justify-center text-cyan-300"
                    >
                      <Check className="w-11 h-11 stroke-[3] drop-shadow-[0_0_12px_#22D3EE]" />
                      {/* Micro Sparkle Burst */}
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="hat"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className="text-white flex items-center justify-center"
                    >
                      <ChefHat className="w-10 h-10 drop-shadow-[0_0_15px_rgba(37,99,255,0.8)]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Floating Sparkle Badge */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#080D1C] border border-[#22D3EE] flex items-center justify-center shadow-[0_0_10px_#22D3EE]">
                <Sparkles className="w-3.5 h-3.5 text-[#22D3EE]" />
              </div>
            </div>

            {/* Pill Tag */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/70 text-[#22D3EE] border border-cyan-500/30 text-[10px] font-bold tracking-[0.2em] uppercase mb-3 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] animate-pulse" />
              <span>{title}</span>
            </motion.div>

            {/* Main Portal Title */}
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight"
            >
              Membuka Ruang Kerja Catering
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xs sm:text-sm text-slate-400 mt-2 font-medium max-w-sm"
            >
              {subtitle}
            </motion.p>

            {/* Laser Speed Progress Bar */}
            <div className="mt-8 w-64 h-1.5 rounded-full bg-slate-900 border border-slate-800 overflow-hidden relative shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-[#2563FF] via-[#22D3EE] to-white relative"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.88, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Laser Head Glow */}
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white blur-[2px] shadow-[0_0_10px_#ffffff]" />
              </motion.div>
            </div>

            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-[11px] text-cyan-400/80 font-mono tracking-wider mt-3"
            >
              Sinkronisasi Dashboard • 100%
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
