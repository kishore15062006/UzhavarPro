// Admin Analytics Page
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { Card, Skeleton } from '../../components/index.js';
import useAsync from '../../hooks/useAsync.js';
import AdminService from '../../services/adminService.js';

const ADMIN_MENU_ITEMS = [
  { label: 'MAIN', items: [{ icon: '📊', label: 'Dashboard', path: '/admin/dashboard' }] },
  { label: 'MANAGEMENT', items: [{ icon: '👥', label: 'Users', path: '/admin/users' }, { icon: '🛒', label: 'Products', path: '/admin/products' }, { icon: '📋', label: 'Orders', path: '/admin/orders' }] },
  { label: 'ANALYTICS', items: [{ icon: '📈', label: 'Analytics', path: '/admin/analytics' }] },
];

export const AdminAnalytics = () => {
  const { data: revenueData, isLoading: revenueLoading } = useAsync(
    () => AdminService.getRevenueAnalytics(),
    true,
    []
  );

  const { data: userStats, isLoading: userLoading } = useAsync(
    () => AdminService.getUserStatistics(),
    true,
    []
  );

  return (
    <DashboardLayout menuItems={ADMIN_MENU_ITEMS}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Platform Analytics</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold mb-4">Revenue Breakdown</h3>
            {revenueLoading ? (
              <Skeleton count={3} />
            ) : (
              <div className="space-y-3">
                {revenueData?.revenues?.slice(0, 5).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.category || `Period ${idx + 1}`}</span>
                    <div className="flex items-center gap-3 flex-1 ml-4">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full" 
                          style={{width: `${(item.amount / (revenueData?.revenues?.[0]?.amount || 1)) * 100}%`}}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold min-w-fit">₹{item.amount || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-4">User Statistics</h3>
            {userLoading ? (
              <Skeleton count={3} />
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Farmers</span>
                  <span className="font-semibold">{userStats?.byRole?.FARMER || 0}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Public Users</span>
                  <span className="font-semibold">{userStats?.byRole?.PUBLIC || 0}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Delivery Agents</span>
                  <span className="font-semibold">{userStats?.byRole?.DELIVERY_AGENT || 0}</span>
                </div>
              </div>
            )}
          </Card>
        </div>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Top Performing Categories</h3>
          {revenueLoading ? (
            <Skeleton count={5} />
          ) : (
            <div className="space-y-3">
              {revenueData?.revenues?.slice(0, 5).map((item, i) => (
                <div key={item.category || i} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold">{item.category || `Category ${i + 1}`}</span>
                      <span className="text-sm text-gray-600">₹{item.amount || 0}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full"
                        style={{width: `${(item.amount / (revenueData?.revenues?.[0]?.amount || 1)) * 100}%`}}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Platform Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">Total Revenue</p>
              <p className="text-3xl font-bold text-blue-900">₹{revenueData?.totalRevenue || 0}</p>
              <p className="text-xs text-blue-600 mt-1">All time</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
              <p className="text-sm text-green-700">Total Users</p>
              <p className="text-3xl font-bold text-green-900">{userStats?.totalUsers || 0}</p>
              <p className="text-xs text-green-600 mt-1">Active users</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
              <p className="text-sm text-orange-700">Active Farmers</p>
              <p className="text-3xl font-bold text-orange-900">{userStats?.byRole?.FARMER || 0}</p>
              <p className="text-xs text-orange-600 mt-1">Selling products</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
              <p className="text-sm text-purple-700">Delivery Network</p>
              <p className="text-3xl font-bold text-purple-900">{userStats?.byRole?.DELIVERY_AGENT || 0}</p>
              <p className="text-xs text-purple-600 mt-1">Active agents</p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminAnalytics;
