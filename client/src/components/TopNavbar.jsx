import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, Bell, Settings, Search, X, ChevronDown,
  LogOut, User, Globe, ExternalLink,
} from 'lucide-react';
import { useApp }      from '../context/AppContext.jsx';
import { useLanguage } from '../hooks/useLanguage.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** @param {string} lang @param {Date} date */
function formatHijri(date) {
  try {
    return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
      day: 'numeric', month: 'long', year: 'numeric',
    }).format(date);
  } catch {
    return '';
  }
}

/** @param {string} lang @param {Date} date */
function formatGregorian(lang, date) {
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-SA' : 'en-US', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  }).format(date);
}

/** @param {string} lang @param {Date} date */
function formatTime(lang, date) {
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-SA' : 'en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
  }).format(date);
}

// ─── Notification mock data ───────────────────────────────────────────────────
const NOTIFICATIONS = [
  { id: 1, title_en: 'Data refresh completed',   title_ar: 'اكتمل تحديث البيانات',   meta: 'Customer Analytics — 2 min ago' },
  { id: 2, title_en: 'New report available',      title_ar: 'تقرير جديد متاح',         meta: 'Financial Overview — 1 hr ago' },
  { id: 3, title_en: 'System maintenance notice', title_ar: 'إشعار صيانة النظام',       meta: 'IT Reports — Today, 08:00' },
];

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Top navigation bar — always sticky at the top of the viewport.
 * Includes: company branding, search (Ctrl+K), live Hijri/Gregorian clock,
 * language toggle, notifications, settings, and user profile dropdown.
 */
