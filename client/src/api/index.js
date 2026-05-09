import axios from 'axios';

/**
 * Central Axios instance — all requests proxy through Vite dev server to
 * http://localhost:5000 in development, and /api in production.
 */
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor — unwrap data or throw a clean Error
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  },
);

// ─── API modules ───────────────────────────────────────────────────────────────

/** Sections API */
export const sectionsApi = {
  /** @returns {Promise<Array>} All sections with nested dashboards */
  getAll: () => api.get('/sections'),

  /** @param {string} sectionId @returns {Promise<Object>} */
  getById: (sectionId) => api.get(`/sections/${sectionId}`),

  /** @param {string} sectionId @returns {Promise<Array>} */
  getDashboards: (sectionId) => api.get(`/sections/${sectionId}/dashboards`),

  /**
   * Add a custom dashboard to a section.
   * @param {string} sectionId
   * @param {{ label_en: string, label_ar?: string, description_en: string, channel: string, url: string }} data
   * @returns {Promise<Object>}
   */
  addDashboard: (sectionId, data) => api.post(`/sections/${sectionId}/dashboards`, data),

  /**
   * Add a new subcategory (no URL) to a section.
   * @param {string} sectionId
   * @param {{ label_en: string, label_ar?: string, description_en: string }} data
   * @returns {Promise<Object>}
   */
  addCategory: (sectionId, data) => api.post(`/sections/${sectionId}/categories`, data),

  /**
   * Delete a dashboard/category from a section.
   * @param {string} sectionId
   * @param {string} dashboardId
   */
  deleteDashboard: (sectionId, dashboardId) => api.delete(`/sections/${sectionId}/dashboards/${dashboardId}`),
};

/** Dashboards API */
export const dashboardsApi = {
  /** @param {string} dashboardId @returns {Promise<Object>} */
  getById: (dashboardId) => api.get(`/dashboards/${dashboardId}`),

  /**
   * Add a report to a dashboard's reports array.
   * @param {string} dashboardId
   * @param {{ label_en: string, label_ar?: string, url: string }} data
   */
  addReport: (dashboardId, data) => api.post(`/dashboards/${dashboardId}/reports`, data),

  /**
   * Delete a report from a dashboard.
   * @param {string} dashboardId
   * @param {string} reportId
   */
  deleteReport: (dashboardId, reportId) => api.delete(`/dashboards/${dashboardId}/reports/${reportId}`),
};

export default api;
