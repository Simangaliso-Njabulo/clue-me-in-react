import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { GlassCard } from '../ui/GlassCard';

const cardVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.8,
    rotateY: direction > 0 ? 15 : -15,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    rotateY: 0,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    scale: 0.8,
    rotateY: direction > 0 ? -15 : 15,
  }),
};

interface WordCardProps {
  direction: number;
}

export function WordCard({ direction }: WordCardProps) {
  const { state } = useGame();
  const { currentWord, status, remainingTime, selectedCategory } = state;

  const isPlaying = status === 'playing';
  const isPaused = status === 'paused';
  const isIdle = status === 'idle';
  const isLowTime = remainingTime <= 10 && isPlaying;
  const isDangerTime = remainingTime <= 5 && isPlaying;

  // Determine what to display
  const getDisplayContent = () => {
    if (!selectedCategory) {
      return { title: 'Select a Category', subtitle: 'Choose a category to get started', isWord: false };
    }
    if (isIdle) {
      return { title: 'Ready?', subtitle: 'Click the timer to start!', isWord: false };
    }
    if (isPaused) {
      return { title: 'Paused', subtitle: 'Click the timer to resume', isWord: false };
    }
    if (!currentWord) {
      return { title: 'No Words Left!', subtitle: 'Choose another category', isWord: false };
    }
    return { title: currentWord, subtitle: null, isWord: true };
  };

  const content = getDisplayContent();

  // Determine neon border color based on state
  const getNeonBorder = () => {
    if (isDangerTime) return 'pink' as const;
    if (isLowTime) return 'yellow' as const;
    return 'purple' as const;
  };

  return (
    <GlassCard
      variant="elevated"
      neonBorder={getNeonBorder()}
      className={`w-full h-48 sm:h-56 md:h-64 flex items-center justify-center
        ${isDangerTime ? 'shadow-[0_0_40px_rgba(255,45,149,0.4)]' : ''}
        ${isLowTime && !isDangerTime ? 'shadow-[0_0_30px_rgba(255,255,0,0.25)]' : ''}
      `}
      animate={isDangerTime ? {
        boxShadow: [
          '0 0 30px rgba(255, 45, 149, 0.25)',
          '0 0 60px rgba(255, 45, 149, 0.5)',
          '0 0 30px rgba(255, 45, 149, 0.25)',
        ],
      } : {}}
      transition={isDangerTime ? { repeat: Infinity, duration: 0.5 } : {}}
    >
      {/* Word content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={content.title}
          custom={direction}
          variants={cardVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
            scale: { duration: 0.2 },
          }}
          className="relative z-10 text-center px-6 sm:px-8 w-full"
        >
          <motion.h1
            className={`font-display font-bold leading-tight break-words
              ${content.isWord
                ? 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl'
                : 'text-2xl sm:text-3xl md:text-4xl'}
              ${isDangerTime ? 'text-neon-pink' : isLowTime ? 'text-neon-yellow' : 'text-text-primary'}
            `}
            animate={isDangerTime ? {
              scale: [1, 1.02, 1],
            } : {}}
            transition={isDangerTime ? { repeat: Infinity, duration: 0.3 } : {}}
          >
            {content.title}
          </motion.h1>
          {content.subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-3 text-base sm:text-lg text-text-secondary"
            >
              {content.subtitle}
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>
    </GlassCard>
  );
}
