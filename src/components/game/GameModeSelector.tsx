import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { useSound } from '../../context/SoundContext';
import { GlassCard } from '../ui/GlassCard';
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
    // Compact horizontal selector
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
              <span className="mr-2">{mode.icon}</span>
              {mode.name}
            </motion.button>
          );
        })}
      </div>
    );
  }

  // Full card grid
  return (
    <div className="space-y-4">
      <h3 className="font-display font-bold text-lg text-text-primary">
        Select Game Mode
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {GAME_MODES.map((mode) => {
          const isSelected = state.gameMode === mode.id;

          return (
            <motion.div
              key={mode.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <GlassCard
                variant={isSelected ? 'elevated' : 'default'}
                neonBorder={isSelected ? 'cyan' : 'none'}
                hover
                className={`p-4 cursor-pointer transition-all ${
                  isSelected ? 'ring-2 ring-neon-blue/50' : ''
                }`}
                onClick={() => handleModeSelect(mode.id)}
              >
                <div className="text-center">
                  <span className="text-3xl mb-2 block">{mode.icon}</span>
                  <h4 className={`font-display font-bold text-base mb-1 ${
                    isSelected ? 'text-neon-blue' : 'text-text-primary'
                  }`}>
                    {mode.name}
                  </h4>
                  <p className="text-xs text-text-secondary">
                    {mode.description}
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
