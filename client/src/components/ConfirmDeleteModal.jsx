import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * A reusable confirmation dialog for delete actions.
 *
 * Props:
 *   open       {boolean}  - whether the modal is visible
 *   onConfirm  {()=>void} - called when the user confirms deletion
 *   onCancel   {()=>void} - called when the user cancels
 *   itemLabel  {string}   - name of the item being deleted (shown in message)
 */
export default function ConfirmDeleteModal({ open, onConfirm, onCancel, itemLabel }) {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="confirm-delete-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-surface rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden"
          >
            {/* Icon strip */}
            <div className="flex items-center justify-center pt-7 pb-4">
              <span className="bg-red-100 p-3 rounded-full">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </span>
            </div>

            {/* Text */}
            <div className="px-6 pb-2 text-center">
              <h3 className="text-lg font-bold text-primary mb-1">{t('delete_confirm_title')}</h3>
              <p className="text-sm text-gray-500">
                {t('delete_confirm_msg')}
                {itemLabel && (
                  <span className="font-semibold text-gray-700"> "{itemLabel}"</span>
                )}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 px-6 pb-6 pt-4">
              <button
                onClick={onCancel}
                className="flex-1 py-2.5 rounded-xl border border-app-border text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                {t('delete_no')}
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors"
              >
                {t('delete_yes')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
