import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { AudioSettings } from "../components/ui/AudioSettings";
import { WordPackSelector } from "../components/game/WordPackSelector";
import { GameModeSelector } from "../components/game/GameModeSelector";
import { TeamSetup } from "../components/game/TeamSetup";
import { useGame } from "../context/GameContext";

const steps = [
  { number: 1, title: "Pick a Pack", description: "Mzansi, General, Industry, Bible, or Kids", icon: "📦" },
  { number: 2, title: "Choose Mode", description: "Classic, Speed, Endless, or Team", icon: "🎮" },
  { number: 3, title: "Pick Category", description: "Select from the pack's categories", icon: "📂" },
  { number: 4, title: "Guess Words", description: "Tap Correct or Skip for each word", icon: "🎯" },
  { number: 5, title: "See Results", description: "Check your score when done", icon: "🏆" },
];

export function HomePage() {
  const { state } = useGame();
  const [showTeamSetup, setShowTeamSetup] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const needsTeamSetup = state.gameMode === "team" && !state.teams;

  return (
    <div className="home-page">
      {/* Header */}
      <header className="home-header">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="home-logo"
        >
          <span className="text-text-primary">WORD</span>
          <span className="text-neon-blue">Z</span>
          <span className="text-text-primary">APP</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="home-header-actions"
        >
          <Link to="/stats" className="home-stats-link" title="Stats & Achievements">
            📊
          </Link>
          <AudioSettings compact />
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="home-main">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="home-hero"
        >
          <h2 className="home-hero-title">Party Word Game</h2>
          <p className="home-hero-subtitle">
            Guess the words before time runs out! Perfect for parties and game nights.
          </p>
        </motion.div>

        {/* Word Pack Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="home-mode-selector"
        >
          <WordPackSelector />
        </motion.div>

        {/* Game Mode Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="home-mode-selector"
        >
          <GameModeSelector />
        </motion.div>

        {/* Play Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="home-play-section"
        >
          {needsTeamSetup ? (
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 16px 32px rgba(176, 38, 255, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowTeamSetup(true)}
              className="home-play-btn"
            >
              Setup Teams
            </motion.button>
          ) : (
            <Link to="/play">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 16px 32px rgba(176, 38, 255, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="home-play-btn"
              >
                Play Now
              </motion.button>
            </Link>
          )}
        </motion.div>

        {/* How to Play Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="home-help-btn"
          onClick={() => setShowHelp(true)}
        >
          <span className="home-help-icon">?</span>
          How to Play
        </motion.button>

        {/* How to Play Modal */}
        <AnimatePresence>
          {showHelp && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="home-modal-overlay"
              onClick={() => setShowHelp(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="home-help-modal"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="home-help-title">How to Play</h3>
                <div className="home-steps-list">
                  {steps.map((step) => (
                    <div key={step.number} className="home-step">
                      <div className="home-step-icon">{step.icon}</div>
                      <div className="home-step-text">
                        <h4 className="home-step-title">{step.title}</h4>
                        <p className="home-step-desc">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  className="home-help-close"
                  onClick={() => setShowHelp(false)}
                >
                  Got it!
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Team Setup Modal */}
        <AnimatePresence>
          {showTeamSetup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="home-modal-overlay"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <TeamSetup onComplete={() => setShowTeamSetup(false)} />
                <button
                  onClick={() => setShowTeamSetup(false)}
                  className="home-modal-cancel"
                >
                  Cancel
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="home-footer">
        <p className="home-footer-text">
          Swipe right for correct, left for skip on mobile
        </p>
      </footer>
    </div>
  );
}
