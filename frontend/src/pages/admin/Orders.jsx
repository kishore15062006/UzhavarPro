// Admin Orders Page
import { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { Card, StatusBadge, Button, Pagination, Modal, Input, Skeleton, ErrorMessage } from '../../components/index.js';
import useAsync from '../../hooks/useAsync.js';
import AdminService from '../../services/adminService.js';
import DeliveryService from '../../services/deliveryService.js';
import toast from 'react-hot-toast';

const ADMIN_MENU_ITEMS = [
  { label: 'MAIN', items: [{ icon: '📊', label: 'Dashboard', path: '/admin/dashboard' }] },
  { label: 'MANAGEMENT', items: [{ icon: '👥', label: 'Users', path: '/admin/users' }, { icon: '🛒', label: 'Products', path: '/admin/products' }, { icon: '📋', label: 'Orders', path: '/admin/orders' }] },
  { label: 'ANALYTICS', items: [{ icon: '📈', label: 'Analytics', path: '/admin/analytics' }] },
];

export const AdminOrders = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [agentId, setAgentId] = useState('');

  const { data: response, isLoading, error, execute: fetchOrders } = useAsync(
    () => AdminService.getAllOrders({ page: currentPage - 1, size: 10 }),
    true,
    [currentPage]
  );

  const orders = response?.content || [];
  const totalPages = response?.totalPages || 1;

  const handleAssignDelivery = async () => {
    if (!agentId.trim()) {
      toast.error('Please enter an agent ID');
      return;
    }

    try {
      const res = await DeliveryService.assignDeliveryAgent(selectedOrder.id, agentId);
      if (res.success) {
        toast.success('Delivery agent assigned successfully');
        fetchOrders();
        setShowModal(false);
        setAgentId('');
      } else {
        toast.error('Failed to assign agent');
      }
    } catch (err) {
      toast.error(err?.message || 'Error assigning agent');
    }
  };

  return (
    <DashboardLayout menuItems={ADMIN_MENU_ITEMS}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Order Monitoring</h1>

        {error && <ErrorMessage error={error} onRetry={fetchOrders} />}

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <Skeleton count={2} />
              </Card>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <p className="text-gray-500">No orders found</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-semibold">#{order.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Farmer</p>
                    <p className="font-semibold text-sm">{order.farmerId || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Buyer</p>
                    <p className="font-semibold text-sm">{order.userId || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Amount</p>
                    <p className="font-semibold">₹{order.totalAmount ?? order.totalPrice ?? 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <StatusBadge status={order.orderStatus || order.status || 'PENDING'} type="order" />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowModal(true);
                      }}
                    >
                      📋 Details
                    </Button>
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowModal(true);
                      }}
                    >
                      📦 Assign
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="flex justify-center">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>

        {/* Assign Delivery Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setAgentId('');
          }}
          title={`Assign Delivery Agent - Order #${selectedOrder?.id}`}
          footer={
            <div className="flex gap-3 justify-end">
              <Button 
                variant="secondary" 
                onClick={() => {
                  setShowModal(false);
                  setAgentId('');
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAssignDelivery}>
                Assign Agent
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order Details</label>
              <div className="p-3 bg-gray-50 rounded space-y-2 text-sm">
                <p><span className="text-gray-600">Order ID:</span> <span className="font-semibold">#{selectedOrder?.id}</span></p>
                <p><span className="text-gray-600">Total Amount:</span> <span className="font-semibold">₹{selectedOrder?.totalAmount ?? selectedOrder?.totalPrice ?? 0}</span></p>
                <p><span className="text-gray-600">Status:</span> <span className="font-semibold">{selectedOrder?.orderStatus || selectedOrder?.status || 'PENDING'}</span></p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Agent ID</label>
              <Input
                placeholder="Enter agent ID"
                value={agentId}
                onChange={(e) => setAgentId(e.target.value)}
              />
            </div>
            <div>
              <p className="text-sm text-gray-600">
                The selected delivery agent will be assigned to handle this order's delivery.
              </p>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default AdminOrders;
