import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppProvider } from './context/AppContext.jsx';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import SectionPage from './pages/SectionPage.jsx';
import DashboardViewer from './pages/DashboardViewer.jsx';
import NotFound       from './pages/NotFound.jsx';
import AIInsightsPage from './pages/AIInsightsPage.jsx';

/** Wraps routes so AnimatePresence detects location key changes. */
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/"                        element={<Home />} />
        <Route path="/section/:sectionId"      element={<SectionPage />} />
        <Route path="/dashboard/:dashboardId"  element={<DashboardViewer />} />
        <Route path="/ai-insights"             element={<AIInsightsPage />} />
        <Route path="*"                        element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Layout>
          <AnimatedRoutes />
        </Layout>
      </AppProvider>
    </BrowserRouter>
  );
}
