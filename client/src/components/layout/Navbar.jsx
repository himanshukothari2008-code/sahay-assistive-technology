import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Sliders,
  Search,
  Menu,
  X,
  Eye,
  Wrench,
  Scale,
  Sparkles,
  User,
  ShieldCheck,
  LogIn
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useAuth } from '../../context/AuthContext';
import LanguageSwitcher from '../common/LanguageSwitcher';

export function Navbar() {
  const { t } = useTranslation();
  const { toggleDrawer, prefs } = useAccessibility();
  const { user, isAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className="border-b-2 border-slate-200 dark:border-slate-800 bg-[var(--bg-surface)] sticky top-0 z-40 shadow-sm"
      aria-label="Main Navigation"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-1.5 sm:gap-3">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-3 focus-visible:outline-none rounded-lg p-1 shrink-0"
            aria-label="Sahay Home Page"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-extrabold text-lg sm:text-xl shadow-md shrink-0">
              S
            </div>
            <div className="shrink-0">
              <span className="font-extrabold text-lg sm:text-2xl tracking-tight text-slate-900 dark:text-slate-100">
                Sahay <span className="text-blue-600 dark:text-blue-400 font-medium text-xs sm:text-sm">(सहाय)</span>
              </span>
              <span className="hidden sm:block text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Assistive Technology Hub
              </span>
            </div>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden lg:flex items-center gap-0.5 xl:gap-1.5 font-semibold text-xs xl:text-sm shrink-0">
            <Link
              to="/#categories"
              className="px-2 xl:px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 whitespace-nowrap shrink-0 transition-colors"
            >
              {t('nav.categories', 'Categories')}
            </Link>
            <Link
              to="/simulations"
              className="px-2 xl:px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors"
            >
              <Eye className="w-4 h-4 text-blue-600 shrink-0" aria-hidden="true" />
              <span>{t('nav.simulations', 'Simulations')}</span>
            </Link>
            <Link
              to="/tools"
              className="px-2 xl:px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors"
            >
              <Wrench className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
              <span>{t('nav.tools', 'Tools')}</span>
            </Link>
            <Link
              to="/rights-and-schemes"
              className="px-2 xl:px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors"
            >
              <Scale className="w-4 h-4 text-purple-600 shrink-0" aria-hidden="true" />
              <span>{t('nav.rights', 'RPwD Rights')}</span>
            </Link>
            <Link
              to="/about"
              className="px-2 xl:px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 whitespace-nowrap shrink-0 transition-colors"
            >
              {t('nav.about', 'About')}
            </Link>
          </div>

          {/* Search Bar - Visible on extra large screens */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden 2xl:flex items-center max-w-[170px] relative shrink-0"
            role="search"
          >
            <label htmlFor="nav-search-input" className="sr-only">
              {t('nav.search_placeholder', 'Search conditions, tools...')}
            </label>
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" aria-hidden="true" />
            <input
              type="search"
              id="nav-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('nav.search_placeholder', 'Search...')}
              className="w-full pl-8 pr-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            />
          </form>

          {/* Quick Actions & Auth */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Language Switcher */}
            <LanguageSwitcher className="inline-flex shrink-0" />

            {/* Easy-Read Mode Active Badge */}
            {prefs.easyRead && (
              <span className="hidden 2xl:inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0 whitespace-nowrap">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                {t('nav.easy_read_active', 'Easy-Read')}
              </span>
            )}

            {/* Accessibility Drawer Toggle Button */}
            <button
              type="button"
              onClick={toggleDrawer}
              aria-label="Open Accessibility Display Controls"
              title="Accessibility Settings (Alt + A)"
              className="flex items-center gap-1.5 px-2 sm:px-2.5 xl:px-3 py-1.5 rounded-xl border-2 border-blue-600 bg-blue-50 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 font-bold text-xs sm:text-sm shrink-0 whitespace-nowrap hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors focus-visible:outline-none shadow-sm"
            >
              <Sliders className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="hidden xl:inline">{t('nav.access_controls', 'Access Controls')}</span>
            </button>

            {/* Auth Button or User Avatar */}
            {user ? (
              <div className="flex items-center gap-1.5 shrink-0">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300 font-bold text-xs shrink-0 whitespace-nowrap"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>{t('nav.admin', 'Admin')}</span>
                  </Link>
                )}

                <Link
                  to="/profile"
                  className="flex items-center gap-1.5 p-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold shrink-0 whitespace-nowrap"
                  title="View Profile"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline max-w-[70px] truncate">{user.name}</span>
                </Link>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold shrink-0 whitespace-nowrap"
              >
                <LogIn className="w-3.5 h-3.5 shrink-0" />
                <span>{t('nav.signin', 'Sign In')}</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 lg:hidden text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg touch-target focus-visible:outline-none shrink-0"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-[var(--bg-surface)] px-4 pt-3 pb-6 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-500">Language:</span>
            <LanguageSwitcher />
          </div>

          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('nav.search_placeholder', 'Search conditions, tools...')}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 text-sm"
            />
          </form>

          <div className="flex flex-col space-y-1 font-semibold">
            <Link
              to="/#categories"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {t('nav.categories', 'Categories')}
            </Link>
            <Link
              to="/simulations"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
            >
              <Eye className="w-5 h-5 text-blue-600" />
              <span>{t('nav.simulations', 'Interactive Simulations')}</span>
            </Link>
            <Link
              to="/tools"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
            >
              <Wrench className="w-5 h-5 text-emerald-600" />
              <span>{t('nav.tools', 'Assistive Tools')}</span>
            </Link>
            <Link
              to="/rights-and-schemes"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
            >
              <Scale className="w-5 h-5 text-purple-600" />
              <span>{t('nav.rights', 'RPwD Rights & Schemes')}</span>
            </Link>
            <Link
              to="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {t('nav.about', 'About & Citations')}
            </Link>

            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 flex items-center gap-2"
                >
                  <User className="w-5 h-5" />
                  <span>{t('nav.profile', 'My Profile')} ({user.name})</span>
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 flex items-center gap-2"
                  >
                    <ShieldCheck className="w-5 h-5" />
                    <span>{t('nav.admin', 'Admin Dashboard')}</span>
                  </Link>
                )}
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 rounded-lg bg-blue-600 text-white flex items-center gap-2 font-bold"
              >
                <LogIn className="w-5 h-5" />
                <span>{t('nav.signin', 'Sign In / Register')}</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
