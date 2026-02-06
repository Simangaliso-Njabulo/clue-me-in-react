import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GlassCard } from '../components/ui/GlassCard';
import { useAchievements } from '../hooks/useAchievements';
import { formatPlayTime } from '../services/storageService';

export function StatsPage() {
  const { progress, unlockedAchievements } = useAchievements();
  const { stats, highScores } = progress;

  const accuracy = stats.totalWordsGuessed + stats.totalWordsSkipped > 0
    ? Math.round((stats.totalWordsGuessed / (stats.totalWordsGuessed + stats.totalWordsSkipped)) * 100)
    : 0;

  const highScoreEntries = Object.entries(highScores).sort((a, b) => b[1].score - a[1].score);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-text-muted hover:text-text-primary transition-colors font-display"
        >
          &larr; Back
        </Link>
        <h1 className="text-xl font-display font-bold text-neon-cyan">Stats</h1>
        <div className="w-12" />
      </header>

      <main className="flex-1 px-6 py-4 overflow-y-auto">
        {/* Overall Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-sm font-display font-bold text-text-muted uppercase tracking-wider mb-3">
            Overall Stats
          </h2>
          <GlassCard variant="elevated" neonBorder="cyan" className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <StatItem
                label="Games Played"
                value={stats.totalGamesPlayed}
                icon="🎮"
              />
              <StatItem
                label="Words Guessed"
                value={stats.totalWordsGuessed}
                icon="✓"
                color="text-neon-green"
              />
              <StatItem
                label="Words Skipped"
                value={stats.totalWordsSkipped}
                icon="✕"
                color="text-neon-pink"
              />
              <StatItem
                label="Accuracy"
                value={`${accuracy}%`}
                icon="🎯"
                color="text-neon-yellow"
              />
              <StatItem
                label="Best Streak"
                value={stats.bestStreak}
                icon="🔥"
                color="text-neon-yellow"
              />
              <StatItem
                label="Perfect Games"
                value={stats.perfectGames}
                icon="✨"
                color="text-neon-purple"
              />
              <StatItem
                label="Play Time"
                value={formatPlayTime(stats.totalPlayTime)}
                icon="⏱️"
              />
              <StatItem
                label="Achievements"
                value={`${unlockedAchievements.length}/11`}
                icon="🏆"
                color="text-neon-cyan"
              />
            </div>
          </GlassCard>
        </motion.div>

        {/* High Scores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <h2 className="text-sm font-display font-bold text-text-muted uppercase tracking-wider mb-3">
            High Scores by Category
          </h2>
          {highScoreEntries.length > 0 ? (
            <div className="space-y-2">
              {highScoreEntries.map(([category, entry], index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + index * 0.05 }}
                >
                  <GlassCard className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-display font-bold text-text-primary">
                          {category}
                        </div>
                        <div className="text-xs text-text-muted">
                          {new Date(entry.date).toLocaleDateString()} • {entry.gameMode}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-mono font-bold text-neon-green">
                          {entry.score}
                        </div>
                        <div className="text-xs text-text-muted">
                          {entry.accuracy}% • 🔥{entry.streak}
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          ) : (
            <GlassCard className="p-6 text-center">
              <p className="text-text-muted">No high scores yet.</p>
              <p className="text-sm text-text-muted mt-1">Play a game to set your first record!</p>
            </GlassCard>
          )}
        </motion.div>

        {/* View Achievements Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link to="/achievements">
            <GlassCard neonBorder="yellow" className="p-4 text-center hover:bg-white/5 transition-colors">
              <div className="text-2xl mb-1">🏆</div>
              <div className="font-display font-bold text-neon-yellow">View Achievements</div>
              <div className="text-xs text-text-muted mt-1">
                {unlockedAchievements.length} of 11 unlocked
              </div>
            </GlassCard>
          </Link>
        </motion.div>
      </main>
    </div>
  );
}

interface StatItemProps {
  label: string;
  value: string | number;
  icon: string;
  color?: string;
}

function StatItem({ label, value, icon, color = 'text-text-primary' }: StatItemProps) {
  return (
    <div className="text-center">
      <div className="text-lg mb-0.5">{icon}</div>
      <div className={`text-xl font-mono font-bold ${color}`}>{value}</div>
      <div className="text-xs text-text-muted">{label}</div>
    </div>
  );
}
