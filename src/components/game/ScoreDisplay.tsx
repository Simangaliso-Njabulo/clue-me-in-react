import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';

export function ScoreDisplay() {
  const { state } = useGame();
  const { correctWords, currentStreak } = state;
  const score = correctWords.length;

  return (
    <div className="flex items-center gap-4">
      {/* Score */}
      <div className="flex items-center gap-2">
        <span className="text-text-secondary">Score:</span>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={score}
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="text-2xl font-bold text-neon-green font-mono"
          >
            {score}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Streak */}
      <AnimatePresence>
        {currentStreak >= 2 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-neon-yellow/20 text-neon-yellow"
          >
            <motion.span
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{ repeat: Infinity, duration: 0.5 }}
              className="text-lg"
            >
              🔥
            </motion.span>
            <span className="font-bold">x{currentStreak}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
