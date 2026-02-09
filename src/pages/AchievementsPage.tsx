import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Icon } from '../components/ui/Icon';
import { useAchievements } from '../hooks/useAchievements';

export function AchievementsPage() {
  const { unlockedAchievements, lockedAchievements, achievements } = useAchievements();

  const progressPercent = Math.round((unlockedAchievements.length / achievements.length) * 100);

  return (
    <div className="achievements-page">
      {/* Header */}
      <header className="achievements-header">
        <Link to="/stats" className="achievements-back-link">
          &larr; Back
        </Link>
        <h1 className="achievements-header-title">Achievements</h1>
        <div className="achievements-header-spacer" />
      </header>

      <main className="achievements-main">
        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="achievements-progress">
            <div className="achievements-progress-header">
              <span className="achievements-progress-label">Progress</span>
              <span className="achievements-progress-count">
                {unlockedAchievements.length}/{achievements.length}
              </span>
            </div>
            <div className="achievements-progress-track">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="achievements-progress-fill"
              />
            </div>
          </div>
        </motion.div>

        {/* Unlocked Achievements */}
        {unlockedAchievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="achievements-section-title achievements-section-title--unlocked">
              Unlocked ({unlockedAchievements.length})
            </h2>
            <div className="achievements-list">
              {unlockedAchievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + index * 0.05 }}
                  className="achievement-card achievement-card--unlocked"
                >
                  <span className="achievement-card-icon"><Icon name={achievement.icon} size={28} /></span>
                  <div className="achievement-card-info">
                    <div className="achievement-card-name">{achievement.name}</div>
                    <div className="achievement-card-desc">{achievement.description}</div>
                  </div>
                  <span className="achievement-card-status achievement-card-status--unlocked"><Icon name="check" size={20} /></span>
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
            <h2 className="achievements-section-title achievements-section-title--locked">
              Locked ({lockedAchievements.length})
            </h2>
            <div className="achievements-list">
              {lockedAchievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + index * 0.03 }}
                  className="achievement-card achievement-card--locked"
                >
                  <span className="achievement-card-icon achievement-card-icon--locked"><Icon name={achievement.icon} size={28} /></span>
                  <div className="achievement-card-info">
                    <div className="achievement-card-name">{achievement.name}</div>
                    <div className="achievement-card-desc">{achievement.criteria}</div>
                  </div>
                  <span className="achievement-card-status achievement-card-status--locked"><Icon name="lock" size={20} /></span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
