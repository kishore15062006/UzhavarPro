// TopNavigation Component
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import Button from '../components/Button.jsx';
import Modal from '../components/Modal.jsx';

export const TopNavigation = ({ toggleMobileMenu }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const getProfilePath = () => {
    const paths = {
      FARMER: '/farmer/profile',
      PUBLIC: '/public/profile',
    };
    return paths[user?.role] || '#';
  };

  // Get initials for profile avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 fixed top-0 left-0 right-0 h-16 z-40 transition-all duration-300">
        <div className="h-full px-4 flex items-center justify-between">
          
          {/* Left Section: Hamburger & Logo */}
          <div className="flex items-center gap-3">
            {/* Hamburger Button for Mobile Drawer Toggle */}
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-colors lg:hidden"
              aria-label="Toggle menu"
            >
              <span className="text-xl">☰</span>
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-2xl transition-transform duration-300 group-hover:rotate-12">🌾</span>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                FarmConnect
              </span>
            </Link>
          </div>

          {/* Right Section: User & Profile Dropdown */}
          <div className="flex items-center gap-4">
            
            {/* User Dropdown Trigger */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-full hover:bg-gray-50 border border-gray-100 transition-all duration-200"
              >
                <div className="flex flex-col text-right hidden sm:flex">
                  <span className="text-xs font-semibold text-gray-800 leading-3">{user?.name}</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">{getRoleLabel(user?.role)}</span>
                </div>
                {/* Gradient Initial Avatar */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white font-bold text-xs flex items-center justify-center shadow-inner">
                  {getInitials(user?.name)}
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* User info header (mobile support) */}
                  <div className="px-4 py-2 border-b border-gray-50 sm:hidden">
                    <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{getRoleLabel(user?.role)}</p>
                  </div>

                  {user?.role !== 'ADMIN' && user?.role !== 'DELIVERY_AGENT' && (
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        navigate(getProfilePath());
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors flex items-center gap-2"
                    >
                      <span>👤</span> My Profile
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      setShowLogoutModal(true);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <span>🚪</span> Logout
                  </button>
                </div>
              )}
            </div>

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
