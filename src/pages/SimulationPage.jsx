import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Eye,
  Ear,
  BookOpen,
  Activity,
  Zap,
  AlertTriangle,
  Sparkles,
  Info,
  Radio,
  Hand,
  MessageSquare,
  Heart,
  ArrowLeft,
  Layers,
  ChevronRight
} from 'lucide-react';

// Simulators
import VisionSimulator from '../components/simulations/VisionSimulator';
import HearingSimulator from '../components/simulations/HearingSimulator';
import DyslexiaSimulator from '../components/simulations/DyslexiaSimulator';
import MotorTremorSimulator from '../components/simulations/MotorTremorSimulator';
import SwitchScanningSimulator from '../components/simulations/SwitchScanningSimulator';
import ADHDSimulator from '../components/simulations/ADHDSimulator';
import SensorySimulator from '../components/simulations/SensorySimulator';
import SmartCane3DSimulator from '../components/simulations/SmartCane3DSimulator';
import BrailleSimulator from '../components/simulations/BrailleSimulator';
import ISLSimulator from '../components/simulations/ISLSimulator';
import SpeechAACSimulator from '../components/simulations/SpeechAACSimulator';
import MentalHealthSimulator from '../components/simulations/MentalHealthSimulator';

// Master Categories Definition
const CATEGORIES = [
  {
    slug: 'visual-impairment',
    title: { en: 'Visual Impairment', hi: 'दृष्टिबाधित', te: 'దృష్టి లోపం' },
    simIds: ['vision', 'smartcane', 'braille'],
    icon: Eye,
    color: 'blue'
  },
  {
    slug: 'hearing-impairment',
    title: { en: 'Hearing & Auditory', hi: 'श्रवण एवं श्रव्य', te: 'వినికిడి లోపం' },
    simIds: ['hearing', 'isl'],
    icon: Ear,
    color: 'emerald'
  },
  {
    slug: 'mobility-physical',
    title: { en: 'Mobility & Physical', hi: 'गतिशीलता एवं शारीरिक', te: 'శారీరక చలన లోపం' },
    simIds: ['motor', 'switch'],
    icon: Activity,
    color: 'teal'
  },
  {
    slug: 'speech-language',
    title: { en: 'Speech & Language', hi: 'वाक् एवं भाषा', te: 'భాష మరియు మాటల లోపం' },
    simIds: ['aac'],
    icon: MessageSquare,
    color: 'indigo'
  },
  {
    slug: 'learning-disabilities',
    title: { en: 'Learning Disabilities & Dyslexia', hi: 'सीखने की अक्षमता एवं डिस्लेक्सिया', te: 'అభ్యాస వైకల్యాలు మరియు డిస్లెక్సియా' },
    simIds: ['dyslexia'],
    icon: BookOpen,
    color: 'purple'
  },
  {
    slug: 'adhd',
    title: { en: 'ADHD & Focus', hi: 'एडीएचडी एवं ध्यान', te: 'ADHD & ఏకాగ్రత' },
    simIds: ['adhd'],
    icon: Zap,
    color: 'amber'
  },
  {
    slug: 'autism-spectrum',
    title: { en: 'Autism Spectrum', hi: 'ऑटिज्म स्पेक्ट्रम', te: 'ఆటిజం స్పెక్ట్రమ్' },
    simIds: ['sensory'],
    icon: AlertTriangle,
    color: 'orange'
  },
  {
    slug: 'mental-health',
    title: { en: 'Mental Health & Wellbeing', hi: 'मानसिक स्वास्थ्य एवं भावनात्मक कल्याण', te: 'మానసిక ఆరోగ్యం & శ్రేయస్సు' },
    simIds: ['mental_health'],
    icon: Heart,
    color: 'rose'
  }
];

