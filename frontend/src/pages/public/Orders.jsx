// Public Orders Page
import { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { Card, StatusBadge, Button, Pagination, Skeleton, Modal } from '../../components/index.js';
import useAsync from '../../hooks/useAsync.js';
import OrderService from '../../services/orderService.js';
import { Formatters } from '../../utils/index.js';
import DeliveryRouteMap from '../../components/DeliveryRouteMap.jsx';

const PUBLIC_MENU_ITEMS = [
  { label: 'MAIN', items: [{ icon: '🏠', label: 'Marketplace', path: '/public/marketplace' }, { icon: '🛒', label: 'Cart', path: '/public/cart' }] },
  { label: 'ACCOUNT', items: [{ icon: '📋', label: 'My Orders', path: '/public/orders' }, { icon: '👤', label: 'Profile', path: '/public/profile' }] },
];

export const PublicOrders = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const { data: response, isLoading } = useAsync(() => OrderService.getMyOrders({ page: currentPage - 1 }), true, [currentPage]);

  const orders = response?.content || [];
  const totalPages = response?.totalPages || 1;

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleTrackOrder = (order) => {
    setSelectedOrder(order);
    setShowTrackModal(true);
  };

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
                    <Button variant="secondary" size="sm" onClick={() => handleViewDetails(order)}>📋 View Details</Button>
                    <Button variant="outline" size="sm" onClick={() => handleTrackOrder(order)}>📍 Track Order</Button>
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

      {/* Order Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedOrder(null);
        }}
        title={`Order Details - #${selectedOrder?.id}`}
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800">Order Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Order Date</p>
                  <p className="font-medium">{Formatters.formatDate(selectedOrder.createdAt)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Status</p>
                  <StatusBadge status={selectedOrder.status} type="order" />
                </div>
                <div>
                  <p className="text-gray-600">Total Amount</p>
                  <p className="font-medium text-lg text-primary-600">{Formatters.formatPrice(selectedOrder.totalAmount)}</p>
                </div>
              </div>
            </div>

            {/* Delivery Location Info */}
            {selectedOrder.deliveryAddress && (
              <div className="space-y-2 p-3 bg-blue-50 rounded">
                <h3 className="font-semibold text-gray-800">Delivery Address</h3>
                <p className="text-sm text-gray-700">{selectedOrder.deliveryAddress}</p>
                {selectedOrder.deliveryLat && selectedOrder.deliveryLng && (
                  <p className="text-xs text-gray-600">Coordinates: ({selectedOrder.deliveryLat.toFixed(4)}, {selectedOrder.deliveryLng.toFixed(4)})</p>
                )}
              </div>
            )}

            {/* Items List */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800">Order Items</h3>
              {selectedOrder.items && selectedOrder.items.length > 0 ? (
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium text-gray-800">Product ID: {item.productId}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{Formatters.formatPrice(item.price * item.quantity)}</p>
                        <p className="text-xs text-gray-600">₹{item.price.toFixed(2)} × {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No items in this order</p>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Track Order Modal */}
      <Modal
        isOpen={showTrackModal}
        onClose={() => {
          setShowTrackModal(false);
          setSelectedOrder(null);
        }}
        title={`Track Order - #${selectedOrder?.id}`}
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Tracking Progress Stepper */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-4">Delivery Status</h3>
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 relative">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    ['PENDING', 'ASSIGNED', 'PICKED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(selectedOrder.status)
                      ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>1</div>
                  <span className="text-xs mt-2 font-medium">Pending</span>
                </div>
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    ['ASSIGNED', 'PICKED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(selectedOrder.status)
                      ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>2</div>
                  <span className="text-xs mt-2 font-medium">Assigned</span>
                </div>
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    ['PICKED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(selectedOrder.status)
                      ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>3</div>
                  <span className="text-xs mt-2 font-medium">Picked Up</span>
                </div>
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    ['OUT_FOR_DELIVERY', 'DELIVERED'].includes(selectedOrder.status)
                      ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>4</div>
                  <span className="text-xs mt-2 font-medium">Out for Delivery</span>
                </div>
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    selectedOrder.status === 'DELIVERED'
                      ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>5</div>
                  <span className="text-xs mt-2 font-medium">Delivered</span>
                </div>
              </div>
            </div>

            {/* Map */}
            <DeliveryRouteMap delivery={selectedOrder} />
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default PublicOrders;
