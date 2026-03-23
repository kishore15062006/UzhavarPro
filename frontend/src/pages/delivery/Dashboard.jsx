// Delivery Agent Dashboard
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { Card, Button, Badge, Skeleton, Modal, ErrorMessage } from '../../components/index.js';
import useAsync from '../../hooks/useAsync.js';
import DeliveryService from '../../services/deliveryService.js';
import toast from 'react-hot-toast';

const DELIVERY_MENU_ITEMS = [
  { label: 'MAIN', items: [{ icon: '📦', label: 'Dashboard', path: '/delivery/dashboard' }] },
  { label: 'ACCOUNT', items: [{ icon: '💰', label: 'Earnings', path: '/delivery/earnings' }] },
];

export const DeliveryDashboard = () => {
  const navigate = useNavigate();
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  const { data: deliveries, isLoading, error, execute: fetchDeliveries } = useAsync(
    () => DeliveryService.getMyDeliveries({ page: 0, size: 20 }),
    true
  );

  const deliveryList = useMemo(() => {
    const deliveryPayload = deliveries?.data ?? deliveries;
    return Array.isArray(deliveryPayload) ? deliveryPayload : deliveryPayload?.content || [];
  }, [deliveries]);

  // Calculate summary stats
  const stats = useMemo(() => {
    const completed = deliveryList.filter(d => d.deliveryStatus === 'DELIVERED').length;
    const inProgress = deliveryList.filter(d => d.deliveryStatus === 'OUT_FOR_DELIVERY' || d.deliveryStatus === 'PICKED').length;
    const totalDistance = deliveryList.reduce((sum, d) => sum + (d.distance || 0), 0);
    
    return {
      total: deliveryList.length,
      completed,
      inProgress,
      totalDistance: totalDistance.toFixed(1),
      rate: deliveryList.length > 0 ? ((completed / deliveryList.length) * 100).toFixed(1) : 0,
    };
  }, [deliveryList]);

  const handleStatusUpdate = async () => {
    if (!newStatus) {
      toast.error('Please select a status');
      return;
    }

    try {
      const res = await DeliveryService.updateDeliveryStatus(selectedDelivery.id, newStatus);
      if (res.success) {
        toast.success('Delivery status updated successfully');
        fetchDeliveries();
        setShowModal(false);
        setNewStatus('');
      } else {
        toast.error('Failed to update status');
      }
    } catch (err) {
      toast.error(err?.message || 'Error updating status');
    }
  };

  const getStatusVariant = (status) => {
    const variants = {
      PENDING: 'warning',
      PICKED: 'info',
      OUT_FOR_DELIVERY: 'info',
      DELIVERED: 'success',
      CANCELLED: 'danger',
    };
    return variants[status] || 'gray';
  };

  const getStatusLabel = (status) => {
    return status ? status.replace(/_/g, ' ') : 'N/A';
  };

  return (
    <DashboardLayout menuItems={DELIVERY_MENU_ITEMS}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Delivery Dashboard</h1>

        {error && <ErrorMessage error={error} onRetry={fetchDeliveries} />}

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
            <Card className="text-center">
              <p className="text-gray-600">Total Deliveries</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
            </Card>
            <Card className="text-center">
              <p className="text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.completed}</p>
            </Card>
            <Card className="text-center">
              <p className="text-gray-600">In Progress</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats.inProgress}</p>
            </Card>
            <Card className="text-center">
              <p className="text-gray-600">Total Distance</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalDistance} km</p>
            </Card>
          </div>
        )}

        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="w-full" onClick={() => navigate('/delivery/earnings')}>📊 View Earnings</Button>
            <Button className="w-full" disabled>📍 Route Optimization</Button>
            <Button className="w-full" disabled>⭐ Your Ratings</Button>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Active Deliveries</h2>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} count={2} />
              ))}
            </div>
          ) : deliveryList.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No deliveries assigned yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {deliveryList.map((delivery) => (
                <div key={delivery.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                  <div>
                    <p className="font-semibold">Order #{delivery.orderId || 'N/A'}</p>
                    <p className="text-sm text-gray-600">
                      {delivery.deliveryAddress || 'Address not provided'} • {delivery.distance || 0} km
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={getStatusVariant(delivery.deliveryStatus)}>
                      {getStatusLabel(delivery.deliveryStatus)}
                    </Badge>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => {
                        setSelectedDelivery(delivery);
                        setShowModal(true);
                      }}
                    >
                      Update Status
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-lg font-semibold mb-4">Delivery Route Map</h2>
            <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-600">🗺️ Map Integration - Coming Soon</p>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold mb-4">Today's Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Orders Assigned</span>
                <span className="font-semibold">{stats.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Successfully Delivered</span>
                <span className="font-semibold text-green-600">{stats.completed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pending Delivery</span>
                <span className="font-semibold text-orange-600">{stats.inProgress}</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-gray-600">Delivery Rate</span>
                <span className="font-semibold text-primary-600">{stats.rate}%</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Status Update Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setNewStatus('');
        }}
        title={`Update Delivery Status - Order #${selectedDelivery?.orderId}`}
        footer={
          <div className="flex gap-3 justify-end">
            <Button 
              variant="secondary"
              onClick={() => {
                setShowModal(false);
                setNewStatus('');
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleStatusUpdate}>
              Update Status
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Status</label>
            <p className="p-2 bg-gray-100 rounded">{getStatusLabel(selectedDelivery?.deliveryStatus)}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Update To</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select status</option>
              <option value="PICKED">Picked Up</option>
              <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
              <option value="DELIVERED">Delivered</option>
              <option value="FAILED">Failed Delivery</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Details</label>
            <div className="p-3 bg-gray-50 rounded space-y-1 text-sm">
              <p><span className="text-gray-600">Order ID:</span> <span className="font-semibold">#{selectedDelivery?.orderId}</span></p>
              <p><span className="text-gray-600">Address:</span> <span className="font-semibold">{selectedDelivery?.deliveryAddress || 'N/A'}</span></p>
              <p><span className="text-gray-600">Distance:</span> <span className="font-semibold">{selectedDelivery?.distance || 0} km</span></p>
            </div>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default DeliveryDashboard;
