// Main App Component
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AuthProvider from './context/AuthContext.jsx';
import AppProvider from './context/AppContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { USER_ROLES } from './constants/index.js';

// Auth Pages
import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';

// Farmer Pages
import FarmerDashboard from './pages/farmer/Dashboard.jsx';
import FarmerProducts from './pages/farmer/Products.jsx';
import FarmerOrders from './pages/farmer/Orders.jsx';
import FarmerAnalytics from './pages/farmer/Analytics.jsx';
import FarmerProfile from './pages/farmer/Profile.jsx';

// Public User Pages
import PublicMarketplace from './pages/public/Marketplace.jsx';
import PublicCart from './pages/public/Cart.jsx';
import PublicOrders from './pages/public/Orders.jsx';
import PublicProfile from './pages/public/Profile.jsx';
import ProductDetail from './pages/public/ProductDetail.jsx';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard.jsx';
import AdminUsers from './pages/admin/Users.jsx';
import AdminProducts from './pages/admin/Products.jsx';
import AdminOrders from './pages/admin/Orders.jsx';
import AdminAnalytics from './pages/admin/Analytics.jsx';

// Delivery Agent Pages
import DeliveryDashboard from './pages/delivery/Dashboard.jsx';
import DeliveryEarnings from './pages/delivery/Earnings.jsx';

// Utility Pages
import UnauthorizedPage from './pages/UnauthorizedPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        {/* global*/}
        <AppProvider>
          <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Farmer Routes */}
          <Route path="/farmer/*" element={<ProtectedRoute requiredRoles={[USER_ROLES.FARMER]} />}>
            <Route path="dashboard" element={<FarmerDashboard />} />
            <Route path="products" element={<FarmerProducts />} />
            <Route path="orders" element={<FarmerOrders />} />
            <Route path="analytics" element={<FarmerAnalytics />} />
            <Route path="profile" element={<FarmerProfile />} />
          </Route>

          {/* Public User Routes */}
          <Route path="/public/*" element={<ProtectedRoute requiredRoles={[USER_ROLES.PUBLIC]} />}>
            <Route path="marketplace" element={<PublicMarketplace />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="cart" element={<PublicCart />} />
            <Route path="orders" element={<PublicOrders />} />
            <Route path="profile" element={<PublicProfile />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/*" element={<ProtectedRoute requiredRoles={[USER_ROLES.ADMIN]} />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="analytics" element={<AdminAnalytics />} />
          </Route>

          {/* Delivery Agent Routes */}
          <Route path="/delivery/*" element={<ProtectedRoute requiredRoles={[USER_ROLES.DELIVERY_AGENT]} />}>
            <Route path="dashboard" element={<DeliveryDashboard />} />
            <Route path="earnings" element={<DeliveryEarnings />} />
          </Route>

          {/* Error Routes */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        {/* Toast Notifications */}
        <Toaster position="top-right" reverseOrder={false} />
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
