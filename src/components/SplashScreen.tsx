import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './ui/Logo';

interface SplashScreenProps {
  isVisible: boolean;
  onComplete?: () => void;
}

export function SplashScreen({ isVisible, onComplete }: SplashScreenProps) {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg-primary"
        >
          {/* Animated background grid */}
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(176, 38, 255, 0.3) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(176, 38, 255, 0.3) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px',
              }}
            />

            {/* Animated glow orbs */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-neon-pink/20 blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-neon-cyan/20 blur-3xl"
            />
          </div>

          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative z-10"
          >
            <Logo size="lg" animate showTagline />
          </motion.div>

          {/* Loading indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-20"
          >
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  className="w-2 h-2 rounded-full bg-neon-purple"
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
