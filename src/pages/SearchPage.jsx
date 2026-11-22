import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, ArrowRight, BookOpen, Layers, AlertCircle } from 'lucide-react';
import Button from '../components/common/Button';
import { cleanMarkdownForSpeech } from '../components/common/MarkdownRenderer';

export function SearchPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setSearchTerm(queryParam);
    if (!queryParam || queryParam.length < 2) {
      setResults([]);
      return;
    }

    async function performSearch() {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch(`/api/v1/search?q=${encodeURIComponent(queryParam)}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Search request failed');
        setResults(json.data || []);
      } catch (err) {
        console.error('Search error:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    performSearch();
  }, [queryParam]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm.trim() });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">
          {t('search.title', 'Search Sahay Knowledge Base')}
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          {t('search.subtitle', 'Find topics, clinical definitions, simulations, assistive hardware, and RPwD schemes.')}
        </p>

        <form onSubmit={handleFormSubmit} className="mt-6 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('search.placeholder', 'Search e.g. screen reader, braille, tremor, dyslexia, RPwD Act...')}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-[var(--bg-surface)] text-base focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400"
            />
          </div>
          <Button type="submit" variant="primary" size="md">
            {t('search.button', 'Search')}
          </Button>
        </form>
      </div>

      {isLoading ? (
        <div className="py-16 text-center" role="status">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mb-2"></div>
          <p className="text-slate-500 font-semibold">{t('search.searching', 'Searching across database...')}</p>
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-red-50 text-red-700 border border-red-200">
          {error}
        </div>
      ) : results.length > 0 ? (
        <div>
          <div className="text-sm font-semibold text-slate-500 mb-4">
            {t('search.found', 'Found {{count}} results for "{{query}}":', { count: results.length, query: queryParam })}
          </div>

          <div className="space-y-4">
            {results.map((item) => (
              <Link
                key={item.id}
                to={item.url}
                className="block p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-[var(--bg-surface)] hover:border-blue-600 dark:hover:border-blue-400 transition-all shadow-sm hover:shadow-md focus-visible:outline-none"
              >
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                    {item.type}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {item.title}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {cleanMarkdownForSpeech(item.snippet)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      ) : queryParam.length >= 2 ? (
        <div className="p-12 text-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <h3 className="text-lg font-bold mb-1">No matching results found</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            {t('search.no_results', 'No results found for "{{query}}". Try broader search terms like "vision", "hearing", or "UDID".', { query: queryParam })}
          </p>
        </div>
      ) : (
        <div className="p-12 text-center text-slate-500">
          Type at least 2 characters to search across all 8 disability pillars.
        </div>
      )}
    </div>
  );
}

export default SearchPage;
