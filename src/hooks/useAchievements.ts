import { useState, useCallback, useEffect } from 'react';
import {
  loadProgress,
  updateStatsAfterGame,
  ACHIEVEMENTS,
  type GameResult,
  type SavedProgress,
  type Achievement,
} from '../services/storageService';

export interface UseAchievementsReturn {
  progress: SavedProgress;
  achievements: Achievement[];
  unlockedAchievements: Achievement[];
  lockedAchievements: Achievement[];
  pendingToasts: Achievement[];
  recordGameResult: (result: GameResult) => void;
  dismissToast: () => void;
  refreshProgress: () => void;
}

export function useAchievements(): UseAchievementsReturn {
  const [progress, setProgress] = useState<SavedProgress>(() => loadProgress());
  const [pendingToasts, setPendingToasts] = useState<Achievement[]>([]);

  // Refresh progress from localStorage
  const refreshProgress = useCallback(() => {
    setProgress(loadProgress());
  }, []);

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'wordzapp_progress') {
        refreshProgress();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshProgress]);

  // Record a game result and check for new achievements
  const recordGameResult = useCallback((result: GameResult) => {
    const { progress: updatedProgress, newAchievements } = updateStatsAfterGame(result);
    setProgress(updatedProgress);

    // Queue new achievements for toast display
    if (newAchievements.length > 0) {
      const newAchievementObjects = newAchievements
        .map(id => ACHIEVEMENTS.find(a => a.id === id))
        .filter((a): a is Achievement => a !== undefined);
      setPendingToasts(prev => [...prev, ...newAchievementObjects]);
    }
  }, []);

  // Dismiss the current toast (show next one if any)
  const dismissToast = useCallback(() => {
    setPendingToasts(prev => prev.slice(1));
  }, []);

  // Compute unlocked and locked achievements
  const unlockedAchievements = ACHIEVEMENTS.filter(a =>
    progress.achievements.includes(a.id)
  );
  const lockedAchievements = ACHIEVEMENTS.filter(a =>
    !progress.achievements.includes(a.id)
  );

  return {
    progress,
    achievements: ACHIEVEMENTS,
    unlockedAchievements,
    lockedAchievements,
    pendingToasts,
    recordGameResult,
    dismissToast,
    refreshProgress,
  };
}
