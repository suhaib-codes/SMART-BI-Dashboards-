import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, Plus, Link2, FileText, AlignLeft, Layers } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage.js';

// ─── Channel options ───────────────────────────────────────────────────────────

const CHANNEL_OPTIONS = [
  { value: 'power-bi',  label_en: 'Power BI',              label_ar: 'Power BI' },
  { value: 'excel',     label_en: 'Excel / Spreadsheet',   label_ar: 'Excel / جداول البيانات' },
  { value: 'web',       label_en: 'Web Analytics',         label_ar: 'تحليلات الويب' },
  { value: 'tableau',   label_en: 'Tableau',               label_ar: 'Tableau' },
  { value: 'ssrs',      label_en: 'SSRS Report',           label_ar: 'تقرير SSRS' },
  { value: 'other',     label_en: 'Other',                 label_ar: 'أخرى' },
];

// ─── Field wrapper ─────────────────────────────────────────────────────────────

function Field({ icon: Icon, label, required, error, children }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-2 text-sm font-semibold text-app-text">
        <Icon size={14} className="text-accent shrink-0" />
        {label}
        {required && <span className="text-danger">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-danger font-medium">{error}</p>
      )}
    </div>
  );
}

// ─── AddReportModal ────────────────────────────────────────────────────────────

/**
 * @param {{
 *   isOpen: boolean,
 *   onClose: () => void,
 *   onSubmit: (data: Object) => Promise<void>,
 *   submitting: boolean,
 *   sectionLabel: string,
 * }} props
 */
