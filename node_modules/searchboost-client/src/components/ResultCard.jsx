const scoreColor = (score) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 50) return 'text-yellow-600';
  return 'text-red-600';
};

const scoreBg = (score) => {
  if (score >= 80) return 'bg-green-50 border-green-200';
  if (score >= 50) return 'bg-yellow-50 border-yellow-200';
  return 'bg-red-50 border-red-200';
};

const speedLabel = (score) => {
  if (score >= 90) return { text: 'Fast', cls: 'text-green-600 bg-green-100' };
  if (score >= 50) return { text: 'Moderate', cls: 'text-yellow-600 bg-yellow-100' };
  return { text: 'Slow', cls: 'text-red-600 bg-red-100' };
};

export default function ResultCard({ result }) {
  const { url, domain, title, metaDescription, seoScore, breakdown, issues, suggestions, keywords, pageSpeed } = result;
  const lbl = speedLabel(pageSpeed?.score || 0);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className={`border-b px-6 py-4 ${scoreBg(seoScore)}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Analyzed URL</p>
            <a href={url} target="_blank" rel="noreferrer" className="text-blue-700 font-semibold text-sm hover:underline truncate block">{url}</a>
            {title && <p className="text-gray-700 text-sm mt-1 truncate">{title}</p>}
          </div>
          <div className="text-center shrink-0">
            <div className={`text-5xl font-extrabold ${scoreColor(seoScore)}`}>{seoScore}</div>
            <div className="text-xs text-gray-500 mt-0.5">SEO Score / 100</div>
          </div>
        </div>
      </div>

      <div className="p-6 grid gap-6">
        {/* Score Breakdown */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Score Breakdown</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {Object.entries({
              Title: breakdown?.title,
              'Meta Desc': breakdown?.metaDescription,
              Headings: breakdown?.headings,
              Images: breakdown?.imageAlt,
              Content: breakdown?.contentStructure
            }).map(([label, score]) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                <div className={`text-xl font-bold ${scoreColor(score * 5)}`}>{score ?? 0}</div>
                <div className="text-xs text-gray-500 mt-0.5">{label}</div>
                <div className="text-xs text-gray-400">/20</div>
              </div>
            ))}
          </div>
        </div>

        {/* Page Speed */}
        {pageSpeed && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Page Speed</h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {[
                { label: 'Score', value: `${pageSpeed.score}`, suffix: '' },
                { label: 'Load Time', value: (pageSpeed.loadTime / 1000).toFixed(2), suffix: 's' },
                { label: 'TTFB', value: pageSpeed.ttfb, suffix: 'ms' },
                { label: 'FCP', value: pageSpeed.fcp, suffix: 'ms' },
                { label: 'LCP', value: pageSpeed.lcp, suffix: 'ms' },
                { label: 'CLS', value: pageSpeed.cls, suffix: '' }
              ].map(({ label, value, suffix }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                  <div className="text-sm font-bold text-gray-800">{value}{suffix}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
            <div className="mt-2">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${lbl.cls}`}>{lbl.text} Performance</span>
              {pageSpeed.source === 'simulated' && <span className="text-xs text-gray-400 ml-2">* Simulated metrics (add PAGESPEED_API_KEY for real data)</span>}
            </div>
          </div>
        )}

        {/* Issues & Suggestions */}
        <div className="grid sm:grid-cols-2 gap-4">
          {issues?.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-red-600 uppercase tracking-wide mb-2">⚠ Issues Found</h3>
              <ul className="space-y-1.5">
                {issues.map((issue, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                    <span className="text-red-400 mt-0.5">✗</span>{issue}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {suggestions?.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-green-600 uppercase tracking-wide mb-2">💡 Suggestions</h3>
              <ul className="space-y-1.5">
                {suggestions.map((suggestion, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
                    <span className="text-green-500 mt-0.5">✓</span>{suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Keywords */}
        {keywords?.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">🔑 Keyword Suggestions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-xs uppercase">
                    <th className="text-left px-3 py-2 rounded-tl-lg">Keyword</th>
                    <th className="text-center px-3 py-2">Score</th>
                    <th className="text-center px-3 py-2">Difficulty</th>
                    <th className="text-right px-3 py-2 rounded-tr-lg">Est. Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {keywords.slice(0, 8).map((kw, i) => (
                    <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-3 py-2 text-gray-800">{kw.keyword}</td>
                      <td className={`px-3 py-2 text-center font-semibold ${scoreColor(kw.seoScore)}`}>{kw.seoScore}</td>
                      <td className="px-3 py-2 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${kw.difficulty === 'Low' ? 'bg-green-100 text-green-700' : kw.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                          {kw.difficulty}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right text-gray-600">{kw.estimatedVolume.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Meta description */}
        {metaDescription && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Meta Description ({metaDescription.length} chars)</p>
            <p className="text-sm text-gray-700">{metaDescription}</p>
          </div>
        )}
      </div>
    </div>
  );
}
