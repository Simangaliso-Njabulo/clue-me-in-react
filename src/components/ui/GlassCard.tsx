import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'subtle';
  neonBorder?: 'none' | 'pink' | 'cyan' | 'purple' | 'green' | 'yellow';
  hover?: boolean;
  className?: string;
}

const variants = {
  default: {
    background: 'rgba(26, 32, 51, 0.85)',
    border: 'rgba(255, 255, 255, 0.1)',
    shadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
  },
  elevated: {
    background: 'rgba(30, 37, 58, 0.9)',
    border: 'rgba(255, 255, 255, 0.12)',
    shadow: '0 12px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
  },
  subtle: {
    background: 'rgba(20, 26, 42, 0.75)',
    border: 'rgba(255, 255, 255, 0.07)',
    shadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
  },
};

const neonBorders = {
  none: '',
  pink: 'border-neon-pink/25 shadow-[0_0_12px_rgba(244,114,182,0.15)]',
  cyan: 'border-neon-blue/25 shadow-[0_0_12px_rgba(56,189,248,0.15)]',
  purple: 'border-neon-blue/25 shadow-[0_0_12px_rgba(56,189,248,0.15)]',
  green: 'border-neon-green/25 shadow-[0_0_12px_rgba(52,211,153,0.15)]',
  yellow: 'border-neon-yellow/25 shadow-[0_0_12px_rgba(251,191,36,0.15)]',
};

export function GlassCard({
  children,
  variant = 'default',
  neonBorder = 'none',
  hover = false,
  className = '',
  ...props
}: GlassCardProps) {
  const variantStyles = variants[variant];

  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -4 } : undefined}
      transition={{ duration: 0.2 }}
      className={`
        relative rounded-2xl overflow-hidden
        backdrop-blur-xl
        ${neonBorder !== 'none' ? neonBorders[neonBorder] : ''}
        ${className}
      `}
      style={{
        background: variantStyles.background,
        border: `1px solid ${variantStyles.border}`,
        boxShadow: variantStyles.shadow,
      }}
      {...props}
    >
      {/* Top light reflection */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
