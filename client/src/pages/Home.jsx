import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  BarChart2, Layers, RefreshCw, Clock,
  Users, DollarSign, Settings, FolderOpen,
  TrendingUp, Share2, Monitor, Wrench, ChevronRight,
} from 'lucide-react';
import { useApp }        from '../context/AppContext.jsx';
import { useLanguage }   from '../hooks/useLanguage.js';
import { useCountUp }    from '../hooks/useCountUp.js';
import AIAgentButton     from '../components/AIAgentButton.jsx';

// ─── Animation variants ───────────────────────────────────────────────────────

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0  },
  exit:    { opacity: 0, y: -8 },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.35, ease: 'easeOut' } }),
};

// ─── Icon map for section cards ───────────────────────────────────────────────

const SECTION_ICONS = {
  'customer-care':   Users,
  'finance':         DollarSign,
  'om':              Settings,
  'projects':        FolderOpen,
  'strategy':        TrendingUp,
  'shared-services': Share2,
  'it-reports':      Monitor,
  'imo-technical':   Wrench,
};

// ─── KPI Card ─────────────────────────────────────────────────────────────────

/**
 * @param {{ label: string, value: number|null, displayText: string|null,
 *           Icon: React.ElementType, accentClass: string, spinning?: boolean, index: number }} props
 */
