// Delivery Service
import api from '../config/axios.js';
import { API_ENDPOINTS } from '../config/api.js';
import { handleApiError } from '../utils/index.js';

export const DeliveryService = {
  // Get delivery by order
  getDeliveryByOrder: async (orderId) => {
    try {
      const response = await api.get(
        API_ENDPOINTS.DELIVERY.GET_DELIVERY.replace(':orderId', orderId)
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // Update delivery status
  updateDeliveryStatus: async (id, status) => {
    try {
      const response = await api.put(
        API_ENDPOINTS.DELIVERY.UPDATE_STATUS.replace(':id', id),
        { status }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // Get my deliveries (delivery agent)
  getMyDeliveries: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.DELIVERY.GET_MY_DELIVERIES, {
        params,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // Assign delivery agent (admin)
  assignDeliveryAgent: async (orderId, agentId) => {
    try {
      const response = await api.post(API_ENDPOINTS.DELIVERY.ASSIGN_AGENT, {
        orderId,
        agentId,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // Get upcoming unassigned deliveries
  getUpcomingDeliveries: async (params = {}) => {
    try {
      const response = await api.get('/delivery/upcoming', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // Pick/claim an upcoming delivery
  pickOrder: async (orderId) => {
    try {
      const response = await api.post(`/delivery/pick?orderId=${orderId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },
};

export default DeliveryService;
