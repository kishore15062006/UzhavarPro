// Admin Service
import api from '../config/axios.js';
import { API_ENDPOINTS } from '../config/api.js';
import { handleApiError } from '../utils/index.js';

export const AdminService = {
  // Get all users
  getAllUsers: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.ADMIN.GET_ALL_USERS, { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // Get all products
  getAllProducts: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.ADMIN.GET_ALL_PRODUCTS, {
        params,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // Get all orders
  getAllOrders: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.ADMIN.GET_ALL_ORDERS, { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // Update user role
  updateUserRole: async (userId, role) => {
    try {
      const response = await api.put(
        API_ENDPOINTS.ADMIN.UPDATE_USER_ROLE.replace(':id', userId),
        { role }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // Suspend user
  suspendUser: async (userId) => {
    try {
      const response = await api.post(
        API_ENDPOINTS.ADMIN.SUSPEND_USER.replace(':id', userId)
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // Remove product
  removeProduct: async (productId) => {
    try {
      const response = await api.delete(
        API_ENDPOINTS.ADMIN.REMOVE_PRODUCT.replace(':id', productId)
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      const response = await api.get(
        API_ENDPOINTS.ADMIN_ANALYTICS.DASHBOARD_STATS
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // Get revenue analytics
  getRevenueAnalytics: async () => {
    try {
      const response = await api.get(
        API_ENDPOINTS.ADMIN_ANALYTICS.REVENUE_SUMMARY
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // Get user statistics
  getUserStatistics: async () => {
    try {
      const response = await api.get(
        API_ENDPOINTS.ADMIN_ANALYTICS.USER_STATS
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },
};

export default AdminService;
