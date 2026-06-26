import { useEffect, useMemo, useState } from 'react';
import { getHistory, getSuggestions } from './api';

const formatVolume = (value) => new Intl.NumberFormat('en-US').format(value);

function App() {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [history, setHistory] = useState([]);

  const canSearch = useMemo(() => keyword.trim().length >= 2, [keyword]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await getHistory();
        setHistory(data.history || []);
      } catch {
        setHistory([]);
      }
    };

    loadHistory();
  }, []);

  useEffect(() => {
    if (!canSearch) {
      setSuggestions([]);
      setError('');
      return undefined;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getSuggestions(keyword.trim());
        setSuggestions(data.suggestions || []);
        const latestHistory = await getHistory();
        setHistory(latestHistory.history || []);
      } catch (requestError) {
        setError(requestError?.response?.data?.message || 'Unable to fetch suggestions.');
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [keyword, canSearch]);

  return (
    <main className="app">
      <section className="panel">
        <h1>SearchBoost SEO Suggestion Search Engine</h1>
        <p>Type a keyword and get live SEO-friendly long-tail suggestions.</p>

        <input
          type="text"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Try: mern stack project"
          className="search-input"
        />

        {!canSearch ? <small>Enter at least 2 characters to start searching.</small> : null}
        {loading ? <small>Generating suggestions...</small> : null}
        {error ? <small className="error">{error}</small> : null}
      </section>

      <section className="grid">
        <article className="panel">
          <h2>Suggestions</h2>
          {suggestions.length === 0 ? (
            <p className="muted">No suggestions yet.</p>
          ) : (
            <ul className="suggestion-list">
              {suggestions.map((item) => (
                <li key={item.suggestion}>
                  <h3>{item.suggestion}</h3>
                  <div className="meta">
                    <span>SEO Score: {item.seoScore}</span>
                    <span>Difficulty: {item.difficulty}</span>
                    <span>Volume: {formatVolume(item.estimatedVolume)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </article>

        <article className="panel">
          <h2>Recent Search History</h2>
          {history.length === 0 ? (
            <p className="muted">History is empty.</p>
          ) : (
            <ul className="history-list">
              {history.map((item, index) => (
                <li key={`${item.keyword}-${item.suggestion}-${index}`}>
                  <strong>{item.keyword}</strong>
                  <span>{item.suggestion}</span>
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>
    </main>
  );
}

export default App;