function KpiCard({ label, value, displayText, Icon, accentClass, spinning, index }) {
  const count = useCountUp(value || 0);
  const display = displayText || String(count);

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(10,37,64,0.16)' }}
      className="bg-surface rounded-xl shadow-card overflow-hidden flex flex-col"
    >
      {/* Accent top bar */}
      <div className={`h-1 w-full ${accentClass}`} />
      <div className="p-5 flex items-center gap-4 flex-1">
        <div className={`p-3 rounded-xl ${accentClass} bg-opacity-10 shrink-0`}>
          <Icon
            size={22}
            className={`${accentClass.replace('bg-', 'text-')} ${spinning ? 'animate-spin-slow' : ''}`}
          />
        </div>
        <div>
          <p className="text-2xl font-bold text-app-text tabular-nums leading-none">{display}</p>
          <p className="text-sm text-sidebar-text mt-1 leading-snug">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────

/**
 * @param {{ section: Object, index: number, isRTL: boolean }} props
 */
function SectionCard({ section, index, isRTL }) {
  const navigate      = useNavigate();
  const { t }         = useTranslation();
  const SectionIcon   = SECTION_ICONS[section.id] || Layers;
  const dbCount       = section.dashboards?.length || 0;

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.02, boxShadow: '0 8px 24px rgba(10,37,64,0.14)' }}
      onClick={() => navigate(`/section/${section.id}`)}
      className="bg-surface rounded-2xl shadow-card cursor-pointer p-6 flex flex-col gap-4 group"
    >
      {/* Icon circle */}
      <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
        <SectionIcon size={28} className="text-accent" />
      </div>

      {/* Names */}
      <div className="flex-1 min-w-0">
        <p className={`font-bold text-app-text text-base leading-snug ${isRTL ? 'text-right' : 'text-left'}`}>
          {isRTL ? section.label_ar : section.label_en}
        </p>
        <p className={`text-sidebar-text text-sm mt-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
          {isRTL ? section.label_en : section.label_ar}
        </p>
      </div>

      {/* Footer row */}
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <span className="text-xs font-medium bg-accent/10 text-accent px-2.5 py-1 rounded-full">
          {dbCount} {t('dashboards')}
        </span>
        <ChevronRight
          size={18}
          className={`text-sidebar-text group-hover:text-accent transition-colors ${isRTL ? 'rotate-180' : ''}`}
        />
      </div>
    </motion.div>
  );
}

// ─── Skeleton loaders ─────────────────────────────────────────────────────────

function KpiSkeleton() {
  return (
    <div className="bg-surface rounded-xl shadow-card overflow-hidden">
      <div className="h-1 w-full bg-app-border" />
      <div className="p-5 flex items-center gap-4">
        <div className="w-12 h-12 skeleton" />
        <div className="flex-1 space-y-2">
          <div className="h-6 w-16 skeleton" />
          <div className="h-4 w-28 skeleton" />
        </div>
      </div>
    </div>
  );
}

function SectionSkeleton() {
  return (
    <div className="bg-surface rounded-2xl shadow-card p-6 space-y-4">
      <div className="w-14 h-14 skeleton rounded-xl" />
      <div className="space-y-2">
        <div className="h-5 w-32 skeleton" />
        <div className="h-4 w-24 skeleton" />
      </div>
      <div className="h-6 w-20 skeleton rounded-full" />
    </div>
  );
}

// ─── Welcome Banner ───────────────────────────────────────────────────────────

function WelcomeBanner({ isRTL }) {
  const { t } = useTranslation();

  const hijriDate = useMemo(() => {
    try {
      const h = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
        day: 'numeric', month: 'long', year: 'numeric',
      }).format(new Date());
      const g = new Intl.DateTimeFormat('en-US', {
        day: 'numeric', month: 'long', year: 'numeric',
      }).format(new Date());
      return `${h}  ·  ${g}`;
    } catch {
      return '';
    }
  }, []);

  return (
    <div className="banner-gradient relative overflow-hidden rounded-2xl px-8 py-10 text-white">
      {/* Decorative water rings */}
      <div className="absolute -right-12 -top-12 w-48 h-48 border-2 border-white/5 rounded-full" aria-hidden="true" />
      <div className="absolute -right-4 -top-4  w-32 h-32 border-2 border-white/5 rounded-full" aria-hidden="true" />
      <div className="absolute left-1/2 bottom-0  w-64 h-64 border border-white/5 rounded-full" aria-hidden="true" />

      <div className={isRTL ? 'text-right' : 'text-left'}>
        <motion.h1
          initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-2xl md:text-3xl font-bold leading-snug font-arabic"
        >
          {t('welcome_title')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          className="mt-2 text-blue-200 text-sm md:text-base"
        >
          {t('welcome_subtitle')}
        </motion.p>
        {hijriDate && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-3 text-blue-300 text-xs"
          >
            {hijriDate}
          </motion.p>
        )}
      </div>
    </div>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────

export default function Home() {
  const { t }              = useTranslation();
  const { sections, loading } = useApp();
  const { isRTL }          = useLanguage();

  // Total report count across all sections
  const totalReports = useMemo(
    () => sections.reduce((sum, s) => sum + (s.dashboards?.reduce((ds, d) => ds + (d.reports?.length || 0), 0) || 0), 0),
    [sections],
  );

  const kpiCards = [
    { label: t('total_reports'),  value: totalReports || 24, displayText: null,          Icon: BarChart2,  accentClass: 'bg-accent',      spinning: false },
    { label: t('active_sections'),value: sections.length || 8, displayText: null,        Icon: Layers,     accentClass: 'bg-accent-dark',  spinning: false },
    { label: t('data_refresh'),   value: null,               displayText: t('in_progress'), Icon: RefreshCw,  accentClass: 'bg-success',      spinning: true  },
    { label: t('last_updated'),   value: null,               displayText: t('today'),    Icon: Clock,      accentClass: 'bg-danger',       spinning: false },
  ];

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex-1 p-4 md:p-6 lg:p-8 space-y-8"
    >
      {/* Welcome Banner */}
      <WelcomeBanner isRTL={isRTL} />

      {/* KPI Cards */}
      <section aria-labelledby="kpi-heading">
        <h2 id="kpi-heading" className="sr-only">Key Performance Indicators</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <KpiSkeleton key={i} />)
            : kpiCards.map((card, i) => (
                <KpiCard key={card.label} {...card} index={i} />
              ))
          }
        </div>
      </section>

      {/* Quick Access — Section Grid */}
      <section aria-labelledby="sections-heading">
        <h2
          id="sections-heading"
          className={`text-lg font-bold text-app-text mb-4 ${isRTL ? 'text-right' : 'text-left'}`}
        >
          {t('quick_access')} — <span className="font-arabic text-accent">الوصول السريع</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SectionSkeleton key={i} />)
            : sections.map((section, i) => (
                <SectionCard key={section.id} section={section} index={i} isRTL={isRTL} />
              ))
          }
        </div>
      </section>
      <AIAgentButton />
    </motion.div>
  );
}
