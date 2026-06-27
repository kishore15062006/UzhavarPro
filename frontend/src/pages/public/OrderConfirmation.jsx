// Order Confirmation Page
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { Card, Button } from '../../components/index.js';
import { OrderService } from '../../services/orderService.js';
import toast from 'react-hot-toast';

const PUBLIC_MENU_ITEMS = [
  { label: 'MAIN', items: [{ icon: '🏠', label: 'Marketplace', path: '/public/marketplace' }, { icon: '🛒', label: 'Cart', path: '/public/cart' }] },
  { label: 'ACCOUNT', items: [{ icon: '📋', label: 'My Orders', path: '/public/orders' }, { icon: '👤', label: 'Profile', path: '/public/profile' }] },
];

export const OrderConfirmation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const orderIdsStr = searchParams.get('orderIds') || '';

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orderIds = orderIdsStr.split(',').filter(Boolean);
        const fetchedOrders = [];
        for (const orderId of orderIds) {
          const response = await OrderService.getOrderById(parseInt(orderId));
          if (response.success) {
            fetchedOrders.push(response.data);
          }
        }
        setOrders(fetchedOrders);
      } catch (error) {
        toast.error('Failed to load order details');
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (orderIdsStr) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [orderIdsStr]);

  if (loading) {
    return (
      <DashboardLayout menuItems={PUBLIC_MENU_ITEMS}>
        <div className="max-w-2xl mx-auto py-12">
          <Card className="text-center py-12">
            <p className="text-gray-600">Loading order details...</p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const totalAmount = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

  return (
    <DashboardLayout menuItems={PUBLIC_MENU_ITEMS}>
      <div className="max-w-2xl mx-auto space-y-6 py-6">
        {/* Success Message */}
        <Card className="bg-green-50 border-2 border-green-500 text-center py-8">
          <div className="text-5xl mb-4">✓</div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600">Thank you for your purchase. Your order has been confirmed.</p>
        </Card>

        {/* Order Details */}
        {orders.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
            {orders.map((order) => (
              <Card key={order.id}>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">Order #{order.id}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₹{order.totalPrice?.toFixed(2) || 0}</p>
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                        {order.status || 'PENDING'}
                      </span>
                    </div>
                  </div>

                  {order.items && order.items.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-900 mb-3">Items</h4>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              {item.product?.name || `Product ${item.productId}`} × {item.quantity}
                            </span>
                            <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}

            {orders.length > 1 && (
              <Card className="bg-blue-50 border-2 border-blue-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold text-gray-900">₹{totalAmount.toFixed(2)}</p>
                  </div>
                  <p className="text-sm text-gray-600">{orders.length} orders placed</p>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Next Steps */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">What's Next?</h2>
          <ul className="space-y-2 mb-4">
            <li className="flex items-start">
              <span className="text-green-600 font-bold mr-3">✓</span>
              <span className="text-gray-700">Order confirmed and payment processed</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-400 font-bold mr-3">2</span>
              <span className="text-gray-700">Farmer will prepare your items for delivery</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-400 font-bold mr-3">3</span>
              <span className="text-gray-700">You will receive shipping notification</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-400 font-bold mr-3">4</span>
              <span className="text-gray-700">Delivery agent will deliver to your address</span>
            </li>
          </ul>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-900">
              💡 <strong>Tip:</strong> You can track your order status in "My Orders" section anytime.
            </p>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            variant="primary"
            fullWidth
            onClick={() => navigate('/public/orders')}
          >
            View My Orders
          </Button>
          <Button
            variant="outline"
            fullWidth
            onClick={() => navigate('/public/marketplace')}
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrderConfirmation;
