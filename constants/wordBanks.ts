export const WORD_BANKS: Record<string, string[]> = {
  Animals: ['Lion', 'Bear', 'Dog', 'Cat', 'Elephant', 'Tiger', 'Wolf', 'Fox', 'Rabbit', 'Deer'],
  Colors: ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'Black', 'White', 'Gray'],
  Shapes: ['Circle', 'Square', 'Triangle', 'Rectangle', 'Oval', 'Star', 'Hexagon', 'Diamond', 'Pentagon', 'Sphere'],
  Fruits: ['Apple', 'Banana', 'Orange', 'Grape', 'Strawberry', 'Kiwi', 'Mango', 'Pineapple', 'Peach', 'Pear'],
};

export const CATEGORIES = Object.keys(WORD_BANKS);
export const CORRECT_COUNT = 8;
export const GRID_SIZE = 16;

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getRandomCategory(exclude?: string): string {
  const available = exclude ? CATEGORIES.filter(c => c !== exclude) : CATEGORIES;
  return available[Math.floor(Math.random() * available.length)];
}

export function generateGrid(category: string): { words: string[]; correctWords: Set<string> } {
  const correctWords = shuffleArray(WORD_BANKS[category]).slice(0, CORRECT_COUNT);
  const otherCategories = CATEGORIES.filter(c => c !== category);
  const distractorPool: string[] = [];
  for (const cat of otherCategories) {
    distractorPool.push(...WORD_BANKS[cat]);
  }
  const distractors = shuffleArray(distractorPool).slice(0, GRID_SIZE - CORRECT_COUNT);
  const allWords = shuffleArray([...correctWords, ...distractors]);
  return { words: allWords, correctWords: new Set(correctWords) };
}
