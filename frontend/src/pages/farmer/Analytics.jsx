// Farmer Analytics Page
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { Card, Skeleton } from '../../components/index.js';
import useAsync from '../../hooks/useAsync.js';
import useAuth from '../../hooks/useAuth.js';
import AnalyticsService from '../../services/analyticsService.js';
import RatingService from '../../services/ratingService.js';

const FARMER_MENU_ITEMS = [
  { label: 'MAIN', items: [{ icon: '📊', label: 'Dashboard', path: '/farmer/dashboard' }, { icon: '🛒', label: 'Products', path: '/farmer/products' }] },
  { label: 'OPERATIONS', items: [{ icon: '📋', label: 'Orders', path: '/farmer/orders' }, { icon: '💰', label: 'Analytics', path: '/farmer/analytics' }] },
  { label: 'ACCOUNT', items: [{ icon: '👤', label: 'Profile', path: '/farmer/profile' }] },
];

export const FarmerAnalytics = () => {
  const { user } = useAuth();

  const { data: salesSummary, isLoading: summaryLoading, error: summaryError } = useAsync(
    () => AnalyticsService.getSalesSummary(),
    true
  );

  const { data: earningsSummary, isLoading: earningsLoading, error: earningsError } = useAsync(
    () => AnalyticsService.getEarningsSummary(),
    true
  );

  const { data: salesTrend, isLoading: trendLoading, error: trendError } = useAsync(
    () => AnalyticsService.getSalesTrend(),
    true
  );

  const { data: topProducts, isLoading: topLoading, error: topError } = useAsync(
    () => AnalyticsService.getTopProducts({ page: 0, size: 6 }),
    true
  );

  const { data: reviews, isLoading: reviewsLoading, error: reviewsError } = useAsync(
    () => user?.id ? RatingService.getRatingsForFarmer(user.id) : Promise.resolve({ success: true, data: [] }),
    true,
    [user?.id]
  );

  const isLoading = summaryLoading || earningsLoading || trendLoading || topLoading || reviewsLoading;
  const error = summaryError || earningsError || trendError || topError || reviewsError;

  // Calculate average rating
  const avgRating = reviews?.length 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  // Sales Trend chart helpers
  const maxSales = salesTrend?.length 
    ? Math.max(...salesTrend.map(t => t.sales || 1), 1)
    : 1;

  return (
    <DashboardLayout menuItems={FARMER_MENU_ITEMS}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600">Detailed insights into your farm products, sales performance, and customer satisfaction.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <Skeleton count={3} />
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            Unable to load analytics. Please refresh and try again.
          </div>
        ) : (
          <>
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Gross Revenue</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      ₹{earningsSummary?.grossEarnings?.toLocaleString('en-IN') || 0}
                    </p>
                  </div>
                  <span className="text-3xl bg-green-50 p-2 rounded-lg">💰</span>
                </div>
                <div className="mt-4 text-xs text-gray-500">Total revenue from delivered orders</div>
              </Card>

              <Card className="hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Net Earnings</p>
                    <p className="text-3xl font-bold text-primary-600 mt-1">
                      ₹{earningsSummary?.netEarnings?.toLocaleString('en-IN') || 0}
                    </p>
                  </div>
                  <span className="text-3xl bg-primary-50 p-2 rounded-lg">🌾</span>
                </div>
                <div className="mt-4 text-xs text-primary-600 font-medium">95% of gross (5% platform comm.)</div>
              </Card>

              <Card className="hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Volume Sold</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {salesSummary?.totalQuantity?.toFixed(1) || 0} kg
                    </p>
                  </div>
                  <span className="text-3xl bg-blue-50 p-2 rounded-lg">📦</span>
                </div>
                <div className="mt-4 text-xs text-gray-500">Across {salesSummary?.totalOrders || 0} total order(s)</div>
              </Card>

              <Card className="hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Average Rating</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <p className="text-3xl font-bold text-gray-900">{avgRating}</p>
                      <span className="text-yellow-500 text-lg">★</span>
                    </div>
                  </div>
                  <span className="text-3xl bg-yellow-50 p-2 rounded-lg">⭐</span>
                </div>
                <div className="mt-4 text-xs text-gray-500">From {reviews?.length || 0} review(s)</div>
              </Card>
            </div>

            {/* Charts & Categorical Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sales Trend Chart */}
              <Card className="lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Sales Trend (Monthly)</h3>
                <div className="h-64 flex items-end justify-around gap-2 px-4 pb-2 border-b">
                  {salesTrend && salesTrend.map((t, idx) => {
                    const pct = (t.sales / maxSales) * 100;
                    return (
                      <div key={idx} className="flex flex-col items-center flex-1 group relative">
                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                          Sales: ₹{t.sales?.toLocaleString('en-IN')}
                        </div>
                        {/* Styled visual bar */}
                        <div 
                          className="w-full bg-gradient-to-t from-primary-400 to-primary-600 rounded-t-md hover:from-primary-500 hover:to-primary-700 transition-all duration-500 ease-out"
                          style={{ height: `${Math.max(pct, 4)}%`, minHeight: '6px' }}
                        ></div>
                        <span className="text-xs text-gray-500 mt-2 truncate w-full text-center">
                          {t.period}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Category distribution */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Category Breakdown</h3>
                {salesSummary?.categoryBreakdown?.length ? (
                  <div className="space-y-5">
                    {salesSummary.categoryBreakdown.map((c, i) => {
                      const totalRev = salesSummary.totalSales || 1;
                      const ratio = (c.amount / totalRev) * 100;
                      return (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between text-sm font-medium">
                            <span className="text-gray-700">{c.category}</span>
                            <span className="text-gray-900">₹{c.amount?.toLocaleString('en-IN')} ({ratio.toFixed(0)}%)</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-3">
                            <div 
                              className="bg-primary-500 h-3 rounded-full transition-all duration-500" 
                              style={{ width: `${ratio}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="h-48 flex items-center justify-center text-gray-500 text-sm">
                    No categorical data available
                  </div>
                )}
              </Card>
            </div>

            {/* Top Products & Customer Reviews */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Products List */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Performing Products</h3>
                <div className="divide-y">
                  {topProducts?.content?.length ? (
                    topProducts.content.map((product) => {
                      const maxProdRevenue = Math.max(...topProducts.content.map(p => p.totalRevenue || 1), 1);
                      const pct = (product.totalRevenue / maxProdRevenue) * 100;
                      return (
                        <div key={product.productId} className="py-4 first:pt-0 last:pb-0">
                          <div className="flex justify-between items-center mb-1">
                            <div>
                              <p className="font-semibold text-gray-900">{product.productName}</p>
                              <p className="text-sm text-gray-500">Revenue: ₹{product.totalRevenue?.toLocaleString('en-IN')}</p>
                            </div>
                            <span className="bg-primary-50 text-primary-700 text-xs px-2.5 py-1 rounded-full font-semibold">
                              {product.totalQuantity?.toFixed(1)} kg sold
                            </span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                            <div 
                              className="bg-primary-500 h-1.5 rounded-full" 
                              style={{ width: `${pct}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-500 py-4 text-center">No sales recorded yet.</p>
                  )}
                </div>
              </Card>

              {/* Reviews Feed */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Customer Reviews</h3>
                <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2">
                  {reviews?.length ? (
                    reviews.map((r) => (
                      <div key={r.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-sm transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="font-semibold text-gray-900 block">{r.userName}</span>
                            <span className="text-xs text-primary-600 font-medium">on {r.productName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">{'★'.repeat(r.rating)}</span>
                            <span className="text-gray-300">{'★'.repeat(5 - r.rating)}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 italic">"{r.comment}"</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 py-4 text-center">No customer reviews yet.</p>
                  )}
                </div>
              </Card>
            </div>

            {/* Payout Tracking Status */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Payout Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x">
                <div className="pt-4 md:pt-0 md:pr-6">
                  <span className="text-sm text-gray-500">Gross Sales</span>
                  <p className="text-2xl font-bold text-gray-900 mt-1">₹{earningsSummary?.grossEarnings?.toLocaleString('en-IN') || 0}</p>
                </div>
                <div className="pt-4 md:pt-0 md:px-6">
                  <span className="text-sm text-gray-500">Completed Payouts (Sent to Bank)</span>
                  <p className="text-2xl font-bold text-green-600 mt-1">₹{earningsSummary?.completedPayout?.toLocaleString('en-IN') || 0}</p>
                </div>
                <div className="pt-4 md:pt-0 md:pl-6">
                  <span className="text-sm text-gray-500">Pending Settlement</span>
                  <p className="text-2xl font-bold text-yellow-600 mt-1">₹{earningsSummary?.pendingPayout?.toLocaleString('en-IN') || 0}</p>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FarmerAnalytics;
