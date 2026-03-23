// Farmer Profile Page
import { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { Card, Input, Button } from '../../components/index.js';
import useAuth from '../../hooks/useAuth.js';
import toast from 'react-hot-toast';

const FARMER_MENU_ITEMS = [
  { label: 'MAIN', items: [{ icon: '📊', label: 'Dashboard', path: '/farmer/dashboard' }, { icon: '🛒', label: 'Products', path: '/farmer/products' }] },
  { label: 'OPERATIONS', items: [{ icon: '📋', label: 'Orders', path: '/farmer/orders' }, { icon: '💰', label: 'Analytics', path: '/farmer/analytics' }] },
  { label: 'ACCOUNT', items: [{ icon: '👤', label: 'Profile', path: '/farmer/profile' }] },
];

export const FarmerProfile = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    farmSize: user?.farmSize || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await updateProfile(formData);
    setLoading(false);
    if (response.success) {
      toast.success('Profile updated successfully!');
    } else {
      toast.error('Failed to update profile');
    }
  };

  return (
    <DashboardLayout menuItems={FARMER_MENU_ITEMS}>
      <div className="max-w-2xl space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>

        <Card>
          <div className="flex items-center gap-4 mb-6 pb-6 border-b">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-3xl">
              👨‍🌾
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <Input
                label="Farm Size (acres)"
                type="number"
                value={formData.farmSize}
                onChange={(e) => setFormData({ ...formData, farmSize: e.target.value })}
              />
            </div>

            <Input
              label="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />

            <Button type="submit" variant="primary" loading={loading} disabled={loading}>
              Save Changes
            </Button>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FarmerProfile;
