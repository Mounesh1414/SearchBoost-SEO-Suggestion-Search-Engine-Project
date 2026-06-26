const LONG_TAIL_SUFFIXES = [
  'for beginners', 'tutorial', 'best practices', 'guide 2026', 'examples',
  'checklist', 'tips and tricks', 'for small business', 'strategy', 'tools',
  'free', 'online', 'vs competitors', 'pricing', 'alternatives',
  'near me', 'step by step', 'course', 'certification', 'agency'
];

const QUESTION_PREFIXES = [
  'how to', 'what is', 'why use', 'when to', 'where to find',
  'can i', 'how does', 'what are the best', 'how to improve',
  'what makes a good'
];

const INTENT_MODIFIERS = ['buy', 'learn', 'compare', 'review', 'hire', 'get'];

const deterministicScore = (text) => {
  const hash = [...text].reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) >>> 0, 0);
  return (hash % 98) + 1; // 1–98
};

const difficultyFromScore = (score) => {
  if (score >= 70) return 'Low';
  if (score >= 40) return 'Medium';
  return 'High';
};

const volumeFromScore = (score, index) => {
  return 100 + ((score * 97 + index * 173) % 4900);
};

export const generateKeywords = (baseKeyword, limit = 15) => {
  const cleaned = baseKeyword.trim().toLowerCase();
  if (!cleaned) return [];

  const candidates = new Set();

  for (const suffix of LONG_TAIL_SUFFIXES) {
    candidates.add(`${cleaned} ${suffix}`);
  }
  for (const prefix of QUESTION_PREFIXES) {
    candidates.add(`${prefix} ${cleaned}`);
  }
  for (const mod of INTENT_MODIFIERS) {
    candidates.add(`${mod} ${cleaned}`);
  }

  // LSI-style variations
  candidates.add(`${cleaned} online`);
  candidates.add(`best ${cleaned}`);
  candidates.add(`top ${cleaned}`);
  candidates.add(`${cleaned} software`);
  candidates.add(`${cleaned} services`);

  return Array.from(candidates)
    .slice(0, limit)
    .map((kw, index) => {
      const seoScore = deterministicScore(kw);
      return {
        keyword: kw,
        seoScore,
        difficulty: difficultyFromScore(seoScore),
        estimatedVolume: volumeFromScore(seoScore, index),
        intent: QUESTION_PREFIXES.some((p) => kw.startsWith(p))
          ? 'informational'
          : INTENT_MODIFIERS.some((m) => kw.startsWith(m))
          ? 'transactional'
          : 'navigational'
      };
    })
    .sort((a, b) => b.seoScore - a.seoScore);
};
