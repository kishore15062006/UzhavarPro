// Payment Service
import api from '../config/axios.js';
import { API_ENDPOINTS } from '../config/api.js';
import { handleApiError } from '../utils/index.js';

export const PaymentService = {
  // Create payment
  createPayment: async (paymentData) => {
    try {
      const response = await api.post(API_ENDPOINTS.PAYMENTS.CREATE, paymentData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // Get my payments
  getMyPayments: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.PAYMENTS.GET_MY_PAYMENTS, {
        params,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // Get payment by order
  getPaymentByOrder: async (orderId) => {
    try {
      const response = await api.get(
        API_ENDPOINTS.PAYMENTS.GET_BY_ORDER.replace(':orderId', orderId)
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // Update payment status
  updatePaymentStatus: async (id, status) => {
    try {
      const response = await api.put(
        API_ENDPOINTS.PAYMENTS.UPDATE_STATUS.replace(':id', id),
        { status }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // Request payout (farmer)
  requestPayout: async (amount) => {
    try {
      const response = await api.post(API_ENDPOINTS.PAYMENTS.REQUEST_PAYOUT, {
        amount,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },
};

export default PaymentService;
