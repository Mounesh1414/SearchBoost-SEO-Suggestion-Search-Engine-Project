import axios from 'axios';

const GOOGLE_API_KEY = process.env.PAGESPEED_API_KEY || '';
const GOOGLE_PAGESPEED_URL = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

const getScoreLabel = (score) => {
  if (score >= 90) return 'Good';
  if (score >= 50) return 'Needs Improvement';
  return 'Poor';
};

const simulateMetrics = (loadTime) => {
  const base = Math.min(loadTime, 6000);
  const ttfb = Math.round(base * 0.15 + Math.random() * 100);
  const fcp = Math.round(base * 0.35 + Math.random() * 200);
  const lcp = Math.round(base * 0.8 + Math.random() * 300);
  const cls = parseFloat((Math.random() * 0.3).toFixed(3));
  const score = Math.max(10, Math.round(100 - (base / 60) - (lcp / 100) - cls * 50));
  return { score: Math.min(100, score), loadTime: base, ttfb, fcp, lcp, cls };
};

export const analyzePageSpeed = async (url, loadTime = 2000) => {
  if (GOOGLE_API_KEY) {
    try {
      const response = await axios.get(GOOGLE_PAGESPEED_URL, {
        params: {
          url,
          key: GOOGLE_API_KEY,
          strategy: 'mobile',
          category: 'performance'
        },
        timeout: 20000
      });

      const cats = response.data.lighthouseResult?.categories;
      const audits = response.data.lighthouseResult?.audits;
      const score = Math.round((cats?.performance?.score || 0.5) * 100);

      return {
        score,
        label: getScoreLabel(score),
        loadTime: Math.round((audits?.['speed-index']?.numericValue || loadTime)),
        ttfb: Math.round(audits?.['server-response-time']?.numericValue || 300),
        fcp: Math.round(audits?.['first-contentful-paint']?.numericValue || 1200),
        lcp: Math.round(audits?.['largest-contentful-paint']?.numericValue || 2500),
        cls: parseFloat((audits?.['cumulative-layout-shift']?.numericValue || 0.1).toFixed(3)),
        source: 'google'
      };
    } catch {
      // fallback to simulation if API call fails
    }
  }

  // Simulation mode: derive realistic metrics from actual HTTP load time
  const metrics = simulateMetrics(loadTime);
  return {
    ...metrics,
    label: getScoreLabel(metrics.score),
    source: 'simulated'
  };
};
