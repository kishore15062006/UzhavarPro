import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { Card, Input, Button } from '../../components/index.js';
import MapLocationPicker from '../../components/MapLocationPicker.jsx';
import useAuth from '../../hooks/useAuth.js';
import toast from 'react-hot-toast';

const DELIVERY_MENU_ITEMS = [
  { label: 'MAIN', items: [{ icon: '📦', label: 'Dashboard', path: '/delivery/dashboard' }] },
  { label: 'ACCOUNT', items: [{ icon: '💰', label: 'Earnings', path: '/delivery/earnings' }, { icon: '👤', label: 'Profile', path: '/delivery/profile' }] },
];

export const DeliveryProfile = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    vehicleType: user?.vehicleType || 'MOTORCYCLE',
    availability: user?.availability !== undefined ? user.availability : true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        vehicleType: user.vehicleType || 'MOTORCYCLE',
        availability: user.availability !== undefined ? user.availability : true,
      });
    }
  }, [user]);

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
    <DashboardLayout menuItems={DELIVERY_MENU_ITEMS}>
      <div className="max-w-2xl space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>

        <Card>
          <div className="flex items-center gap-4 mb-6 pb-6 border-b">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 flex items-center justify-center text-3xl">
              🚴
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-600">{user?.email} • Delivery Agent</p>
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
                label="Email Address"
                type="email"
                value={formData.email}
                disabled
              />
              <Input
                label="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Type
                </label>
                <select
                  value={formData.vehicleType}
                  onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200"
                >
                  <option value="BICYCLE">Bicycle</option>
                  <option value="MOTORCYCLE">Motorcycle</option>
                  <option value="CAR">Car</option>
                  <option value="TRUCK">Truck</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Availability Status
                </label>
                <select
                  value={formData.availability ? 'true' : 'false'}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value === 'true' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200"
                >
                  <option value="true">Available for Deliveries</option>
                  <option value="false">Busy / Offline</option>
                </select>
              </div>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Agent Location</h2>
          <MapLocationPicker 
            initialLat={user?.latitude || 11.1271}
            initialLng={user?.longitude || 78.6569}
            initialAddress={user?.address || ''}
            title="Select Agent Location"
            saveButtonText="Save Agent Location"
            onSave={() => {
              toast.success('Your location updated successfully!');
            }}
          />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DeliveryProfile;
