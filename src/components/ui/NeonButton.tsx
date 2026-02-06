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
    bg: 'bg-neon-purple',
    hover: 'hover:bg-neon-purple-hover',
    glow: 'shadow-[0_4px_20px_rgba(176,38,255,0.4)]',
    hoverGlow: '0 8px 30px rgba(176, 38, 255, 0.6)',
    text: 'text-white',
    border: 'border-neon-purple/50',
  },
  success: {
    bg: 'bg-neon-green',
    hover: 'hover:bg-neon-green-hover',
    glow: 'shadow-[0_4px_20px_rgba(57,255,20,0.4)]',
    hoverGlow: '0 8px 30px rgba(57, 255, 20, 0.6)',
    text: 'text-bg-primary',
    border: 'border-neon-green/50',
  },
  danger: {
    bg: 'bg-neon-pink',
    hover: 'hover:bg-neon-pink-hover',
    glow: 'shadow-[0_4px_20px_rgba(255,45,149,0.4)]',
    hoverGlow: '0 8px 30px rgba(255, 45, 149, 0.6)',
    text: 'text-white',
    border: 'border-neon-pink/50',
  },
  secondary: {
    bg: 'bg-bg-tertiary',
    hover: 'hover:bg-bg-quaternary',
    glow: '',
    hoverGlow: '0 4px 15px rgba(0, 0, 0, 0.3)',
    text: 'text-text-primary',
    border: 'border-white/10',
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
      {/* 3D effect - top highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-t-xl" />

      {/* 3D effect - bottom shadow */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-black/20 rounded-b-xl" />

      {/* Content */}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
