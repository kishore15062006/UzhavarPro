// DashboardLayout Component
import { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth.js';
import TopNavigation from './TopNavigation.jsx';
import Sidebar from './Sidebar.jsx';
import { Modal, Button } from '../components/index.js';
import toast from 'react-hot-toast';

const MENU_BY_ROLE = {
  FARMER: [
    {
      id: 'farmer-main',
      label: 'MAIN',
      items: [
        { icon: '📊', label: 'Dashboard', path: '/farmer/dashboard' },
        { icon: '🛒', label: 'Products', path: '/farmer/products' },
      ],
    },
    {
      id: 'farmer-operations',
      label: 'OPERATIONS',
      items: [
        { icon: '📋', label: 'Orders', path: '/farmer/orders' },
        { icon: '💰', label: 'Analytics', path: '/farmer/analytics' },
      ],
    },
    {
      id: 'farmer-account',
      label: 'ACCOUNT',
      items: [
        { icon: '👤', label: 'Profile', path: '/farmer/profile' },
      ],
    },
  ],
  PUBLIC: [
    {
      id: 'public-main',
      label: 'MAIN',
      items: [
        { icon: '🏠', label: 'Marketplace', path: '/public/marketplace' },
        { icon: '🛒', label: 'Cart', path: '/public/cart' },
      ],
    },
    {
      id: 'public-account',
      label: 'ACCOUNT',
      items: [
        { icon: '📋', label: 'My Orders', path: '/public/orders' },
        { icon: '👤', label: 'Profile', path: '/public/profile' },
      ],
    },
  ],
  ADMIN: [
    {
      id: 'admin-main',
      label: 'MAIN',
      items: [
        { icon: '📊', label: 'Dashboard', path: '/admin/dashboard' },
      ],
    },
    {
      id: 'admin-mgmt',
      label: 'MANAGEMENT',
      items: [
        { icon: '👥', label: 'Users', path: '/admin/users' },
        { icon: '🛒', label: 'Products', path: '/admin/products' },
        { icon: '📋', label: 'Orders', path: '/admin/orders' },
      ],
    },
    {
      id: 'admin-analytics',
      label: 'ANALYTICS',
      items: [
        { icon: '📈', label: 'Analytics', path: '/admin/analytics' },
      ],
    },
  ],
  DELIVERY_AGENT: [
    {
      id: 'delivery-main',
      label: 'MAIN',
      items: [
        { icon: '📦', label: 'Dashboard', path: '/delivery/dashboard' },
      ],
    },
    {
      id: 'delivery-account',
      label: 'ACCOUNT',
      items: [
        { icon: '💰', label: 'Earnings', path: '/delivery/earnings' },
        { icon: '👤', label: 'Profile', path: '/delivery/profile' },
      ],
    },
  ],
};

export const DashboardLayout = ({ children, menuItems }) => {
  const { user, updateLocation } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showLocModal, setShowLocModal] = useState(false);
  const [locLoading, setLocLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const isFarmerMissingLoc = user.role === 'FARMER' && (!user.farmLat || !user.farmLng);
      const isBuyerMissingLoc = user.role === 'PUBLIC' && (!user.latitude || !user.longitude);
      const isAgentMissingLoc = user.role === 'DELIVERY_AGENT' && (!user.latitude || !user.longitude);
      const hasDismissed = sessionStorage.getItem('dismissedLocationPrompt') === 'true';

      if ((isFarmerMissingLoc || isBuyerMissingLoc || isAgentMissingLoc) && !hasDismissed) {
        setShowLocModal(true);
      }
    }
  }, [user]);

  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        
        try {
          let address = '';
          try {
            const geoRes = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
              { headers: { 'Accept-Language': 'en' } }
            );
            if (geoRes.ok) {
              const geoData = await geoRes.json();
              address = geoData.display_name || '';
            }
          } catch (geoErr) {
            console.error('Reverse geocoding error:', geoErr);
          }

          const res = await updateLocation(lat, lng, address);
          if (res.success) {
            toast.success("Location saved successfully!");
            setShowLocModal(false);
          } else {
            toast.error(res.error?.message || "Failed to save location");
          }
        } catch (err) {
          toast.error("An error occurred while saving location");
        } finally {
          setLocLoading(false);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        let errorMsg = "Could not retrieve location. Please check your browser permission.";
        if (error.code === 1) {
          errorMsg = "Location permission denied. Please allow location access in your browser settings.";
        }
        toast.error(errorMsg);
        setLocLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleDismissLocation = () => {
    sessionStorage.setItem('dismissedLocationPrompt', 'true');
    setShowLocModal(false);
  };

  const processedMenuItems = menuItems
    ? menuItems.map((item, idx) => ({ ...item, id: item.id || `menu-group-${idx}` }))
    : (user ? MENU_BY_ROLE[user.role] : []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <TopNavigation 
        toggleMobileMenu={() => setIsMobileOpen(!isMobileOpen)} 
        toggleSidebar={() => setCollapsed(!collapsed)}
        isSidebarCollapsed={collapsed}
      />
      <div className="flex flex-1">
        <Sidebar 
          menuItems={processedMenuItems} 
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />
        <main className={`flex-1 transition-all duration-300 mt-16 p-4 md:p-6 overflow-y-auto ${
          collapsed ? 'lg:ml-20' : 'lg:ml-64'
        } ml-0`}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      <Modal
        isOpen={showLocModal}
        onClose={handleDismissLocation}
        title={
          user?.role === 'FARMER' 
            ? '📍 Save Farm Location' 
            : user?.role === 'DELIVERY_AGENT'
              ? '📍 Save Agent Location'
              : '📍 Save Delivery Location'
        }
        closeButton={true}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleDismissLocation} disabled={locLoading}>
              Not Now
            </Button>
            <Button variant="primary" onClick={handleRequestLocation} loading={locLoading}>
              {locLoading ? 'Detecting...' : 'Share Location'}
            </Button>
          </div>
        }
      >
        <div className="text-center py-4 space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center text-3xl animate-bounce">
            📍
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">
              {user?.role === 'FARMER' 
                ? 'Turn on Location for Farm' 
                : user?.role === 'DELIVERY_AGENT'
                  ? 'Enable Location for Agent'
                  : 'Enable Delivery Location'
              }
            </h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              {user?.role === 'FARMER' 
                ? 'To showcase your products to nearby buyers and enable route guidance for delivery agents, please turn on your location to save your farm coordinates.'
                : user?.role === 'DELIVERY_AGENT'
                  ? 'To help plan delivery routes and calculate distances to pick up items from farms, please share your current agent location.'
                  : 'To help us calculate accurate shipping fees and assist delivery agents in locating your address, please share your current delivery location.'
              }
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DashboardLayout;
