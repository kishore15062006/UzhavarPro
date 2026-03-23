// Product Service
import api from '../config/axios.js';
import { API_ENDPOINTS } from '../config/api.js';
import { handleApiError } from '../utils/index.js';

export const ProductService = {
  // Get all products
  getAllProducts: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.PRODUCTS.GET_ALL, { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // Get product by ID
  getProductById: async (id) => {
    try {
      const response = await api.get(
        API_ENDPOINTS.PRODUCTS.GET_BY_ID.replace(':id', id)
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // Get farmer's products
  getMyProducts: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.PRODUCTS.GET_MY_PRODUCTS, {
        params,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // Create product
  createProduct: async (productData) => {
    try {
      const response = await api.post(API_ENDPOINTS.PRODUCTS.CREATE, productData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // Update product
  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(
        API_ENDPOINTS.PRODUCTS.UPDATE.replace(':id', id),
        productData
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // Delete product
  deleteProduct: async (id) => {
    try {
      const response = await api.delete(
        API_ENDPOINTS.PRODUCTS.DELETE.replace(':id', id)
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // Toggle product availability
  toggleAvailability: async (id) => {
    try {
      const response = await api.patch(
        API_ENDPOINTS.PRODUCTS.TOGGLE_AVAILABILITY.replace(':id', id)
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // Upload product image
  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post(API_ENDPOINTS.PRODUCTS.UPLOAD_IMAGE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // Search products
  searchProducts: async (query, params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.SEARCH.PRODUCTS, {
        params: { q: query, ...params },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // Get products by farmer
  getByFarmer: async (farmerId, params = {}) => {
    try {
      const response = await api.get(
        API_ENDPOINTS.PRODUCTS.GET_BY_FARMER.replace(':farmerId', farmerId),
        { params }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },
};

export default ProductService;
