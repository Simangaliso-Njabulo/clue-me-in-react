// Storage Service - Manages persistent game data in localStorage

const STORAGE_KEY = 'wordzapp_progress';

// Statistics tracked across all games
export interface GameStats {
  totalGamesPlayed: number;
  totalWordsGuessed: number;
  totalWordsSkipped: number;
  bestStreak: number;
  perfectGames: number; // 100% accuracy (no skips, 5+ correct)
  totalPlayTime: number; // in seconds
}

// High score entry for a category
export interface HighScoreEntry {
  score: number;
  streak: number;
  accuracy: number; // percentage
  date: string; // ISO string
  gameMode: string;
}

// Achievement definition
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: string;
}

// Full saved progress structure
export interface SavedProgress {
  stats: GameStats;
  highScores: Record<string, HighScoreEntry>;
  achievements: string[]; // unlocked achievement IDs
  lastPlayed: string | null; // ISO date string
}

// Default empty progress
const DEFAULT_PROGRESS: SavedProgress = {
  stats: {
    totalGamesPlayed: 0,
    totalWordsGuessed: 0,
    totalWordsSkipped: 0,
    bestStreak: 0,
    perfectGames: 0,
    totalPlayTime: 0,
  },
  highScores: {},
  achievements: [],
  lastPlayed: null,
};

// Achievement definitions
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_game',
    name: 'First Timer',
    description: 'Complete your first game',
    icon: '🎮',
    criteria: 'Play 1 game',
  },
  {
    id: 'streak_5',
    name: 'On Fire',
    description: 'Get a 5-word streak',
    icon: '🔥',
    criteria: 'Streak = 5',
  },
  {
    id: 'streak_10',
    name: 'Unstoppable',
    description: 'Get a 10-word streak',
    icon: '💥',
    criteria: 'Streak = 10',
  },
  {
    id: 'perfect_game',
    name: 'Perfectionist',
    description: '100% accuracy with 5+ words',
    icon: '✨',
    criteria: '0 skips, 5+ correct',
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: '10+ words in Speed Round',
    icon: '⚡',
    criteria: 'Score 10+ in speed mode',
  },
  {
    id: 'word_wizard_100',
    name: 'Word Wizard',
    description: 'Guess 100 total words',
    icon: '🧙',
    criteria: 'Total correct = 100',
  },
  {
    id: 'word_wizard_500',
    name: 'Word Master',
    description: 'Guess 500 total words',
    icon: '🏆',
    criteria: 'Total correct = 500',
  },
  {
    id: 'party_starter',
    name: 'Party Starter',
    description: 'Play 10 games',
    icon: '🎉',
    criteria: 'Games = 10',
  },
  {
    id: 'party_animal',
    name: 'Party Animal',
    description: 'Play 50 games',
    icon: '🦁',
    criteria: 'Games = 50',
  },
  {
    id: 'endless_master',
    name: 'Endless Master',
    description: 'Score 20+ in Endless mode',
    icon: '♾️',
    criteria: 'Score 20+ in endless mode',
  },
  {
    id: 'team_player',
    name: 'Team Player',
    description: 'Complete a Team Battle game',
    icon: '👥',
    criteria: 'Play team mode',
  },
];

// Load progress from localStorage
export function loadProgress(): SavedProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { ...DEFAULT_PROGRESS };
    }
    const parsed = JSON.parse(stored) as SavedProgress;
    // Merge with defaults to handle new fields
    return {
      stats: { ...DEFAULT_PROGRESS.stats, ...parsed.stats },
      highScores: parsed.highScores ?? {},
      achievements: parsed.achievements ?? [],
      lastPlayed: parsed.lastPlayed ?? null,
    };
  } catch {
    console.error('Failed to load progress from localStorage');
    return { ...DEFAULT_PROGRESS };
  }
}

// Save progress to localStorage
export function saveProgress(progress: SavedProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    console.error('Failed to save progress to localStorage');
  }
}

