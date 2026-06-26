import axios from 'axios';
import * as cheerio from 'cheerio';

const fetchPage = async (url) => {
  const start = Date.now();
  const response = await axios.get(url, {
    timeout: 12000,
    headers: {
      'User-Agent':
        'Mozilla/5.0 (compatible; SearchBoostBot/1.0; +https://searchboost.app)'
    },
    maxRedirects: 5
  });
  const loadTime = Date.now() - start;
  return { html: response.data, loadTime, status: response.status };
};

const scoreTitle = ($) => {
  const title = $('title').text().trim();
  if (!title) return { score: 0, issue: 'Missing <title> tag', suggestion: 'Add a descriptive title tag (50-60 characters)' };
  if (title.length < 10) return { score: 8, issue: 'Title too short', suggestion: 'Expand title to 50-60 characters' };
  if (title.length > 70) return { score: 12, issue: 'Title too long (may be truncated)', suggestion: 'Keep title under 60 characters' };
  return { score: 20, issue: null, suggestion: null };
};

const scoreMeta = ($) => {
  const desc = $('meta[name="description"]').attr('content') || '';
  if (!desc) return { score: 0, issue: 'Missing meta description', suggestion: 'Add a meta description (140-160 characters)' };
  if (desc.length < 50) return { score: 8, issue: 'Meta description too short', suggestion: 'Expand meta description to 140-160 characters' };
  if (desc.length > 165) return { score: 12, issue: 'Meta description too long', suggestion: 'Trim meta description to under 160 characters' };
  return { score: 20, issue: null, suggestion: null };
};

const scoreHeadings = ($) => {
  const h1Count = $('h1').length;
  const h2Count = $('h2').length;
  if (h1Count === 0) return { score: 5, issue: 'No H1 tag found', suggestion: 'Add exactly one H1 tag as the main page title' };
  if (h1Count > 1) return { score: 12, issue: `Multiple H1 tags (${h1Count})`, suggestion: 'Use exactly one H1 tag per page' };
  if (h2Count === 0) return { score: 14, issue: 'No H2 subheadings found', suggestion: 'Add H2 subheadings to structure your content' };
  return { score: 20, issue: null, suggestion: null };
};

const scoreImages = ($) => {
  const images = $('img');
  const total = images.length;
  if (total === 0) return { score: 15, issue: null, suggestion: 'Consider adding relevant images with descriptive alt text' };
  let missing = 0;
  images.each((_, el) => {
    const alt = $(el).attr('alt');
    if (!alt || !alt.trim()) missing++;
  });
  if (missing === 0) return { score: 20, issue: null, suggestion: null };
  const ratio = missing / total;
  if (ratio > 0.5) return { score: 5, issue: `${missing} of ${total} images missing alt text`, suggestion: 'Add descriptive alt text to all images' };
  return { score: 12, issue: `${missing} image(s) missing alt text`, suggestion: 'Add alt text to remaining images' };
};

const scoreContentStructure = ($) => {
  const text = $('body').text().replace(/\s+/g, ' ').trim();
  const wordCount = text.split(' ').filter(Boolean).length;
  const hasSchema = $('script[type="application/ld+json"]').length > 0;
  const hasCanonical = $('link[rel="canonical"]').length > 0;
  const hasOG = $('meta[property^="og:"]').length > 0;
  let score = 0;
  const issues = [];
  const suggestions = [];
  if (wordCount < 300) { suggestions.push('Add more content (target 500+ words)'); } else { score += 8; }
  if (!hasSchema) { suggestions.push('Add JSON-LD structured data markup'); } else { score += 4; }
  if (!hasCanonical) { suggestions.push('Add a canonical link tag to prevent duplicate content'); } else { score += 4; }
  if (!hasOG) { suggestions.push('Add Open Graph meta tags for better social sharing'); } else { score += 4; }
  return { score: Math.min(20, score), issue: issues.join('. ') || null, suggestion: suggestions.join('. ') || null };
};

export const analyzeSEO = async (rawUrl) => {
  let url = rawUrl.trim();
  if (!url.startsWith('http')) url = `https://${url}`;

  const { html, loadTime } = await fetchPage(url);
  const $ = cheerio.load(html);

  const titleResult = scoreTitle($);
  const metaResult = scoreMeta($);
  const headingsResult = scoreHeadings($);
  const imagesResult = scoreImages($);
  const contentResult = scoreContentStructure($);

  const breakdown = {
    title: titleResult.score,
    metaDescription: metaResult.score,
    headings: headingsResult.score,
    imageAlt: imagesResult.score,
    contentStructure: contentResult.score
  };

  const seoScore = Object.values(breakdown).reduce((sum, v) => sum + v, 0);

  const issues = [
    titleResult.issue,
    metaResult.issue,
    headingsResult.issue,
    imagesResult.issue,
    contentResult.issue
  ].filter(Boolean);

  const suggestions = [
    titleResult.suggestion,
    metaResult.suggestion,
    headingsResult.suggestion,
    imagesResult.suggestion,
    contentResult.suggestion
  ].filter(Boolean);

  const title = $('title').text().trim();
  const metaDesc = $('meta[name="description"]').attr('content') || '';
  const domain = new URL(url).hostname;

  return {
    url,
    domain,
    title,
    metaDescription: metaDesc,
    seoScore,
    breakdown,
    issues,
    suggestions,
    loadTime
  };
};
