import React, { useState } from 'react';
import { motion } from 'motion/react';

interface NeonInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  autoComplete?: string;
}

export const NeonInput: React.FC<NeonInputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  icon,
  rightElement,
  autoComplete,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative space-y-1.5">
      <label className="block text-xs font-bold text-slate-700 transition-colors">
        {label}
      </label>

      <div className="relative group">
        {/* Leading Icon */}
        {icon && (
          <div
            className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 z-10 ${
              isFocused ? 'text-[#2563FF]' : 'text-slate-400'
            }`}
          >
            {icon}
          </div>
        )}

        {/* Real Input Element */}
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className={`w-full py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 font-medium placeholder:text-slate-400 transition-all duration-200 outline-none ${
            icon ? 'pl-10' : 'pl-3.5'
          } ${rightElement ? 'pr-11' : 'pr-3.5'} ${
            isFocused
              ? 'border-transparent bg-white shadow-[0_0_20px_rgba(37,99,255,0.12)]'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        />

        {/* Trailing element (e.g. eye toggle) */}
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
            {rightElement}
          </div>
        )}

        {/* Expanding Cyan Neon Underline from center outward */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-b-xl bg-gradient-to-r from-[#2563FF] via-[#22D3EE] to-[#2563FF] shadow-[0_2px_10px_rgba(34,211,238,0.7)] pointer-events-none origin-center"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{
            scaleX: isFocused ? 1 : 0,
            opacity: isFocused ? 1 : 0,
          }}
          transition={{
            duration: 0.35,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      </div>
    </div>
  );
};
