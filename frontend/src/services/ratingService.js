// Rating Service
import api from '../config/axios.js';
import { API_ENDPOINTS } from '../config/api.js';
import { handleApiError } from '../utils/index.js';

export const RatingService = {
  // Create rating
  createRating: async (ratingData) => {
    try {
      const response = await api.post(API_ENDPOINTS.RATINGS.CREATE, ratingData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // Get ratings for farmer
  getRatingsForFarmer: async (farmerId, params = {}) => {
    try {
      const response = await api.get(
        API_ENDPOINTS.RATINGS.GET_FOR_FARMER.replace(':farmerId', farmerId),
        { params }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // Get ratings for product
  getRatingsForProduct: async (productId, params = {}) => {
    try {
      const response = await api.get(
        API_ENDPOINTS.RATINGS.GET_FOR_PRODUCT.replace(':productId', productId),
        { params }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // Update rating
  updateRating: async (id, ratingData) => {
    try {
      const response = await api.put(
        API_ENDPOINTS.RATINGS.UPDATE.replace(':id', id),
        ratingData
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // Delete rating
  deleteRating: async (id) => {
    try {
      const response = await api.delete(
        API_ENDPOINTS.RATINGS.DELETE.replace(':id', id)
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },
};

export default RatingService;
