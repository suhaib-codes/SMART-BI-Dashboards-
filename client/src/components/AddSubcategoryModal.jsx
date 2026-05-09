import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, FolderPlus, FileText, AlignLeft } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage.js';

function Field({ icon: Icon, label, required, error, children }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-2 text-sm font-semibold text-app-text">
        <Icon size={14} className="text-accent shrink-0" />
        {label}
        {required && <span className="text-danger">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-danger font-medium">{error}</p>}
    </div>
  );
}

export default function AddSubcategoryModal({ isOpen, onClose, onSubmit, submitting, sectionLabel }) {
  const { t }     = useTranslation();
  const { isRTL } = useLanguage();
  const nameRef   = useRef(null);

  const [name, setName]           = useState('');
  const [nameAr, setNameAr]       = useState('');
  const [description, setDesc]    = useState('');
  const [nameError, setNameError] = useState('');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(''); setNameAr(''); setDesc(''); setNameError(''); setSubmitError('');
      const t = setTimeout(() => nameRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape' && !submitting) onClose(); };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose, submitting]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!name.trim()) { setNameError(t('add_cat_error_name')); return; }
    onSubmit(
      { label_en: name.trim(), label_ar: nameAr.trim() || name.trim(), description_en: description.trim() },
      (err) => setSubmitError(err),
    );
  };

  const inputCls = (hasErr) =>
    `w-full border rounded-xl px-4 py-2.5 text-sm text-app-text bg-app-bg placeholder:text-sidebar-text
     outline-none transition-all duration-150 focus:ring-2 focus:ring-accent/40 focus:border-accent
     ${hasErr ? 'border-danger ring-1 ring-danger/20 bg-danger/5' : 'border-app-border'}`;

  return (
    <AnimatePresence>
      {isOpen && (
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
        >
          <motion.div
            initial={{ scale: 0.90, opacity: 0, y: 24 }}
            animate={{ scale: 1,    opacity: 1, y: 0 }}
            exit={{    scale: 0.90, opacity: 0, y: 24 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="bg-surface rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <div className="card-gradient-strip h-1.5 w-full" />

            {/* Header */}
            <div className="bg-primary px-6 py-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center shrink-0 ring-1 ring-accent/30">
                  <FolderPlus size={20} className="text-accent" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-base leading-tight">{t('add_cat_title')}</h2>
                  <p className="text-accent/75 text-xs mt-0.5">
                    {sectionLabel ? `${t('add_report_to')} ${sectionLabel}` : t('add_cat_subtitle')}
                  </p>
                </div>
              </div>
              <button onClick={onClose} disabled={submitting}
                className="text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-40 rounded-lg p-1.5 transition-colors"
                aria-label={t('close')}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5" noValidate>
              {submitError && (
                <div className="bg-danger/10 border border-danger/30 text-danger text-sm font-medium rounded-xl px-4 py-3 flex items-center gap-2">
                  <span>⚠</span>{submitError}
                </div>
              )}

              <Field icon={FileText} label={t('add_cat_name')} required error={nameError}>
                <input ref={nameRef} type="text" value={name}
                  onChange={(e) => { setName(e.target.value); setNameError(''); }}
                  placeholder={t('add_cat_name_placeholder')}
                  className={inputCls(!!nameError)} maxLength={120} />
              </Field>

              <Field icon={FileText} label={t('add_name_ar_label')}>
                <input type="text" value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  placeholder={t('add_name_ar_placeholder')}
                  dir="rtl"
                  className={`${inputCls(false)} text-right`} maxLength={120} />
              </Field>

              <Field icon={AlignLeft} label={t('add_report_description')}>
                <textarea value={description} onChange={(e) => setDesc(e.target.value)}
                  placeholder={t('add_cat_description_placeholder')}
                  rows={3}
                  className="w-full border border-app-border rounded-xl px-4 py-2.5 text-sm text-app-text bg-app-bg
                             placeholder:text-sidebar-text outline-none resize-none transition-all duration-150
                             focus:ring-2 focus:ring-accent/40 focus:border-accent"
                  maxLength={400} />
              </Field>

              <div className="flex items-center gap-3 pt-1">
                <button type="button" onClick={onClose} disabled={submitting}
                  className="flex-1 border border-app-border text-sidebar-text hover:text-app-text hover:border-accent/50
                             text-sm font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50">
                  {t('cancel')}
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-[2] bg-accent hover:bg-accent-dark disabled:opacity-60 disabled:cursor-not-allowed
                             text-white text-sm font-bold py-2.5 rounded-xl transition-colors flex items-center
                             justify-center gap-2 shadow-md shadow-accent/25">
                  {submitting ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{t('uploading')}</>
                  ) : (
                    <><FolderPlus size={16} />{t('add_cat_btn')}</>
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
