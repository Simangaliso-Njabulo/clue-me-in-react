import type { WordsData, WordPack } from '../types/game';
import { WORD_PACKS } from '../types/game';

const packCache: Partial<Record<WordPack, WordsData>> = {};

export async function loadWordPack(pack: WordPack): Promise<WordsData> {
  if (packCache[pack]) {
    return packCache[pack];
  }

  const config = WORD_PACKS.find(p => p.id === pack);
  if (!config) {
    throw new Error(`Unknown word pack: ${pack}`);
  }

  try {
    const response = await fetch(config.jsonFile);
    if (!response.ok) {
      throw new Error(`Failed to load word pack: ${pack}`);
    }

    const data: WordsData = await response.json();
    packCache[pack] = data;
    return data;
  } catch (error) {
    console.error(`Error loading word pack "${pack}":`, error);
    throw error;
  }
}

export function getCategories(words: WordsData): string[] {
  return Object.keys(words);
}

export function getWordsForCategory(words: WordsData, category: string): string[] {
  return words[category] || [];
}
