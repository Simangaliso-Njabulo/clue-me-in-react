export type GameStatus = 'idle' | 'countdown' | 'playing' | 'paused' | 'ended';

// Game Modes
export type GameMode = 'classic' | 'speed' | 'endless' | 'team';

export interface GameModeConfig {
  id: GameMode;
  name: string;
  description: string;
  icon: string;
  defaultTime: number;
  allowTimeAdjust: boolean;
}

export const GAME_MODES: GameModeConfig[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Race against the clock',
    icon: '⏱️',
    defaultTime: 60,
    allowTimeAdjust: true,
  },
  {
    id: 'speed',
    name: 'Speed Round',
    description: '30 seconds of pure chaos',
    icon: '⚡',
    defaultTime: 30,
    allowTimeAdjust: false,
  },
  {
    id: 'endless',
    name: 'Endless',
    description: 'Play until you skip 3 times',
    icon: '♾️',
    defaultTime: 0, // No timer
    allowTimeAdjust: false,
  },
  {
    id: 'team',
    name: 'Team Battle',
    description: 'Teams alternate each round',
    icon: '👥',
    defaultTime: 60,
    allowTimeAdjust: true,
  },
];

// Difficulty Levels
export type Difficulty = 'easy' | 'medium' | 'hard' | 'all';

export interface DifficultyConfig {
  id: Difficulty;
  name: string;
  color: string;
}

export const DIFFICULTY_LEVELS: DifficultyConfig[] = [
  { id: 'all', name: 'All', color: 'neon-purple' },
  { id: 'easy', name: 'Easy', color: 'neon-green' },
  { id: 'medium', name: 'Medium', color: 'neon-yellow' },
  { id: 'hard', name: 'Hard', color: 'neon-pink' },
];

// Team Battle
export interface Team {
  name: string;
  score: number;
  color: 'pink' | 'cyan';
}

export interface GameState {
  // Game status
  status: GameStatus;

  // Game mode
  gameMode: GameMode;
  difficulty: Difficulty;

  // Timer
  totalTime: number; // in seconds (30-300, or 0 for endless)
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

  // Endless mode
  skipCount: number; // For endless mode - ends at 3

  // Team Battle
  teams: [Team, Team] | null;
  currentTeamIndex: number; // 0 or 1
  roundNumber: number;

  // Settings
  soundEnabled: boolean;
}

export type GameAction =
  | { type: 'SET_CATEGORIES'; payload: string[] }
  | { type: 'SELECT_CATEGORY'; payload: { category: string; words: string[] } }
  | { type: 'SET_GAME_MODE'; payload: GameMode }
  | { type: 'SET_DIFFICULTY'; payload: Difficulty }
  | { type: 'SET_TEAMS'; payload: { team1Name: string; team2Name: string } }
  | { type: 'NEXT_TEAM_TURN' }
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
