// Admin Dashboard
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { Card, Button, Skeleton, ErrorMessage } from '../../components/index.js';
import useAsync from '../../hooks/useAsync.js';
import AdminService from '../../services/adminService.js';
import { AppContext } from '../../context/AppContextObject.js';
import { Formatters } from '../../utils/index.js';

const ADMIN_MENU_ITEMS = [
  { label: 'MAIN', items: [{ icon: '📊', label: 'Dashboard', path: '/admin/dashboard' }] },
  { label: 'MANAGEMENT', items: [{ icon: '👥', label: 'Users', path: '/admin/users' }, { icon: '🛒', label: 'Products', path: '/admin/products' }, { icon: '📋', label: 'Orders', path: '/admin/orders' }] },
  { label: 'ANALYTICS', items: [{ icon: '📈', label: 'Analytics', path: '/admin/analytics' }] },
];

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { dashboardRefreshKey } = useContext(AppContext);

  const { data: stats, isLoading, error } = useAsync(
    () => AdminService.getDashboardStats(),
    true,
    [dashboardRefreshKey]
  );

  return (
    <DashboardLayout menuItems={ADMIN_MENU_ITEMS}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

        {error && <ErrorMessage error={error} />}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <Skeleton height="h-24" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <div className="text-center">
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalUsers || 0}</p>
                <p className="text-xs text-blue-600 mt-1">Registered</p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-gray-600 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">₹{Formatters.formatNumber(stats?.totalRevenue || 0)}</p>
                <p className="text-xs text-green-600 mt-1">Platform earnings</p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-gray-600 text-sm">Active Orders</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalOrders || 0}</p>
                <p className="text-xs text-blue-600 mt-1">In progress</p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-gray-600 text-sm">Total Products</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalProducts || 0}</p>
                <p className="text-xs text-purple-600 mt-1">Listed</p>
              </div>
            </Card>
          </div>
        )}

        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="w-full" onClick={() => navigate('/admin/users')}>👥 Manage Users</Button>
            <Button className="w-full" onClick={() => navigate('/admin/products')}>🛒 Review Products</Button>
            <Button className="w-full" onClick={() => navigate('/admin/orders')}>📋 Process Orders</Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-lg font-semibold mb-4">Platform Stats</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <p className="text-gray-700">Active Farmers</p>
                <p className="font-semibold">{stats?.activeFarmers || 0}</p>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <p className="text-gray-700">Active Buyers</p>
                <p className="font-semibold">{stats?.activeBuyers || 0}</p>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <p className="text-gray-700">Active Shop Owners</p>
                <p className="font-semibold">{stats?.activeShops || 0}</p>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <p className="text-gray-700">Commission Rate</p>
                <p className="font-semibold">5%</p>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold mb-4">System Health</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                <p className="text-gray-700">API Status</p>
                <span className="px-2 py-1 bg-green-200 text-green-800 rounded text-xs font-semibold">Operational</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                <p className="text-gray-700">Database</p>
                <span className="px-2 py-1 bg-green-200 text-green-800 rounded text-xs font-semibold">Connected</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                <p className="text-gray-700">Cache Server</p>
                <span className="px-2 py-1 bg-green-200 text-green-800 rounded text-xs font-semibold">Active</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                <p className="text-gray-700">Upload Server</p>
                <span className="px-2 py-1 bg-green-200 text-green-800 rounded text-xs font-semibold">Ready</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;