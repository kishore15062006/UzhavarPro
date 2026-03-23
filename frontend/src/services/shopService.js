// Shop Service
import api from '../config/axios.js';
import { API_ENDPOINTS } from '../config/api.js';
import { handleApiError } from '../utils/index.js';

export const ShopService = {
  // Dashboard statistics
  getDashboardStats: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.ANALYTICS.SHOP_DASHBOARD_STATS || '/api/analytics/shop/dashboard-stats');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // Get shop orders (bulk orders)
  getMyOrders: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.ORDERS.GET_MY_ORDERS, { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // Get subscriptions
  getMySubscriptions: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.SUBSCRIPTIONS.GET_MY_SUBSCRIPTIONS, { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // Place bulk order
  placeBulkOrder: async (orderData) => {
    try {
      const response = await api.post(API_ENDPOINTS.ORDERS.CREATE, orderData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  }
};

export default ShopService;

