import { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { GameState, GameAction, GameMode, Difficulty, Team, WordPack } from '../types/game';
import { TIMER_CONFIG, GAME_MODES } from '../types/game';

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

// Get default time for a game mode
function getDefaultTimeForMode(mode: GameMode): number {
  const modeConfig = GAME_MODES.find(m => m.id === mode);
  return modeConfig?.defaultTime ?? TIMER_CONFIG.DEFAULT_TIME;
}

const initialState: GameState = {
  status: 'idle',
  wordPack: 'mzansi',
  gameMode: 'classic',
  difficulty: 'all',
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
  skipCount: 0,
  teams: null,
  currentTeamIndex: 0,
  roundNumber: 1,
  soundEnabled: true,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_WORD_PACK':
      return {
        ...state,
        wordPack: action.payload,
        // Reset category/word state when switching packs
        categories: [],
        selectedCategory: '',
        availableWords: [],
        currentWord: '',
        correctWords: [],
        skippedWords: [],
        currentStreak: 0,
        maxStreak: 0,
        skipCount: 0,
        status: 'idle',
      };

    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };

    case 'SET_GAME_MODE': {
      const newTime = getDefaultTimeForMode(action.payload);
      return {
        ...state,
        gameMode: action.payload,
        totalTime: newTime,
        remainingTime: newTime,
        // Reset teams if not team mode
        teams: action.payload === 'team' ? state.teams : null,
        skipCount: 0,
      };
    }

    case 'SET_DIFFICULTY':
      return { ...state, difficulty: action.payload };

    case 'SET_TEAMS': {
      const teams: [Team, Team] = [
        { name: action.payload.team1Name || 'Team 1', score: 0, color: 'pink' },
        { name: action.payload.team2Name || 'Team 2', score: 0, color: 'cyan' },
      ];
      return { ...state, teams, currentTeamIndex: 0, roundNumber: 1 };
    }

    case 'NEXT_TEAM_TURN': {
      if (!state.teams) return state;
      const nextIndex = state.currentTeamIndex === 0 ? 1 : 0;
      const newRound = nextIndex === 0 ? state.roundNumber + 1 : state.roundNumber;
      return {
        ...state,
        currentTeamIndex: nextIndex,
        roundNumber: newRound,
        status: 'idle',
        remainingTime: state.totalTime,
        correctWords: [],
        skippedWords: [],
        currentStreak: 0,
      };
    }

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
        skipCount: 0,
        remainingTime: state.totalTime,
      };
    }

    case 'START_COUNTDOWN':
      return { ...state, status: 'countdown' };

    case 'START_GAME':
      return { ...state, status: 'playing' };

    case 'PAUSE_GAME':
      // Can't pause endless mode
      if (state.gameMode === 'endless') return state;
      return { ...state, status: 'paused' };

    case 'RESUME_GAME':
      return { ...state, status: 'playing' };

    case 'TICK': {
      // Endless mode has no timer
      if (state.gameMode === 'endless') return state;

      if (state.remainingTime <= 1) {
        // Update team score if in team mode
        if (state.teams && state.gameMode === 'team') {
          const updatedTeams = [...state.teams] as [Team, Team];
          updatedTeams[state.currentTeamIndex] = {
            ...updatedTeams[state.currentTeamIndex],
            score: updatedTeams[state.currentTeamIndex].score + state.correctWords.length,
          };
          return { ...state, remainingTime: 0, status: 'ended', teams: updatedTeams };
        }
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
        // Update team score if in team mode
        let updatedTeams = state.teams;
        if (state.teams && state.gameMode === 'team') {
          updatedTeams = [...state.teams] as [Team, Team];
          updatedTeams[state.currentTeamIndex] = {
            ...updatedTeams[state.currentTeamIndex],
            score: updatedTeams[state.currentTeamIndex].score + state.correctWords.length + 1,
          };
        }
        return {
          ...state,
          correctWords: [...state.correctWords, currentWord],
          currentStreak: newStreak,
          maxStreak: Math.max(state.maxStreak, newStreak),
          currentWord: '',
          availableWords: [],
          status: 'ended',
          teams: updatedTeams,
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

      const newSkipCount = state.skipCount + 1;
      const { word: nextWord, remaining } = getNextWord(state.availableWords);

      // Endless mode: end after 3 skips
      if (state.gameMode === 'endless' && newSkipCount >= 3) {
        return {
          ...state,
          skippedWords: [...state.skippedWords, currentWord],
          currentStreak: 0,
          skipCount: newSkipCount,
          status: 'ended',
        };
      }

      // Check if words exhausted
      if (!nextWord && state.availableWords.length === 0) {
        // Update team score if in team mode
        let updatedTeams = state.teams;
        if (state.teams && state.gameMode === 'team') {
          updatedTeams = [...state.teams] as [Team, Team];
          updatedTeams[state.currentTeamIndex] = {
            ...updatedTeams[state.currentTeamIndex],
            score: updatedTeams[state.currentTeamIndex].score + state.correctWords.length,
          };
        }
        return {
          ...state,
          skippedWords: [...state.skippedWords, currentWord],
          currentStreak: 0,
          currentWord: '',
          availableWords: [],
          status: 'ended',
          skipCount: newSkipCount,
          teams: updatedTeams,
        };
      }

      return {
        ...state,
        skippedWords: [...state.skippedWords, currentWord],
        currentWord: nextWord,
        availableWords: remaining,
        currentStreak: 0,
        skipCount: newSkipCount,
      };
    }

    case 'INCREASE_TIME': {
      // Can't adjust time in speed or endless mode
      const modeConfig = GAME_MODES.find(m => m.id === state.gameMode);
      if (!modeConfig?.allowTimeAdjust) return state;

      const newTime = Math.min(state.totalTime + TIMER_CONFIG.TIME_INCREMENT, TIMER_CONFIG.MAX_TIME);
      return {
        ...state,
        totalTime: newTime,
        remainingTime: newTime,
      };
    }

    case 'DECREASE_TIME': {
      // Can't adjust time in speed or endless mode
      const modeConfig = GAME_MODES.find(m => m.id === state.gameMode);
      if (!modeConfig?.allowTimeAdjust) return state;

      const newTime = Math.max(state.totalTime - TIMER_CONFIG.TIME_INCREMENT, TIMER_CONFIG.MIN_TIME);
      return {
        ...state,
        totalTime: newTime,
        remainingTime: newTime,
      };
    }

    case 'END_GAME': {
      // Update team score if in team mode
      if (state.teams && state.gameMode === 'team') {
        const updatedTeams = [...state.teams] as [Team, Team];
        updatedTeams[state.currentTeamIndex] = {
          ...updatedTeams[state.currentTeamIndex],
          score: updatedTeams[state.currentTeamIndex].score + state.correctWords.length,
        };
        return { ...state, status: 'ended', teams: updatedTeams };
      }
      return { ...state, status: 'ended' };
    }

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
        skipCount: 0,
      };
    }

    case 'RESTART_GAME': {
      // Restart with only unplayed words (exclude already shown ones)
      const freshWords = [state.currentWord, ...state.availableWords].filter(Boolean);
      const shuffled = shuffleArray(freshWords);
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
        skipCount: 0,
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
  setWordPack: (pack: WordPack) => void;
  selectCategory: (category: string, words: string[]) => void;
  setGameMode: (mode: GameMode) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setTeams: (team1Name: string, team2Name: string) => void;
  nextTeamTurn: () => void;
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
  restartGame: () => void;
  toggleSound: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const timerRef = useRef<number | null>(null);

  // Timer effect - only for timed modes
  useEffect(() => {
    if (state.status === 'playing' && state.gameMode !== 'endless') {
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
  }, [state.status, state.gameMode]);

  const setWordPack = useCallback((pack: WordPack) => {
    dispatch({ type: 'SET_WORD_PACK', payload: pack });
  }, []);

  const selectCategory = useCallback((category: string, words: string[]) => {
    dispatch({ type: 'SELECT_CATEGORY', payload: { category, words } });
  }, []);

  const setGameMode = useCallback((mode: GameMode) => {
    dispatch({ type: 'SET_GAME_MODE', payload: mode });
  }, []);

  const setDifficulty = useCallback((difficulty: Difficulty) => {
    dispatch({ type: 'SET_DIFFICULTY', payload: difficulty });
  }, []);

  const setTeams = useCallback((team1Name: string, team2Name: string) => {
    dispatch({ type: 'SET_TEAMS', payload: { team1Name, team2Name } });
  }, []);

  const nextTeamTurn = useCallback(() => {
    dispatch({ type: 'NEXT_TEAM_TURN' });
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

  const restartGame = useCallback(() => {
    dispatch({ type: 'RESTART_GAME' });
  }, []);

  const toggleSound = useCallback(() => {
    dispatch({ type: 'TOGGLE_SOUND' });
  }, []);

  const value: GameContextValue = {
    state,
    dispatch,
    setWordPack,
    selectCategory,
    setGameMode,
    setDifficulty,
    setTeams,
    nextTeamTurn,
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
    restartGame,
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
