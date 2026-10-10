import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'submit' | 'button' | 'reset';
  disabled?: boolean;
  className?: string;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
}) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    // Magnetic pull: max 8px
    setOffset({
      x: dx * 0.16,
      y: dy * 0.16,
    });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = { id: Date.now(), x, y };
    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 650);

    if (onClick) onClick(e);
  };

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      animate={{ x: offset.x, y: offset.y }}
      whileTap={{ scale: 0.96 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 25,
        mass: 0.5,
      }}
      className={`relative overflow-hidden group select-none ${className}`}
    >
      {/* Rotating Neon Glow Border (Active on Hover) */}
      <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-[#2563FF] via-[#22D3EE] to-[#8B5CF6] opacity-0 group-hover:opacity-100 blur-[2px] transition-opacity duration-300 pointer-events-none -z-10 animate-pulse" />

      {/* Liquid / Shimmer Sweep Light Beam */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform ease-out pointer-events-none z-10" />

      {/* Shockwave Ripples from Click Coordinates */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/40 pointer-events-none animate-ping z-20"
          style={{
            left: ripple.x - 15,
            top: ripple.y - 15,
            width: 30,
            height: 30,
          }}
        />
      ))}

      {/* Button Content */}
      <span className="relative z-10 flex items-center justify-center gap-2 w-full">
        {children}
      </span>
    </motion.button>
  );
};
