// Public Orders Page
import { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { Card, StatusBadge, Button, Pagination, Skeleton } from '../../components/index.js';
import useAsync from '../../hooks/useAsync.js';
import OrderService from '../../services/orderService.js';
import { Formatters } from '../../utils/index.js';

const PUBLIC_MENU_ITEMS = [
  { label: 'MAIN', items: [{ icon: '🏠', label: 'Marketplace', path: '/public/marketplace' }, { icon: '🛒', label: 'Cart', path: '/public/cart' }] },
  { label: 'ACCOUNT', items: [{ icon: '📋', label: 'My Orders', path: '/public/orders' }, { icon: '👤', label: 'Profile', path: '/public/profile' }] },
];

export const PublicOrders = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: response, isLoading } = useAsync(() => OrderService.getMyOrders({ page: currentPage }), true, [currentPage]);

  const orders = response?.orders || [];
  const totalPages = response?.totalPages || 1;

  return (
    <DashboardLayout menuItems={PUBLIC_MENU_ITEMS}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (<Card key={i}><Skeleton count={3} /></Card>))}
          </div>
        ) : orders.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-600 text-lg">No orders yet</p>
          </Card>
        ) : (
          <>
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Order ID</p>
                      <p className="font-semibold">#{order.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-semibold">{Formatters.formatDate(order.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="font-semibold">{Formatters.formatPrice(order.totalAmount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <StatusBadge status={order.status} type="order" />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4 border-t">
                    <Button variant="secondary" size="sm">📋 View Details</Button>
                    <Button variant="outline" size="sm">📍 Track Order</Button>
                  </div>
                </Card>
              ))}
            </div>
            <div className="flex justify-center">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PublicOrders;
