import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AudioSettings } from '../components/ui/AudioSettings';
import { GameModeSelector } from '../components/game/GameModeSelector';
import { TeamSetup } from '../components/game/TeamSetup';
import { useGame } from '../context/GameContext';

const steps = [
  { number: 1, title: 'Choose Mode', description: 'Classic, Speed, Endless, or Team', icon: '🎮' },
  { number: 2, title: 'Pick Category', description: 'Select from 15+ categories', icon: '📂' },
  { number: 3, title: 'Start Game', description: 'Click the timer to begin!', icon: '▶️' },
  { number: 4, title: 'Guess Words', description: 'Tap Correct or Skip for each word', icon: '🎯' },
  { number: 5, title: 'See Results', description: 'Check your score when done', icon: '🏆' },
];

export function HomePage() {
  const { state } = useGame();
  const [showTeamSetup, setShowTeamSetup] = useState(false);

  const needsTeamSetup = state.gameMode === 'team' && !state.teams;

  return (
    <div className="min-h-screen w-full flex flex-col">
      {/* Header */}
      <header className="w-full flex-shrink-0 px-6 sm:px-10 pt-8 pb-4 flex items-center justify-between">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl sm:text-3xl font-display font-black tracking-wider"
        >
          <span className="text-neon-pink">WORD</span>
          <span className="text-neon-yellow">Z</span>
          <span className="text-neon-cyan">APP</span>
        </motion.h1>

        {/* Header Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <Link
            to="/stats"
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-bg-secondary/50 hover:bg-bg-secondary transition-colors text-lg"
            title="Stats & Achievements"
          >
            📊
          </Link>
          <AudioSettings compact />
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="w-full flex-1 overflow-y-auto px-6 sm:px-8 py-8 flex flex-col items-center gap-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center w-full max-w-xl"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-text-primary mb-4 leading-tight">
            Party Word Game
          </h2>
          <p className="text-lg text-text-secondary">
            Guess the words before time runs out! Perfect for parties and game nights.
          </p>
        </motion.div>

        {/* Game Mode Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="w-full max-w-lg"
        >
          <GameModeSelector />
        </motion.div>

        {/* Play Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          {needsTeamSetup ? (
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 16px 32px rgba(176, 38, 255, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowTeamSetup(true)}
              className="px-10 py-4 text-xl font-display font-bold text-white bg-neon-purple rounded-xl
                shadow-lg shadow-neon-purple/30 transition-shadow"
            >
              Setup Teams
            </motion.button>
          ) : (
            <Link to="/play">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 16px 32px rgba(176, 38, 255, 0.5)' }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 text-xl font-display font-bold text-white bg-neon-purple rounded-xl
                  shadow-lg shadow-neon-purple/30 transition-shadow"
              >
                Play Now
              </motion.button>
            </Link>
          )}
        </motion.div>

        {/* How to Play */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-lg"
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
                <div className="w-10 h-10 rounded-full bg-neon-purple/20 flex items-center justify-center
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

        {/* Team Setup Modal */}
        <AnimatePresence>
          {showTeamSetup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/90 backdrop-blur-sm p-6"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <TeamSetup onComplete={() => setShowTeamSetup(false)} />
                <button
                  onClick={() => setShowTeamSetup(false)}
                  className="mt-4 w-full text-center text-text-muted text-sm hover:text-text-secondary"
                >
                  Cancel
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="w-full flex-shrink-0 px-6 sm:px-10 py-6 text-center">
        <p className="text-text-muted text-xs">
          Swipe right for correct, left for skip on mobile
        </p>
      </footer>
    </div>
  );
}
