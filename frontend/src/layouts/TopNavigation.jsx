// TopNavigation Component
import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import Button from '../components/Button.jsx';
import Modal from '../components/Modal.jsx';
import { StringUtils } from '../utils/index.js';

export const TopNavigation = () => {
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowLogoutModal(false);
  };

  const getRoleLabel = (role) => {
    const labels = {
      FARMER: '👨‍🌾 Farmer',
      PUBLIC: '🛍️ Buyer',
      ADMIN: '⚙️ Admin',
      DELIVERY_AGENT: '📦 Delivery Agent',
    };
    return labels[role] || role;
  };

  return (
    <>
      <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🌾</span>
            <span className="text-xl font-bold text-primary-600">FarmConnect</span>
          </Link>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">{user?.name}</span>
              <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">
                {getRoleLabel(user?.role)}
              </span>
            </div>

            <button
              onClick={() => setShowLogoutModal(true)}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              👤
            </button>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Logout"
        footer={
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowLogoutModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        }
      >
        <p className="text-gray-600">Are you sure you want to logout?</p>
      </Modal>
    </>
  );
};

export default TopNavigation;