export default function TopNavbar() {
  const { t }                              = useTranslation();
  const navigate                           = useNavigate();
  const { sections, setSidebarOpen }       = useApp();
  const { isRTL, toggleLanguage, language } = useLanguage();

  // State
  const [now, setNow]                 = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setResults]   = useState([]);
  const [searchOpen, setSearchOpen]   = useState(false);
  const [userMenuOpen, setUserMenu]   = useState(false);
  const [notifOpen, setNotifOpen]     = useState(false);

  // Refs for click-outside detection
  const searchRef    = useRef(null);
  const searchWrap   = useRef(null);
  const userRef      = useRef(null);
  const notifRef     = useRef(null);

  // ── Live clock ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // ── Keyboard shortcut ───────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
        searchRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setSearchQuery('');
        setUserMenu(false);
        setNotifOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // ── Click outside ───────────────────────────────────────────────────────────
  useEffect(() => {
    const onMouseDown = (e) => {
      if (searchWrap.current && !searchWrap.current.contains(e.target)) {
        setSearchOpen(false);
        setSearchQuery('');
      }
      if (userRef.current  && !userRef.current.contains(e.target))  setUserMenu(false);
      if (notifRef.current && !notifRef.current.contains(e.target))  setNotifOpen(false);
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

  // ── Search logic ────────────────────────────────────────────────────────────
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) { setResults([]); return; }

    const hits = [];
    sections.forEach((sec) => {
      if (sec.label_en.toLowerCase().includes(q) || sec.label_ar.includes(searchQuery)) {
        hits.push({ type: 'section', id: sec.id, label_en: sec.label_en, label_ar: sec.label_ar });
      }
      sec.dashboards?.forEach((db) => {
        if (db.label_en.toLowerCase().includes(q) || db.label_ar.includes(searchQuery)) {
          hits.push({ type: 'dashboard', id: db.id, label_en: db.label_en, label_ar: db.label_ar, sectionId: sec.id });
        }
      });
    });
    setResults(hits.slice(0, 8));
  }, [searchQuery, sections]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleSearchResult = useCallback((result) => {
    setSearchOpen(false);
    setSearchQuery('');
    navigate(result.type === 'section' ? `/section/${result.id}` : `/dashboard/${result.id}`);
  }, [navigate]);

  // ── Derived display values ───────────────────────────────────────────────────
  const timeStr    = formatTime(language, now);
  const hijriStr   = formatHijri(now);
  const gregorianStr = formatGregorian(language, now);

  // ── Dropdown animation variants ─────────────────────────────────────────────
  const dropVariants = {
    hidden:  { opacity: 0, y: -8, scale: 0.96 },
    visible: { opacity: 1, y: 0,  scale: 1 },
    exit:    { opacity: 0, y: -8, scale: 0.96 },
  };
  const dropTransition = { duration: 0.15, ease: 'easeOut' };

  return (
    <nav
      className="h-16 bg-primary flex items-center justify-between px-3 lg:px-6 z-40 shadow-sidebar"
      style={{ position: 'sticky', top: 0 }}
      role="banner"
    >
      {/* ── LEFT: Hamburger + Branding ──────────────────────────────────────── */}
      <div className="flex items-center gap-2 lg:gap-3 shrink-0">

        {/* Hamburger — mobile only */}
        <button
          className="lg:hidden text-sidebar-text hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          onClick={() => setSidebarOpen((p) => !p)}
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        {/* NWC Official Logo PNG */}
        <div className="w-10 h-10 shrink-0">
          <img
            src="/nwc-logo.png"
            alt="National Water Company Logo"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Company name text block */}
        <div className="flex flex-col leading-tight">
          <span
            className="font-bold text-white"
            style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '15px', letterSpacing: '0.01em' }}
          >
            شركة المياه الوطنية
          </span>
          <span
            className="hidden sm:block text-sidebar-text"
            style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.02em' }}
          >
            National Water Company
          </span>
        </div>

        {/* Vertical divider + BI Portal block — hidden on small screens */}
        <div className="hidden md:flex items-center gap-3">
          <div className="h-8 w-px shrink-0" style={{ backgroundColor: '#1E3A5F' }} />
          <div className="flex flex-col leading-tight">
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#FFFFFF', fontWeight: '500', letterSpacing: '0.01em' }}>
              Smart Reports
            </span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#00B4D8', fontWeight: '500', letterSpacing: '0.05em' }}>
              BI Portal
            </span>
          </div>
        </div>
      </div>

      {/* ── CENTER: Search bar ──────────────────────────────────────────────── */}
      <div className="hidden md:flex flex-1 max-w-sm mx-6 relative" ref={searchWrap}>
        <div className="relative w-full">
          <Search
            size={14}
            className="absolute top-1/2 -translate-y-1/2 text-sidebar-text pointer-events-none"
            style={{ [isRTL ? 'right' : 'left']: '12px' }}
          />
          <input
            ref={searchRef}
            type="text"
            placeholder={t('search_placeholder')}
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
            onFocus={() => setSearchOpen(true)}
            dir={isRTL ? 'rtl' : 'ltr'}
            className="w-full bg-white/10 text-white placeholder-sidebar-text border border-white/10 rounded-full py-2 text-sm focus:outline-none focus:border-accent/50 focus:bg-white/15 transition-all"
            style={{
              paddingLeft:  isRTL ? '16px' : '36px',
              paddingRight: isRTL ? '36px' : '16px',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); setSearchOpen(false); }}
              className="absolute top-1/2 -translate-y-1/2 text-sidebar-text hover:text-white transition-colors"
              style={{ [isRTL ? 'left' : 'right']: '12px' }}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Search results dropdown */}
        <AnimatePresence>
          {searchOpen && searchResults.length > 0 && (
            <motion.div
              variants={dropVariants} initial="hidden" animate="visible" exit="exit"
              transition={dropTransition}
              className="absolute top-full mt-2 w-full bg-surface rounded-xl shadow-card-hover border border-app-border z-50 overflow-hidden"
              role="listbox"
              aria-label="Search results"
            >
              {searchResults.map((r) => (
                <button
                  key={`${r.type}-${r.id}`}
                  role="option"
                  onClick={() => handleSearchResult(r)}
                  className={`w-full px-4 py-3 hover:bg-app-bg flex items-center gap-3 border-b border-app-border last:border-0 transition-colors ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}
                >
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent/10 text-accent shrink-0 uppercase tracking-wide">
                    {r.type === 'section' ? t('section') : t('dashboard')}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-app-text truncate">
                      {isRTL ? r.label_ar : r.label_en}
                    </p>
                    <p className="text-xs text-sidebar-text truncate">
                      {isRTL ? r.label_en : r.label_ar}
                    </p>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
          {searchOpen && searchQuery && searchResults.length === 0 && (
            <motion.div
              variants={dropVariants} initial="hidden" animate="visible" exit="exit"
              transition={dropTransition}
              className="absolute top-full mt-2 w-full bg-surface rounded-xl shadow-card-hover border border-app-border z-50 p-4 text-center"
            >
              <p className="text-sm text-sidebar-text">{t('no_results')}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── RIGHT: Clock + Lang + Notifications + Settings + User ───────────── */}
      <div className="flex items-center gap-1.5 lg:gap-2 shrink-0">

        {/* Live clock (large screens) */}
        <div className="hidden xl:flex flex-col items-end leading-none mr-2">
          <span className="text-white text-xs font-medium tabular-nums">{timeStr}</span>
          <span className="text-sidebar-text text-[10px] mt-0.5">{hijriStr}</span>
          <span className="text-sidebar-text text-[10px]">{gregorianStr}</span>
        </div>

        {/* Language toggle */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-2.5 py-1.5 border border-accent/40 rounded-full text-xs text-accent hover:bg-accent/10 transition-colors min-h-[36px]"
          aria-label="Toggle language"
        >
          <Globe size={12} />
          <span className="font-medium">{language === 'ar' ? 'EN' : 'عربي'}</span>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setNotifOpen((p) => !p); setUserMenu(false); }}
            className="relative p-2 text-sidebar-text hover:text-white rounded-lg hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={t('notifications')}
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full" aria-hidden="true" />
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                variants={dropVariants} initial="hidden" animate="visible" exit="exit"
                transition={dropTransition}
                className={`absolute top-full mt-2 w-72 bg-surface rounded-xl shadow-card-hover border border-app-border z-50 overflow-hidden ${isRTL ? 'left-0' : 'right-0'}`}
                role="menu"
              >
                <div className="p-3 border-b border-app-border flex items-center justify-between">
                  <h3 className="font-semibold text-app-text text-sm">{t('notifications')}</h3>
                  <span className="text-xs bg-danger text-white px-1.5 py-0.5 rounded-full">
                    {NOTIFICATIONS.length}
                  </span>
                </div>
                {NOTIFICATIONS.map((n, i) => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 hover:bg-app-bg cursor-pointer transition-colors ${i < NOTIFICATIONS.length - 1 ? 'border-b border-app-border' : ''} ${isRTL ? 'text-right' : 'text-left'}`}
                  >
                    <p className="text-sm text-app-text font-medium">
                      {isRTL ? n.title_ar : n.title_en}
                    </p>
                    <p className="text-xs text-sidebar-text mt-0.5">{n.meta}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Settings */}
        <button
          className="hidden sm:flex p-2 text-sidebar-text hover:text-white rounded-lg hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] items-center justify-center"
          aria-label={t('settings')}
        >
          <Settings size={18} />
        </button>

        {/* User avatar + dropdown */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => { setUserMenu((p) => !p); setNotifOpen(false); }}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-white/10 transition-colors min-h-[44px]"
            aria-haspopup="true"
            aria-expanded={userMenuOpen}
          >
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
              MB
            </div>
            <div className="hidden lg:flex flex-col items-start max-w-[110px]">
              <span className="text-white text-xs font-medium truncate leading-none">Mohammed B. Osmud</span>
              <span className="text-sidebar-text text-[10px] mt-0.5 leading-none">Administrator</span>
            </div>
            <ChevronDown
              size={13}
              className={`text-sidebar-text hidden lg:block transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`}
            />
          </button>

          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                variants={dropVariants} initial="hidden" animate="visible" exit="exit"
                transition={dropTransition}
                className={`absolute top-full mt-2 w-52 bg-surface rounded-xl shadow-card-hover border border-app-border z-50 overflow-hidden ${isRTL ? 'left-0' : 'right-0'}`}
                role="menu"
              >
                <div className={`p-4 border-b border-app-border ${isRTL ? 'text-right' : 'text-left'}`}>
                  <p className="font-semibold text-app-text text-sm">Mohammed B. Osmud</p>
                  <p className="text-sidebar-text text-xs mt-0.5">BI Portal Administrator</p>
                </div>
                <div className="py-1.5">
                  {[
                    { label: t('profile'),  Icon: User },
                    { label: t('settings'), Icon: Settings },
                    { label: 'BI Portal',   Icon: ExternalLink },
                  ].map(({ label, Icon }) => (
                    <button
                      key={label}
                      role="menuitem"
                      className={`w-full px-4 py-2.5 text-sm text-app-text hover:bg-app-bg flex items-center gap-2.5 transition-colors ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}
                    >
                      <Icon size={14} className="text-sidebar-text shrink-0" />
                      {label}
                    </button>
                  ))}
                  <hr className="my-1 border-app-border" />
                  <button
                    role="menuitem"
                    className={`w-full px-4 py-2.5 text-sm text-danger hover:bg-app-bg flex items-center gap-2.5 transition-colors ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}
                  >
                    <LogOut size={14} className="shrink-0" />
                    {t('logout')}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