// Master Simulators Registry
const SIMULATOR_REGISTRY = {
  vision: {
    id: 'vision',
    categorySlug: 'visual-impairment',
    labelKey: 'tab_vision',
    defaultLabel: '1. Vision & Color Blindness',
    icon: Eye,
    component: VisionSimulator
  },
  smartcane: {
    id: 'smartcane',
    categorySlug: 'visual-impairment',
    labelKey: 'tab_smartcane',
    defaultLabel: '2. 3D Smart Cane Solution',
    icon: Radio,
    component: SmartCane3DSimulator
  },
  braille: {
    id: 'braille',
    categorySlug: 'visual-impairment',
    labelKey: 'tab_braille',
    defaultLabel: '3. Braille & Tactile Reading',
    icon: Sparkles,
    component: BrailleSimulator
  },
  hearing: {
    id: 'hearing',
    categorySlug: 'hearing-impairment',
    labelKey: 'tab_hearing',
    defaultLabel: '1. Hearing Frequency & Tinnitus',
    icon: Ear,
    component: HearingSimulator
  },
  isl: {
    id: 'isl',
    categorySlug: 'hearing-impairment',
    labelKey: 'tab_isl',
    defaultLabel: '2. Indian Sign Language (ISL)',
    icon: Hand,
    component: ISLSimulator
  },
  motor: {
    id: 'motor',
    categorySlug: 'mobility-physical',
    labelKey: 'tab_motor',
    defaultLabel: '1. Motor Tremors & Targeting',
    icon: Activity,
    component: MotorTremorSimulator
  },
  switch: {
    id: 'switch',
    categorySlug: 'mobility-physical',
    labelKey: 'tab_switch',
    defaultLabel: '2. Single-Switch & Scanning',
    icon: Zap,
    component: SwitchScanningSimulator
  },
  aac: {
    id: 'aac',
    categorySlug: 'speech-language',
    labelKey: 'tab_aac',
    defaultLabel: '1. AAC Speech Generating Board',
    icon: MessageSquare,
    component: SpeechAACSimulator
  },
  dyslexia: {
    id: 'dyslexia',
    categorySlug: 'learning-disabilities',
    labelKey: 'tab_dyslexia',
    defaultLabel: '1. Dyslexia Reading & Letter Jitter',
    icon: BookOpen,
    component: DyslexiaSimulator
  },
  adhd: {
    id: 'adhd',
    categorySlug: 'adhd',
    labelKey: 'tab_adhd',
    defaultLabel: '1. ADHD Focus Mode vs Distractions',
    icon: Zap,
    component: ADHDSimulator
  },
  sensory: {
    id: 'sensory',
    categorySlug: 'autism-spectrum',
    labelKey: 'tab_sensory',
    defaultLabel: '1. Sensory Overload & Hypersensitivity',
    icon: AlertTriangle,
    component: SensorySimulator
  },
  mental_health: {
    id: 'mental_health',
    categorySlug: 'mental-health',
    labelKey: 'tab_mental_health',
    defaultLabel: '1. Anxiety Grounding & Crisis Card',
    icon: Heart,
    component: MentalHealthSimulator
  }
};

