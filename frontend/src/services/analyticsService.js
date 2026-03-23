// Analytics Service
import api from '../config/axios.js';
import { API_ENDPOINTS } from '../config/api.js';
import { handleApiError } from '../utils/index.js';

export const AnalyticsService = {
  // Farmer Analytics
  getSalesSummary: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.ANALYTICS.SALES_SUMMARY, {
        params,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  getEarningsSummary: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.ANALYTICS.EARNINGS_SUMMARY, {
        params,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  getSalesTrend: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.ANALYTICS.SALES_TREND, {
        params,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  getTopProducts: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.ANALYTICS.TOP_PRODUCTS, {
        params,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  getDashboardStats: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.ANALYTICS.DASHBOARD_STATS);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // Admin Analytics
  getAdminDashboardStats: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.ADMIN_ANALYTICS.DASHBOARD_STATS);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  getRevenueSummary: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.ADMIN_ANALYTICS.REVENUE_SUMMARY, {
        params,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  getTopSellingCrops: async (params = {}) => {
    try {
      const response = await api.get(
        API_ENDPOINTS.ADMIN_ANALYTICS.TOP_SELLING_CROPS,
        { params }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  getUserStats: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.ADMIN_ANALYTICS.USER_STATS, {
        params,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  getCommissionTracking: async (params = {}) => {
    try {
      const response = await api.get(
        API_ENDPOINTS.ADMIN_ANALYTICS.COMMISSION_TRACKING,
        { params }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },
};

export default AnalyticsService;