export default function AddReportModal({ isOpen, onClose, onSubmit, submitting, sectionLabel }) {
  const { t }      = useTranslation();
  const { isRTL }  = useLanguage();
  const nameRef    = useRef(null);

  const [form, setForm] = useState({
    label_en: '',
    label_ar: '',
    description_en: '',
    channel: 'power-bi',
    url: '',
  });
  const [errors,      setErrors]      = useState({});
  const [submitError, setSubmitError] = useState('');

  // Reset form when opening
  useEffect(() => {
    if (isOpen) {
      setForm({ label_en: '', label_ar: '', description_en: '', channel: 'power-bi', url: '' });
      setErrors({});
      setSubmitError('');
      // Delay focus so animation completes first
      const timer = setTimeout(() => nameRef.current?.focus(), 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape' && !submitting) onClose(); };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose, submitting]);

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.label_en.trim()) {
      errs.label_en = t('add_report_error_name');
    }
    if (!form.url.trim()) {
      errs.url = t('add_report_error_url');
    } else {
      try { new URL(form.url.trim()); }
      catch { errs.url = t('add_report_error_url_invalid'); }
    }
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitError('');
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSubmit(
      {
        label_en:       form.label_en.trim(),
        label_ar:       form.label_ar.trim() || form.label_en.trim(),
        description_en: form.description_en.trim(),
        channel:        form.channel,
        url:            form.url.trim(),
      },
      (errMsg) => setSubmitError(errMsg),
    );
  };

  const inputCls = (field) =>
    `w-full border rounded-xl px-4 py-2.5 text-sm text-app-text bg-app-bg placeholder:text-sidebar-text
     outline-none transition-all duration-150
     focus:ring-2 focus:ring-accent/40 focus:border-accent
     ${errors[field] ? 'border-danger ring-1 ring-danger/20 bg-danger/5' : 'border-app-border'}`;

  return (
    <AnimatePresence>
      {isOpen && (
        /* ── Backdrop ── */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backdropFilter: 'blur(7px)', background: 'rgba(10,37,64,0.60)' }}
          onClick={(e) => { if (e.target === e.currentTarget && !submitting) onClose(); }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="arm-title"
        >
          {/* ── Panel ── */}
          <motion.div
            initial={{ scale: 0.90, opacity: 0, y: 24 }}
            animate={{ scale: 1,    opacity: 1, y: 0 }}
            exit={{    scale: 0.90, opacity: 0, y: 24 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="bg-surface rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {/* Gradient strip */}
            <div className="card-gradient-strip h-1.5 w-full" />

            {/* Header */}
            <div className="bg-primary px-6 py-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center shrink-0 ring-1 ring-accent/30">
                  <Plus size={20} className="text-accent" />
                </div>
                <div>
                  <h2 id="arm-title" className="text-white font-bold text-base leading-tight">
                    {t('add_report_title')}
                  </h2>
                  <p className="text-accent/75 text-xs mt-0.5">
                    {sectionLabel ? `${t('add_report_to')} ${sectionLabel}` : t('add_report_subtitle')}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                disabled={submitting}
                className="text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-40
                           rounded-lg p-1.5 transition-colors shrink-0"
                aria-label={t('close')}
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5" noValidate>

              {/* Server-side error banner */}
              {submitError && (
                <div className="bg-danger/10 border border-danger/30 text-danger text-sm font-medium
                                rounded-xl px-4 py-3 flex items-center gap-2">
                  <span className="shrink-0">⚠</span>
                  {submitError}
                </div>
              )}
              <Field icon={FileText} label={t('add_report_name')} required error={errors.label_en}>
                <input
                  ref={nameRef}
                  type="text"
                  value={form.label_en}
                  onChange={set('label_en')}
                  placeholder={t('add_report_name_placeholder')}
                  className={inputCls('label_en')}
                  maxLength={120}
                />
              </Field>

              {/* Arabic Name */}
              <Field icon={FileText} label={t('add_name_ar_label')}>
                <input
                  type="text"
                  value={form.label_ar}
                  onChange={set('label_ar')}
                  placeholder={t('add_name_ar_placeholder')}
                  dir="rtl"
                  className={`${inputCls('')} text-right`}
                  maxLength={120}
                />
              </Field>

              {/* Description */}
              <Field icon={AlignLeft} label={t('add_report_description')}>
                <textarea
                  value={form.description_en}
                  onChange={set('description_en')}
                  placeholder={t('add_report_description_placeholder')}
                  rows={3}
                  className="w-full border border-app-border rounded-xl px-4 py-2.5 text-sm
                             text-app-text bg-app-bg placeholder:text-sidebar-text outline-none
                             resize-none transition-all duration-150
                             focus:ring-2 focus:ring-accent/40 focus:border-accent"
                  maxLength={500}
                />
              </Field>

              {/* Channel */}
              <Field icon={Layers} label={t('add_report_channel')}>
                <select
                  value={form.channel}
                  onChange={set('channel')}
                  className="w-full border border-app-border rounded-xl px-4 py-2.5 text-sm
                             text-app-text bg-app-bg outline-none transition-all duration-150
                             focus:ring-2 focus:ring-accent/40 focus:border-accent cursor-pointer"
                >
                  {CHANNEL_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {isRTL ? opt.label_ar : opt.label_en}
                    </option>
                  ))}
                </select>
              </Field>

              {/* URL */}
              <Field icon={Link2} label={t('add_report_url')} required error={errors.url}>
                <input
                  type="url"
                  value={form.url}
                  onChange={set('url')}
                  placeholder={t('add_report_url_placeholder')}
                  dir="ltr"
                  className={`${inputCls('url')} font-mono text-xs`}
                />
              </Field>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="flex-1 border border-app-border text-sidebar-text hover:text-app-text
                             hover:border-accent/50 text-sm font-semibold py-2.5 rounded-xl
                             transition-colors disabled:opacity-50"
                >
                  {t('cancel')}
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-[2] bg-accent hover:bg-accent-dark disabled:opacity-60
                             disabled:cursor-not-allowed text-white text-sm font-bold py-2.5
                             rounded-xl transition-colors flex items-center justify-center gap-2
                             shadow-md shadow-accent/25"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t('uploading')}
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      {t('upload_report')}
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
