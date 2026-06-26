import { Link } from 'react-router-dom';

const features = [
  { icon: '🔍', title: 'SEO Analyzer', desc: 'Full on-page SEO analysis with a 100-point score covering title, meta, headings, images, and content structure.' },
  { icon: '🔑', title: 'Keyword Engine', desc: 'Generate long-tail keywords with SEO score, difficulty, search volume, and intent classification.' },
  { icon: '⚡', title: 'Page Speed', desc: 'Measure real-world load time, TTFB, FCP, LCP, and CLS metrics for any website.' },
  { icon: '📊', title: 'Analytics', desc: 'Visualize your SEO trends with interactive charts and track progress over time.' },
  { icon: '📜', title: 'Search History', desc: 'Every analysis is saved so you can monitor improvements and revisit prior reports.' },
  { icon: '🔒', title: 'Secure Auth', desc: 'JWT-based authentication with protected routes and admin dashboard features.' }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-24 text-center text-white">
        <div className="inline-flex items-center gap-2 bg-blue-700/50 backdrop-blur border border-blue-500/30 rounded-full px-4 py-1.5 text-sm text-blue-200 mb-6">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse inline-block" />
          Live SEO Analysis Platform
        </div>
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
          Boost Your Website<br />
          <span className="text-blue-300">SEO Rankings</span>
        </h1>
        <p className="text-blue-200 text-xl max-w-2xl mx-auto mb-10">
          Analyze any URL in seconds. Get a detailed SEO score, keyword suggestions, and actionable recommendations to rank higher.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/analyzer"
            className="bg-blue-500 hover:bg-blue-400 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all shadow-lg hover:shadow-blue-500/30"
          >
            🚀 Analyze Your Website
          </Link>
          <Link
            to="/register"
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium px-8 py-4 rounded-xl text-lg transition-all"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'SEO Factors', value: '5' },
            { label: 'Score Points', value: '100' },
            { label: 'API Integrated', value: 'Yes' },
            { label: 'Always Free', value: '✓' }
          ].map((s) => (
            <div key={s.label} className="bg-white/10 border border-white/10 rounded-2xl p-4 text-center text-white backdrop-blur">
              <div className="text-3xl font-extrabold mb-1">{s.value}</div>
              <div className="text-blue-200 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Everything You Need to Rank</h2>
          <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">A complete toolkit to understand, improve, and track your SEO performance.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow bg-white">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-600 py-16 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to improve your SEO?</h2>
        <p className="text-blue-100 mb-8">Start analyzing websites instantly — no credit card required.</p>
        <Link to="/analyzer" className="bg-white text-blue-700 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors">
          Start Analyzing Free
        </Link>
      </section>
    </div>
  );
}
