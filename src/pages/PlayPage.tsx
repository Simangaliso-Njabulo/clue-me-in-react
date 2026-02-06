import { motion } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { useSound } from '../context/SoundContext';
import { Timer } from '../components/game/Timer';
import { WordCard } from '../components/game/WordCard';
import { CategorySelector } from '../components/game/CategorySelector';
import { ActionButtons } from '../components/game/ActionButtons';
import { ScoreDisplay } from '../components/game/ScoreDisplay';
import { CountdownOverlay } from '../components/CountdownOverlay';
import { loadAllWords } from '../services/wordsService';
import type { WordsData } from '../types/game';

export function PlayPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const { play } = useSound();
  const [words, setWords] = useState<WordsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState(1);

  // Load words on mount
  useEffect(() => {
    loadAllWords()
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
  }, [dispatch]);

  // Navigate to results when game ends
  useEffect(() => {
    if (state.status === 'ended') {
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

    // Warning sound at 5 seconds or less
    if (state.remainingTime <= 5) {
      play('warning');
    } else if (state.remainingTime <= 10) {
      // Tick sound at 10 seconds or less
      play('tick');
    }
  }, [state.remainingTime, state.status, play]);

  // Play card flip sound when word changes
  useEffect(() => {
    if (state.currentWord && state.status === 'playing') {
      play('cardFlip');
    }
  }, [state.currentWord, state.status, play]);

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
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!words) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-xl text-text-secondary">Failed to load words</p>
        <Link to="/" className="btn btn-primary">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-screen flex flex-col overflow-hidden">
      <CountdownOverlay />

      {/* Header - Fixed height */}
      <header className="flex-shrink-0 px-4 sm:px-6 py-4 flex items-center justify-between border-b border-white/5">
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-tertiary/50 hover:bg-bg-tertiary text-text-secondary hover:text-text-primary transition-colors"
          >
            <span>←</span>
            <span className="hidden sm:inline">Back</span>
          </motion.button>
        </Link>

        <ScoreDisplay />
      </header>

      {/* Main Game Area - Flex grow to fill remaining space */}
      <main
        className="flex-1 flex flex-col items-center justify-between px-4 sm:px-6 py-6 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Top Section: Category */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm flex-shrink-0"
        >
          <CategorySelector words={words} compact />
        </motion.div>

        {/* Center Section: Timer + Word Card */}
        <div className="flex-1 flex flex-col items-center justify-center gap-6 w-full py-4 min-h-0">
          {/* Timer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex-shrink-0"
          >
            <Timer />
          </motion.div>

          {/* Word Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-2xl flex-shrink min-h-0"
          >
            <WordCard direction={direction} />
          </motion.div>
        </div>

        {/* Bottom Section: Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex-shrink-0 pb-2"
        >
          <ActionButtons onCorrect={handleCorrect} onSkip={handleSkip} />

          {/* Swipe hint for mobile */}
          {state.status === 'playing' && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              className="text-xs text-text-muted text-center mt-3 sm:hidden"
            >
              Swipe right = correct, left = skip
            </motion.p>
          )}
        </motion.div>
      </main>
    </div>
  );
}
