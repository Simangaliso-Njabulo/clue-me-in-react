import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useGame } from '../context/GameContext';
import { GlassCard } from '../components/ui/GlassCard';
import { useAchievements } from '../hooks/useAchievements';

export function ResultsPage() {
  const navigate = useNavigate();
  const { state, resetGame, nextTeamTurn } = useGame();
  const { correctWords, skippedWords, maxStreak, gameMode, teams, currentTeamIndex, roundNumber, selectedCategory, totalTime, remainingTime } = state;
  const { pendingToasts, recordGameResult, dismissToast } = useAchievements();
  const hasRecordedRef = useRef(false);

  const totalWords = correctWords.length + skippedWords.length;
  const percentage = totalWords > 0 ? Math.round((correctWords.length / totalWords) * 100) : 0;

  const isTeamMode = gameMode === 'team' && teams;
  const currentTeam = teams ? teams[currentTeamIndex] : null;

  // Record game result for stats and achievements (only once)
  useEffect(() => {
    if (hasRecordedRef.current) return;
    if (correctWords.length === 0 && skippedWords.length === 0) return;

    hasRecordedRef.current = true;
    const playTime = gameMode === 'endless' ? 0 : totalTime - remainingTime;

    recordGameResult({
      category: selectedCategory,
      gameMode,
      correctCount: correctWords.length,
      skippedCount: skippedWords.length,
      maxStreak,
      playTime,
    });
  }, [correctWords, skippedWords, maxStreak, gameMode, selectedCategory, totalTime, remainingTime, recordGameResult]);

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
        colors: ['#ff2d95', '#00f5ff', '#b026ff', '#39ff14', '#ffff00'],
      });

      if (percentage >= 70) {
        setTimeout(() => {
          confetti({
            particleCount: 100,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#ff2d95', '#00f5ff'],
          });
          confetti({
            particleCount: 100,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#b026ff', '#39ff14'],
          });
        }, 300);
      }
    }
  }, [correctWords.length, percentage]);

  const handlePlayAgain = () => {
    resetGame();
    navigate('/play');
  };

  const handleNextTurn = () => {
    nextTeamTurn();
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
        {/* Team Mode Scoreboard */}
        {isTeamMode && teams && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md mb-6"
          >
            <GlassCard variant="elevated" neonBorder="purple" className="p-4">
              <div className="text-center mb-3">
                <span className="text-xs text-text-muted font-display">Round {roundNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                {/* Team 1 */}
                <div className={`text-center flex-1 ${currentTeamIndex === 0 ? 'opacity-100' : 'opacity-70'}`}>
                  <div className={`text-sm font-display font-bold mb-1 ${
                    teams[0].color === 'pink' ? 'text-neon-pink' : 'text-neon-cyan'
                  }`}>
                    {teams[0].name}
                  </div>
                  <div className={`text-4xl font-mono font-bold ${
                    teams[0].color === 'pink' ? 'text-neon-pink' : 'text-neon-cyan'
                  }`}>
                    {teams[0].score}
                  </div>
                </div>

                {/* VS */}
                <div className="px-4 text-text-muted font-display font-bold">VS</div>

                {/* Team 2 */}
                <div className={`text-center flex-1 ${currentTeamIndex === 1 ? 'opacity-100' : 'opacity-70'}`}>
                  <div className={`text-sm font-display font-bold mb-1 ${
                    teams[1].color === 'pink' ? 'text-neon-pink' : 'text-neon-cyan'
                  }`}>
                    {teams[1].name}
                  </div>
                  <div className={`text-4xl font-mono font-bold ${
                    teams[1].color === 'pink' ? 'text-neon-pink' : 'text-neon-cyan'
                  }`}>
                    {teams[1].score}
                  </div>
                </div>
              </div>

              {/* Current team indicator */}
              <div className="text-center mt-3">
                <span className={`text-xs px-3 py-1 rounded-full ${
                  currentTeam?.color === 'pink'
                    ? 'bg-neon-pink/20 text-neon-pink'
                    : 'bg-neon-cyan/20 text-neon-cyan'
                }`}>
                  {currentTeam?.name} just played
                </span>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Game Over Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl font-display font-black text-neon-cyan mb-3"
        >
          {isTeamMode ? "Turn Over!" : "Game Over!"}
        </motion.h1>

        {/* Stars (non-team mode) */}
        {!isTeamMode && (
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
        )}

        {/* Score Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-6"
        >
          <div className="text-5xl sm:text-6xl font-bold font-mono text-neon-green mb-1">
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
              className="mt-2 text-sm text-neon-yellow"
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
            <h3 className="text-sm font-bold text-neon-green mb-3 flex items-center gap-2">
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
                  <span className="text-neon-green text-xs">✓</span>
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
            <h3 className="text-sm font-bold text-neon-pink mb-3 flex items-center gap-2">
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
                  <span className="text-neon-pink text-xs">✕</span>
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
          {isTeamMode ? (
            <>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleNextTurn}
                className={`flex-1 px-6 py-3 text-base font-display font-bold text-white rounded-xl shadow-lg ${
                  currentTeamIndex === 0
                    ? 'bg-neon-cyan shadow-neon-cyan/30'
                    : 'bg-neon-pink shadow-neon-pink/30'
                }`}
              >
                {teams![currentTeamIndex === 0 ? 1 : 0].name}'s Turn
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handlePlayAgain}
                className="flex-1 px-6 py-3 text-base font-bold text-text-primary bg-bg-tertiary rounded-xl
                  hover:bg-bg-quaternary transition-colors"
              >
                New Game
              </motion.button>
            </>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handlePlayAgain}
                className="flex-1 px-6 py-3 text-base font-display font-bold text-white bg-neon-purple rounded-xl
                  shadow-lg shadow-neon-purple/30"
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
            </>
          )}
        </motion.div>
      </main>

      {/* Achievement Toast */}
      <AnimatePresence>
        {pendingToasts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <button
              onClick={dismissToast}
              className="flex items-center gap-3 px-5 py-3 bg-bg-secondary border border-neon-yellow/50 rounded-xl shadow-lg shadow-neon-yellow/20"
            >
              <span className="text-3xl">{pendingToasts[0].icon}</span>
              <div className="text-left">
                <div className="text-xs text-neon-yellow font-display font-bold uppercase tracking-wider">
                  Achievement Unlocked!
                </div>
                <div className="text-sm font-bold text-text-primary">
                  {pendingToasts[0].name}
                </div>
                <div className="text-xs text-text-muted">
                  {pendingToasts[0].description}
                </div>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
