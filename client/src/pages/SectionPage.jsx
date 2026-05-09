import { useMemo, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, ChevronLeft, Plus, UploadCloud, X,
  Users, DollarSign, Settings, FolderOpen,
  TrendingUp, Share2, Monitor, Wrench, Layers, CheckCircle2,
  FolderOpen as FolderIcon,
} from 'lucide-react';
import { useApp }                from '../context/AppContext.jsx';
import { useLanguage }           from '../hooks/useLanguage.js';
import { sectionsApi }           from '../api/index.js';
import AddReportModal            from '../components/AddReportModal.jsx';
import AddSubcategoryModal       from '../components/AddSubcategoryModal.jsx';
import ConfirmDeleteModal        from '../components/ConfirmDeleteModal.jsx';

// Sections that support adding subcategories / uploading reports
const ADDABLE_SECTIONS = ['customer-care', 'finance', 'projects', 'strategy'];

// ─── Variants ─────────────────────────────────────────────────────────────────

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: 'easeOut' },
  }),
};

// ─── Icon map ─────────────────────────────────────────────────────────────────

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

// ─── Dashboard Card ───────────────────────────────────────────────────────────

/**
 * @param {{ dashboard: Object, index: number, isRTL: boolean, onDelete: (id:string, label:string)=>void }} props
 */
function DashboardCard({ dashboard, index, isRTL, onDelete }) {
  const navigate = useNavigate();
  const { t }    = useTranslation();
  const reportCount = dashboard.reports?.length || 0;

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -3, boxShadow: '0 12px 28px rgba(10,37,64,0.16)' }}
      className="bg-surface rounded-2xl shadow-card overflow-hidden flex flex-col group relative"
    >
      {/* Delete X button (hover) */}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(dashboard.id, isRTL ? dashboard.label_ar : dashboard.label_en); }}
        className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity
                   w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow"
        aria-label="Delete"
      >
        <X size={12} strokeWidth={3} />
      </button>
      {/* Gradient strip */}
      <div className="card-gradient-strip h-1.5 w-full" />

      <div className="p-6 flex flex-col gap-4 flex-1">
        {/* Report count badge */}
        {reportCount > 0 && (
          <span className={`self-${isRTL ? 'end' : 'start'} text-xs font-semibold bg-accent/10 text-accent px-2.5 py-1 rounded-full`}>
            {reportCount} {t('reports')}
          </span>
        )}

        {/* Name */}
        <div className="flex-1">
          <h3 className={`font-bold text-app-text text-base leading-snug ${isRTL ? 'text-right' : 'text-left'}`}>
            {isRTL ? dashboard.label_ar : dashboard.label_en}
          </h3>
          <p className={`text-sidebar-text text-sm mt-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
            {isRTL ? dashboard.label_en : dashboard.label_ar}
          </p>
          {(isRTL ? dashboard.description_ar : dashboard.description_en) && (
            <p className={`text-sidebar-text text-xs mt-2 leading-relaxed line-clamp-3 ${isRTL ? 'text-right' : 'text-left'}`}>
              {isRTL ? dashboard.description_ar : dashboard.description_en}
            </p>
          )}
        </div>

        {/* View button */}
        <button
          onClick={() => navigate(`/dashboard/${dashboard.id}`)}
          className="w-full bg-accent hover:bg-accent-dark text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
        >
          {t('view_reports')}
        </button>
      </div>
    </motion.div>
  );
}

// ─── Report Tile ──────────────────────────────────────────────────────────────

/**
 * Small tile for sub-reports (shown for customer-care section).
 * @param {{ report: Object, index: number, isRTL: boolean }} props
 */
function ReportTile({ report, index, isRTL }) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.02, boxShadow: '0 4px 16px rgba(0,180,216,0.12)' }}
      className={`bg-surface rounded-xl shadow-card p-4 flex items-center gap-3 cursor-pointer border border-app-border hover:border-accent/30 transition-colors ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}
    >
      <div className="w-9 h-9 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
        <FileText size={16} className="text-accent" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-app-text truncate">
          {isRTL ? report.label_ar : report.label_en}
        </p>
        <p className="text-xs text-sidebar-text truncate">
          {isRTL ? report.label_en : report.label_ar}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Add-Subcategory Card ─────────────────────────────────────────────────────

