import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage.js';

export default function NotFound() {
  const { t }     = useTranslation();
  const navigate  = useNavigate();
  const { isRTL } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex-1 flex flex-col items-center justify-center gap-6 p-8 text-center ${isRTL ? 'font-arabic' : ''}`}
    >
      {/* Large 404 */}
      <div className="relative">
        <p className="text-[120px] font-bold text-app-border leading-none select-none">404</p>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-4xl font-bold text-accent">?</p>
        </div>
      </div>

      <div className="space-y-2 max-w-sm">
        <h1 className="text-2xl font-bold text-app-text">Page Not Found</h1>
        <p className="text-sidebar-text text-sm leading-relaxed">
          الصفحة التي تبحث عنها غير موجودة — The page you're looking for doesn't exist.
        </p>
      </div>

      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors shadow-card"
      >
        <Home size={16} />
        {t('try_home')}
      </button>
    </motion.div>
  );
}
