// Local Storage Utilities
import { TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY, CART_KEY } from '../constants/index.js';

export const Storage = {
  setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
  getToken: () => localStorage.getItem(TOKEN_KEY),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),

  setRefreshToken: (token) => localStorage.setItem(REFRESH_TOKEN_KEY, token),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  removeRefreshToken: () => localStorage.removeItem(REFRESH_TOKEN_KEY),

  setUser: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  getUser: () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },
  removeUser: () => localStorage.removeItem(USER_KEY),

  setCart: (cart) => localStorage.setItem(CART_KEY, JSON.stringify(cart)),
  getCart: () => {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  },
  removeCart: () => localStorage.removeItem(CART_KEY),

  clearAll: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

// Validation Utilities
export const Validators = {
  isEmail: (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  isPassword: (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
    return regex.test(password);
  },

  isPhone: (phone) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(phone.replace(/[-\s]/g, ''));
  },

  isRequired: (value) => {
    return value !== null && value !== undefined && value !== '';
  },

  isValidNumber: (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value) && value >= 0;
  },
};

// Format Utilities
export const Formatters = {
  formatPrice: (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  },

  formatNumber: (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  },

  formatDate: (date) => {
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  },

  formatDateTime: (date) => {
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  },

  formatTime: (date) => {
    return new Intl.DateTimeFormat('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  },

  formatDistance: (distance) => {
    if (distance < 1) {
      return `${(distance * 1000).toFixed(0)} m`;
    }
    return `${distance.toFixed(1)} km`;
  },
};

// Math Utilities
export const MathUtils = {
  // Haversine formula to calculate distance between two coordinates
  calculateDistance: (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  calculateTotalPrice: (price, quantity) => {
    return (price * quantity).toFixed(2);
  },

  calculateDiscount: (originalPrice, discountPrice) => {
    return (((originalPrice - discountPrice) / originalPrice) * 100).toFixed(2);
  },

  calculateCommission: (amount, percentage) => {
    return (amount * percentage) / 100;
  },
};

// String Utilities
export const StringUtils = {
  capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase(),

  truncate: (str, length) => {
    return str.length > length ? str.substring(0, length) + '...' : str;
  },

  slugify: (str) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s]+/g, '-');
  },

  getInitials: (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  },
};

// API Error Handler
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    return {
      status,
      message: data?.message || 'An error occurred',
      errors: data?.errors || {},
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      status: 0,
      message: 'No response from server. Please check your connection.',
      errors: {},
    };
  } else {
    // Error in request setup
    return {
      status: 0,
      message: error.message || 'An error occurred',
      errors: {},
    };
  }
};

// Sleep utility for async operations
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
