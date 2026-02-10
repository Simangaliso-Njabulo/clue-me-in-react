import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { useSound } from '../../context/SoundContext';
import { Icon } from '../ui/Icon';
import { WORD_PACKS } from '../../types/game';
import type { WordPack } from '../../types/game';

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
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePackSelect(pack.id)}
              className={`pack-card ${isSelected ? 'pack-card--selected' : ''}`}
            >
              <span className="pack-card-icon"><Icon name={pack.icon} size={24} /></span>
              <span className="pack-card-name">{pack.name}</span>
              <span className="pack-card-desc">{pack.description}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
