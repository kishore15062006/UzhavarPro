// Public Profile Page
import { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { Card, Input, Button } from '../../components/index.js';
import useAuth from '../../hooks/useAuth.js';
import toast from 'react-hot-toast';

const PUBLIC_MENU_ITEMS = [
  { label: 'MAIN', items: [{ icon: '🏠', label: 'Marketplace', path: '/public/marketplace' }, { icon: '🛒', label: 'Cart', path: '/public/cart' }] },
  { label: 'ACCOUNT', items: [{ icon: '📋', label: 'My Orders', path: '/public/orders' }, { icon: '👤', label: 'Profile', path: '/public/profile' }] },
];

export const PublicProfile = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await updateProfile(formData);
    setLoading(false);
    if (response.success) {
      toast.success('Profile updated!');
    } else {
      toast.error('Failed to update profile');
    }
  };

  return (
    <DashboardLayout menuItems={PUBLIC_MENU_ITEMS}>
      <div className="max-w-2xl space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>

        <Card>
          <div className="flex items-center gap-4 mb-6 pb-6 border-b">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-3xl">
              🛍️
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
              <Input
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <div className="hidden md:block"></div>
              <div className="md:col-span-2">
                <Input
                  label="Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-start pt-2">
              <Button type="submit" variant="primary" loading={loading} disabled={loading}>
                Save Changes
              </Button>
            </div>
          </form>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Account Settings</h2>
          <div className="space-y-3">
            <Button variant="outline" fullWidth>🔐 Change Password</Button>
            <Button variant="outline" fullWidth>🔔 Notification Settings</Button>
            <Button variant="danger" fullWidth>❌ Delete Account</Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PublicProfile;
