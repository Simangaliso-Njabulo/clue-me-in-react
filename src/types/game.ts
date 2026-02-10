export type GameStatus = 'idle' | 'countdown' | 'playing' | 'paused' | 'ended';

// Word Packs
export type WordPack = 'mzansi' | 'general' | 'industry' | 'bible' | 'kids';

export interface WordPackConfig {
  id: WordPack;
  name: string;
  description: string;
  icon: string;
  jsonFile: string;
}

export const WORD_PACKS: WordPackConfig[] = [
  {
    id: 'mzansi',
    name: 'Mzansi',
    description: 'South African vibes',
    icon: 'map-pin',
    jsonFile: './data/mzansi-words.json',
  },
  {
    id: 'general',
    name: 'General',
    description: 'International pop culture',
    icon: 'globe',
    jsonFile: './data/general-words.json',
  },
  {
    id: 'industry',
    name: 'Industry',
    description: 'IT, Medical, Legal & more',
    icon: 'briefcase',
    jsonFile: './data/industry-words.json',
  },
  {
    id: 'bible',
    name: 'Bible',
    description: 'Biblical knowledge',
    icon: 'book-open',
    jsonFile: './data/bible-words.json',
  },
  {
    id: 'kids',
    name: 'Kids',
    description: 'Family-friendly fun',
    icon: 'smile',
    jsonFile: './data/kids-words.json',
  },
];

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
    icon: 'clock',
    defaultTime: 60,
    allowTimeAdjust: true,
  },
  {
    id: 'speed',
    name: 'Speed Round',
    description: '30 seconds of pure chaos',
    icon: 'zap',
    defaultTime: 30,
    allowTimeAdjust: false,
  },
  {
    id: 'endless',
    name: 'Endless',
    description: 'Play until you skip 3 times',
    icon: 'infinity',
    defaultTime: 0, // No timer
    allowTimeAdjust: false,
  },
  {
    id: 'team',
    name: 'Team Battle',
    description: 'Teams alternate each round',
    icon: 'users',
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

  // Word pack
  wordPack: WordPack;

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
  | { type: 'SET_WORD_PACK'; payload: WordPack }
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
  | { type: 'RESTART_GAME' }
  | { type: 'CLEAR_CATEGORY' }
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
  'Music': 'music',
  'TV shows': 'tv',
  'Sport Teams': 'trophy',
  'Celebrities': 'star',
  'Food': 'utensils',
  'Name Brands': 'tag',
  'Act It Out': 'drama',
  'Alcohol': 'wine',
  // Mzansi categories
  'Local Foods': 'cooking-pot',
  'SA Music Genres': 'mic',
  'Popular Local TV Shows': 'tv',
  'SA Sport Teams': 'trophy',
  'Local Celebrities': 'sparkles',
  'Mzansi Slang': 'message-circle',
  'Local Brands': 'shopping-cart',
  'SA Places & Landmarks': 'map',
  'Mzansi Dances': 'disc',
  // Industry categories
  'IT & Tech': 'monitor',
  'Medical': 'stethoscope',
  'Accounting & Finance': 'bar-chart',
  'Engineering': 'settings',
  'Legal': 'scale',
  'Education': 'graduation-cap',
  // Bible categories
  'Bible Characters': 'user',
  'Bible Stories': 'scroll',
  'Books of the Bible': 'book-marked',
  'Bible Places': 'landmark',
  'Bible Objects & Symbols': 'church',
  'Parables': 'bird',
  // Kids categories
  'Animals': 'paw-print',
  'Cartoons & Characters': 'film',
  'Superheroes': 'shield',
  'Toys & Games': 'gamepad',
  'Food Kids Love': 'ice-cream',
  'School Things': 'backpack',
};
