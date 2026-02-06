import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { GAME_MODES } from '../../types/game';

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function Timer() {
  const { state, toggleTimer, increaseTime, decreaseTime } = useGame();
  const { remainingTime, status, totalTime, gameMode, skipCount, teams, currentTeamIndex } = state;

  const modeConfig = GAME_MODES.find(m => m.id === gameMode);
  const canAdjustTime = status === 'idle' && (modeConfig?.allowTimeAdjust ?? true);
  const isEndless = gameMode === 'endless';
  const skipsRemaining = 3 - skipCount;

  // Determine timer color state
  const getTimerState = () => {
    if (isEndless) {
      if (skipsRemaining <= 1) return 'danger';
      if (skipsRemaining === 2) return 'warning';
      return 'normal';
    }
    if (remainingTime <= 5) return 'danger';
    if (remainingTime <= 10) return 'warning';
    return 'normal';
  };

  const timerState = getTimerState();

  const timerClasses = {
    normal: 'text-neon-cyan',
    warning: 'text-neon-yellow',
    danger: 'text-neon-pink',
  };

  // Progress percentage for the ring
  const progress = isEndless
    ? (skipsRemaining / 3) * 100
    : (remainingTime / totalTime) * 100;

  // Get current team color
  const currentTeamColor = teams ? teams[currentTeamIndex].color : null;

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Team indicator */}
      {teams && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-sm font-display font-bold px-4 py-1 rounded-full ${
            currentTeamColor === 'pink'
              ? 'bg-neon-pink/20 text-neon-pink border border-neon-pink/30'
              : 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30'
          }`}
        >
          {teams[currentTeamIndex].name}'s Turn
        </motion.div>
      )}

      <div className="flex items-center gap-4">
        {/* Decrease Time Button */}
        <motion.button
          whileHover={canAdjustTime ? { scale: 1.1 } : {}}
          whileTap={canAdjustTime ? { scale: 0.9 } : {}}
          onClick={decreaseTime}
          disabled={!canAdjustTime}
          className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold transition-all
            ${canAdjustTime
              ? 'bg-bg-tertiary hover:bg-bg-quaternary text-text-primary cursor-pointer'
              : 'bg-bg-secondary text-text-muted cursor-not-allowed opacity-50'
            }`}
        >
          −
        </motion.button>

        {/* Timer Display */}
        <motion.button
          onClick={toggleTimer}
          disabled={!state.currentWord || isEndless && status === 'playing'}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={timerState === 'danger' && !isEndless ? {
            x: [0, -3, 3, -3, 3, 0],
            transition: { repeat: Infinity, duration: 0.5 }
          } : {}}
          className={`relative w-32 h-32 rounded-full flex items-center justify-center cursor-pointer
            ${!state.currentWord ? 'cursor-not-allowed opacity-50' : ''}
          `}
        >
          {/* Background ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="58"
              fill="none"
              stroke="var(--color-bg-tertiary)"
              strokeWidth="8"
            />
            <motion.circle
              cx="64"
              cy="64"
              r="58"
              fill="none"
              stroke={
                timerState === 'danger'
                  ? 'var(--color-neon-pink)'
                  : timerState === 'warning'
                    ? 'var(--color-neon-yellow)'
                    : 'var(--color-neon-cyan)'
              }
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 58}`}
              strokeDashoffset={`${2 * Math.PI * 58 * (1 - progress / 100)}`}
              initial={false}
              animate={{
                strokeDashoffset: `${2 * Math.PI * 58 * (1 - progress / 100)}`,
              }}
              transition={{ duration: 0.3 }}
            />
          </svg>

          {/* Timer text */}
          {isEndless ? (
            <div className="flex flex-col items-center">
              <motion.span
                className={`font-display text-4xl font-bold ${timerClasses[timerState]}`}
                animate={timerState === 'danger' ? {
                  scale: [1, 1.1, 1],
                  transition: { repeat: Infinity, duration: 0.5 }
                } : {}}
              >
                ♾️
              </motion.span>
              <span className={`text-xs font-mono ${timerClasses[timerState]}`}>
                {skipsRemaining} skips left
              </span>
            </div>
          ) : (
            <motion.span
              className={`font-mono text-3xl font-bold ${timerClasses[timerState]}`}
              animate={timerState === 'warning' ? {
                scale: [1, 1.05, 1],
                transition: { repeat: Infinity, duration: 1 }
              } : {}}
            >
              {formatTime(remainingTime)}
            </motion.span>
          )}
        </motion.button>

        {/* Increase Time Button */}
        <motion.button
          whileHover={canAdjustTime ? { scale: 1.1 } : {}}
          whileTap={canAdjustTime ? { scale: 0.9 } : {}}
          onClick={increaseTime}
          disabled={!canAdjustTime}
          className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold transition-all
            ${canAdjustTime
              ? 'bg-bg-tertiary hover:bg-bg-quaternary text-text-primary cursor-pointer'
              : 'bg-bg-secondary text-text-muted cursor-not-allowed opacity-50'
            }`}
        >
          +
        </motion.button>
      </div>

      {/* Mode indicator */}
      {gameMode !== 'classic' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-text-muted font-display"
        >
          {modeConfig?.icon} {modeConfig?.name} Mode
        </motion.div>
      )}
    </div>
  );
}
