// Farmer Orders Page
import { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { Card, Button, Badge, StatusBadge, Skeleton, Pagination } from '../../components/index.js';
import useAsync from '../../hooks/useAsync.js';
import OrderService from '../../services/orderService.js';
import { Formatters } from '../../utils/index.js';
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

export const FarmerOrders = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: response, isLoading, execute: fetchOrders } = useAsync(
    () => OrderService.getIncomingOrders({ page: currentPage - 1 }),
    true,
    [currentPage]
  );

  const orders = response?.content || [];
  const totalPages = response?.totalPages || 1;

  const handleAcceptOrder = async (orderId) => {
    try {
      const res = await OrderService.acceptOrder(orderId);
      if (res.success) {
        toast.success('Order accepted successfully!');
        fetchOrders();
      } else {
        toast.error(res.error?.message || 'Failed to accept order');
      }
    } catch (err) {
      toast.error('Error accepting order');
    }
  };

  const handleRejectOrder = async (orderId) => {
    try {
      const res = await OrderService.rejectOrder(orderId);
      if (res.success) {
        toast.success('Order rejected');
        fetchOrders();
      } else {
        toast.error(res.error?.message || 'Failed to reject order');
      }
    } catch (err) {
      toast.error('Error rejecting order');
    }
  };

  return (
    <DashboardLayout menuItems={FARMER_MENU_ITEMS}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Incoming Orders</h1>
          <p className="text-gray-600">Manage orders from customers</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <Skeleton count={3} />
              </Card>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-600 text-lg">No orders yet</p>
          </Card>
        ) : (
          <>
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} hoverable>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Order ID</p>
                      <p className="font-semibold text-gray-900">#{order.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Customer</p>
                      <p className="font-semibold text-gray-900">{order.buyerId ? `User #${order.buyerId}` : 'Customer'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="font-semibold text-gray-900">{Formatters.formatPrice(order.totalAmount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <StatusBadge status={order.status} type="order" />
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="secondary" size="sm">View Details</Button>
                    {order.status === 'PENDING' && (
                      <>
                        <Button variant="primary" size="sm" onClick={() => handleAcceptOrder(order.id)}>✅ Accept</Button>
                        <Button variant="danger" size="sm" onClick={() => handleRejectOrder(order.id)}>❌ Reject</Button>
                      </>
                    )}
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

export default FarmerOrders;
