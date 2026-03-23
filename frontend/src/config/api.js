// API Configuration for FarmConnect

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
    VERIFY_TOKEN: '/auth/verify',
  },

  // User Management
  USERS: {
    GET_PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    GET_LOCATION: '/users/location',
    UPDATE_LOCATION: '/users/location',
  },

  // Products (Farmer)
  PRODUCTS: {
    CREATE: '/products',
    GET_ALL: '/products',
    GET_BY_ID: '/products/:id',
    UPDATE: '/products/:id',
    DELETE: '/products/:id',
    GET_MY_PRODUCTS: '/products/farmer/my-products',
    TOGGLE_AVAILABILITY: '/products/:id/toggle-availability',
    GET_BY_FARMER: '/products/farmer/:farmerId',
    UPLOAD_IMAGE: '/products/upload-image',
  },

  // Orders
  ORDERS: {
    CREATE: '/orders',
    GET_ALL: '/orders',
    GET_BY_ID: '/orders/:id',
    GET_MY_ORDERS: '/orders/user/my-orders',
    GET_INCOMING_ORDERS: '/orders/farmer/incoming',
    UPDATE_STATUS: '/orders/:id/status',
    ACCEPT_ORDER: '/orders/:id/accept',
    REJECT_ORDER: '/orders/:id/reject',
    CANCEL_ORDER: '/orders/:id/cancel',
  },

  // Order Items
  ORDER_ITEMS: {
    GET_BY_ORDER: '/order-items/order/:orderId',
  },

  // Payments
  PAYMENTS: {
    CREATE: '/payments',
    GET_ALL: '/payments',
    GET_BY_ORDER: '/payments/order/:orderId',
    UPDATE_STATUS: '/payments/:id/status',
    GET_MY_PAYMENTS: '/payments/user/my-payments',
    REQUEST_PAYOUT: '/payments/farmer/payout-request',
  },

  // Cart (Client-side storage)
  CART: {
    GET_CART: '/cart', // If using server-side cart
  },

  // Ratings & Reviews
  RATINGS: {
    CREATE: '/ratings',
    GET_FOR_FARMER: '/ratings/farmer/:farmerId',
    GET_FOR_PRODUCT: '/ratings/product/:productId',
    UPDATE: '/ratings/:id',
    DELETE: '/ratings/:id',
  },

  // Delivery
  DELIVERY: {
    ASSIGN_AGENT: '/delivery/assign',
    UPDATE_STATUS: '/delivery/:id/status',
    GET_DELIVERY: '/delivery/order/:orderId',
    GET_MY_DELIVERIES: '/delivery/agent/my-deliveries',
  },

  // Analytics (Farmer)
  ANALYTICS: {
    SALES_SUMMARY: '/analytics/farmer/sales-summary',
    EARNINGS_SUMMARY: '/analytics/farmer/earnings-summary',
    SALES_TREND: '/analytics/farmer/sales-trend',
    TOP_PRODUCTS: '/analytics/farmer/top-products',
    DASHBOARD_STATS: '/analytics/farmer/dashboard-stats',
  },

  // Analytics (Admin)
  ADMIN_ANALYTICS: {
    DASHBOARD_STATS: '/analytics/admin/dashboard-stats',
    REVENUE_SUMMARY: '/analytics/admin/revenue-summary',
    TOP_SELLING_CROPS: '/analytics/admin/top-selling-crops',
    USER_STATS: '/analytics/admin/user-stats',
    COMMISSION_TRACKING: '/analytics/admin/commission-tracking',
  },

  // Admin Management
  ADMIN: {
    GET_ALL_USERS: '/admin/users',
    GET_ALL_PRODUCTS: '/admin/products',
    GET_ALL_ORDERS: '/admin/orders',
    UPDATE_USER_ROLE: '/admin/users/:id/role',
    SUSPEND_USER: '/admin/users/:id/suspend',
    REMOVE_PRODUCT: '/admin/products/:id',
  },

  // Search & Filter
  SEARCH: {
    PRODUCTS: '/search/products',
    FARMERS: '/search/farmers',
    NEARBY_FARMERS: '/search/nearby-farmers',
  },

  // Subscriptions (Shop Owner)
  SUBSCRIPTIONS: {
    CREATE: '/subscriptions',
    GET_MY_SUBSCRIPTIONS: '/subscriptions/user/my-subscriptions',
    UPDATE: '/subscriptions/:id',
    CANCEL: '/subscriptions/:id/cancel',
  },
};

export default API_BASE_URL;
