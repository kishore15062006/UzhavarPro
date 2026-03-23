// App-wide Constants

export const USER_ROLES = {
  FARMER: 'FARMER',
  PUBLIC: 'PUBLIC',
  ADMIN: 'ADMIN',
  DELIVERY_AGENT: 'DELIVERY_AGENT',
};

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PROCESSING: 'PROCESSING',
  READY_FOR_PICKUP: 'READY_FOR_PICKUP',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  REJECTED: 'REJECTED',
};

export const DELIVERY_STATUS = {
  PENDING: 'PENDING',
  ASSIGNED: 'ASSIGNED',
  PICKED: 'PICKED',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
};

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
};

export const PRODUCT_CATEGORIES = [
  { id: 1, name: 'Vegetables', icon: '🥬' },
  { id: 2, name: 'Fruits', icon: '🍎' },
  { id: 3, name: 'Grains', icon: '🌾' },
  { id: 4, name: 'Pulses', icon: '🫘' },
  { id: 5, name: 'Dairy', icon: '🥛' },
  { id: 6, name: 'Spices', icon: '🌶️' },
  { id: 7, name: 'Herbs', icon: '🌿' },
  { id: 8, name: 'Others', icon: '📦' },
];

export const SUBSCRIPTION_TYPES = {
  WEEKLY: 'WEEKLY',
  MONTHLY: 'MONTHLY',
  QUARTERLY: 'QUARTERLY',
};

export const COMMISSION_PERCENTAGE = 5; // 5% platform commission

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};

export const TOAST_DURATION = 3000;

export const TOKEN_KEY = 'farmconnect_token';
export const REFRESH_TOKEN_KEY = 'farmconnect_refresh_token';
export const USER_KEY = 'farmconnect_user';
export const CART_KEY = 'farmconnect_cart';

export const DATE_FORMAT = 'dd MMM yyyy';
export const TIME_FORMAT = 'hh:mm a';
export const DATETIME_FORMAT = 'dd MMM yyyy hh:mm a';

export const MESSAGES = {
  SUCCESS: {
    LOGIN: 'Login successful!',
    REGISTER: 'Registration successful! Please log in.',
    LOGOUT: 'Logged out successfully.',
    CREATE: 'Created successfully!',
    UPDATE: 'Updated successfully!',
    DELETE: 'Deleted successfully!',
  },
  ERROR: {
    NETWORK: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'Unauthorized. Please log in again.',
    FORBIDDEN: 'You do not have permission to perform this action.',
    NOT_FOUND: 'Resource not found.',
    SERVER_ERROR: 'Server error. Please try again later.',
    VALIDATION: 'Please fill all required fields correctly.',
  },
};
