import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, ChevronLeft, ExternalLink,
  Maximize2, X, RefreshCw, AlertTriangle, Layers, FileText, Plus,
  UploadCloud, CheckCircle2,
} from 'lucide-react';
import { useApp }          from '../context/AppContext.jsx';
import { useLanguage }     from '../hooks/useLanguage.js';
import { dashboardsApi, sectionsApi } from '../api/index.js';
import ConfirmDeleteModal              from '../components/ConfirmDeleteModal.jsx';

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
    transition: { delay: i * 0.08, duration: 0.35, ease: 'easeOut' },
  }),
};

// ─── Loading Spinner ──────────────────────────────────────────────────────────

function LoadingSpinner({ message }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-app-bg gap-4 z-10">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-app-border" />
        <div className="absolute inset-0 rounded-full border-4 border-t-accent animate-spin" />
      </div>
      <p className="text-sidebar-text text-sm font-medium">{message}</p>
    </div>
  );
}

// ─── Embed Error Card ─────────────────────────────────────────────────────────

function EmbedErrorCard({ url, onRetry, isRTL }) {
  const { t } = useTranslation();
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-app-bg p-8 z-10">
      <div className="max-w-sm w-full bg-surface rounded-2xl shadow-card p-8 flex flex-col items-center gap-5 text-center">
        <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center">
          <AlertTriangle size={32} className="text-orange-400" />
        </div>
        <div>
          <h3 className="font-bold text-app-text text-lg">{t('error_embed_title')}</h3>
          <p className="text-sidebar-text text-sm mt-2 leading-relaxed">{t('error_embed_subtitle')}</p>
        </div>
        <div className={`flex gap-3 flex-wrap justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
          >
            <ExternalLink size={15} />
            {t('open_new_tab')}
          </a>
          <button
            onClick={onRetry}
            className="flex items-center gap-2 border border-app-border text-app-text hover:bg-app-bg px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <RefreshCw size={15} />
            {t('refresh')}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── DashboardViewer ──────────────────────────────────────────────────────────

export default function DashboardViewer() {
  const { t }             = useTranslation();
  const { dashboardId }   = useParams();
  const navigate          = useNavigate();
  const { sections, refetchSections } = useApp();
  const { isRTL }         = useLanguage();

  const [iframeKey,    setIframeKey]    = useState(0);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError,  setIframeError]  = useState(false);
  const [isFullscreen, setFullscreen]   = useState(false);

  // ── Report tile viewer state ────────────────────────────────────────────────
  const [viewingReport,        setViewingReport]        = useState(null);  // {label_en, url}
  const [reportIframeKey,      setReportIframeKey]      = useState(0);
  const [reportIframeLoaded,   setReportIframeLoaded]   = useState(false);
  const [reportIframeError,    setReportIframeError]    = useState(false);

  // ── Add report modal state ──────────────────────────────────────────────────
  const [addReportOpen,        setAddReportOpen]        = useState(false);
  const [addReportName,        setAddReportName]        = useState('');
  const [addReportNameAr,      setAddReportNameAr]      = useState('');
  const [addReportUrl,         setAddReportUrl]         = useState('');
  const [addReportSubmitting,  setAddReportSubmitting]  = useState(false);
  const [addReportError,       setAddReportError]       = useState('');
  const [addReportSuccess,     setAddReportSuccess]     = useState('');

  // ── Delete confirmation state ──────────────────────────────────────────────────────
  const [deleteTarget,   setDeleteTarget]   = useState(null); // { type, id, label }
  const [deleteOpen,     setDeleteOpen]     = useState(false);
  const [deleteSuccessMsg, setDeleteSuccessMsg] = useState('');

  const iframeRef = useRef(null);

  // ── Find dashboard + parent section from context ────────────────────────────

  // ── Find dashboard + parent section from context ────────────────────────────
  const { dashboard, section } = useMemo(() => {
    for (const sec of sections) {
      const db = sec.dashboards?.find((d) => d.id === dashboardId);
      if (db) return { dashboard: db, section: sec };
    }
    return { dashboard: null, section: null };
  }, [sections, dashboardId]);

  // ── Sub-dashboards: other dashboards in the same section grouped under this id
  const subDashboards = useMemo(
    () => (section?.dashboards || []).filter(db => db.group === dashboardId),
    [section, dashboardId],
  );

  // ── Parent dashboard (when this dashboard is a subcategory, i.e. has group) ─
  const parentDashboard = useMemo(() => {
    if (!dashboard?.group || !section) return null;
    return section.dashboards?.find((db) => db.id === dashboard.group) || null;
  }, [dashboard, section]);

  // ── Page title ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (dashboard) {
      document.title = `BI Portal | ${dashboard.label_en}`;
    }
  }, [dashboard]);

  // ── ESC exits fullscreen / closes report viewer ────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (viewingReport) { setViewingReport(null); return; }
        if (isFullscreen) setFullscreen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isFullscreen, viewingReport]);

  // ── Refresh handler ─────────────────────────────────────────────────────────
  const handleRefresh = useCallback(() => {
    setIframeLoaded(false);
    setIframeError(false);
    setIframeKey((k) => k + 1);
  }, []);

  // ── Iframe timeout — show error if iframe hasn't loaded after 12s ───────────
  useEffect(() => {
    // When iframeLoaded becomes true, effect re-runs, hits early return, cleanup cancels timer.
    if (iframeLoaded || iframeError || !dashboard?.url) return;
    const timer = setTimeout(() => setIframeError(true), 12000);
    return () => clearTimeout(timer);
  }, [iframeKey, iframeLoaded, iframeError, dashboard?.url]);

  // ── Report iframe timeout ───────────────────────────────────────────────────
  useEffect(() => {
    if (reportIframeLoaded || reportIframeError || !viewingReport) return;
    const timer = setTimeout(() => setReportIframeError(true), 12000);
    return () => clearTimeout(timer);
  }, [reportIframeKey, reportIframeLoaded, reportIframeError, viewingReport?.resolvedUrl]);

  // ── Add report to dashboard ─────────────────────────────────────────────────
  const handleAddReport = useCallback(async () => {
    if (!addReportName.trim()) { setAddReportError(t('add_report_error_name')); return; }
    if (!addReportUrl.trim())  { setAddReportError(t('add_report_error_url'));  return; }
    try { new URL(addReportUrl.trim()); } catch {
      setAddReportError(t('add_report_error_url_invalid')); return;
    }
    setAddReportSubmitting(true);
    setAddReportError('');
    try {
      await dashboardsApi.addReport(dashboardId, {
        label_en: addReportName.trim(),
        label_ar: addReportNameAr.trim() || addReportName.trim(),
        url: addReportUrl.trim(),
      });
      await refetchSections();
      setAddReportOpen(false);
      setAddReportName('');
      setAddReportNameAr('');
      setAddReportUrl('');
      setAddReportSuccess(t('add_report_success'));
      setTimeout(() => setAddReportSuccess(''), 3500);
    } catch (err) {
      setAddReportError(err.message || t('add_report_error_generic'));
    } finally {
      setAddReportSubmitting(false);
    }
  }, [dashboardId, addReportName, addReportNameAr, addReportUrl, refetchSections, t]);

  const handleDeleteClick = useCallback((type, id, label) => {
    setDeleteTarget({ type, id, label });
    setDeleteOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === 'report') {
        await dashboardsApi.deleteReport(dashboardId, deleteTarget.id);
        setDeleteSuccessMsg(t('delete_success_report'));
      } else {
        await sectionsApi.deleteDashboard(section?.id, deleteTarget.id);
        setDeleteSuccessMsg(t('delete_success_category'));
      }
      await refetchSections();
      setTimeout(() => setDeleteSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteOpen(false);
      setDeleteTarget(null);
    }
  }, [deleteTarget, dashboardId, section, refetchSections, t]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteOpen(false);
    setDeleteTarget(null);
  }, []);

  const BreadCrumbChevron = isRTL ? ChevronLeft : ChevronRight;

  // ── Not found state ─────────────────────────────────────────────────────────
  const isDataReady = sections.length > 0;

  // ── Report tiles listing page (has reports but no sub-dashboards) ────────────
  if (isDataReady && dashboard && (dashboard.reports?.length ?? 0) > 0 && subDashboards.length === 0) {
    const tileUrl = (report) => report.url || dashboard.url;

    return (
      <>
      <motion.div
        variants={pageVariants} initial="initial" animate="animate" exit="exit"
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="flex-1 p-4 md:p-6 lg:p-8 space-y-8"
      >
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className={`flex items-center gap-1.5 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Link to="/" className="text-accent hover:underline font-medium">{t('breadcrumb_home')}</Link>
          <BreadCrumbChevron size={14} className="text-sidebar-text shrink-0" />
          {section && (
            <>
              <Link to={`/section/${section.id}`} className="text-accent hover:underline font-medium truncate">
                {isRTL ? section.label_ar : section.label_en}
              </Link>
              <BreadCrumbChevron size={14} className="text-sidebar-text shrink-0" />
            </>
          )}
          {parentDashboard && (
            <>
              <Link to={`/dashboard/${parentDashboard.id}`} className="text-accent hover:underline font-medium truncate">
                {isRTL ? parentDashboard.label_ar : parentDashboard.label_en}
              </Link>
              <BreadCrumbChevron size={14} className="text-sidebar-text shrink-0" />
            </>
          )}
          <span className="text-app-text font-medium">
            {isRTL ? dashboard.label_ar : dashboard.label_en}
          </span>
        </nav>

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center shrink-0">
            <Layers size={32} className="text-accent" />
          </div>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h1 className="text-2xl font-bold text-app-text leading-snug">
              {isRTL ? dashboard.label_ar : dashboard.label_en}
            </h1>
            <p className="text-sidebar-text text-sm mt-0.5">
              {isRTL ? dashboard.label_en : dashboard.label_ar}
            </p>
          </div>
        </motion.div>

        {/* Section divider */}
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="h-px flex-1 bg-gradient-to-r from-accent/30 to-transparent" />
          <span className="text-xs font-semibold bg-accent/10 text-accent px-3 py-1.5 rounded-full">
            {t('report_tiles_heading')}
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-accent/30 to-transparent" />
        </div>

        {/* Report tiles — 2-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {dashboard.reports.map((report, i) => (
            <div key={report.id} className="relative group">
              <motion.button
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(10,37,64,0.14)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setReportIframeLoaded(false);
                  setReportIframeError(false);
                  setReportIframeKey(k => k + 1);
                  setViewingReport({ ...report, resolvedUrl: tileUrl(report) });
                }}
                className="bg-surface rounded-xl shadow-card border border-app-border overflow-hidden
                           flex items-center gap-4 p-4 cursor-pointer group text-left
                           hover:border-accent/40 transition-all duration-200 w-full"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0
                                group-hover:bg-accent/20 transition-colors duration-200">
                  <FileText size={22} className="text-accent" />
                </div>
                <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <p className="font-bold text-app-text text-sm leading-snug truncate">
                    {report.label_en}
                  </p>
                  {report.label_ar && (
                    <p className="text-sidebar-text text-xs mt-0.5 font-arabic truncate">
                      {report.label_ar}
                    </p>
                  )}
                </div>
                <ExternalLink size={14} className="text-sidebar-text shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
              {/* Delete X */}
              <button
                onClick={(e) => { e.stopPropagation(); handleDeleteClick('report', report.id, isRTL ? report.label_ar : report.label_en); }}
                className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity
                           w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white
                           flex items-center justify-center shadow"
                aria-label="Delete"
              >
                <X size={12} strokeWidth={3} />
              </button>
            </div>
          ))}

          {/* ── Add report + tile ── */}
          <motion.button
            custom={dashboard.reports.length}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,180,216,0.15)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setAddReportError(''); setAddReportOpen(true); }}
            className="bg-surface rounded-xl border-2 border-dashed border-accent/30 hover:border-accent
                       flex items-center gap-4 p-4 cursor-pointer group transition-all duration-200
                       min-h-[72px]"
          >
            <div className="w-12 h-12 rounded-xl bg-accent/10 group-hover:bg-accent/20
                            flex items-center justify-center shrink-0 transition-colors duration-200
                            ring-2 ring-accent/20 group-hover:ring-accent/40">
              <Plus size={20} className="text-accent" strokeWidth={2.5} />
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <p className="font-bold text-accent text-sm">{t('add_report_card_title')}</p>
              <p className="text-sidebar-text text-xs mt-0.5">{t('add_report_card_subtitle')}</p>
            </div>
          </motion.button>
        </div>
      </motion.div>

      {/* ── Report iframe viewer modal ── */}
      <AnimatePresence>
        {viewingReport && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col"
            onClick={(e) => { if (e.target === e.currentTarget) setViewingReport(null); }}
          >
            {/* Header bar */}
            <div className={`flex items-center justify-between px-4 py-3 bg-primary border-b border-white/10
                             shrink-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                  <FileText size={16} className="text-accent" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm leading-none">{viewingReport.label_en}</p>
                  {viewingReport.label_ar && (
                    <p className="text-white/50 text-xs mt-0.5 font-arabic">{viewingReport.label_ar}</p>
                  )}
                </div>
              </div>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <a href={viewingReport.resolvedUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-white/70 hover:text-white
                             text-xs px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors">
                  <ExternalLink size={13} />
                  <span className="hidden sm:inline">{t('open_new_tab')}</span>
                </a>
                <button onClick={() => { setReportIframeLoaded(false); setReportIframeError(false); setReportIframeKey(k => k + 1); }}
                  className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                  <RefreshCw size={14} />
                </button>
                <button onClick={() => setViewingReport(null)}
                  className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Iframe area */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="flex-1 relative bg-white overflow-hidden"
            >
              {!reportIframeLoaded && !reportIframeError && (
                <LoadingSpinner message={t('loading_dashboard')} />
              )}
              {reportIframeError && (
                <EmbedErrorCard url={viewingReport.resolvedUrl}
                  onRetry={() => { setReportIframeLoaded(false); setReportIframeError(false); setReportIframeKey(k => k+1); }}
                  isRTL={isRTL} />
              )}
              {!reportIframeError && (
                <iframe
                  key={reportIframeKey}
                  src={viewingReport.resolvedUrl}
                  title={viewingReport.label_en}
                  frameBorder="0"
                  allowFullScreen
                  className={`absolute inset-0 w-full h-full transition-opacity duration-300
                               ${reportIframeLoaded ? 'opacity-100' : 'opacity-0'}`}
                  style={{ border: 'none' }}
                  onLoad={() => { setReportIframeLoaded(true); setReportIframeError(false); }}
                  onError={() => { setReportIframeLoaded(false); setReportIframeError(true); }}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Add report modal ── */}
      <AnimatePresence>
        {addReportOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setAddReportOpen(false); }}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0,  scale: 1 }}
              exit={{    opacity: 0, y: 16, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              dir={isRTL ? 'rtl' : 'ltr'}
              className="bg-surface rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-app-border">
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                    <UploadCloud size={18} className="text-accent" />
                  </div>
                  <div>
                    <h2 className="font-bold text-app-text text-base leading-none">{t('add_report_title')}</h2>
                    <p className="text-sidebar-text text-xs mt-0.5">{t('add_report_subtitle')}</p>
                  </div>
                </div>
                <button onClick={() => setAddReportOpen(false)}
                  className="text-sidebar-text hover:text-app-text p-1.5 rounded-lg hover:bg-app-bg transition-colors">
                  <X size={16} />
                </button>
              </div>

              {/* Error banner */}
              <AnimatePresence>
                {addReportError && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-6 pt-3">
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-3 py-2">
                      <AlertTriangle size={13} className="shrink-0" />
                      {addReportError}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <div className="px-6 py-5 space-y-4">
                <div>
                  <label className={`block text-xs font-semibold text-app-text mb-1.5 ${isRTL ? 'text-right' : ''}`}>
                    {t('add_report_name')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={addReportName}
                    onChange={(e) => { setAddReportName(e.target.value); setAddReportError(''); }}
                    placeholder={t('add_report_name_placeholder')}
                    className={`w-full border border-app-border rounded-xl px-3 py-2.5 text-sm text-app-text
                               bg-app-bg focus:outline-none focus:ring-2 focus:ring-accent/40
                               placeholder:text-sidebar-text ${isRTL ? 'text-right' : ''}`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-semibold text-app-text mb-1.5 ${isRTL ? 'text-right' : ''}`}>
                    {t('add_name_ar_label')}
                  </label>
                  <input
                    value={addReportNameAr}
                    onChange={(e) => setAddReportNameAr(e.target.value)}
                    placeholder={t('add_name_ar_placeholder')}
                    dir="rtl"
                    className="w-full border border-app-border rounded-xl px-3 py-2.5 text-sm text-app-text
                               bg-app-bg focus:outline-none focus:ring-2 focus:ring-accent/40
                               placeholder:text-sidebar-text text-right"
                  />
                </div>
                <div>
                  <label className={`block text-xs font-semibold text-app-text mb-1.5 ${isRTL ? 'text-right' : ''}`}>
                    {t('add_report_url')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={addReportUrl}
                    onChange={(e) => { setAddReportUrl(e.target.value); setAddReportError(''); }}
                    placeholder={t('add_report_url_placeholder')}
                    dir="ltr"
                    className="w-full border border-app-border rounded-xl px-3 py-2.5 text-sm text-app-text
                               bg-app-bg focus:outline-none focus:ring-2 focus:ring-accent/40
                               placeholder:text-sidebar-text"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className={`flex gap-3 px-6 pb-5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <button onClick={() => setAddReportOpen(false)}
                  className="flex-1 border border-app-border text-app-text hover:bg-app-bg
                             text-sm font-medium py-2.5 rounded-xl transition-colors">
                  {t('cancel')}
                </button>
                <button onClick={handleAddReport} disabled={addReportSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark
                             disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">
                  {addReportSubmitting
                    ? <><RefreshCw size={14} className="animate-spin" />{t('uploading')}</>
                    : <><UploadCloud size={14} />{t('upload_report')}</>
                  }
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Success toast ── */}
      <AnimatePresence>
        {addReportSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50
                       bg-primary text-white px-5 py-3 rounded-2xl shadow-2xl
                       flex items-center gap-3 min-w-[260px]"
          >
            <CheckCircle2 size={18} className="text-accent shrink-0" />
            <span className="text-sm font-medium">{addReportSuccess}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete success toast ── */}
      <AnimatePresence>
        {deleteSuccessMsg && (
          <motion.div
            initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60]
                       bg-primary text-white px-5 py-3 rounded-2xl shadow-2xl
                       flex items-center gap-3 min-w-[260px]"
          >
            <CheckCircle2 size={18} className="text-accent shrink-0" />
            <span className="text-sm font-medium">{deleteSuccessMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDeleteModal
        open={deleteOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        itemLabel={deleteTarget?.label}
      />
      </>
    );
  }

  // ── Sub-category listing page (this dashboard is a group parent) ─────────
  if (isDataReady && dashboard && subDashboards.length > 0) {
    return (
      <>
      <motion.div
        variants={pageVariants} initial="initial" animate="animate" exit="exit"
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="flex-1 p-4 md:p-6 lg:p-8 space-y-8"
      >
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className={`flex items-center gap-1.5 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Link to="/" className="text-accent hover:underline font-medium">{t('breadcrumb_home')}</Link>
          <BreadCrumbChevron size={14} className="text-sidebar-text shrink-0" />
          {section && (
            <>
              <Link to={`/section/${section.id}`} className="text-accent hover:underline font-medium truncate">
                {isRTL ? section.label_ar : section.label_en}
              </Link>
              <BreadCrumbChevron size={14} className="text-sidebar-text shrink-0" />
            </>
          )}
          {parentDashboard && (
            <>
              <Link to={`/dashboard/${parentDashboard.id}`} className="text-accent hover:underline font-medium truncate">
                {isRTL ? parentDashboard.label_ar : parentDashboard.label_en}
              </Link>
              <BreadCrumbChevron size={14} className="text-sidebar-text shrink-0" />
            </>
          )}
          <span className="text-app-text font-medium">
            {isRTL ? dashboard.label_ar : dashboard.label_en}
          </span>
        </nav>

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center shrink-0">
            <Layers size={32} className="text-accent" />
          </div>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h1 className="text-2xl font-bold text-app-text leading-snug">
              {isRTL ? dashboard.label_ar : dashboard.label_en}
            </h1>
            <p className="text-sidebar-text text-sm mt-0.5">
              {isRTL ? dashboard.label_en : dashboard.label_ar}
            </p>
          </div>
        </motion.div>

        {/* Divider with sub-categories badge */}
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="h-px flex-1 bg-gradient-to-r from-accent/30 to-transparent" />
          <span className="text-xs font-semibold bg-accent/10 text-accent px-3 py-1.5 rounded-full">
            {t('sub_categories')}
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-accent/30 to-transparent" />
        </div>

        {/* Sub-dashboard cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {subDashboards.map((db, i) => (
            <motion.div
              key={db.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -3, boxShadow: '0 12px 28px rgba(10,37,64,0.16)' }}
              className="bg-surface rounded-2xl shadow-card overflow-hidden flex flex-col relative group"
            >
              {/* Delete X */}
              <button
                onClick={(e) => { e.stopPropagation(); handleDeleteClick('category', db.id, isRTL ? db.label_ar : db.label_en); }}
                className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity
                           w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white
                           flex items-center justify-center shadow"
                aria-label="Delete"
              >
                <X size={12} strokeWidth={3} />
              </button>
              <div className="card-gradient-strip h-1.5 w-full" />
              <div className="p-6 flex flex-col gap-4 flex-1">
                <div className="flex-1">
                  <h3 className={`font-bold text-app-text text-base leading-snug ${isRTL ? 'text-right' : 'text-left'}`}>
                    {isRTL ? db.label_ar : db.label_en}
                  </h3>
                  <p className={`text-sidebar-text text-sm mt-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {isRTL ? db.label_en : db.label_ar}
                  </p>
                  {(isRTL ? db.description_ar : db.description_en) && (
                    <p className={`text-sidebar-text text-xs mt-2 leading-relaxed line-clamp-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {isRTL ? db.description_ar : db.description_en}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => navigate(`/dashboard/${db.id}`)}
                  className="w-full bg-accent hover:bg-accent-dark text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                >
                  {t('view_reports')}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Delete success toast ── */}
      <AnimatePresence>
        {deleteSuccessMsg && (
          <motion.div
            initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60]
                       bg-primary text-white px-5 py-3 rounded-2xl shadow-2xl
                       flex items-center gap-3 min-w-[260px]"
          >
            <CheckCircle2 size={18} className="text-accent shrink-0" />
            <span className="text-sm font-medium">{deleteSuccessMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDeleteModal
        open={deleteOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        itemLabel={deleteTarget?.label}
      />
      </>
    );
  }

  if (isDataReady && !dashboard) {
    return (
      <motion.div
        variants={pageVariants} initial="initial" animate="animate" exit="exit"
        transition={{ duration: 0.3 }}
        className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center"
      >
        <Layers size={48} className="text-sidebar-text" />
        <h2 className="text-xl font-bold text-app-text">{t('dashboard_not_found')}</h2>
        <button
          onClick={() => navigate('/')}
          className="bg-accent hover:bg-accent-dark text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          {t('try_home')}
        </button>
      </motion.div>
    );
  }

  // ── Shared iframe body (loading / error / iframe) ─────────────────────────
  const iframeBody = (
    <>
      {!iframeLoaded && !iframeError && (
        <LoadingSpinner message={t('loading_dashboard')} />
      )}
      {iframeError && (
        <EmbedErrorCard url={dashboard?.url} onRetry={handleRefresh} isRTL={isRTL} />
      )}
      {dashboard && !iframeError && (
        <iframe
          key={iframeKey}
          ref={iframeRef}
          src={dashboard.url}
          title={dashboard.label_en}
          frameBorder="0"
          allowFullScreen
          className={`absolute inset-0 transition-opacity duration-300 ${iframeLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ display: 'block', border: 'none', width: '100%', height: '100%' }}
          onLoad={() => { setIframeLoaded(true); setIframeError(false); }}
          onError={() => { setIframeLoaded(false); setIframeError(true); }}
        />
      )}
    </>
  );

  // ── FULLSCREEN — covers entire viewport including navbar ───────────────────
  if (isFullscreen) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
          background: '#000',
        }}
      >
        <div className="relative w-full h-full">
          {iframeBody}

          {/* Floating exit button — top-right (top-left for RTL) */}
          <button
            onClick={() => setFullscreen(false)}
            className="absolute top-3 z-10 flex items-center gap-1.5 bg-black/70 hover:bg-black/90 text-white text-xs px-3 py-2 rounded-lg border border-white/20 transition-colors"
            style={{ [isRTL ? 'left' : 'right']: '12px' }}
            aria-label={t('exit_fullscreen')}
          >
            <X size={14} />
            <span className="hidden sm:inline">{t('exit_fullscreen')}</span>
          </button>

          {/* Open in new tab — opposite corner */}
          {dashboard && (
            <a
              href={dashboard.url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-3 z-10 flex items-center gap-1.5 bg-black/70 hover:bg-black/90 text-white text-xs p-2 rounded-lg border border-white/20 transition-colors"
              style={{ [isRTL ? 'right' : 'left']: '12px' }}
              aria-label={t('open_new_tab')}
            >
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    );
  }

  // ── NORMAL LAYOUT ──────────────────────────────────────────────────────────
  // Navbar = 64px  |  Breadcrumb bar = 48px  |  Iframe = calc(100vh − 112px)
  // The iframe fills the entire visible viewport. Footer sits below (scroll to reveal).
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex flex-col"
    >
      {/* Breadcrumb / action bar — 48px (h-12) */}
      <div
        className={`h-12 bg-surface border-b border-app-border flex items-center justify-between px-4 md:px-6 shrink-0 ${isRTL ? 'flex-row-reverse' : ''}`}
      >
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className={`flex items-center gap-1.5 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <Link to="/" className="text-accent hover:underline font-medium hidden sm:inline">
            {t('breadcrumb_home')}
          </Link>
          <BreadCrumbChevron size={13} className="text-sidebar-text shrink-0 hidden sm:inline" />
          {section && (
            <>
              <Link
                to={`/section/${section.id}`}
                className="text-accent hover:underline font-medium truncate max-w-[120px] hidden sm:inline"
              >
                {isRTL ? section.label_ar : section.label_en}
              </Link>
              <BreadCrumbChevron size={13} className="text-sidebar-text shrink-0 hidden sm:inline" />
            </>
          )}
          <span className="text-app-text font-semibold truncate max-w-[160px]">
            {dashboard ? (isRTL ? dashboard.label_ar : dashboard.label_en) : '…'}
          </span>
        </nav>

        {/* Action buttons */}
        <div className={`flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button
            onClick={handleRefresh}
            title={t('refresh')}
            className="p-2 text-sidebar-text hover:text-app-text rounded-lg hover:bg-app-bg transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
          >
            <RefreshCw size={16} className={iframeLoaded ? '' : 'animate-spin'} />
          </button>

          {dashboard && (
            <a
              href={dashboard.url}
              target="_blank"
              rel="noopener noreferrer"
              title={t('open_new_tab')}
              className="p-2 text-sidebar-text hover:text-app-text rounded-lg hover:bg-app-bg transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
            >
              <ExternalLink size={16} />
            </a>
          )}

          <button
            onClick={() => setFullscreen(true)}
            title={t('fullscreen')}
            className="p-2 text-sidebar-text hover:text-app-text rounded-lg hover:bg-app-bg transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
          >
            <Maximize2 size={16} />
          </button>
        </div>
      </div>

      {/* Iframe container — calc(100vh - 112px) fills the visible viewport exactly.
          Footer lives below this div in the scrollable main; only visible on scroll. */}
      <div
        className="w-full relative overflow-hidden"
        style={{
          height: 'calc(100vh - 112px)',
          flex: '1 0 auto',
          minHeight: '400px',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {iframeBody}
      </div>
    </motion.div>
  );
}
