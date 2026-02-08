import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { CATEGORY_ICONS } from '../../types/game';
import type { WordsData } from '../../types/game';

interface CategorySelectorProps {
  words: WordsData;
  compact?: boolean;
}

export function CategorySelector({ words, compact = false }: CategorySelectorProps) {
  const { state, selectCategory } = useGame();
  const { selectedCategory, status } = state;

  const categories = Object.keys(words);
  const isDisabled = status === 'playing' || status === 'countdown';

  const handleSelect = (category: string) => {
    if (isDisabled || !category || !words[category]) return;
    selectCategory(category, words[category]);
  };

  if (compact) {
    return (
      <div className="category-select-wrapper">
        <select
          value={selectedCategory}
          onChange={(e) => handleSelect(e.target.value)}
          disabled={isDisabled}
          className={`category-select ${isDisabled ? 'category-select--disabled' : ''}`}
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {CATEGORY_ICONS[category] || '📝'} {category}
            </option>
          ))}
        </select>
        <span className="category-select-arrow">▼</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {categories.map((category, index) => {
        const isSelected = selectedCategory === category;
        const icon = CATEGORY_ICONS[category] || '📝';

        return (
          <motion.button
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={!isDisabled ? { scale: 1.05, y: -4 } : {}}
            whileTap={!isDisabled ? { scale: 0.95 } : {}}
            onClick={() => handleSelect(category)}
            disabled={isDisabled}
            className={`relative p-4 rounded-xl text-center transition-all
              ${isSelected
                ? 'bg-neon-purple text-white shadow-lg shadow-neon-purple/30'
                : 'bg-bg-tertiary hover:bg-bg-quaternary text-text-primary'
              }
              ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <span className="text-3xl block mb-2">{icon}</span>
            <span className="text-sm font-medium line-clamp-2">{category}</span>
            {isSelected && (
              <motion.div
                layoutId="categorySelection"
                className="absolute inset-0 border-2 border-white rounded-xl"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
