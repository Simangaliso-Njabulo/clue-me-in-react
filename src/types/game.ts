export type GameStatus = 'idle' | 'countdown' | 'playing' | 'paused' | 'ended';

export interface GameState {
  // Game status
  status: GameStatus;

  // Timer
  totalTime: number; // in seconds (30-300)
  remainingTime: number; // in seconds

  // Category & Words
  categories: string[];
  selectedCategory: string;
  availableWords: string[];
  currentWord: string;

  // Scoring
  correctWords: string[];
  skippedWords: string[];
  currentStreak: number;
  maxStreak: number;

  // Settings
  soundEnabled: boolean;
}

export type GameAction =
  | { type: 'SET_CATEGORIES'; payload: string[] }
  | { type: 'SELECT_CATEGORY'; payload: { category: string; words: string[] } }
  | { type: 'START_COUNTDOWN' }
  | { type: 'START_GAME' }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'TICK' }
  | { type: 'MARK_CORRECT' }
  | { type: 'MARK_SKIPPED' }
  | { type: 'INCREASE_TIME' }
  | { type: 'DECREASE_TIME' }
  | { type: 'END_GAME' }
  | { type: 'RESET_GAME' }
  | { type: 'TOGGLE_SOUND' };

export interface WordsData {
  [category: string]: string[];
}

export const TIMER_CONFIG = {
  DEFAULT_TIME: 60,
  MIN_TIME: 30,
  MAX_TIME: 300,
  TIME_INCREMENT: 30,
} as const;

export const CATEGORY_ICONS: Record<string, string> = {
  // Standard categories
  'Music': '🎵',
  'TV shows': '📺',
  'Sport Teams': '🏆',
  'Celebrities': '⭐',
  'Food': '🍕',
  'Name Brands': '🏷️',
  'Act It Out': '🎭',
  'Alcohol': '🍻',
  // Mzansi categories
  'Local Foods': '🍲',
  'South African Music Genres': '🎤',
  'Popular Local TV Shows': '📺',
  'South African Sport Teams': '⚽',
  'Local Celebrities': '🌟',
  'South African Slang/Phrases': '💬',
  'Local Brands': '🛒',
};
