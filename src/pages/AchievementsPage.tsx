import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GlassCard } from '../components/ui/GlassCard';
import { useAchievements } from '../hooks/useAchievements';

export function AchievementsPage() {
  const { unlockedAchievements, lockedAchievements, achievements } = useAchievements();

  const progressPercent = Math.round((unlockedAchievements.length / achievements.length) * 100);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between">
        <Link
          to="/stats"
          className="text-text-muted hover:text-text-primary transition-colors font-display"
        >
          &larr; Back
        </Link>
        <h1 className="text-xl font-display font-bold text-neon-yellow">Achievements</h1>
        <div className="w-12" />
      </header>

      <main className="flex-1 px-6 py-4 overflow-y-auto">
        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <GlassCard variant="elevated" neonBorder="yellow" className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-display font-bold text-text-primary">Progress</span>
              <span className="text-sm font-mono text-neon-yellow">
                {unlockedAchievements.length}/{achievements.length}
              </span>
            </div>
            <div className="h-2 bg-bg-primary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="h-full bg-gradient-to-r from-neon-yellow to-neon-green rounded-full"
              />
            </div>
          </GlassCard>
        </motion.div>

        {/* Unlocked Achievements */}
        {unlockedAchievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <h2 className="text-sm font-display font-bold text-neon-green uppercase tracking-wider mb-3">
              Unlocked ({unlockedAchievements.length})
            </h2>
            <div className="space-y-2">
              {unlockedAchievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + index * 0.05 }}
                >
                  <GlassCard neonBorder="green" className="p-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{achievement.icon}</span>
                      <div className="flex-1">
                        <div className="font-display font-bold text-text-primary">
                          {achievement.name}
                        </div>
                        <div className="text-xs text-text-muted">
                          {achievement.description}
                        </div>
                      </div>
                      <span className="text-neon-green text-xl">✓</span>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Locked Achievements */}
        {lockedAchievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-sm font-display font-bold text-text-muted uppercase tracking-wider mb-3">
              Locked ({lockedAchievements.length})
            </h2>
            <div className="space-y-2">
              {lockedAchievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + index * 0.03 }}
                >
                  <GlassCard className="p-3 opacity-60">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl grayscale">{achievement.icon}</span>
                      <div className="flex-1">
                        <div className="font-display font-bold text-text-muted">
                          {achievement.name}
                        </div>
                        <div className="text-xs text-text-muted">
                          {achievement.criteria}
                        </div>
                      </div>
                      <span className="text-text-muted text-xl">🔒</span>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
