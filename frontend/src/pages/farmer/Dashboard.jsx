// Farmer Dashboard
// (no direct React hooks used)
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { Card, Button, Skeleton, ErrorMessage } from '../../components/index.js';
import { useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContextObject.js';
import useAsync from '../../hooks/useAsync.js';
import AnalyticsService from '../../services/analyticsService.js';
import OrderService from '../../services/orderService.js';
import ProductService from '../../services/productService.js';
import toast from 'react-hot-toast';

const FARMER_MENU_ITEMS = [
  {
    label: 'MAIN',
    items: [
      { icon: '📊', label: 'Dashboard', path: '/farmer/dashboard' },
      { icon: '🛒', label: 'Products', path: '/farmer/products' },
    ],
  },
  {
    label: 'OPERATIONS',
    items: [
      { icon: '📋', label: 'Orders', path: '/farmer/orders' },
      { icon: '💰', label: 'Analytics', path: '/farmer/analytics' },
    ],
  },
  {
    label: 'ACCOUNT',
    items: [
      { icon: '👤', label: 'Profile', path: '/farmer/profile' },
    ],
  },
];

export const FarmerDashboard = () => {
  const navigate = useNavigate();
  const { dashboardRefreshKey } = useContext(AppContext);

  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
    execute: executeStats,
  } = useAsync(() => AnalyticsService.getDashboardStats(), true, [dashboardRefreshKey]);

  const {
    data: incomingOrders,
    isLoading: incomingOrdersLoading,
    error: incomingOrdersError,
    execute: executeIncomingOrders,
  } = useAsync(
    () => OrderService.getIncomingOrders({ page: 0, size: 5 }),
    true,
    [dashboardRefreshKey]
  );

  const {
    data: myProducts,
    isLoading: myProductsLoading,
    error: myProductsError,
    execute: executeMyProducts,
  } = useAsync(
    () => ProductService.getMyProducts({ page: 0, size: 5 }),
    true,
    [dashboardRefreshKey]
  );

  const isLoading = statsLoading || incomingOrdersLoading || myProductsLoading;
  const error = statsError || incomingOrdersError || myProductsError;

  const activityItems = useMemo(() => {
    const orders = (incomingOrders?.content || []).map((order) => ({
      id: `order-${order.id}`,
      title: `New order received #${order.id}`,
      subtitle: `${order.items?.length || 0} item(s) • ₹${
        order.totalAmount?.toLocaleString('en-IN') ?? '0'
      }`,
      icon: '📦',
      when: order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Just now',
    }));

    const products = (myProducts?.content || []).map((product) => ({
      id: `product-${product.id}`,
      title: `Product listed: ${product.name}`,
      subtitle: `₹${product.pricePerKg?.toLocaleString('en-IN') || 0} per kg`,
      icon: '🌾',
      when: product.createdAt ? new Date(product.createdAt).toLocaleString() : 'Just now',
    }));

    const combined = [...orders, ...products];
    return combined.sort((a, b) => (a.when < b.when ? 1 : -1)).slice(0, 6);
  }, [incomingOrders, myProducts]);

  const handleRefresh = () => {
    executeStats();
    executeIncomingOrders();
    executeMyProducts();
    toast.success('Data refreshed');
  };

  return (
    <DashboardLayout menuItems={FARMER_MENU_ITEMS}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's your farming activity.</p>
          </div>
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            🔄 Refresh
          </Button>
        </div>

        {/* Error State */}
        {error && <ErrorMessage error={error} onRetry={handleRefresh} />}

        {/* Stats Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <Skeleton count={3} />
              </Card>
            ))}
          </div>
        ) : (
          stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Sales</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      ₹{stats.totalSales?.toLocaleString('en-IN') || 0}
                    </p>
                  </div>
                  <span className="text-4xl">📈</span>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Orders</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stats.totalOrders || 0}
                    </p>
                  </div>
                  <span className="text-4xl">📋</span>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Earnings</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      ₹{stats.totalEarnings?.toLocaleString('en-IN') || 0}
                    </p>
                  </div>
                  <span className="text-4xl">💰</span>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Products</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stats.totalProducts || 0}
                    </p>
                  </div>
                  <span className="text-4xl">🛒</span>
                </div>
              </Card>
            </div>
          )
        )}

        {/* Quick Actions */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="primary" fullWidth onClick={() => navigate('/farmer/products')}>
              ➕ Add New Product
            </Button>
            <Button variant="secondary" fullWidth onClick={() => navigate('/farmer/orders')}>
              👀 View Orders
            </Button>
            <Button variant="outline" fullWidth onClick={() => navigate('/farmer/analytics')}>
              📊 View Analytics
            </Button>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {isLoading ? (
              <div className="grid gap-3">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <Skeleton count={2} />
                  </div>
                ))}
              </div>
            ) : error ? (
              <ErrorMessage error={error} onRetry={handleRefresh} />
            ) : activityItems.length > 0 ? (
              activityItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.subtitle}</p>
                    <p className="text-xs text-gray-400">{item.when}</p>
                  </div>
                  <span>{item.icon}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No recent activity. Start adding products or watch for incoming orders.</p>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FarmerDashboard;
