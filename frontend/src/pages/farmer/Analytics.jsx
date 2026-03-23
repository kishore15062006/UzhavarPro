// Farmer Analytics Page
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { Card, Skeleton } from '../../components/index.js';
import useAsync from '../../hooks/useAsync.js';
import AnalyticsService from '../../services/analyticsService.js';

const FARMER_MENU_ITEMS = [
  { label: 'MAIN', items: [{ icon: '📊', label: 'Dashboard', path: '/farmer/dashboard' }, { icon: '🛒', label: 'Products', path: '/farmer/products' }] },
  { label: 'OPERATIONS', items: [{ icon: '📋', label: 'Orders', path: '/farmer/orders' }, { icon: '💰', label: 'Analytics', path: '/farmer/analytics' }] },
  { label: 'ACCOUNT', items: [{ icon: '👤', label: 'Profile', path: '/farmer/profile' }] },
];

export const FarmerAnalytics = () => {
  const { data: salesTrend, isLoading: trendLoading, error: trendError } = useAsync(
    () => AnalyticsService.getSalesTrend(),
    true
  );

  const {
    data: topProducts,
    isLoading: topLoading,
    error: topError,
  } = useAsync(() => AnalyticsService.getTopProducts({ page: 0, size: 6 }), true);

  const isLoading = trendLoading || topLoading;
  const error = trendError || topError;

  return (
    <DashboardLayout menuItems={FARMER_MENU_ITEMS}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <Skeleton count={3} />
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-red-600">Unable to load analytics (please refresh).</div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <h3 className="text-lg font-semibold mb-4">Sales Trend</h3>
                <div className="h-64 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg flex items-center justify-center">
                  {salesTrend ? (
                    <p className="text-gray-600">📈 Latest sales trend data loaded</p>
                  ) : (
                    <p className="text-gray-600">No trend data yet</p>
                  )}
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold mb-4">Top Products</h3>
                <div className="space-y-3">
                  {topProducts?.content?.length ? (
                    topProducts.content.map((product) => (
                      <div key={product.productId} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-semibold text-gray-900">{product.productName}</p>
                          <p className="text-sm text-gray-500">Revenue: ₹{product.totalRevenue?.toLocaleString('en-IN')}</p>
                        </div>
                        <span className="font-semibold">{product.totalQuantity?.toFixed(2)} kg</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No sales yet. Create products and receive orders to see top product rankings.</p>
                  )}
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FarmerAnalytics;
