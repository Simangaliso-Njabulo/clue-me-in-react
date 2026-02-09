import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { useSound } from '../../context/SoundContext';
import { Icon } from '../ui/Icon';
import { WORD_PACKS } from '../../types/game';
import type { WordPack } from '../../types/game';

const ACCENT_COLOR = 'var(--color-neon-blue)';

export function WordPackSelector() {
  const { state, setWordPack } = useGame();
  const { play } = useSound();

  const handlePackSelect = (pack: WordPack) => {
    play('buttonClick');
    setWordPack(pack);
  };

  return (
    <div className="pack-selector">
      <h3 className="pack-selector-title">Choose Your Pack</h3>
      <div className="pack-selector-grid">
        {WORD_PACKS.map((pack) => {
          const isSelected = state.wordPack === pack.id;

          return (
            <motion.button
              key={pack.id}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePackSelect(pack.id)}
              className={`pack-card ${isSelected ? 'pack-card--selected' : ''}`}
              style={isSelected ? {
                borderColor: ACCENT_COLOR,
                boxShadow: `0 0 16px rgba(56, 189, 248, 0.2), 0 0 32px rgba(56, 189, 248, 0.08)`,
              } : undefined}
            >
              <span className="pack-card-icon"><Icon name={pack.icon} size={24} /></span>
              <span
                className="pack-card-name"
                style={isSelected ? { color: ACCENT_COLOR } : undefined}
              >
                {pack.name}
              </span>
              <span className="pack-card-desc">{pack.description}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
