import { useTranslation } from 'react-i18next';
import { useLanguage }    from '../hooks/useLanguage.js';


/** Twitter/X SVG icon */
function TwitterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

/** LinkedIn SVG icon */
function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

/**
 * Site footer — shown at the bottom of the scrollable content area.
 */
export default function Footer() {
  const { t }      = useTranslation();
  const { isRTL }  = useLanguage();

  return (
    <footer className="bg-primary mt-auto" role="contentinfo">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col items-center gap-6 text-center">

        {/* Branding */}
        <div className="flex flex-col items-center gap-3">
          <img src="/nwc-logo.png" alt="National Water Company Logo" className="w-14 h-14 object-contain" />
          <div className="space-y-1">
            <p className="text-white font-semibold text-sm">
              شركة المياه الوطنية — National Water Company
            </p>
            <p className="text-sidebar-text text-xs">
              بوابة التقارير الذكية — BI Portal
            </p>
          </div>
        </div>

        {/* Vision 2030 badge */}
        <div className="flex items-center gap-2 px-4 py-2 border border-accent/30 rounded-full">
          {/* Vision 2030 mini emblem */}
          <svg width="22" height="22" viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <circle cx="20" cy="20" r="19" stroke="#00B4D8" strokeWidth="2" fill="none" />
            <path d="M20 10 L24 20 L20 30 L16 20 Z" fill="#00B4D8" opacity="0.8" />
            <text x="20" y="22" textAnchor="middle" fill="#00B4D8" fontSize="7" fontFamily="Inter,sans-serif" fontWeight="700">2030</text>
          </svg>
          <span className="text-sidebar-text text-xs font-medium">
            {t('vision2030')}
          </span>
        </div>

        {/* Divider */}
        <div className="w-full border-t border-white/10" />

        {/* Bottom row */}
        <div className={`w-full flex flex-col sm:flex-row items-center justify-between gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
          <p className="text-sidebar-text text-xs">{t('copyright')}</p>

          {/* Social links */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="text-sidebar-text hover:text-accent transition-colors p-1.5 rounded-lg hover:bg-white/10"
              aria-label="Twitter / X"
              rel="noopener noreferrer"
            >
              <TwitterIcon />
            </a>
            <a
              href="#"
              className="text-sidebar-text hover:text-accent transition-colors p-1.5 rounded-lg hover:bg-white/10"
              aria-label="LinkedIn"
              rel="noopener noreferrer"
            >
              <LinkedInIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
