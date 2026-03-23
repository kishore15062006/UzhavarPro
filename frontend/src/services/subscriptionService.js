// Subscription Service
import api from '../config/axios.js';
import { API_ENDPOINTS } from '../config/api.js';
import { handleApiError } from '../utils/index.js';

export const SubscriptionService = {
  // Create subscription
  createSubscription: async (subscriptionData) => {
    try {
      const response = await api.post(API_ENDPOINTS.SUBSCRIPTIONS.CREATE, subscriptionData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // Get my subscriptions
  getMySubscriptions: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.SUBSCRIPTIONS.GET_MY_SUBSCRIPTIONS, {
        params,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // Update subscription
  updateSubscription: async (id, subscriptionData) => {
    try {
      const response = await api.put(
        API_ENDPOINTS.SUBSCRIPTIONS.UPDATE.replace(':id', id),
        subscriptionData
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // Cancel subscription
  cancelSubscription: async (id) => {
    try {
      const response = await api.post(
        API_ENDPOINTS.SUBSCRIPTIONS.CANCEL.replace(':id', id)
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },
};

export default SubscriptionService;
