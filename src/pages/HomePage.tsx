import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useGame } from '../context/GameContext';

const steps = [
  { number: 1, title: 'Choose Category', description: 'Pick from 15 exciting categories', icon: '📂' },
  { number: 2, title: 'Set Timer', description: 'Use +/- to adjust (30s to 5min)', icon: '⏱️' },
  { number: 3, title: 'Start Game', description: 'Click the timer to begin!', icon: '▶️' },
  { number: 4, title: 'Guess Words', description: 'Tap Correct or Skip for each word', icon: '🎯' },
  { number: 5, title: 'See Results', description: 'Check your score when time runs out', icon: '🏆' },
];

export function HomePage() {
  const { state, toggleSound } = useGame();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 px-6 py-4 flex items-center justify-between">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl sm:text-3xl font-display font-bold text-accent-purple"
        >
          Clue Me In
        </motion.h1>

        {/* Sound Toggle */}
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleSound}
          className="w-10 h-10 rounded-full bg-bg-tertiary hover:bg-bg-quaternary flex items-center justify-center transition-colors text-lg"
          title={state.soundEnabled ? 'Sound On' : 'Sound Off'}
        >
          {state.soundEnabled ? '🔊' : '🔇'}
        </motion.button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-6 py-8 overflow-y-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-10 max-w-lg"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-text-primary mb-4 leading-tight">
            Party Word Game
          </h2>
          <p className="text-lg text-text-secondary">
            Guess the words before time runs out! Perfect for parties and game nights.
          </p>
        </motion.div>

        {/* Play Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <Link to="/play">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 16px 32px rgba(124, 58, 237, 0.35)' }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 text-xl font-bold text-white bg-accent-purple rounded-xl
                shadow-lg shadow-accent-purple/25 transition-shadow"
            >
              Play Now
            </motion.button>
          </Link>
        </motion.div>

        {/* How to Play */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-md"
        >
          <h3 className="text-xl font-display font-bold text-center mb-6 text-text-primary">
            How to Play
          </h3>

          <div className="space-y-3">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.08 }}
                className="flex items-center gap-4 p-3 rounded-xl bg-bg-secondary/50 border border-white/5"
              >
                <div className="w-10 h-10 rounded-full bg-accent-purple/20 flex items-center justify-center
                  text-lg flex-shrink-0">
                  {step.icon}
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-text-primary text-sm">{step.title}</h4>
                  <p className="text-text-secondary text-xs">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="flex-shrink-0 px-6 py-4 text-center">
        <p className="text-text-muted text-xs">
          Swipe right for correct, left for skip on mobile
        </p>
      </footer>
    </div>
  );
}
