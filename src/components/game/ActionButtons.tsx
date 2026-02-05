import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { useSound } from '../../context/SoundContext';

interface ActionButtonsProps {
  onCorrect?: () => void;
  onSkip?: () => void;
}

export function ActionButtons({ onCorrect, onSkip }: ActionButtonsProps) {
  const { state, markCorrect, markSkipped } = useGame();
  const { play } = useSound();
  const { status, currentWord } = state;

  const isPlaying = status === 'playing';
  const canInteract = isPlaying && currentWord;

  const handleCorrect = () => {
    if (!canInteract) return;
    play('correct');
    markCorrect();
    onCorrect?.();
  };

  const handleSkip = () => {
    if (!canInteract) return;
    play('skip');
    markSkipped();
    onSkip?.();
  };

  return (
    <div className="flex items-center justify-center gap-6">
      {/* Skip Button */}
      <motion.button
        whileHover={canInteract ? { scale: 1.1 } : {}}
        whileTap={canInteract ? { scale: 0.9 } : {}}
        onClick={handleSkip}
        disabled={!canInteract}
        className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center
          text-3xl sm:text-4xl font-bold transition-all
          ${canInteract
            ? 'bg-game-error hover:bg-game-error-hover text-white cursor-pointer shadow-lg shadow-game-error/30'
            : 'bg-bg-tertiary text-text-muted cursor-not-allowed opacity-50'
          }
        `}
      >
        <motion.span
          initial={false}
          animate={canInteract ? {} : { opacity: 0.5 }}
        >
          ✕
        </motion.span>
      </motion.button>

      {/* Correct Button */}
      <motion.button
        whileHover={canInteract ? { scale: 1.1 } : {}}
        whileTap={canInteract ? { scale: 0.9 } : {}}
        onClick={handleCorrect}
        disabled={!canInteract}
        className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center
          text-3xl sm:text-4xl font-bold transition-all
          ${canInteract
            ? 'bg-game-success hover:bg-game-success-hover text-white cursor-pointer shadow-lg shadow-game-success/30'
            : 'bg-bg-tertiary text-text-muted cursor-not-allowed opacity-50'
          }
        `}
      >
        <motion.span
          initial={false}
          animate={canInteract ? {} : { opacity: 0.5 }}
        >
          ✓
        </motion.span>
      </motion.button>
    </div>
  );
}
