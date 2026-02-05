import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function Timer() {
  const { state, toggleTimer, increaseTime, decreaseTime } = useGame();
  const { remainingTime, status, totalTime } = state;

  const canAdjustTime = status === 'idle';

  // Determine timer color state
  const getTimerState = () => {
    if (remainingTime <= 5) return 'danger';
    if (remainingTime <= 10) return 'warning';
    return 'normal';
  };

  const timerState = getTimerState();

  const timerClasses = {
    normal: 'text-game-success',
    warning: 'text-game-warning',
    danger: 'text-game-error',
  };

  // Progress percentage for the ring
  const progress = (remainingTime / totalTime) * 100;

  return (
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
        disabled={!state.currentWord}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={timerState === 'danger' ? {
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
                ? 'var(--color-game-error)'
                : timerState === 'warning'
                  ? 'var(--color-game-warning)'
                  : 'var(--color-accent-purple)'
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
        <motion.span
          className={`font-mono text-3xl font-bold ${timerClasses[timerState]}`}
          animate={timerState === 'warning' ? {
            scale: [1, 1.05, 1],
            transition: { repeat: Infinity, duration: 1 }
          } : {}}
        >
          {formatTime(remainingTime)}
        </motion.span>
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
  );
}
