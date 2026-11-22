import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Eye,
  Ear,
  Accessibility,
  MessageSquare,
  BookOpen,
  Zap,
  Activity,
  HeartHandshake,
  Search,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Scale
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import Button from '../components/common/Button';
import { getLocalizedCategoryList } from '../i18n/categoryTranslations';

const iconMap = {
  Eye,
  Ear,
  Accessibility,
  MessageSquare,
  BookOpen,
  Zap,
  Activity,
  HeartHandshake
};

export function HomePage() {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { toggleDrawer } = useAccessibility();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadCategories() {
      try {
        setIsLoading(true);
        const res = await fetch('/api/v1/categories');
        const json = await res.json();
        setCategories(json.data || []);
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="space-y-16 sm:space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 sm:pt-12 pb-16 sm:pb-20 bg-gradient-to-b from-blue-50/80 via-white to-transparent dark:from-slate-900/80 dark:via-[var(--bg-primary)] dark:to-transparent border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 text-xs sm:text-sm font-bold mb-6 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>{t('hero.badge', 'WCAG 2.2 Level AA Accessible • RPwD Act 2016 Compliant')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 max-w-4xl mx-auto leading-tight">
            {t('hero.title_prefix', 'Empowering Universal Inclusion with')}{' '}
            <span className="text-blue-600 dark:text-blue-400">{t('hero.title_brand', 'Sahay (सहाय)')}</span>
          </h1>

          <p className="mt-5 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t('hero.subtitle', 'An open educational hub and assistive technology suite designed for people with disabilities, educators, and families. Explore conditions, test live empathy simulators, and discover modern accommodations.')}
          </p>

          {/* Hero Search Bar */}
          <form onSubmit={handleSearch} className="mt-8 max-w-xl mx-auto flex items-center gap-2" role="search">
            <div className="relative flex-1">
              <label htmlFor="hero-search" className="sr-only">
                {t('hero.search_placeholder', 'Search assistive topics or conditions')}
              </label>
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 pointer-events-none" />
              <input
                type="search"
                id="hero-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('hero.search_placeholder', 'Search e.g. screen reader, dyslexia, RPwD Act...')}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 text-sm sm:text-base shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400"
              />
            </div>
            <Button type="submit" variant="primary" size="lg" className="shrink-0">
              {t('hero.search_button', 'Search')}
            </Button>
          </form>

          {/* Quick Shortcuts */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 text-xs sm:text-sm font-semibold">
            <span className="text-slate-500">{t('hero.popular', 'Popular:')}</span>
            <Link to="/category/visual-impairment" className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors">
              {t('hero.link_vision', 'Low Vision & Blindness')}
            </Link>
            <Link to="/category/hearing-impairment" className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors">
              {t('hero.link_hearing', 'Indian Sign Language')}
            </Link>
            <Link to="/simulations" className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 transition-colors">
              {t('hero.link_simulations', 'Experience Simulators')}
            </Link>
          </div>
        </div>
      </section>

      {/* Main Categories Section */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b-2 border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              {t('hero.categories_title', 'Disability Pillars & Assistive Sections')}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-1">
              {t('hero.categories_subtitle', 'Select a category to explore clinical overviews, challenges, working tools, and interactive quizzes.')}
            </p>
          </div>

          <button
            type="button"
            onClick={toggleDrawer}
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline shrink-0"
          >
            <Sliders className="w-4 h-4" />
            <span>{t('hero.customize_display', 'Customize Display')}</span>
          </button>
        </div>

        {isLoading ? (
          <div className="py-20 text-center" role="status">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent mb-3"></div>
            <p className="text-slate-500 font-semibold">Loading topics...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {getLocalizedCategoryList(categories, i18n.language).map((cat) => {
              const IconComp = iconMap[cat.icon] || Accessibility;
              const isCore = ['visual-impairment', 'hearing-impairment', 'mobility-physical'].includes(cat.slug);

              return (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  className="group p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-[var(--bg-surface)] hover:border-blue-600 dark:hover:border-blue-400 transition-all shadow-sm hover:shadow-lg flex flex-col justify-between focus-visible:outline-none"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <IconComp className="w-6 h-6" aria-hidden="true" />
                      </div>
                      {isCore && (
                        <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                          {t('hero.sections_badge', '8 Full Sections')}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 mb-6">
                      {cat.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                    <span>{t('common.explore', 'Explore Section')}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Featured Empathy Simulator Showcase Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white shadow-xl relative overflow-hidden">
          <div className="max-w-3xl relative z-10">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/30 text-blue-300 border border-blue-400/30 inline-block mb-4">
              {t('hero.sim_banner_badge', 'Interactive Empathy Lab')}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold mb-4">
              {t('hero.sim_banner_title', 'Step Into Their Shoes: Real-Time Disability Simulators')}
            </h2>
            <p className="text-sm sm:text-lg text-blue-100/90 leading-relaxed mb-8">
              {t('hero.sim_banner_desc', 'Experience the visual blur of cataracts, peripheral vision loss of glaucoma, auditory frequency filters, cursor jitter of motor tremors, and the letter-scrambling of dyslexia in your browser.')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/simulations">
                <Button variant="primary" size="lg" icon={Eye}>
                  {t('hero.launch_simulators', 'Launch Interactive Simulators')}
                </Button>
              </Link>
              <Link to="/tools">
                <Button variant="secondary" size="lg">
                  {t('hero.explore_tools', 'Explore Working Tools')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Rights & RPwD Act 2016 Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-2xl border-2 border-purple-200 dark:border-purple-900/60 bg-purple-50/50 dark:bg-purple-950/20">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 font-bold text-xs uppercase tracking-wider mb-2">
                <Scale className="w-4 h-4 shrink-0" />
                <span>{t('hero.rights_badge', 'Legal Rights & Inclusion in India')}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2 text-slate-900 dark:text-slate-100">
                {t('hero.rights_title', 'Rights of Persons with Disabilities (RPwD) Act, 2016')}
              </h2>
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 max-w-2xl leading-relaxed">
                {t('hero.rights_desc', 'Mandates 4% reservation in government employment, accessible websites and public infrastructure, free assistive devices under the ADIP scheme, and national welfare through the UDID card.')}
              </p>
            </div>
            <div className="shrink-0">
              <Link to="/rights-and-schemes">
                <Button variant="primary" size="md">
                  {t('hero.read_rights_guide', 'Read RPwD Act Guide')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
