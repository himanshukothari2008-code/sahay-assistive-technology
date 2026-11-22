import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  ExternalLink,
  Sparkles,
  ArrowLeft,
  Bookmark,
  Share2,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
  PhoneCall,
  Radio,
  Hand,
  AlertTriangle,
  Heart,
  Camera
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import SpeakButton from '../components/common/SpeakButton';
import QuizSection from '../components/category/QuizSection';
import MediaGallerySection from '../components/category/MediaGallerySection';
import Button from '../components/common/Button';
import SmartCane3DSimulator from '../components/simulations/SmartCane3DSimulator';
import BrailleSimulator from '../components/simulations/BrailleSimulator';
import ISLSimulator from '../components/simulations/ISLSimulator';
import MarkdownRenderer, { cleanMarkdownForSpeech } from '../components/common/MarkdownRenderer';
import { getLocalizedCategory } from '../i18n/categoryTranslations';

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

const CATEGORY_SIMS_MAP = {
  'visual-impairment': [
    { id: 'vision', titleKey: 'simulations.tab_vision', defaultTitle: '1. Vision & Color Blindness', icon: Eye },
    { id: 'smartcane', titleKey: 'simulations.tab_smartcane', defaultTitle: '2. 3D Smart Cane Solution', icon: Radio },
    { id: 'braille', titleKey: 'simulations.tab_braille', defaultTitle: '3. Braille & Tactile Reading', icon: Sparkles }
  ],
  'hearing-impairment': [
    { id: 'hearing', titleKey: 'simulations.tab_hearing', defaultTitle: '1. Hearing Frequency & Tinnitus', icon: Ear },
    { id: 'isl', titleKey: 'simulations.tab_isl', defaultTitle: '2. Indian Sign Language (ISL)', icon: Hand }
  ],
  'mobility-physical': [
    { id: 'motor', titleKey: 'simulations.tab_motor', defaultTitle: '1. Motor Tremors & Targeting', icon: Activity },
    { id: 'switch', titleKey: 'simulations.tab_switch', defaultTitle: '2. Single-Switch & Scanning', icon: Zap }
  ],
  'speech-language': [
    { id: 'aac', titleKey: 'simulations.tab_aac', defaultTitle: '1. AAC Speech Generating Board', icon: MessageSquare }
  ],
  'learning-disabilities': [
    { id: 'dyslexia', titleKey: 'simulations.tab_dyslexia', defaultTitle: '1. Dyslexia Reading & Letter Jitter', icon: BookOpen }
  ],
  'adhd': [
    { id: 'adhd', titleKey: 'simulations.tab_adhd', defaultTitle: '1. ADHD Focus Mode vs Distractions', icon: Zap }
  ],
  'autism-spectrum': [
    { id: 'sensory', titleKey: 'simulations.tab_sensory', defaultTitle: '1. Sensory Overload Awareness', icon: AlertTriangle }
  ],
  'mental-health': [
    { id: 'mental_health', titleKey: 'simulations.tab_mental_health', defaultTitle: '1. Anxiety Grounding & Crisis Card', icon: Heart }
  ]
};

