import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useGame } from '../context/GameContext';
import { GlassCard } from '../components/ui/GlassCard';
import { Icon } from '../components/ui/Icon';
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
        colors: ['#38bdf8', '#7dd3fc', '#34d399', '#f472b6', '#fbbf24'],
      });

      if (percentage >= 70) {
        setTimeout(() => {
          confetti({
            particleCount: 100,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#38bdf8', '#34d399'],
          });
          confetti({
            particleCount: 100,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#7dd3fc', '#fbbf24'],
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
    <div className="results-page">
      {/* Main Content */}
      <main className="results-main">
        {/* Team Mode Scoreboard */}
        {isTeamMode && teams && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="results-team-scoreboard"
          >
            <GlassCard variant="elevated" neonBorder="purple" className="p-4">
              <div className="results-team-round">
                Round {roundNumber}
              </div>
              <div className="results-team-scores">
                {/* Team 1 */}
                <div className={`results-team ${currentTeamIndex === 0 ? 'results-team--active' : 'results-team--inactive'}`}>
                  <div className={`results-team-name ${
                    teams[0].color === 'pink' ? 'text-neon-pink' : 'text-neon-blue'
                  }`}>
                    {teams[0].name}
                  </div>
                  <div className={`results-team-score ${
                    teams[0].color === 'pink' ? 'text-neon-pink' : 'text-neon-blue'
                  }`}>
                    {teams[0].score}
                  </div>
                </div>

                {/* VS */}
                <div className="results-team-vs">VS</div>

                {/* Team 2 */}
                <div className={`results-team ${currentTeamIndex === 1 ? 'results-team--active' : 'results-team--inactive'}`}>
                  <div className={`results-team-name ${
                    teams[1].color === 'pink' ? 'text-neon-pink' : 'text-neon-blue'
                  }`}>
                    {teams[1].name}
                  </div>
                  <div className={`results-team-score ${
                    teams[1].color === 'pink' ? 'text-neon-pink' : 'text-neon-blue'
                  }`}>
                    {teams[1].score}
                  </div>
                </div>
              </div>

              {/* Current team indicator */}
              <div className="results-team-indicator">
                <span className={`results-team-badge ${
                  currentTeam?.color === 'pink'
                    ? 'bg-neon-pink/20 text-neon-pink'
                    : 'bg-neon-blue/20 text-neon-blue'
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
          className="results-title"
        >
          {isTeamMode ? "Turn Over!" : "Game Over!"}
        </motion.h1>

        {/* Stars (non-team mode) */}
        {!isTeamMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, type: 'spring' }}
            className="results-stars"
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
                className="results-star"
              >
                <Icon name="star" size={28} className={star <= stars ? 'text-neon-yellow' : 'text-text-muted'} />
              </motion.span>
            ))}
          </motion.div>
        )}

        {/* Score Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="results-score-section"
        >
          <div className="results-score-number">
            {correctWords.length}
          </div>
          <p className="results-score-text">
            correct out of {totalWords} ({percentage}%)
          </p>
          {maxStreak >= 3 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="results-streak"
            >
              <Icon name="flame" size={16} className="inline-block align-middle mr-1" /> Best streak: {maxStreak} in a row!
            </motion.p>
          )}
        </motion.div>

        {/* Word Lists */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="results-word-lists"
        >
          {/* Correct Words */}
          <div className="results-word-card">
            <h3 className="results-word-card-title results-word-card-title--correct">
              <Icon name="check" size={16} /> Correct ({correctWords.length})
            </h3>
            <ul className="results-word-list">
              {correctWords.map((word, index) => (
                <motion.li
                  key={word + index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.02 }}
                  className="results-word-item"
                >
                  <span className="results-word-icon--correct"><Icon name="check" size={12} /></span>
                  <span className="results-word-name">{word}</span>
                </motion.li>
              ))}
              {correctWords.length === 0 && (
                <li className="results-word-empty">No correct words</li>
              )}
            </ul>
          </div>

          {/* Skipped Words */}
          <div className="results-word-card">
            <h3 className="results-word-card-title results-word-card-title--skipped">
              <Icon name="x" size={16} /> Skipped ({skippedWords.length})
            </h3>
            <ul className="results-word-list">
              {skippedWords.map((word, index) => (
                <motion.li
                  key={word + index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.02 }}
                  className="results-word-item"
                >
                  <span className="results-word-icon--skipped"><Icon name="x" size={12} /></span>
                  <span className="results-word-name">{word}</span>
                </motion.li>
              ))}
              {skippedWords.length === 0 && (
                <li className="results-word-empty">No skipped words</li>
              )}
            </ul>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="results-actions"
        >
          {isTeamMode ? (
            <>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleNextTurn}
                className={`results-btn-team ${
                  currentTeamIndex === 0
                    ? 'bg-neon-blue shadow-lg shadow-neon-blue/30'
                    : 'bg-neon-pink shadow-lg shadow-neon-pink/30'
                }`}
              >
                {teams![currentTeamIndex === 0 ? 1 : 0].name}'s Turn
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handlePlayAgain}
                className="results-btn-secondary"
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
                className="results-btn-primary"
              >
                Play Again
              </motion.button>

              <Link to="/" className="w-full">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="results-btn-secondary w-full"
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
            className="results-toast"
          >
            <button
              onClick={dismissToast}
              className="results-toast-btn"
            >
              <span className="results-toast-icon"><Icon name={pendingToasts[0].icon} size={28} /></span>
              <div className="results-toast-content">
                <div className="results-toast-label">
                  Achievement Unlocked!
                </div>
                <div className="results-toast-name">
                  {pendingToasts[0].name}
                </div>
                <div className="results-toast-desc">
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
