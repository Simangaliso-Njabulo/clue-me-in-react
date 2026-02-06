import { useEffect, useCallback } from 'react';
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

  const handleCorrect = useCallback(() => {
    if (!canInteract) return;
    play('correct');
    markCorrect();
    onCorrect?.();
  }, [canInteract, play, markCorrect, onCorrect]);

  const handleSkip = useCallback(() => {
    if (!canInteract) return;
    play('skip');
    markSkipped();
    onSkip?.();
  }, [canInteract, play, markSkipped, onSkip]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!canInteract) return;

      // Right arrow, D, or Enter = Correct
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        handleCorrect();
      }
      // Left arrow, A, or Backspace = Skip
      else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        handleSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canInteract, handleCorrect, handleSkip]);

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
            ? 'bg-neon-pink hover:bg-neon-pink-hover text-white cursor-pointer shadow-lg shadow-neon-pink/30'
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
            ? 'bg-neon-green hover:bg-neon-green-hover text-bg-primary cursor-pointer shadow-lg shadow-neon-green/30'
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
