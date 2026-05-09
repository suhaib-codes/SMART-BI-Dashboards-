import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Hook that manages language/direction state.
 * Applies dir + lang attributes to <html> and stores preference in localStorage.
 *
 * @returns {{ isRTL: boolean, toggleLanguage: () => void, language: string }}
 */
export function useLanguage() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    const dir  = isRTL ? 'rtl' : 'ltr';
    const font = isRTL
      ? '"Tajawal", system-ui, sans-serif'
      : '"Inter", system-ui, sans-serif';

    document.documentElement.dir  = dir;
    document.documentElement.lang = i18n.language;
    document.documentElement.style.fontFamily = font;
  }, [i18n.language, isRTL]);

  /** Toggle between Arabic ↔ English */
  const toggleLanguage = () => {
    const next = isRTL ? 'en' : 'ar';
    i18n.changeLanguage(next);
    localStorage.setItem('language', next);
  };

  return { isRTL, toggleLanguage, language: i18n.language };
}
