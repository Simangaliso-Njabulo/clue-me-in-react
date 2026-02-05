import { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { GameState, GameAction } from '../types/game';
import { TIMER_CONFIG } from '../types/game';

// Utility to shuffle array (Fisher-Yates)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Get next word from available words
function getNextWord(words: string[]): { word: string; remaining: string[] } {
  if (words.length === 0) {
    return { word: '', remaining: [] };
  }
  const index = Math.floor(Math.random() * words.length);
  const word = words[index];
  const remaining = words.filter((_, i) => i !== index);
  return { word, remaining };
}

const initialState: GameState = {
  status: 'idle',
  totalTime: TIMER_CONFIG.DEFAULT_TIME,
  remainingTime: TIMER_CONFIG.DEFAULT_TIME,
  categories: [],
  selectedCategory: '',
  availableWords: [],
  currentWord: '',
  correctWords: [],
  skippedWords: [],
  currentStreak: 0,
  maxStreak: 0,
  soundEnabled: true,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };

    case 'SELECT_CATEGORY': {
      const shuffled = shuffleArray(action.payload.words);
      const { word, remaining } = getNextWord(shuffled);
      return {
        ...state,
        selectedCategory: action.payload.category,
        availableWords: remaining,
        currentWord: word,
        // Reset game state when changing category
        status: 'idle',
        correctWords: [],
        skippedWords: [],
        currentStreak: 0,
        maxStreak: 0,
        remainingTime: state.totalTime,
      };
    }

    case 'START_COUNTDOWN':
      return { ...state, status: 'countdown' };

    case 'START_GAME':
      return { ...state, status: 'playing' };

    case 'PAUSE_GAME':
      return { ...state, status: 'paused' };

    case 'RESUME_GAME':
      return { ...state, status: 'playing' };

    case 'TICK': {
      if (state.remainingTime <= 1) {
        return { ...state, remainingTime: 0, status: 'ended' };
      }
      return { ...state, remainingTime: state.remainingTime - 1 };
    }

    case 'MARK_CORRECT': {
      const currentWord = state.currentWord;
      if (!currentWord) return state;

      const newStreak = state.currentStreak + 1;
      const { word: nextWord, remaining } = getNextWord(state.availableWords);

      // Check if words exhausted
      if (!nextWord && state.availableWords.length === 0) {
        return {
          ...state,
          correctWords: [...state.correctWords, currentWord],
          currentStreak: newStreak,
          maxStreak: Math.max(state.maxStreak, newStreak),
          currentWord: '',
          availableWords: [],
          status: 'ended',
        };
      }

      return {
        ...state,
        correctWords: [...state.correctWords, currentWord],
        currentWord: nextWord,
        availableWords: remaining,
        currentStreak: newStreak,
        maxStreak: Math.max(state.maxStreak, newStreak),
      };
    }

    case 'MARK_SKIPPED': {
      const currentWord = state.currentWord;
      if (!currentWord) return state;

      const { word: nextWord, remaining } = getNextWord(state.availableWords);

      // Check if words exhausted
      if (!nextWord && state.availableWords.length === 0) {
        return {
          ...state,
          skippedWords: [...state.skippedWords, currentWord],
          currentStreak: 0,
          currentWord: '',
          availableWords: [],
          status: 'ended',
        };
      }

      return {
        ...state,
        skippedWords: [...state.skippedWords, currentWord],
        currentWord: nextWord,
        availableWords: remaining,
        currentStreak: 0,
      };
    }

    case 'INCREASE_TIME': {
      const newTime = Math.min(state.totalTime + TIMER_CONFIG.TIME_INCREMENT, TIMER_CONFIG.MAX_TIME);
      return {
        ...state,
        totalTime: newTime,
        remainingTime: newTime,
      };
    }

    case 'DECREASE_TIME': {
      const newTime = Math.max(state.totalTime - TIMER_CONFIG.TIME_INCREMENT, TIMER_CONFIG.MIN_TIME);
      return {
        ...state,
        totalTime: newTime,
        remainingTime: newTime,
      };
    }

    case 'END_GAME':
      return { ...state, status: 'ended' };

    case 'RESET_GAME': {
      // Re-shuffle words for the current category if we have words
      const allWords = [...state.correctWords, ...state.skippedWords, state.currentWord, ...state.availableWords].filter(Boolean);
      const shuffled = shuffleArray(allWords);
      const { word, remaining } = getNextWord(shuffled);

      return {
        ...state,
        status: 'idle',
        remainingTime: state.totalTime,
        availableWords: remaining,
        currentWord: word,
        correctWords: [],
        skippedWords: [],
        currentStreak: 0,
        maxStreak: 0,
      };
    }

    case 'TOGGLE_SOUND':
      return { ...state, soundEnabled: !state.soundEnabled };

    default:
      return state;
  }
}

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  // Convenience methods
  selectCategory: (category: string, words: string[]) => void;
  startCountdown: () => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  toggleTimer: () => void;
  markCorrect: () => void;
  markSkipped: () => void;
  increaseTime: () => void;
  decreaseTime: () => void;
  resetGame: () => void;
  toggleSound: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const timerRef = useRef<number | null>(null);

  // Timer effect
  useEffect(() => {
    if (state.status === 'playing') {
      timerRef.current = window.setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [state.status]);

  const selectCategory = useCallback((category: string, words: string[]) => {
    dispatch({ type: 'SELECT_CATEGORY', payload: { category, words } });
  }, []);

  const startCountdown = useCallback(() => {
    dispatch({ type: 'START_COUNTDOWN' });
  }, []);

  const startGame = useCallback(() => {
    dispatch({ type: 'START_GAME' });
  }, []);

  const pauseGame = useCallback(() => {
    dispatch({ type: 'PAUSE_GAME' });
  }, []);

  const resumeGame = useCallback(() => {
    dispatch({ type: 'RESUME_GAME' });
  }, []);

  const toggleTimer = useCallback(() => {
    if (state.status === 'idle') {
      dispatch({ type: 'START_COUNTDOWN' });
    } else if (state.status === 'playing') {
      dispatch({ type: 'PAUSE_GAME' });
    } else if (state.status === 'paused') {
      dispatch({ type: 'RESUME_GAME' });
    }
  }, [state.status]);

  const markCorrect = useCallback(() => {
    dispatch({ type: 'MARK_CORRECT' });
  }, []);

  const markSkipped = useCallback(() => {
    dispatch({ type: 'MARK_SKIPPED' });
  }, []);

  const increaseTime = useCallback(() => {
    dispatch({ type: 'INCREASE_TIME' });
  }, []);

  const decreaseTime = useCallback(() => {
    dispatch({ type: 'DECREASE_TIME' });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);

  const toggleSound = useCallback(() => {
    dispatch({ type: 'TOGGLE_SOUND' });
  }, []);

  const value: GameContextValue = {
    state,
    dispatch,
    selectCategory,
    startCountdown,
    startGame,
    pauseGame,
    resumeGame,
    toggleTimer,
    markCorrect,
    markSkipped,
    increaseTime,
    decreaseTime,
    resetGame,
    toggleSound,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
