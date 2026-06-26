import { SearchHistory } from '../models/SearchHistory.js';
import { User } from '../models/User.js';
import { analyzeSEO } from '../services/seoAnalyzer.js';
import { generateKeywords } from '../services/keywordEngine.js';
import { analyzePageSpeed } from '../services/pageSpeed.js';

export const analyzeURL = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || url.trim().length < 4) {
      return res.status(400).json({ message: 'A valid URL is required.' });
    }

    const [seoResult, keywordResult] = await Promise.allSettled([
      analyzeSEO(url),
      generateKeywords(new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace('www.', ''))
    ]);

    if (seoResult.status === 'rejected') {
      return res.status(422).json({ message: 'Failed to reach URL or parse page.', error: seoResult.reason?.message });
    }

    const seo = seoResult.value;
    const keywords = keywordResult.status === 'fulfilled' ? keywordResult.value : [];

    const speedResult = await analyzePageSpeed(url.startsWith('http') ? url : `https://${url}`, seo.loadTime);

    await SearchHistory.create({
      userId: req.user?._id || null,
      url: seo.url,
      domain: seo.domain,
      seoScore: seo.seoScore,
      seoBreakdown: seo.breakdown,
      pageSpeed: speedResult,
      keywords: keywords.slice(0, 10).map((k) => k.keyword),
      issues: seo.issues,
      suggestions: seo.suggestions
    });

    return res.json({
      url: seo.url,
      domain: seo.domain,
      title: seo.title,
      metaDescription: seo.metaDescription,
      seoScore: seo.seoScore,
      breakdown: seo.breakdown,
      issues: seo.issues,
      suggestions: seo.suggestions,
      keywords: keywords.slice(0, 10),
      pageSpeed: speedResult
    });
  } catch (err) {
    return res.status(500).json({ message: 'Analysis failed.', error: err.message });
  }
};

export const getKeywords = async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword || keyword.trim().length < 2) {
      return res.status(400).json({ message: 'Keyword must be at least 2 characters.' });
    }
    const keywords = generateKeywords(keyword.trim(), 20);
    return res.json({ keyword: keyword.trim(), count: keywords.length, keywords });
  } catch (err) {
    return res.status(500).json({ message: 'Keyword generation failed.', error: err.message });
  }
};

export const getUserHistory = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const filter = req.user ? { userId: req.user._id } : {};
    const [history, total] = await Promise.all([
      SearchHistory.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      SearchHistory.countDocuments(filter)
    ]);

    return res.json({ total, page, pages: Math.ceil(total / limit), history });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch history.', error: err.message });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalSearches,
      recentSearches,
      topDomains,
      scoreDistribution
    ] = await Promise.all([
      User.countDocuments(),
      SearchHistory.countDocuments(),
      SearchHistory.find({}).sort({ createdAt: -1 }).limit(10).select('url domain seoScore createdAt').lean(),
      SearchHistory.aggregate([
        { $group: { _id: '$domain', count: { $sum: 1 }, avgScore: { $avg: '$seoScore' } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      SearchHistory.aggregate([
        {
          $bucket: {
            groupBy: '$seoScore',
            boundaries: [0, 20, 40, 60, 80, 101],
            default: 'other',
            output: { count: { $sum: 1 } }
          }
        }
      ])
    ]);

    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date();
      day.setDate(day.getDate() - i);
      const start = new Date(day.setHours(0, 0, 0, 0));
      const end = new Date(day.setHours(23, 59, 59, 999));
      const count = await SearchHistory.countDocuments({ createdAt: { $gte: start, $lte: end } });
      last7Days.push({ date: start.toISOString().split('T')[0], count });
    }

    return res.json({
      totalUsers,
      totalSearches,
      recentSearches,
      topDomains,
      scoreDistribution,
      activityLast7Days: last7Days
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch admin stats.', error: err.message });
  }
};
