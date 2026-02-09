import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { useSound } from '../context/SoundContext';

export function CountdownOverlay() {
  const { state, startGame } = useGame();
  const { play } = useSound();
  const [count, setCount] = useState<number | string | null>(null);

  const isCountdown = state.status === 'countdown';

  useEffect(() => {
    if (!isCountdown) {
      setCount(null);
      return;
    }

    // Start countdown sequence
    setCount(3);
    play('countdown');

    const intervals = [
      setTimeout(() => { setCount(2); play('countdown'); }, 1000),
      setTimeout(() => { setCount(1); play('countdown'); }, 2000),
      setTimeout(() => { setCount('GO!'); play('go'); }, 3000),
      setTimeout(() => {
        setCount(null);
        startGame();
      }, 3700),
    ];

    return () => {
      intervals.forEach(clearTimeout);
    };
  }, [isCountdown, play, startGame]);

  return (
    <AnimatePresence>
      {count !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/90 backdrop-blur-sm"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={count}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 2, opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 25,
              }}
              className={`text-center ${typeof count === 'string' ? 'text-neon-green' : 'text-neon-blue'}`}
            >
              <span className="font-display text-[12rem] sm:text-[16rem] font-bold leading-none drop-shadow-2xl">
                {count}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Background pulse effect */}
          <motion.div
            className="absolute inset-0 bg-neon-blue/10"
            animate={{
              opacity: [0, 0.2, 0],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