export function SimulationPage() {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language || 'en').split('-')[0];
  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Determine active category (either from URL path /simulations/:categorySlug or query param ?category=)
  const activeCategorySlug = categorySlug || searchParams.get('category') || null;
  const activeCategoryObj = CATEGORIES.find((c) => c.slug === activeCategorySlug) || null;

  // Determine which simulators to display
  const activeSimList = activeCategoryObj
    ? activeCategoryObj.simIds.map((id) => SIMULATOR_REGISTRY[id]).filter(Boolean)
    : Object.values(SIMULATOR_REGISTRY);

  // Active simulator within the current list
  const requestedSim = searchParams.get('sim') || searchParams.get('tab');
  const defaultSim = activeSimList.some((s) => s.id === requestedSim)
    ? requestedSim
    : activeSimList[0]?.id || 'vision';

  const [activeSim, setActiveSim] = useState(defaultSim);

  // Synchronize activeSim when category or query changes
  useEffect(() => {
    if (activeSimList.some((s) => s.id === requestedSim)) {
      setActiveSim(requestedSim);
    } else if (!activeSimList.some((s) => s.id === activeSim)) {
      setActiveSim(activeSimList[0]?.id || 'vision');
    }
  }, [activeCategorySlug, requestedSim]);

  const handleSelectSim = (simId) => {
    setActiveSim(simId);
    setSearchParams({ sim: simId });
  };

  const handleSelectCategory = (slug) => {
    if (!slug) {
      navigate('/simulations');
    } else {
      navigate(`/simulations/${slug}`);
    }
  };

  const ActiveComponent = SIMULATOR_REGISTRY[activeSim]?.component || VisionSimulator;
  const categoryTitle = activeCategoryObj ? activeCategoryObj.title[currentLang] || activeCategoryObj.title.en : null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Category Dedicated Breadcrumb & Header */}
      {activeCategoryObj ? (
        <div className="pb-6 border-b-2 border-slate-200 dark:border-slate-800 space-y-3">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-semibold mb-2">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              {t('nav.home', 'Home')}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to={`/category/${activeCategoryObj.slug}`} className="hover:text-blue-600 transition-colors">
              {categoryTitle}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-blue-600 dark:text-blue-400">
              {t('simulations.simulators', 'Simulators')}
            </span>
          </nav>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('simulations.category_only_badge', 'Category Dedicated Simulators')}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                {t('simulations.dedicated_title', '{{category}} Interactive Simulators', { category: categoryTitle })}
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                {t(
                  'simulations.dedicated_subtitle',
                  'Explore hands-on empathy simulators and working assistive technology solutions built specifically for {{category}}.',
                  { category: categoryTitle }
                )}
              </p>
            </div>

            <Link
              to={`/category/${activeCategoryObj.slug}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('simulations.back_to_category', '← Back to {{category}} Overview', { category: categoryTitle })}</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="pb-6 border-b-2 border-slate-200 dark:border-slate-800">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 mb-3">
            <Sparkles className="w-4 h-4" />
            <span>{t('simulations.badge', 'Interactive Empathy Suite')}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            {t('simulations.title', 'Disability Experience Simulators')}
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            {t(
              'simulations.subtitle',
              'Step into different sensory, motor, and cognitive experiences using real-time browser filters, Web Audio API frequency shifts, and physics-driven cursor jitter.'
            )}
          </p>

          <div className="mt-4 p-4 rounded-xl bg-blue-50 dark:bg-slate-800/80 border border-blue-200 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong>{t('simulations.edu_note_label', 'Educational Approximation Note:')} </strong>
              {t(
                'simulations.edu_note',
                'Simulations are designed to build empathy and highlight the necessity of accessible design (such as high-contrast colors, captions, and large touch targets). They do not replicate the full lived reality or adaptive strategies of individuals living with disabilities.'
              )}
            </div>
          </div>
        </div>
      )}

      {/* Category Filter Pill Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
          <span>{t('simulations.filter_by_category', 'Filter by Disability Category:')}</span>
          {activeCategoryObj && (
            <button
              type="button"
              onClick={() => handleSelectCategory(null)}
              className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              {t('simulations.all_categories_view', 'View All 8 Categories')}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <button
            type="button"
            onClick={() => handleSelectCategory(null)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
              !activeCategorySlug
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {t('simulations.all_categories_view', 'All Categories')} (12)
          </button>

          {CATEGORIES.map((cat) => {
            const isCatActive = activeCategorySlug === cat.slug;
            const Icon = cat.icon;
            const title = cat.title[currentLang] || cat.title.en;

            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => handleSelectCategory(cat.slug)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  isCatActive
                    ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{title}</span>
                <span className="opacity-75">({cat.simIds.length})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Simulator Switcher Tabs (Only Simulators of Current Category) */}
      <div
        role="tablist"
        aria-orientation="horizontal"
        className="flex flex-wrap items-center gap-2 pb-3 border-b-2 border-slate-200 dark:border-slate-800"
      >
        {activeSimList.map((simItem) => {
          const isSelected = activeSim === simItem.id;
          const Icon = simItem.icon;
          const label = t(`simulations.${simItem.labelKey}`, simItem.defaultLabel);

          return (
            <button
              key={simItem.id}
              role="tab"
              id={`sim-tab-${simItem.id}`}
              aria-selected={isSelected}
              aria-controls={`sim-panel-${simItem.id}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => handleSelectSim(simItem.id)}
              className={`flex items-center gap-2 px-4 py-2.5 font-bold text-xs sm:text-sm rounded-xl transition-all touch-target shrink-0 focus-visible:outline-none cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Simulator Viewport */}
      <div
        id={`sim-panel-${activeSim}`}
        role="tabpanel"
        aria-labelledby={`sim-tab-${activeSim}`}
        className="pt-2 focus-visible:outline-none"
      >
        <ActiveComponent />
      </div>
    </div>
  );
}

export default SimulationPage;
