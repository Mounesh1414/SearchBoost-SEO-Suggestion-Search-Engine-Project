import { Router } from 'express';
import { Suggestion } from '../models/Suggestion.js';
import { buildSEOSuggestions } from '../utils/seoEngine.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const keyword = `${req.query.keyword || ''}`.trim();
    const limit = Number(req.query.limit) || 10;

    if (!keyword || keyword.length < 2) {
      return res.status(400).json({ message: 'Keyword must be at least 2 characters long.' });
    }

    const generated = buildSEOSuggestions(keyword, Math.min(limit, 20));

    const toStore = generated.map((entry) => ({
      keyword,
      suggestion: entry.suggestion,
      seoScore: entry.seoScore,
      difficulty: entry.difficulty,
      estimatedVolume: entry.estimatedVolume
    }));

    await Suggestion.insertMany(toStore, { ordered: false });

    return res.json({
      keyword,
      count: generated.length,
      suggestions: generated
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to generate suggestions.', error: error.message });
  }
});

router.get('/history', async (req, res) => {
  try {
    const history = await Suggestion.find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .select('keyword suggestion seoScore difficulty estimatedVolume createdAt -_id')
      .lean();

    return res.json({ count: history.length, history });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch history.', error: error.message });
  }
});

export default router;
