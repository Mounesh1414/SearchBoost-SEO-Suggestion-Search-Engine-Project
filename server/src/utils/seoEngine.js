const longTailSuffixes = [
  'for beginners',
  'in 2026',
  'best tools',
  'step by step',
  'for small business',
  'strategy guide',
  'examples',
  'checklist',
  'tips',
  'near me'
];

const questionPrefixes = ['how to', 'what is', 'why', 'when', 'where', 'can'];

const toDifficulty = (score) => {
  if (score >= 75) return 'Low';
  if (score >= 45) return 'Medium';
  return 'High';
};

const createScore = (text, seed) => {
  const base = [...text].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const score = (base + seed * 37) % 100;
  return Math.max(1, score);
};

export const buildSEOSuggestions = (keyword, limit = 10) => {
  const cleaned = keyword.trim().toLowerCase();
  if (!cleaned) return [];

  const generated = new Set();
  const output = [];

  for (const suffix of longTailSuffixes) {
    generated.add(`${cleaned} ${suffix}`);
  }

  for (const prefix of questionPrefixes) {
    generated.add(`${prefix} ${cleaned}`);
  }

  generated.add(`${cleaned} vs competitors`);
  generated.add(`${cleaned} pricing`);
  generated.add(`${cleaned} alternatives`);

  Array.from(generated)
    .slice(0, limit)
    .forEach((suggestionText, index) => {
      const seoScore = createScore(suggestionText, index + 1);
      output.push({
        suggestion: suggestionText,
        seoScore,
        difficulty: toDifficulty(seoScore),
        estimatedVolume: 50 + ((seoScore * 97 + index * 173) % 5000)
      });
    });

  return output.sort((a, b) => b.seoScore - a.seoScore);
};
