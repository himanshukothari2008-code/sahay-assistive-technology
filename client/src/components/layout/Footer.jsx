import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, PhoneCall, ExternalLink, ShieldCheck } from 'lucide-react';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t-2 border-slate-200 dark:border-slate-800 bg-[var(--bg-surface)] mt-16 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-200 dark:border-slate-800">
          {/* Col 1: About Sahay */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-extrabold text-base">
                S
              </div>
              <span className="font-extrabold text-xl">
                Sahay <span className="text-blue-600 dark:text-blue-400 font-normal text-sm">(सहाय)</span>
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              {t('footer.desc', 'An open-access educational and assistive technology platform fostering empathy, barrier-free access, and digital inclusion across India and beyond.')}
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
              <ShieldCheck className="w-4 h-4" />
              <span>{t('footer.wcag_badge', 'WCAG 2.2 Level AA Verified')}</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-4">
              {t('footer.col_topics', 'Explore Topics')}
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/category/visual-impairment" className="hover:text-blue-600">
                  {t('hero.link_vision', 'Visual Impairment')}
                </Link>
              </li>
              <li>
                <Link to="/category/hearing-impairment" className="hover:text-blue-600">
                  {t('hero.link_hearing', 'Hearing & Auditory Impairment')}
                </Link>
              </li>
              <li>
                <Link to="/category/mobility-physical" className="hover:text-blue-600">
                  {t('nav.categories', 'Mobility & Motor Disability')}
                </Link>
              </li>
              <li>
                <Link to="/simulations" className="hover:text-blue-600">
                  {t('nav.simulations', 'Interactive Simulations')}
                </Link>
              </li>
              <li>
                <Link to="/tools" className="hover:text-blue-600">
                  {t('nav.tools', 'Assistive Tools Suite')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Indian Rights & Government Portals */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-4">
              {t('footer.col_rights', 'Rights & Schemes (India)')}
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/rights-and-schemes" className="hover:text-blue-600 font-medium text-slate-800 dark:text-slate-200">
                  {t('rights_page.title', 'RPwD Act 2016 Guide')}
                </Link>
              </li>
              <li>
                <a
                  href="https://www.swavlambancard.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-blue-600"
                >
                  <span>Swavlamban (UDID) Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <a
                  href="https://sugamyapustakalaya.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-blue-600"
                >
                  <span>Sugamya Pustakalaya Library</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <a
                  href="https://disabilityaffairs.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-blue-600"
                >
                  <span>DEPwD Ministry Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: National Crisis & Support Helplines */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-rose-500" />
              <span>{t('footer.col_emergency', 'National Helplines (24x7)')}</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <span className="font-bold block text-slate-800 dark:text-slate-200">
                  {t('footer.helpline_kiran', 'KIRAN 24x7 Mental Health Helpline')}
                </span>
                <a href="tel:18005990019" className="text-blue-600 dark:text-blue-400 font-extrabold text-sm block mt-0.5">
                  1800-599-0019
                </a>
                <span className="text-slate-500 text-[11px]">Toll-Free, 13 languages</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <span className="font-bold block text-slate-800 dark:text-slate-200">
                  {t('footer.helpline_disability', 'DEPwD National Disability Helpline')}
                </span>
                <a href="tel:14416" className="text-blue-600 dark:text-blue-400 font-extrabold text-sm block mt-0.5">
                  14416 / 1800-891-4416
                </a>
                <span className="text-slate-500 text-[11px]">National Health Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p className="max-w-2xl text-center md:text-left">
            <strong>Disclaimer:</strong> {t('footer.bottom_statement', 'Designed with WCAG 2.2 AA and RPwD Act 2016 compliance. Built for college capstone presentation.')}
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" aria-hidden="true" />
            <span>for Universal Access</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
