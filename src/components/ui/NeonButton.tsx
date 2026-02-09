import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

interface NeonButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
  variant?: 'primary' | 'success' | 'danger' | 'secondary';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  disabled?: boolean;
  className?: string;
}

const variants = {
  primary: {
    bg: 'bg-neon-blue',
    hover: 'hover:bg-neon-blue-hover',
    glow: 'shadow-[0_4px_16px_rgba(56,189,248,0.3)]',
    hoverGlow: '0 8px 24px rgba(56, 189, 248, 0.4)',
    text: 'text-white',
    border: 'border-neon-blue/40',
  },
  success: {
    bg: 'bg-neon-green',
    hover: 'hover:bg-neon-green-hover',
    glow: 'shadow-[0_4px_16px_rgba(52,211,153,0.3)]',
    hoverGlow: '0 8px 24px rgba(52, 211, 153, 0.4)',
    text: 'text-bg-primary',
    border: 'border-neon-green/40',
  },
  danger: {
    bg: 'bg-neon-pink',
    hover: 'hover:bg-neon-pink-hover',
    glow: 'shadow-[0_4px_16px_rgba(244,114,182,0.3)]',
    hoverGlow: '0 8px 24px rgba(244, 114, 182, 0.4)',
    text: 'text-white',
    border: 'border-neon-pink/40',
  },
  secondary: {
    bg: 'bg-bg-tertiary',
    hover: 'hover:bg-bg-quaternary',
    glow: '',
    hoverGlow: '0 4px 15px rgba(0, 0, 0, 0.3)',
    text: 'text-text-primary',
    border: 'border-white/8',
  },
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
  icon: 'w-12 h-12 p-0',
};

export function NeonButton({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  ...props
}: NeonButtonProps) {
  const variantStyles = variants[variant];
  const sizeStyles = sizes[size];

  return (
    <motion.button
      whileHover={disabled ? undefined : {
        scale: 1.02,
        y: -2,
        boxShadow: variantStyles.hoverGlow,
      }}
      whileTap={disabled ? undefined : {
        scale: 0.98,
        y: 0,
      }}
      transition={{ duration: 0.15 }}
      disabled={disabled}
      className={`
        relative font-display font-bold rounded-xl
        border transition-colors
        flex items-center justify-center gap-2
        ${variantStyles.bg}
        ${variantStyles.hover}
        ${variantStyles.glow}
        ${variantStyles.text}
        ${variantStyles.border}
        ${sizeStyles}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      {...props}
    >
      {/* Top highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-t-xl" />

      {/* Bottom shadow */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-black/15 rounded-b-xl" />

      {/* Content */}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
