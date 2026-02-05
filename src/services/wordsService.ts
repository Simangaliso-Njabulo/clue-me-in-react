import type { WordsData } from '../types/game';

const WORDS_URL = './data/words.json';
const MZANSI_WORDS_URL = './data/mzansi-words.json';

let cachedWords: WordsData | null = null;

export async function loadAllWords(): Promise<WordsData> {
  if (cachedWords) {
    return cachedWords;
  }

  try {
    const [wordsResponse, mzansiResponse] = await Promise.all([
      fetch(WORDS_URL),
      fetch(MZANSI_WORDS_URL),
    ]);

    if (!wordsResponse.ok || !mzansiResponse.ok) {
      throw new Error('Failed to load word data');
    }

    const words: WordsData = await wordsResponse.json();
    const mzansiWords: WordsData = await mzansiResponse.json();

    // Merge both word sets
    cachedWords = { ...words, ...mzansiWords };
    return cachedWords;
  } catch (error) {
    console.error('Error loading words:', error);
    throw error;
  }
}

export function getCategories(words: WordsData): string[] {
  return Object.keys(words);
}

export function getWordsForCategory(words: WordsData, category: string): string[] {
  return words[category] || [];
}
