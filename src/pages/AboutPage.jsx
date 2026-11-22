import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Heart, Users, BookOpen, ExternalLink, Scale } from 'lucide-react';

export function AboutPage() {
  const { t } = useTranslation();

  const commitments = [
    { title: t('about_page.c1_title', '4.5:1 Color Contrast'), desc: t('about_page.c1_desc', 'Every element adheres to strict contrast ratios across Light, Dark, High Contrast, and Yellow-on-Black modes.') },
    { title: t('about_page.c2_title', 'Keyboard Operability'), desc: t('about_page.c2_desc', 'All links, buttons, drawers, and modal dialogs are fully navigable using Tab, Shift+Tab, Arrow Keys, and Escape.') },
    { title: t('about_page.c3_title', '≥44px Touch Targets'), desc: t('about_page.c3_desc', 'All interactive elements maintain a minimum target size of 44x44 CSS pixels to accommodate motor tremors and touch screens.') },
    { title: t('about_page.c4_title', 'Easy-Read Mode'), desc: t('about_page.c4_desc', 'A global toggle transforms complex clinical terminology into plain-language summaries with visual icons.') },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="pb-8 border-b-2 border-slate-200 dark:border-slate-800">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-2">
          {t('about_page.badge', 'Capstone Project Documentation')}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          {t('about_page.title', 'About Sahay (सहाय)')}
        </h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          {t('about_page.subtitle', 'An open-access educational and assistive technology platform designed to make disability awareness, lived-experience simulations, and modern accommodations accessible to everyone.')}
        </p>
      </div>

      {/* Purpose & Empathy Mission */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Heart className="w-6 h-6 text-rose-500" />
          <span>{t('about_page.mission_title', 'Our Mission')}</span>
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-base sm:text-lg">
          {t('about_page.mission_desc', 'Disability is often viewed through medicalized or sympathetic lenses. Sahay is built on the Social Model of Disability: that people are disabled by barriers in environmental and digital design, not by their impairments. By providing real-time empathy simulators, working browser-powered assistive tools, and comprehensive legal guides, we aim to equip students, teachers, and developers to build universally inclusive products.')}
        </p>
      </section>

      {/* Technical Standards & WCAG Compliance */}
      <section className="p-8 rounded-3xl border-2 border-slate-200 dark:border-slate-700 bg-[var(--bg-surface)]">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm uppercase tracking-wider mb-2">
          <ShieldCheck className="w-5 h-5" />
          <span>{t('about_page.commitments_badge', 'Built to WCAG 2.2 Level AA Standards')}</span>
        </div>
        <h2 className="text-2xl font-bold mb-4">{t('about_page.commitments_title', 'Accessibility Commitments')}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700 dark:text-slate-300">
          {commitments.map((c, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-base mb-1 text-slate-900 dark:text-slate-100">{c.title}</h3>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sourced Citations & Academic Integrity */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-emerald-600" />
          <span>{t('about_page.citations_title', 'Verified Sources & Data References')}</span>
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {t('about_page.citations_desc', 'All factual statements, epidemiology numbers, and legal citations in Sahay are derived from verified official bodies:')}
        </p>

        <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <li className="flex items-center gap-2">
            <span>•</span>
            <a href="https://www.who.int" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">
              <span>World Health Organization (WHO) Fact Sheets on Blindness, Deafness & Disability</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </li>
          <li className="flex items-center gap-2">
            <span>•</span>
            <a href="https://disabilityaffairs.gov.in" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">
              <span>Ministry of Social Justice and Empowerment, Government of India - RPwD Act 2016</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </li>
          <li className="flex items-center gap-2">
            <span>•</span>
            <a href="https://www.w3.org/WAI/standards-guidelines/wcag/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">
              <span>W3C Web Accessibility Initiative (WAI) - WCAG 2.2 Specifications</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </li>
          <li className="flex items-center gap-2">
            <span>•</span>
            <a href="https://islrtc.nic.in" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">
              <span>Indian Sign Language Research and Training Centre (ISLRTC) Dictionary</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}

export default AboutPage;
