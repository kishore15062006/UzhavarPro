// Delivery Agent Earnings Page
import { useState, useMemo } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { Card, Badge, Skeleton, Select } from '../../components/index.js';
import useAsync from '../../hooks/useAsync.js';
import DeliveryService from '../../services/deliveryService.js';
import { MathUtils } from '../../utils/index.js';

const DELIVERY_MENU_ITEMS = [
  { label: 'MAIN', items: [{ icon: '📦', label: 'Dashboard', path: '/delivery/dashboard' }] },
  { label: 'ACCOUNT', items: [{ icon: '💰', label: 'Earnings', path: '/delivery/earnings' }, { icon: '👤', label: 'Profile', path: '/delivery/profile' }] },
];

export const DeliveryEarnings = () => {
  const [timeRange, setTimeRange] = useState('MONTH');

  const { data: deliveries, isLoading } = useAsync(
    () => DeliveryService.getMyDeliveries({ page: 0, size: 100 }),
    true
  );

  const deliveryList = useMemo(() => {
    const deliveryPayload = deliveries?.data ?? deliveries;
    const list = Array.isArray(deliveryPayload) ? deliveryPayload : deliveryPayload?.content || [];
    return list.map(d => ({
      ...d,
      orderId: d.orderId || d.id,
      deliveryStatus: d.deliveryStatus || d.status,
      distance: d.farmLat && d.farmLng && d.deliveryLat && d.deliveryLng 
        ? parseFloat(MathUtils.calculateDistance(d.farmLat, d.farmLng, d.deliveryLat, d.deliveryLng).toFixed(1))
        : 0
    }));
  }, [deliveries]);

  // Calculate earnings and stats
  const stats = useMemo(() => {
    const completed = deliveryList.filter(d => d.deliveryStatus === 'DELIVERED');
    const pending = deliveryList.filter(d => d.deliveryStatus !== 'DELIVERED' && d.deliveryStatus !== 'CANCELLED');
    
    // Realized earnings are only from completed deliveries
    const earnings = completed.reduce((sum, d) => sum + (d.earnings || 50), 0);
    const avgPerDelivery = completed.length > 0 ? earnings / completed.length : 0;
    const totalDistance = deliveryList.reduce((sum, d) => sum + (d.distance || 0), 0);
    const avgDistance = deliveryList.length > 0 ? totalDistance / deliveryList.length : 0;

    return {
      totalEarnings: earnings,
      completedDeliveries: completed.length,
      pendingDeliveries: pending.length,
      totalDeliveries: deliveryList.length,
      avgPerDelivery,
      totalDistance: totalDistance.toFixed(1),
      avgDistance: avgDistance.toFixed(1),
    };
  }, [deliveryList]);

  return (
    <DashboardLayout menuItems={DELIVERY_MENU_ITEMS}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Earnings & Performance</h1>
          <Select
            options={[
              { value: 'WEEK', label: 'This Week' },
              { value: 'MONTH', label: 'This Month' },
              { value: 'YEAR', label: 'This Year' },
            ]}
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-48"
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <Skeleton count={2} />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <div className="text-center">
                <p className="text-gray-600 text-sm">Total Earnings</p>
                <p className="text-3xl font-bold text-green-600 mt-2">₹{stats.totalEarnings}</p>
                <p className="text-xs text-gray-500 mt-1">Lifetime</p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-gray-600 text-sm">Completed Deliveries</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{stats.completedDeliveries}</p>
                <p className="text-xs text-gray-500 mt-1">Successfully delivered</p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-gray-600 text-sm">Avg Per Delivery</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">₹{stats.avgPerDelivery.toFixed(0)}</p>
                <p className="text-xs text-gray-500 mt-1">Per order average</p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-gray-600 text-sm">Total Distance</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{stats.totalDistance} km</p>
                <p className="text-xs text-gray-500 mt-1">All deliveries</p>
              </div>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-lg font-semibold mb-4">Performance Metrics</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Delivery Completion Rate</span>
                  <span className="font-semibold">
                    {stats.totalDeliveries > 0 
                      ? ((stats.completedDeliveries / stats.totalDeliveries) * 100).toFixed(1) 
                      : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: stats.totalDeliveries > 0 
                        ? `${(stats.completedDeliveries / stats.totalDeliveries) * 100}%` 
                        : '0%',
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Average Distance per Delivery</span>
                  <span className="font-semibold">{stats.avgDistance} km</span>
                </div>
                <p className="text-sm text-gray-600">Helps optimize route planning</p>
              </div>

              <div className="border-t pt-3">
                <p className="text-gray-700 mb-2">Current Status</p>
                <Badge variant="success" className="inline-block">Active - Available for Deliveries</Badge>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold mb-4">Earnings Breakdown</h2>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded">
                <div className="flex justify-between">
                  <span className="text-gray-700">Completed Deliveries</span>
                  <span className="font-semibold">₹{stats.completedDeliveries * 50}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">₹50 per delivery × {stats.completedDeliveries}</p>
              </div>

              <div className="p-3 bg-yellow-50 rounded">
                <div className="flex justify-between">
                  <span className="text-gray-700">Pending Deliveries</span>
                  <span className="font-semibold text-orange-600">₹{stats.pendingDeliveries * 50}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">Earnings on completion</p>
              </div>

              <div className="p-3 bg-blue-50 rounded border-t-2">
                <div className="flex justify-between">
                  <span className="text-gray-700 font-medium">Total Available Earnings</span>
                  <span className="font-bold text-lg text-blue-600">
                    ₹{stats.totalEarnings + stats.pendingDeliveries * 50}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Recent Deliveries</h2>
          {deliveryList.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No deliveries yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Order ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Distance</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Earnings</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveryList.slice(0, 10).map((delivery) => (
                    <tr key={delivery.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">#{delivery.orderId || 'N/A'}</td>
                      <td className="px-4 py-3">
                        <Badge 
                          variant={delivery.deliveryStatus === 'DELIVERED' ? 'success' : 'warning'}
                        >
                          {delivery.deliveryStatus?.replace(/_/g, ' ')}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">{delivery.distance || 0} km</td>
                      <td className="px-4 py-3 text-sm font-semibold text-green-600">
                        {delivery.deliveryStatus === 'DELIVERED' ? '₹50' : '₹0'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DeliveryEarnings;
