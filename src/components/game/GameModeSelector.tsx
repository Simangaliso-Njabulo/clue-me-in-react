import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { useSound } from '../../context/SoundContext';
import { Icon } from '../ui/Icon';
import { GAME_MODES } from '../../types/game';
import type { GameMode } from '../../types/game';

interface GameModeSelectorProps {
  compact?: boolean;
}

export function GameModeSelector({ compact = false }: GameModeSelectorProps) {
  const { state, setGameMode } = useGame();
  const { play } = useSound();

  const handleModeSelect = (mode: GameMode) => {
    play('buttonClick');
    setGameMode(mode);
  };

  if (compact) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {GAME_MODES.map((mode) => {
          const isSelected = state.gameMode === mode.id;
          return (
            <motion.button
              key={mode.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleModeSelect(mode.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl font-display text-sm transition-all
                ${isSelected
                  ? 'bg-neon-blue text-white shadow-lg shadow-neon-blue/30'
                  : 'bg-bg-tertiary/50 text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
                }
              `}
            >
              <span className="mr-2 inline-flex align-middle"><Icon name={mode.icon} size={16} /></span>
              {mode.name}
            </motion.button>
          );
        })}
      </div>
    );
  }

  return (
    <div>
      <h3 className="mode-grid-title">Select Game Mode</h3>
      <div className="mode-grid">
        {GAME_MODES.map((mode) => {
          const isSelected = state.gameMode === mode.id;
          return (
            <motion.button
              key={mode.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleModeSelect(mode.id)}
              className={`mode-card ${isSelected ? 'mode-card--selected' : ''}`}
            >
              <span className="mode-card-icon"><Icon name={mode.icon} size={28} /></span>
              <span className="mode-card-name">{mode.name}</span>
              <span className="mode-card-desc">{mode.description}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
