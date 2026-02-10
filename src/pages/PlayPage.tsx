import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { useSound } from '../context/SoundContext';
import { Icon } from '../components/ui/Icon';
import { Timer } from '../components/game/Timer';
import { WordCard } from '../components/game/WordCard';
import { ActionButtons } from '../components/game/ActionButtons';
import { ScoreDisplay } from '../components/game/ScoreDisplay';
import { CountdownOverlay } from '../components/CountdownOverlay';
import { loadWordPack } from '../services/wordsService';
import { CATEGORY_ICONS } from '../types/game';
import type { WordsData } from '../types/game';

export function PlayPage() {
  const navigate = useNavigate();
  const { state, dispatch, selectCategory, startCountdown, pauseGame, resumeGame, restartGame } = useGame();
  const { play } = useSound();
  const [words, setWords] = useState<WordsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState(1);
  const hasPlayedThisSession = useRef(false);

  const isPlaying = state.status === 'playing';
  const isPaused = state.status === 'paused';
  const isIdle = state.status === 'idle';
  const hasCategory = !!state.selectedCategory;
  const canStart = isIdle && !!state.currentWord;
  const canChangeCategory = isIdle;

  // Reset category on mount so user always picks fresh
  useEffect(() => {
    dispatch({ type: 'CLEAR_CATEGORY' });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- only on mount

  // Track when the game actually starts playing this session
  useEffect(() => {
    if (state.status === 'playing') {
      hasPlayedThisSession.current = true;
    }
  }, [state.status]);

  // Load words when pack changes
  useEffect(() => {
    loadWordPack(state.wordPack)
      .then((data) => {
        setWords(data);
        dispatch({ type: 'SET_CATEGORIES', payload: Object.keys(data) });
      })
      .catch((error) => {
        console.error('Failed to load words:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch, state.wordPack]);

  // Navigate to results when game ends during this session
  useEffect(() => {
    if (state.status === 'ended' && hasPlayedThisSession.current) {
      play('gameOver');
      const timeout = setTimeout(() => {
        navigate('/results');
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [state.status, navigate, play]);

  // Play sounds based on timer state
  useEffect(() => {
    if (state.status !== 'playing' || state.remainingTime <= 0) return;

    if (state.remainingTime <= 5) {
      play('warning');
    } else if (state.remainingTime <= 10) {
      play('tick');
    }
  }, [state.remainingTime, state.status, play]);

  // Play card flip sound when word changes
  useEffect(() => {
    if (state.currentWord && state.status === 'playing') {
      play('cardFlip');
    }
  }, [state.currentWord, state.status, play]);

  const handleCategorySelect = useCallback((category: string) => {
    if (!words || !category || !words[category]) return;
    selectCategory(category, words[category]);
  }, [words, selectCategory]);

  const handleChangeCategory = useCallback(() => {
    if (!canChangeCategory) return;
    // Clear category to go back to selection screen
    dispatch({ type: 'SELECT_CATEGORY', payload: { category: '', words: [] } });
  }, [canChangeCategory, dispatch]);

  const handleCorrect = useCallback(() => {
    setDirection(1);
  }, []);

  const handleSkip = useCallback(() => {
    setDirection(-1);
  }, []);

  // Handle swipe gestures
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    (e.currentTarget as any).touchStartX = touch.clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const touchStartX = (e.currentTarget as any).touchStartX;
    const touch = e.changedTouches[0];
    const diff = touch.clientX - touchStartX;

    if (state.status !== 'playing' || !state.currentWord) return;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setDirection(1);
        play('correct');
        dispatch({ type: 'MARK_CORRECT' });
      } else {
        setDirection(-1);
        play('skip');
        dispatch({ type: 'MARK_SKIPPED' });
      }
    }
  }, [state.status, state.currentWord, play, dispatch]);

  if (loading) {
    return (
      <div className="play-loading">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!words) {
    return (
      <div className="play-error">
        <p className="play-error-text">Failed to load words</p>
        <Link to="/" className="btn btn-primary">Go Home</Link>
      </div>
    );
  }

  const categories = Object.keys(words);

  return (
    <div className="play-page">
      <CountdownOverlay />

      {/* Header */}
      <header className="play-header">
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="play-back-btn"
          >
            <Icon name="chevron-left" size={18} />
            <span className="hidden sm:inline">Back</span>
          </motion.button>
        </Link>

        <div className="play-header-right">
          {/* Category chip when a category is selected */}
          {hasCategory && (
            <button
              className={`play-category-chip ${!canChangeCategory ? 'play-category-chip--disabled' : ''}`}
              onClick={handleChangeCategory}
              disabled={!canChangeCategory}
              title={canChangeCategory ? 'Change category' : ''}
            >
              <Icon name={CATEGORY_ICONS[state.selectedCategory] || 'help-circle'} size={16} />
              <span>{state.selectedCategory}</span>
            </button>
          )}

          {/* Pause / Resume button in header during gameplay */}
          <AnimatePresence>
            {isPlaying && state.gameMode !== 'endless' && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileTap={{ scale: 0.9 }}
                onClick={pauseGame}
                className="play-pause-btn"
                title="Pause game"
              >
                <Icon name="pause" size={18} />
              </motion.button>
            )}
            {isPaused && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileTap={{ scale: 0.9 }}
                onClick={resumeGame}
                className="play-resume-btn"
                title="Resume game"
              >
                <Icon name="play" size={18} />
              </motion.button>
            )}
          </AnimatePresence>

          <ScoreDisplay />
        </div>
      </header>

      {/* Category Selection Screen */}
      {!hasCategory && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="play-category-screen"
        >
          <h2 className="play-category-title">Choose a Category</h2>
          <div className="play-category-grid">
            {categories.map((category, index) => {
              const icon = CATEGORY_ICONS[category] || 'help-circle';
              return (
                <motion.button
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCategorySelect(category)}
                  className="play-category-card"
                >
                  <span className="play-category-card-icon"><Icon name={icon} size={28} /></span>
                  <span className="play-category-card-name">{category}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Game Area (shown after category is selected) */}
      {hasCategory && (
        <main
          className="play-main"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Timer + Word Card */}
          <div className="play-game-area">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="play-timer-wrapper"
            >
              <Timer />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="play-word-wrapper"
            >
              <WordCard direction={direction} />
            </motion.div>
          </div>

          {/* Bottom: Start Button or Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="play-actions-wrapper"
          >
            {/* Start Round + Restart when idle */}
            {canStart && (
              <div className="play-idle-actions">
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startCountdown}
                  className="play-start-btn"
                >
                  Start Round
                </motion.button>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={restartGame}
                  className="play-restart-btn"
                >
                  Restart
                </motion.button>
              </div>
            )}

            {/* Paused: Resume + Restart */}
            {isPaused && (
              <div className="play-paused-actions">
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resumeGame}
                  className="play-resume-big-btn"
                >
                  Resume
                </motion.button>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={restartGame}
                  className="play-restart-btn"
                >
                  Restart
                </motion.button>
              </div>
            )}

            {/* Action buttons during play */}
            {isPlaying && (
              <>
                <ActionButtons onCorrect={handleCorrect} onSkip={handleSkip} />
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  className="play-swipe-hint sm:hidden"
                >
                  Swipe right = correct, left = skip
                </motion.p>
              </>
            )}
          </motion.div>
        </main>
      )}
    </div>
  );
}