function AddSubcategoryCard({ onClick, index, isRTL }) {
  const { t } = useTranslation();
  return (
    <motion.button
      custom={index} variants={cardVariants} initial="hidden" animate="visible"
      whileHover={{ y: -4, boxShadow: '0 14px 30px rgba(0,180,216,0.18)' }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      aria-label={t('add_cat_title')}
      className="bg-surface rounded-2xl shadow-card overflow-hidden flex flex-col group
                 border-2 border-dashed border-accent/30 hover:border-accent
                 transition-all duration-200 cursor-pointer min-h-[220px]"
    >
      <div className="h-1.5 w-full bg-gradient-to-r from-accent/30 to-accent-dark/30
                      group-hover:from-accent group-hover:to-accent-dark transition-all duration-300" />
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6">
        <div className="w-14 h-14 rounded-2xl bg-accent/10 group-hover:bg-accent/20
                        flex items-center justify-center transition-colors duration-200
                        ring-2 ring-accent/20 group-hover:ring-accent/40">
          <Plus size={26} className="text-accent" strokeWidth={2.5} />
        </div>
        <div className={isRTL ? 'text-right' : 'text-center'}>
          <p className="font-bold text-accent text-sm">{t('add_cat_card_title')}</p>
          <p className="text-sidebar-text text-xs mt-1 leading-relaxed">{t('add_cat_card_subtitle')}</p>
        </div>
      </div>
    </motion.button>
  );
}

// ─── Success Toast ────────────────────────────────────────────────────────────

function SuccessToast({ message, onHide }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0,  scale: 1 }}
          exit={{    opacity: 0, y: 60, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50
                     bg-primary text-white px-5 py-3 rounded-2xl shadow-2xl
                     flex items-center gap-3 min-w-[260px] max-w-xs"
        >
          <CheckCircle2 size={18} className="text-accent shrink-0" />
          <span className="text-sm font-medium">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Skeletons ────────────────────────────────────────────────────────────────

function DashboardCardSkeleton() {
  return (
    <div className="bg-surface rounded-2xl shadow-card overflow-hidden">
      <div className="h-1.5 w-full bg-app-border" />
      <div className="p-6 space-y-4">
        <div className="h-4 w-20 skeleton rounded-full" />
        <div className="space-y-2">
          <div className="h-5 w-36 skeleton" />
          <div className="h-4 w-28 skeleton" />
          <div className="h-3 w-full skeleton" />
          <div className="h-3 w-4/5 skeleton" />
        </div>
        <div className="h-10 w-full skeleton rounded-lg" />
      </div>
    </div>
  );
}

// ─── SectionPage ──────────────────────────────────────────────────────────────

export default function SectionPage() {
  const { t }                           = useTranslation();
  const { sectionId }                   = useParams();
  const navigate                        = useNavigate();
  const { sections, loading, refetchSections } = useApp();
  const { isRTL }                       = useLanguage();

  const [catModalOpen,    setCatModalOpen]    = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [submitting,      setSubmitting]      = useState(false);
  const [successMsg,      setSuccessMsg]      = useState('');
  const [deleteTarget,    setDeleteTarget]    = useState(null); // { id, label }
  const [deleteOpen,      setDeleteOpen]      = useState(false);

  const section = useMemo(
    () => sections.find((s) => s.id === sectionId),
    [sections, sectionId],
  );

  // Only show top-level dashboards (not grouped subcategories)
  const visibleDashboards = useMemo(
    () => (section?.dashboards || []).filter((db) => !db.group),
    [section],
  );

  const canAdd        = ADDABLE_SECTIONS.includes(sectionId);
  const SectionIcon   = SECTION_ICONS[sectionId] || Layers;
  const BreadCrumbChevron = isRTL ? ChevronLeft : ChevronRight;

  useMemo(() => {
    if (section) document.title = `BI Portal | ${section.label_en}`;
  }, [section]);

  const handleAddCategory = useCallback(async (formData, onError) => {
    setSubmitting(true);
    try {
      await sectionsApi.addCategory(sectionId, formData);
      await refetchSections();
      setCatModalOpen(false);
      setSuccessMsg(t('add_cat_success'));
      setTimeout(() => setSuccessMsg(''), 3500);
    } catch (err) {
      onError?.(err.message || t('add_report_error_generic'));
    } finally {
      setSubmitting(false);
    }
  }, [sectionId, refetchSections, t]);

  const handleAddReport = useCallback(async (formData, onError) => {
    setSubmitting(true);
    try {
      await sectionsApi.addDashboard(sectionId, formData);
      await refetchSections();
      setReportModalOpen(false);
      setSuccessMsg(t('add_report_success'));
      setTimeout(() => setSuccessMsg(''), 3500);
    } catch (err) {
      onError?.(err.message || t('add_report_error_generic'));
    } finally {
      setSubmitting(false);
    }
  }, [sectionId, refetchSections, t]);

  const handleDeleteClick = useCallback((id, label) => {
    setDeleteTarget({ id, label });
    setDeleteOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await sectionsApi.deleteDashboard(sectionId, deleteTarget.id);
      await refetchSections();
      setSuccessMsg(t('delete_success_category'));
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteOpen(false);
      setDeleteTarget(null);
    }
  }, [deleteTarget, sectionId, refetchSections, t]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteOpen(false);
    setDeleteTarget(null);
  }, []);

  if (!loading && !section) {
    return (
      <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"
        transition={{ duration: 0.3 }}
        className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
        <Layers size={48} className="text-sidebar-text" />
        <h2 className="text-xl font-bold text-app-text">{t('section_not_found')}</h2>
        <button onClick={() => navigate('/')}
          className="bg-accent hover:bg-accent-dark text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
          {t('try_home')}
        </button>
      </motion.div>
    );
  }

  return (
    <>
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex-1 p-4 md:p-6 lg:p-8 space-y-8">

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb"
        className={`flex items-center gap-1.5 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Link to="/" className="text-accent hover:underline font-medium">{t('breadcrumb_home')}</Link>
        <BreadCrumbChevron size={14} className="text-sidebar-text shrink-0" />
        <span className="text-app-text font-medium truncate">
          {loading ? '…' : (isRTL ? section?.label_ar : section?.label_en)}
        </span>
      </nav>

      {/* Section header */}
      {loading ? (
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 skeleton rounded-2xl" />
          <div className="space-y-2">
            <div className="h-7 w-40 skeleton" /><div className="h-5 w-32 skeleton" />
          </div>
        </div>
      ) : section && (
        <motion.div initial={{ opacity: 0, x: isRTL ? 20 : -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className={`flex items-center justify-between flex-wrap gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center shrink-0">
              <SectionIcon size={32} className="text-accent" />
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <h1 className="text-2xl font-bold text-app-text leading-snug">
                {isRTL ? section.label_ar : section.label_en}
              </h1>
              <p className="text-sidebar-text text-sm mt-0.5">
                {isRTL ? section.label_en : section.label_ar}
              </p>
            </div>
          </div>

        </motion.div>
      )}

      {/* Subcategory cards grid */}
      <section aria-label="Subcategories">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <DashboardCardSkeleton key={i} />)
            : (
              <>
                {visibleDashboards.map((db, i) => (
                  <DashboardCard key={db.id} dashboard={db} index={i} isRTL={isRTL} onDelete={handleDeleteClick} />
                ))}
                {canAdd && (
                  <AddSubcategoryCard
                    onClick={() => setCatModalOpen(true)}
                    index={visibleDashboards.length}
                    isRTL={isRTL}
                  />
                )}
              </>
            )
          }
        </div>
      </section>
    </motion.div>

    <AddSubcategoryModal
      isOpen={catModalOpen}
      onClose={() => setCatModalOpen(false)}
      onSubmit={handleAddCategory}
      submitting={submitting}
      sectionLabel={isRTL ? section?.label_ar : section?.label_en}
    />

    <AddReportModal
      isOpen={reportModalOpen}
      onClose={() => setReportModalOpen(false)}
      onSubmit={handleAddReport}
      submitting={submitting}
      sectionLabel={isRTL ? section?.label_ar : section?.label_en}
    />

    <SuccessToast message={successMsg} />

    <ConfirmDeleteModal
      open={deleteOpen}
      onConfirm={handleDeleteConfirm}
      onCancel={handleDeleteCancel}
      itemLabel={deleteTarget?.label}
    />
    </>
  );
}

