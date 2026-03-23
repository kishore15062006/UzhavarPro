// Order Service
import api from '../config/axios.js';
import { API_ENDPOINTS } from '../config/api.js';
import { handleApiError } from '../utils/index.js';

export const OrderService = {
  // Create order
  createOrder: async (orderData) => {
    try {
      const response = await api.post(API_ENDPOINTS.ORDERS.CREATE, orderData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // Get all orders (admin)
  getAllOrders: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.ORDERS.GET_ALL, { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // Get my orders (user)
  getMyOrders: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.ORDERS.GET_MY_ORDERS, {
        params,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // Get incoming orders (farmer)
  getIncomingOrders: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.ORDERS.GET_INCOMING_ORDERS, {
        params,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // Get order by ID
  getOrderById: async (id) => {
    try {
      const response = await api.get(
        API_ENDPOINTS.ORDERS.GET_BY_ID.replace(':id', id)
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // Update order status
  updateOrderStatus: async (id, status) => {
    try {
      const response = await api.put(
        API_ENDPOINTS.ORDERS.UPDATE_STATUS.replace(':id', id),
        { status }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // Accept order (farmer)
  acceptOrder: async (id) => {
    try {
      const response = await api.post(
        API_ENDPOINTS.ORDERS.ACCEPT_ORDER.replace(':id', id)
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // Reject order (farmer)
  rejectOrder: async (id, reason = '') => {
    try {
      const response = await api.post(
        API_ENDPOINTS.ORDERS.REJECT_ORDER.replace(':id', id),
        { reason }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // Cancel order (user)
  cancelOrder: async (id, reason = '') => {
    try {
      const response = await api.post(
        API_ENDPOINTS.ORDERS.CANCEL_ORDER.replace(':id', id),
        { reason }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },
};

export default OrderService;