export function CategoryPage() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const { prefs, updatePref } = useAccessibility();

  const [categoryData, setCategoryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [visualSolutionTab, setVisualSolutionTab] = useState('smartcane');

  useEffect(() => {
    async function fetchCategory() {
      try {
        setIsLoading(true);
        setError(null);
        window.scrollTo(0, 0);

        const res = await fetch(`/api/v1/categories/${slug}`);
        const json = await res.json();

        if (!res.ok) throw new Error(json.error || 'Failed to load category');
        setCategoryData(json.data);
      } catch (err) {
        console.error('Category fetch error:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCategory();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center" role="status">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-400">Loading topic details from database...</p>
      </div>
    );
  }

  if (error || !categoryData) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="p-8 rounded-2xl bg-red-50 dark:bg-red-950/40 border-2 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200">
          <h2 className="text-2xl font-bold mb-2">Category Not Found</h2>
          <p className="mb-6">{error || 'The requested category could not be found.'}</p>
          <Link to="/">
            <Button variant="primary" icon={ArrowLeft}>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const localized = getLocalizedCategory(categoryData, i18n.language) || categoryData;
  const IconComponent = iconMap[localized.icon] || Accessibility;
  const blocks = localized.blocks || [];
  const catSims = CATEGORY_SIMS_MAP[categoryData.slug] || [];

  // Group blocks by type
  const overviewBlock = blocks.find((b) => b.type === 'overview');
  const challengeBlock = blocks.find((b) => b.type === 'challenge');
  const simulationBlock = blocks.find((b) => b.type === 'simulation');
  const solutionBlock = blocks.find((b) => b.type === 'solution');
  const toolBlock = blocks.find((b) => b.type === 'tool');
  const resourceBlock = blocks.find((b) => b.type === 'resource');
  const mythFactBlock = blocks.find((b) => b.type === 'myth_fact');

  const navItems = [
    { id: 'sec-overview', label: t('sections.sec1', '1. What is it?') },
    { id: 'sec-challenges', label: t('sections.sec2', '2. Challenges') },
    { id: 'sec-simulation', label: t('sections.sec3', '3. Experience it') },
    { id: 'sec-solutions', label: t('sections.sec4', '4. Solutions') },
    { id: 'sec-tools', label: t('sections.sec5', '5. Try Tools') },
    { id: 'sec-media', label: t('sections.sec6', '6. Media Gallery') },
    { id: 'sec-quiz', label: t('sections.sec7', '7. Quiz') },
    { id: 'sec-resources', label: t('sections.sec8', '8. Rights & Support') },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Category Hero Banner */}
      <section className="bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-[var(--bg-primary)] border-b border-slate-200 dark:border-slate-800 pt-8 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-slate-500 dark:text-slate-400">
            <Link to="/" className="hover:text-blue-600 flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              <span>{t('sections.all_categories', 'All Categories')}</span>
            </Link>
            <span>/</span>
            <span className="text-slate-800 dark:text-slate-200">{localized.title}</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-lg">
                <IconComponent className="w-7 h-7 sm:w-8 sm:h-8" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-2 text-slate-900 dark:text-slate-100">
                  {localized.title}
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                  {localized.summary}
                </p>
              </div>
            </div>

            {/* Quick Actions (Easy Read Toggle, Bookmark) */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0 flex-wrap">
              <button
                type="button"
                onClick={() => updatePref('easyRead', !prefs.easyRead)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border-2 font-bold text-xs sm:text-sm touch-target transition-all shrink-0 ${
                  prefs.easyRead
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-300 dark:bg-emerald-950 dark:text-emerald-100'
                    : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-800 dark:text-slate-200'
                }`}
                aria-pressed={prefs.easyRead}
              >
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t('sections.easy_read', 'Easy-Read')}: {prefs.easyRead ? 'ON' : 'OFF'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2 sm:p-2.5 rounded-xl border-2 touch-target shrink-0 ${
                  isBookmarked
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-slate-300 dark:border-slate-700 text-slate-600 hover:bg-slate-50'
                }`}
                title="Bookmark topic"
                aria-label="Bookmark this topic"
              >
                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-blue-600' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Table of Contents Navigation - Clean Responsive Flex Wrap to prevent any button clipping */}
      <nav
        className="sticky top-16 z-30 bg-[var(--bg-surface)]/95 backdrop-blur-md border-b-2 border-slate-200 dark:border-slate-800 shadow-sm"
        aria-label="Section shortcuts"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 py-2">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-semibold shrink-0 whitespace-nowrap text-slate-700 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Main 8-Section Body */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-14">
        {/* Section 1: What is it? (Overview & Myths vs Facts) */}
        <section id="sec-overview" className="scroll-mt-32">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 flex items-center justify-center text-sm font-bold shrink-0">1</span>
              <span>{t('sections.title_overview', 'What is it?')}</span>
            </h2>
            {overviewBlock && (
              <SpeakButton
                textToRead={cleanMarkdownForSpeech(prefs.easyRead && overviewBlock.easy_read_body ? overviewBlock.easy_read_body : overviewBlock.body_markdown)}
                label="Section 1 Overview"
              />
            )}
          </div>

          {overviewBlock && (
            <div className="p-6 sm:p-8 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-[var(--bg-surface)] shadow-sm leading-relaxed mb-6">
              <div className="max-w-none text-base sm:text-lg">
                {prefs.easyRead && overviewBlock.easy_read_body ? (
                  <div className="p-4 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-100 font-medium">
                    <span className="text-xs font-bold uppercase tracking-wider block mb-2 text-emerald-700 dark:text-emerald-300">
                      ✨ Easy-Read Explanation
                    </span>
                    <p>{overviewBlock.easy_read_body}</p>
                  </div>
                ) : (
                  <MarkdownRenderer content={overviewBlock.body_markdown} />
                )}
              </div>

              {overviewBlock.sources && overviewBlock.sources.length > 0 && (
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                  <span className="font-bold">{t('common.verified_sources', 'Verified Sources')}: </span>
                  {overviewBlock.sources.map((s, idx) => (
                    <a
                      key={idx}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline mr-3 inline-flex items-center gap-0.5"
                    >
                      <span>{s.name}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Myth vs Fact Box */}
          {mythFactBlock && (
            <div className="p-6 rounded-2xl border-2 border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                  {t('sections.debunking_myths', 'Debunking Common Misconceptions')}
                </span>
                <SpeakButton textToRead={cleanMarkdownForSpeech(mythFactBlock.body_markdown)} label="Myths vs Facts" />
              </div>
              <h3 className="text-xl font-bold text-amber-950 dark:text-amber-200 mb-3">
                {mythFactBlock.title}
              </h3>
              <MarkdownRenderer content={mythFactBlock.body_markdown} className="text-sm sm:text-base text-amber-900 dark:text-amber-300 leading-relaxed" />
            </div>
          )}
        </section>

        {/* Section 2: Daily-Life Challenges */}
        <section id="sec-challenges" className="scroll-mt-32">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 flex items-center justify-center text-sm font-bold shrink-0">2</span>
              <span>{t('sections.title_challenges', 'Daily-Life Challenges & Barriers')}</span>
            </h2>
            {challengeBlock && (
              <SpeakButton
                textToRead={cleanMarkdownForSpeech(prefs.easyRead && challengeBlock.easy_read_body ? challengeBlock.easy_read_body : challengeBlock.body_markdown)}
                label="Challenges"
              />
            )}
          </div>

          {challengeBlock ? (
            <div className="p-6 sm:p-8 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-[var(--bg-surface)] leading-relaxed shadow-sm">
              {prefs.easyRead && challengeBlock.easy_read_body ? (
                <div className="p-4 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-300 text-emerald-900 dark:text-emerald-100 font-medium">
                  <span className="text-xs font-bold uppercase tracking-wider block mb-2 text-emerald-700">
                    ✨ Easy-Read Summary
                  </span>
                  <p>{challengeBlock.easy_read_body}</p>
                </div>
              ) : (
                <MarkdownRenderer content={challengeBlock.body_markdown} />
              )}
            </div>
          ) : (
            <div className="p-6 border rounded-xl text-slate-500">Challenges documentation being compiled.</div>
          )}
        </section>

        {/* Section 3: Experience it (Interactive Simulations) */}
        <section id="sec-simulation" className="scroll-mt-32">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 flex items-center justify-center text-sm font-bold shrink-0">3</span>
              <span>{t('sections.title_simulation', 'Experience It: Interactive Simulation')}</span>
            </h2>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl border-2 border-blue-300 dark:border-blue-700 bg-gradient-to-br from-blue-50/70 to-indigo-50/70 dark:from-slate-900 dark:to-slate-950 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-600 text-white inline-block mb-3">
                  {t('sections.empathy_engine', 'Empathy Engine')}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {t('sections.experience_firsthand', 'Experience {{title}} First-Hand', { title: localized.title })}
                </h3>
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 max-w-xl leading-relaxed mb-4">
                  {simulationBlock ? simulationBlock.body_markdown : 'Test how visual filters, hearing frequency losses, or motor jitter affect computer interaction.'}
                </p>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {t('sections.simulation_disclaimer', '*Simulations are educational approximations designed to promote inclusive design.')}
                </div>
              </div>

              <div className="shrink-0">
                <Link to={`/simulations/${categoryData.slug}`}>
                  <Button variant="primary" size="lg" icon={Eye}>
                    {t('hero.launch_simulators', 'Launch Interactive Simulator')}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Dedicated category simulators chips */}
            {catSims && catSims.length > 0 && (
              <div className="mt-6 pt-5 border-t border-blue-200/70 dark:border-slate-800">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-3">
                  {t('sections.dedicated_simulators_for', 'Dedicated Simulators for this Topic ({{count}}):', { count: catSims.length })}
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  {catSims.map((sim) => {
                    const SimIcon = sim.icon;
                    return (
                      <Link
                        key={sim.id}
                        to={`/simulations/${categoryData.slug}?sim=${sim.id}`}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 shadow-sm hover:bg-blue-50 dark:hover:bg-slate-700 hover:scale-[1.02] transition-all"
                      >
                        <SimIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span>{t(sim.titleKey, sim.defaultTitle)}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 uppercase font-black">Launch</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Section 4: Solutions and Assistive Technologies */}
        <section id="sec-solutions" className="scroll-mt-32">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 flex items-center justify-center text-sm font-bold shrink-0">4</span>
              <span>{t('sections.title_solutions', 'Solutions & Assistive Technologies')}</span>
            </h2>
            {solutionBlock && (
              <SpeakButton
                textToRead={cleanMarkdownForSpeech(prefs.easyRead && solutionBlock.easy_read_body ? solutionBlock.easy_read_body : solutionBlock.body_markdown)}
                label="Solutions"
              />
            )}
          </div>

          {solutionBlock && (
            <div className="p-6 sm:p-8 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-[var(--bg-surface)] leading-relaxed shadow-sm">
              {prefs.easyRead && solutionBlock.easy_read_body ? (
                <div className="p-4 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-300 text-emerald-900 dark:text-emerald-100 font-medium">
                  <span className="text-xs font-bold uppercase tracking-wider block mb-2 text-emerald-700">
                    ✨ Easy-Read Solutions
                  </span>
                  <p>{solutionBlock.easy_read_body}</p>
                </div>
              ) : (
                <MarkdownRenderer content={solutionBlock.body_markdown} />
              )}
            </div>
          )}

          {/* Interactive Assistive Tech Solutions for Visual Impairment */}
          {categoryData.slug === 'visual-impairment' && (
            <div className="mt-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 inline-block mb-1">
                    {t('sections.assistive_solutions_badge', 'Interactive Assistive Solutions')}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {t('sections.visual_solutions_heading', 'Working Assistive Technology Simulators')}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setVisualSolutionTab('smartcane')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all touch-target ${
                      visualSolutionTab === 'smartcane'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {t('sections.smart_cane_tab', '1. 3D Smart Cane')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisualSolutionTab('braille')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all touch-target ${
                      visualSolutionTab === 'braille'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {t('sections.braille_tab', '2. Braille Simulator')}
                  </button>
                  <Link
                    to={`/simulations/visual-impairment?sim=${visualSolutionTab}`}
                    className="sm:ml-auto inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 underline underline-offset-2"
                  >
                    <span>{t('sections.open_in_dedicated_page', 'Open in Dedicated Simulator Page')}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {visualSolutionTab === 'smartcane' ? <SmartCane3DSimulator /> : <BrailleSimulator />}

              {/* AI-Powered Offline Document & Signboard Reader Feature Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white shadow-lg space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/30 text-blue-300 border border-blue-400/30 inline-block mb-2">
                      New AI Assistive Tool (Offline Native)
                    </span>
                    <h4 className="text-lg sm:text-xl font-extrabold">
                      AI Document & Signboard Reader (OCR + Regional TTS)
                    </h4>
                    <p className="text-xs sm:text-sm text-blue-100/90 max-w-xl mt-1 leading-relaxed">
                      Point a smartphone camera at printed prescriptions, bus destination boards, medicine packages, or government notices to have them extracted with client-side OCR and read aloud in Hindi, Telugu, or English.
                    </p>
                  </div>
                  <Link to="/tools?tab=docreader" className="shrink-0">
                    <Button variant="primary" size="md" icon={Camera}>
                      Launch Document Reader
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Indian Sign Language Solution for Hearing Impairment */}
          {categoryData.slug === 'hearing-impairment' && (
            <div className="mt-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 inline-block mb-1">
                    {t('sections.isl_solution_badge', 'Featured Linguistic Solution')}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {t('sections.isl_solution_title', 'Indian Sign Language (ISL) Interactive Lab & Fingerspeller')}
                  </h3>
                </div>
                <Link
                  to="/simulations/hearing-impairment?sim=isl"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 underline underline-offset-2 shrink-0"
                >
                  <span>{t('sections.open_in_dedicated_page', 'Open in Dedicated Simulator Page')}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
              <ISLSimulator />
            </div>
          )}
        </section>

        {/* Section 5: Try It (Working Tools Hub Link) */}
        <section id="sec-tools" className="scroll-mt-32">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 flex items-center justify-center text-sm font-bold shrink-0">5</span>
              <span>{t('sections.title_tools', 'Try It: Built-in Assistive Tools')}</span>
            </h2>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50/40 dark:bg-emerald-950/20">
            <h3 className="text-xl font-bold text-emerald-950 dark:text-emerald-200 mb-2">
              {t('sections.working_utilities', 'Working Browser Assistive Utilities')}
            </h3>
            <div className="text-sm sm:text-base text-slate-700 dark:text-slate-300 mb-4">
              {toolBlock ? (
                <MarkdownRenderer content={toolBlock.body_markdown} />
              ) : (
                <p>Try our built-in speech reader, AAC communication board, and high-contrast settings right now.</p>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/tools">
                <Button variant="primary" size="md">
                  {t('hero.explore_tools', 'Open Assistive Tools Hub')}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Section 6: Videos and Images Gallery */}
        <section id="sec-media" className="scroll-mt-32">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 flex items-center justify-center text-sm font-bold shrink-0">6</span>
              <span>{t('sections.title_media', 'Videos & Media Gallery (Captioned with Transcripts)')}</span>
            </h2>
          </div>

          <MediaGallerySection media={localized.media || categoryData.media || []} />
        </section>

        {/* Section 7: Interactive Quiz */}
        <section id="sec-quiz" className="scroll-mt-32">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 flex items-center justify-center text-sm font-bold shrink-0">7</span>
              <span>{t('sections.title_quiz', 'Interactive Knowledge Quiz')}</span>
            </h2>
          </div>

          <QuizSection
            questions={localized.quiz || categoryData.quiz || []}
            categoryId={localized.id || categoryData.id}
            categoryTitle={localized.title || categoryData.title}
          />
        </section>

        {/* Section 8: Resources, Rights & Support */}
        <section id="sec-resources" className="scroll-mt-32">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 flex items-center justify-center text-sm font-bold shrink-0">8</span>
              <span>{t('sections.title_resources', 'Resources, Rights & Support (India & Global)')}</span>
            </h2>
            {resourceBlock && (
              <SpeakButton textToRead={cleanMarkdownForSpeech(resourceBlock.body_markdown)} label="Resources and Support" />
            )}
          </div>

          {resourceBlock && (
            <div className="p-6 sm:p-8 rounded-2xl border-2 border-purple-200 dark:border-purple-900 bg-purple-50/40 dark:bg-purple-950/20 shadow-sm leading-relaxed mb-8">
              <MarkdownRenderer content={resourceBlock.body_markdown} className="mb-6 text-base sm:text-lg" />

              {resourceBlock.sources && (
                <div className="pt-4 border-t border-purple-200 dark:border-purple-800 text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">{t('common.official_portals', 'Official Portals:')} </span>
                  {resourceBlock.sources.map((s, idx) => (
                    <a
                      key={idx}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline mr-4 inline-flex items-center gap-1 font-semibold"
                    >
                      <span>{s.name}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* National Support Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-sm mb-2">
                <PhoneCall className="w-4 h-4" />
                <span>{t('common.helpline', '24x7 Helpline Support')}</span>
              </div>
              <h4 className="font-bold text-lg mb-1">{t('sections.kiran_title', 'KIRAN Mental Health & Disability')}</h4>
              <p className="text-xs text-slate-500 mb-3">{t('sections.kiran_desc', 'Toll-free national helpline by DEPwD, Government of India.')}</p>
              <a href="tel:18005990019" className="text-xl font-extrabold text-blue-600">1800-599-0019</a>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <div className="flex items-center gap-2 text-purple-600 font-bold text-sm mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>{t('common.official_portal', 'Government Portal')}</span>
              </div>
              <h4 className="font-bold text-lg mb-1">{t('sections.udid_card_title', 'Swavlamban Card (UDID)')}</h4>
              <p className="text-xs text-slate-500 mb-3">{t('sections.udid_card_desc', 'Apply for or verify your Unique Disability Identity Card.')}</p>
              <a
                href="https://www.swavlambancard.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
              >
                <span>{t('sections.visit_udid', 'Visit swavlambancard.gov.in')}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default CategoryPage;
