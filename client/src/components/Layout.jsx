import PropTypes from 'prop-types';
import { useApp }      from '../context/AppContext.jsx';
import { useLanguage } from '../hooks/useLanguage.js';
import TopNavbar from './TopNavbar.jsx';
import Sidebar   from './Sidebar.jsx';
import Footer    from './Footer.jsx';

/**
 * Root layout shell — TopNavbar + Sidebar + scrollable main + Footer.
 * The sidebar is always visible on desktop; it becomes a drawer on mobile.
 * @param {{ children: React.ReactNode }} props
 */
export default function Layout({ children }) {
  const { sidebarOpen, setSidebarOpen } = useApp();
  const { isRTL } = useLanguage();

  return (
    <div className={`flex flex-col min-h-screen bg-app-bg ${isRTL ? 'font-arabic' : 'font-sans'}`}>
      {/* ── Top Navigation Bar ─────────────────────────── */}
      <TopNavbar />

      {/* ── Body: Sidebar + Content ────────────────────── */}
      <div className="flex flex-1 min-h-0">

        {/* Desktop sidebar — always rendered; mobile drawer handled inside */}
        <Sidebar />

        {/* Mobile backdrop overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Main scrollable area */}
        <main className="flex-1 overflow-y-auto flex flex-col">
          {children}
          <Footer />
        </main>
      </div>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