// Update stats after a game ends
export interface GameResult {
  category: string;
  gameMode: string;
  correctCount: number;
  skippedCount: number;
  maxStreak: number;
  playTime: number; // seconds
}

export function updateStatsAfterGame(result: GameResult): { progress: SavedProgress; newAchievements: string[] } {
  const progress = loadProgress();
  const newAchievements: string[] = [];

  // Update stats
  progress.stats.totalGamesPlayed += 1;
  progress.stats.totalWordsGuessed += result.correctCount;
  progress.stats.totalWordsSkipped += result.skippedCount;
  progress.stats.totalPlayTime += result.playTime;

  // Update best streak
  if (result.maxStreak > progress.stats.bestStreak) {
    progress.stats.bestStreak = result.maxStreak;
  }

  // Check for perfect game (no skips, 5+ correct)
  if (result.skippedCount === 0 && result.correctCount >= 5) {
    progress.stats.perfectGames += 1;
  }

  // Update high score for category
  const accuracy = result.correctCount + result.skippedCount > 0
    ? Math.round((result.correctCount / (result.correctCount + result.skippedCount)) * 100)
    : 0;

  const currentHighScore = progress.highScores[result.category];
  if (!currentHighScore || result.correctCount > currentHighScore.score) {
    progress.highScores[result.category] = {
      score: result.correctCount,
      streak: result.maxStreak,
      accuracy,
      date: new Date().toISOString(),
      gameMode: result.gameMode,
    };
  }

  // Update last played
  progress.lastPlayed = new Date().toISOString();

  // Check for new achievements
  const unlocked = progress.achievements;

  // First game
  if (!unlocked.includes('first_game')) {
    newAchievements.push('first_game');
  }

  // Streak achievements
  if (result.maxStreak >= 5 && !unlocked.includes('streak_5')) {
    newAchievements.push('streak_5');
  }
  if (result.maxStreak >= 10 && !unlocked.includes('streak_10')) {
    newAchievements.push('streak_10');
  }

  // Perfect game
  if (result.skippedCount === 0 && result.correctCount >= 5 && !unlocked.includes('perfect_game')) {
    newAchievements.push('perfect_game');
  }

  // Speed demon
  if (result.gameMode === 'speed' && result.correctCount >= 10 && !unlocked.includes('speed_demon')) {
    newAchievements.push('speed_demon');
  }

  // Word count achievements
  if (progress.stats.totalWordsGuessed >= 100 && !unlocked.includes('word_wizard_100')) {
    newAchievements.push('word_wizard_100');
  }
  if (progress.stats.totalWordsGuessed >= 500 && !unlocked.includes('word_wizard_500')) {
    newAchievements.push('word_wizard_500');
  }

  // Games played achievements
  if (progress.stats.totalGamesPlayed >= 10 && !unlocked.includes('party_starter')) {
    newAchievements.push('party_starter');
  }
  if (progress.stats.totalGamesPlayed >= 50 && !unlocked.includes('party_animal')) {
    newAchievements.push('party_animal');
  }

  // Endless master
  if (result.gameMode === 'endless' && result.correctCount >= 20 && !unlocked.includes('endless_master')) {
    newAchievements.push('endless_master');
  }

  // Team player
  if (result.gameMode === 'team' && !unlocked.includes('team_player')) {
    newAchievements.push('team_player');
  }

  // Add new achievements to progress
  progress.achievements = [...unlocked, ...newAchievements];

  // Save updated progress
  saveProgress(progress);

  return { progress, newAchievements };
}

// Get achievement by ID
export function getAchievement(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find(a => a.id === id);
}

// Check if achievement is unlocked
export function isAchievementUnlocked(id: string): boolean {
  const progress = loadProgress();
  return progress.achievements.includes(id);
}

// Reset all progress (for testing or user request)
export function resetProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// Format play time for display
export function formatPlayTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}
