import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useGame } from '../context/GameContext';

export function ResultsPage() {
  const navigate = useNavigate();
  const { state, resetGame } = useGame();
  const { correctWords, skippedWords, maxStreak } = state;

  const totalWords = correctWords.length + skippedWords.length;
  const percentage = totalWords > 0 ? Math.round((correctWords.length / totalWords) * 100) : 0;

  // Redirect if no game was played
  useEffect(() => {
    if (correctWords.length === 0 && skippedWords.length === 0) {
      navigate('/play');
    }
  }, [correctWords.length, skippedWords.length, navigate]);

  // Confetti effect
  useEffect(() => {
    if (correctWords.length > 0) {
      const count = Math.min(correctWords.length * 20, 200);

      confetti({
        particleCount: count,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7c3aed', '#10b981', '#f59e0b', '#ef4444'],
      });

      if (percentage >= 70) {
        setTimeout(() => {
          confetti({
            particleCount: 100,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#7c3aed', '#10b981'],
          });
          confetti({
            particleCount: 100,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#7c3aed', '#10b981'],
          });
        }, 300);
      }
    }
  }, [correctWords.length, percentage]);

  const handlePlayAgain = () => {
    resetGame();
    navigate('/play');
  };

  const getStars = () => {
    if (percentage >= 90) return 3;
    if (percentage >= 70) return 2;
    if (percentage >= 50) return 1;
    return 0;
  };

  const stars = getStars();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-6 py-8 overflow-y-auto">
        {/* Game Over Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl font-display font-bold text-accent-purple mb-3"
        >
          Game Over!
        </motion.h1>

        {/* Stars */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, type: 'spring' }}
          className="flex gap-1 mb-6"
        >
          {[1, 2, 3].map((star) => (
            <motion.span
              key={star}
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{
                opacity: star <= stars ? 1 : 0.3,
                scale: 1,
                rotate: 0,
              }}
              transition={{ delay: 0.25 + star * 0.1, type: 'spring' }}
              className="text-3xl sm:text-4xl"
            >
              {star <= stars ? '⭐' : '☆'}
            </motion.span>
          ))}
        </motion.div>

        {/* Score Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-6"
        >
          <div className="text-5xl sm:text-6xl font-bold font-mono text-game-success mb-1">
            {correctWords.length}
          </div>
          <p className="text-text-secondary text-base">
            correct out of {totalWords} ({percentage}%)
          </p>
          {maxStreak >= 3 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-2 text-sm text-game-warning"
            >
              🔥 Best streak: {maxStreak} in a row!
            </motion.p>
          )}
        </motion.div>

        {/* Word Lists */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-lg grid grid-cols-2 gap-4 mb-8"
        >
          {/* Correct Words */}
          <div className="bg-bg-secondary/50 rounded-xl p-4 border border-white/5">
            <h3 className="text-sm font-bold text-game-success mb-3 flex items-center gap-2">
              <span>✓</span> Correct ({correctWords.length})
            </h3>
            <ul className="space-y-1.5 max-h-48 overflow-y-auto text-sm">
              {correctWords.map((word, index) => (
                <motion.li
                  key={word + index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.02 }}
                  className="flex items-center gap-2 text-text-primary"
                >
                  <span className="text-game-success text-xs">✓</span>
                  <span className="truncate">{word}</span>
                </motion.li>
              ))}
              {correctWords.length === 0 && (
                <li className="text-text-muted italic text-xs">No correct words</li>
              )}
            </ul>
          </div>

          {/* Skipped Words */}
          <div className="bg-bg-secondary/50 rounded-xl p-4 border border-white/5">
            <h3 className="text-sm font-bold text-game-error mb-3 flex items-center gap-2">
              <span>✕</span> Skipped ({skippedWords.length})
            </h3>
            <ul className="space-y-1.5 max-h-48 overflow-y-auto text-sm">
              {skippedWords.map((word, index) => (
                <motion.li
                  key={word + index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.02 }}
                  className="flex items-center gap-2 text-text-primary"
                >
                  <span className="text-game-error text-xs">✕</span>
                  <span className="truncate">{word}</span>
                </motion.li>
              ))}
              {skippedWords.length === 0 && (
                <li className="text-text-muted italic text-xs">No skipped words</li>
              )}
            </ul>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 w-full max-w-xs"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handlePlayAgain}
            className="flex-1 px-6 py-3 text-base font-bold text-white bg-accent-purple rounded-xl
              shadow-lg shadow-accent-purple/25"
          >
            Play Again
          </motion.button>

          <Link to="/" className="flex-1">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full px-6 py-3 text-base font-bold text-text-primary bg-bg-tertiary rounded-xl
                hover:bg-bg-quaternary transition-colors"
            >
              Home
            </motion.button>
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
