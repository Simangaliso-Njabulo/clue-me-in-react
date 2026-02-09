import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Icon } from '../components/ui/Icon';
import { useAchievements } from '../hooks/useAchievements';
import { formatPlayTime } from '../services/storageService';

export function StatsPage() {
  const { progress, unlockedAchievements } = useAchievements();
  const { stats, highScores } = progress;

  const accuracy = stats.totalWordsGuessed + stats.totalWordsSkipped > 0
    ? Math.round((stats.totalWordsGuessed / (stats.totalWordsGuessed + stats.totalWordsSkipped)) * 100)
    : 0;

  const highScoreEntries = Object.entries(highScores)
    .sort((a, b) => b[1].score - a[1].score)
    .slice(0, 5);

  return (
    <div className="stats-page">
      {/* Header */}
      <header className="stats-header">
        <Link to="/" className="stats-back-link">
          &larr; Back
        </Link>
        <h1 className="stats-header-title">Stats</h1>
        <div className="stats-header-spacer" />
      </header>

      <main className="stats-main">
        {/* Overall Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="stats-section-title">Overall Stats</h2>
          <div className="stats-grid">
            <StatItem label="Games Played" value={stats.totalGamesPlayed} icon="gamepad" color="text-neon-blue" />
            <StatItem label="Words Guessed" value={stats.totalWordsGuessed} icon="check" color="text-neon-green" />
            <StatItem label="Words Skipped" value={stats.totalWordsSkipped} icon="x" color="text-neon-pink" />
            <StatItem label="Accuracy" value={`${accuracy}%`} icon="target" color="text-neon-cyan" />
            <StatItem label="Best Streak" value={stats.bestStreak} icon="flame" color="text-neon-yellow" />
            <StatItem label="Perfect Games" value={stats.perfectGames} icon="sparkles" color="text-neon-purple" />
            <StatItem label="Play Time" value={formatPlayTime(stats.totalPlayTime)} icon="clock" color="text-neon-blue" />
            <StatItem label="Achievements" value={`${unlockedAchievements.length}/11`} icon="trophy" color="text-neon-yellow" />
          </div>
        </motion.div>

        {/* High Scores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="stats-section-title">Top High Scores</h2>
          {highScoreEntries.length > 0 ? (
            <div className="stats-highscores">
              {highScoreEntries.map(([category, entry], index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + index * 0.05 }}
                >
                  <div className="stats-highscore-row">
                    <div>
                      <div className="stats-highscore-category">{category}</div>
                      <div className="stats-highscore-meta">
                        {new Date(entry.date).toLocaleDateString()} • {entry.gameMode}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="stats-highscore-value">{entry.score}</div>
                      <div className="stats-highscore-detail">
                        {entry.accuracy}% • <Icon name="flame" size={12} className="inline-block align-middle" />{entry.streak}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="stats-empty-block">
              <p className="stats-empty">No high scores yet.</p>
              <p className="stats-empty-hint">Play a game to set your first record!</p>
            </div>
          )}
        </motion.div>

        {/* View Achievements Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link to="/achievements" className="stats-achievements-link">
            <div className="stats-achievements-icon"><Icon name="trophy" size={24} /></div>
            <div className="stats-achievements-title">View Achievements</div>
            <div className="stats-achievements-count">
              {unlockedAchievements.length} of 11 unlocked
            </div>
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
    <div className="stats-item">
      <div className={`stats-item-icon ${color}`}><Icon name={icon} size={20} /></div>
      <div>
        <div className={`stats-item-value ${color}`}>{value}</div>
        <div className="stats-item-label">{label}</div>
      </div>
    </div>
  );
}
