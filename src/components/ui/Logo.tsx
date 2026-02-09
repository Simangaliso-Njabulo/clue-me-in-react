import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
  showTagline?: boolean;
}

const sizes = {
  sm: { text: 'text-2xl', tagline: 'text-xs' },
  md: { text: 'text-4xl sm:text-5xl', tagline: 'text-sm' },
  lg: { text: 'text-5xl sm:text-6xl md:text-7xl', tagline: 'text-base sm:text-lg' },
};

export function Logo({ size = 'md', animate = true, showTagline = false }: LogoProps) {
  const { text, tagline } = sizes[size];

  const letters = [
    { char: 'W', color: 'text-text-primary', delay: 0 },
    { char: 'O', color: 'text-text-primary', delay: 0.1 },
    { char: 'R', color: 'text-text-primary', delay: 0.2 },
    { char: 'D', color: 'text-text-primary', delay: 0.3 },
    { char: 'Z', color: 'text-neon-blue', delay: 0.4, special: true },
    { char: 'A', color: 'text-text-primary', delay: 0.5 },
    { char: 'P', color: 'text-text-primary', delay: 0.6 },
    { char: 'P', color: 'text-text-primary', delay: 0.7 },
  ];

  return (
    <div className="flex flex-col items-center">
      <h1 className={`${text} font-display font-black tracking-wider flex`}>
        {letters.map((letter, i) => (
          <motion.span
            key={i}
            initial={animate ? { opacity: 0, y: 20 } : undefined}
            animate={animate ? { opacity: 1, y: 0 } : undefined}
            transition={animate ? { delay: letter.delay, duration: 0.5 } : undefined}
            className={letter.color}
          >
            {letter.special ? (
              <motion.span
                animate={animate ? {
                  opacity: [1, 0.9, 1],
                } : undefined}
                transition={animate ? {
                  duration: 3,
                  repeat: Infinity,
                } : undefined}
                className="inline-block"
                style={{
                  textShadow: '0 0 8px rgba(79, 110, 247, 0.6), 0 0 16px rgba(79, 110, 247, 0.3)',
                }}
              >
                {letter.char}
              </motion.span>
            ) : (
              <span className="inline-block">{letter.char}</span>
            )}
          </motion.span>
        ))}
      </h1>

      {showTagline && (
        <motion.p
          initial={animate ? { opacity: 0, y: 10 } : undefined}
          animate={animate ? { opacity: 1, y: 0 } : undefined}
          transition={{ delay: 1, duration: 0.5 }}
          className={`${tagline} font-body text-text-secondary mt-2 tracking-widest uppercase`}
        >
          The Guessing Game
        </motion.p>
      )}
    </div>
  );
}
