import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { sectionsApi } from '../api/index.js';

/** @type {React.Context} */
const AppContext = createContext(null);

/**
 * Global application state provider.
 * Provides: sections data, sidebar collapsed/open state, loading/error flags.
 */
export function AppProvider({ children }) {
  const [sections, setSections]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    () => localStorage.getItem('sidebarCollapsed') === 'true',
  );
  const [sidebarOpen, setSidebarOpen]     = useState(false); // mobile drawer

  const fetchSections = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await sectionsApi.getAll();
      setSections(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('sidebarCollapsed', String(next));
      return next;
    });
  }, []);

  const value = {
    sections,
    loading,
    error,
    sidebarCollapsed,
    toggleSidebar,
    sidebarOpen,
    setSidebarOpen,
    refetchSections: fetchSections,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Hook to consume AppContext.
 * @returns {Object} app context value
 */
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within <AppProvider>');
  return ctx;
}
