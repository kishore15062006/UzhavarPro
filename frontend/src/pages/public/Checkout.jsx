// Public Checkout Page
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { Card, Button, Input, ErrorMessage } from '../../components/index.js';
import MapLocationPicker from '../../components/MapLocationPicker.jsx';
import DeliveryLocationMapPicker from '../../components/DeliveryLocationMapPicker.jsx';
import useCart from '../../hooks/useCart.js';
import { OrderService } from '../../services/orderService.js';
import { Formatters } from '../../utils/index.js';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth.js';

const PUBLIC_MENU_ITEMS = [
  { label: 'MAIN', items: [{ icon: '🏠', label: 'Marketplace', path: '/public/marketplace' }, { icon: '🛒', label: 'Cart', path: '/public/cart' }] },
  { label: 'ACCOUNT', items: [{ icon: '📋', label: 'My Orders', path: '/public/orders' }, { icon: '👤', label: 'Profile', path: '/public/profile' }] },
];

export const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, getCartSummary, clearCart } = useCart();
  const cartSummary = getCartSummary?.();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || '',
    paymentMethod: 'CARD'
  });

  const [deliveryLocation, setDeliveryLocation] = useState({
    deliveryLat: user?.latitude || null,
    deliveryLng: user?.longitude || null,
    deliveryAddress: user?.address || ''
  });

  const [cardData, setCardData] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName?.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName?.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email?.trim()) newErrors.email = 'Email is required';
    if (!formData.phoneNumber?.trim()) newErrors.phoneNumber = 'Phone number is required';
    // Allow using map instead of address text input
    if (!deliveryLocation.deliveryLat && !formData.address?.trim()) newErrors.address = 'Address or delivery location on map is required';
    if (!formData.city?.trim()) newErrors.city = 'City is required';
    if (!formData.state?.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode?.trim()) newErrors.zipCode = 'Zip code is required';
    
    if (formData.paymentMethod === 'CARD') {
      if (!cardData.cardName?.trim()) newErrors.cardName = 'Card holder name is required';
      if (!cardData.cardNumber?.trim()) newErrors.cardNumber = 'Card number is required';
      if (!/^\d{16}$/.test(cardData.cardNumber)) newErrors.cardNumber = 'Card number must be 16 digits';
      if (!cardData.expiryDate?.trim()) newErrors.expiryDate = 'Expiry date is required';
      if (!/^\d{2}\/\d{2}$/.test(cardData.expiryDate)) newErrors.expiryDate = 'Expiry date must be MM/YY format';
      if (!cardData.cvv?.trim()) newErrors.cvv = 'CVV is required';
      if (!/^\d{3,4}$/.test(cardData.cvv)) newErrors.cvv = 'CVV must be 3-4 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      // Prepare order data - group by farmer
      const ordersByFarmer = {};
      cart.forEach(item => {
        const fid = item.farmerId;
        if (!ordersByFarmer[fid]) {
          ordersByFarmer[fid] = [];
        }
        ordersByFarmer[fid].push({
          productId: item.id,
          quantity: item.quantity,
          price: parseFloat(item.price)
        });
      });

      // Create orders for each farmer and collect order IDs
      const orderIds = [];
      for (const [_farmerId, items] of Object.entries(ordersByFarmer)) {
        const orderData = {
          buyerId: user?.id,
          items: items,
          deliveryLat: deliveryLocation.deliveryLat,
          deliveryLng: deliveryLocation.deliveryLng,
          deliveryAddress: deliveryLocation.deliveryAddress || formData.address
        };

        const response = await OrderService.createOrder(orderData);
        
        if (response.success) {
          orderIds.push(response.data.id);
          toast.success(`Order placed successfully!`);
        } else {
          throw new Error(response.error || 'Failed to create order');
        }
      }

      // Create payment record
      if (formData.paymentMethod === 'CARD') {
        // In a real application, this would communicate with a payment gateway
        const paymentData = {
          orderIds: orderIds,
          amount: (cartSummary?.subtotal || 0) + 50,
          paymentMethod: formData.paymentMethod,
          cardLast4: cardData.cardNumber.slice(-4),
          status: 'COMPLETED'
        };
        console.log('Payment data:', paymentData);
      }

      // Clear cart and navigate to success page
      clearCart?.();
      navigate(`/public/order-confirmation?orderIds=${orderIds.join(',')}`);
    } catch (error) {
      toast.error(`Error placing order: ${error.message}`);
      console.error('Order creation error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <DashboardLayout menuItems={PUBLIC_MENU_ITEMS}>
        <div className="max-w-2xl mx-auto py-12">
          <Card className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">Your cart is empty. Add items before checking out.</p>
            <Button variant="primary" onClick={() => navigate('/public/marketplace')}>
              Continue Shopping
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const deliveryFee = 50;
  const total = (cartSummary?.subtotal || 0) + deliveryFee;

  return (
    <DashboardLayout menuItems={PUBLIC_MENU_ITEMS}>
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card>
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <Input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleShippingChange}
                      placeholder="First name"
                      className={errors.firstName ? 'border-red-500' : ''}
                    />
                    {errors.firstName && <ErrorMessage>{errors.firstName}</ErrorMessage>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <Input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleShippingChange}
                      placeholder="Last name"
                      className={errors.lastName ? 'border-red-500' : ''}
                    />
                    {errors.lastName && <ErrorMessage>{errors.lastName}</ErrorMessage>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleShippingChange}
                    placeholder="Email address"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleShippingChange}
                    placeholder="Phone number"
                    className={errors.phoneNumber ? 'border-red-500' : ''}
                  />
                  {errors.phoneNumber && <ErrorMessage>{errors.phoneNumber}</ErrorMessage>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <Input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleShippingChange}
                    placeholder="Street address"
                    className={errors.address ? 'border-red-500' : ''}
                  />
                  {errors.address && <ErrorMessage>{errors.address}</ErrorMessage>}
                </div>

                {/* Delivery Location Map Picker */}
                <div className="pt-2 border-t">
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Or select delivery location on map:</p>
                    <DeliveryLocationMapPicker 
                      initialLat={deliveryLocation.deliveryLat}
                      initialLng={deliveryLocation.deliveryLng}
                      initialAddress={deliveryLocation.deliveryAddress}
                      onLocationSelect={(lat, lng, address) => {
                        setDeliveryLocation({
                          deliveryLat: lat,
                          deliveryLng: lng,
                          deliveryAddress: address
                        });
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <Input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleShippingChange}
                      placeholder="City"
                      className={errors.city ? 'border-red-500' : ''}
                    />
                    {errors.city && <ErrorMessage>{errors.city}</ErrorMessage>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <Input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleShippingChange}
                      placeholder="State"
                      className={errors.state ? 'border-red-500' : ''}
                    />
                    {errors.state && <ErrorMessage>{errors.state}</ErrorMessage>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Zip Code
                  </label>
                  <Input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleShippingChange}
                    placeholder="Zip code"
                    className={errors.zipCode ? 'border-red-500' : ''}
                  />
                  {errors.zipCode && <ErrorMessage>{errors.zipCode}</ErrorMessage>}
                </div>
              </form>
            </Card>

            {/* Payment Method */}
            <Card>
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="space-y-3 mb-4">
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50" style={{ borderColor: formData.paymentMethod === 'CARD' ? '#3b82f6' : '#e5e7eb' }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CARD"
                    checked={formData.paymentMethod === 'CARD'}
                    onChange={handleShippingChange}
                    className="mr-3"
                  />
                  <span className="flex-1">Credit/Debit Card</span>
                  <span className="text-sm text-gray-500">💳</span>
                </label>
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50" style={{ borderColor: formData.paymentMethod === 'UPI' ? '#3b82f6' : '#e5e7eb' }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="UPI"
                    checked={formData.paymentMethod === 'UPI'}
                    onChange={handleShippingChange}
                    className="mr-3"
                  />
                  <span className="flex-1">UPI</span>
                  <span className="text-sm text-gray-500">📱</span>
                </label>
              </div>

              {formData.paymentMethod === 'CARD' && (
                <div className="space-y-4 pt-4 border-t">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Holder Name
                    </label>
                    <Input
                      type="text"
                      name="cardName"
                      value={cardData.cardName}
                      onChange={handleCardChange}
                      placeholder="Name on card"
                      className={errors.cardName ? 'border-red-500' : ''}
                    />
                    {errors.cardName && <ErrorMessage>{errors.cardName}</ErrorMessage>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <Input
                      type="text"
                      name="cardNumber"
                      value={cardData.cardNumber}
                      onChange={handleCardChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength="16"
                      className={errors.cardNumber ? 'border-red-500' : ''}
                    />
                    {errors.cardNumber && <ErrorMessage>{errors.cardNumber}</ErrorMessage>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <Input
                        type="text"
                        name="expiryDate"
                        value={cardData.expiryDate}
                        onChange={handleCardChange}
                        placeholder="MM/YY"
                        maxLength="5"
                        className={errors.expiryDate ? 'border-red-500' : ''}
                      />
                      {errors.expiryDate && <ErrorMessage>{errors.expiryDate}</ErrorMessage>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <Input
                        type="text"
                        name="cvv"
                        value={cardData.cvv}
                        onChange={handleCardChange}
                        placeholder="123"
                        maxLength="4"
                        className={errors.cvv ? 'border-red-500' : ''}
                      />
                      {errors.cvv && <ErrorMessage>{errors.cvv}</ErrorMessage>}
                    </div>
                  </div>
                </div>
              )}

              {formData.paymentMethod === 'UPI' && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-3">You will be redirected to your UPI app to complete the payment</p>
                </div>
              )}
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            <Card>
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm pb-3 border-b">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-gray-500 text-xs">{item.quantity} × ₹{parseFloat(item.price).toFixed(2)}</p>
                    </div>
                    <p className="font-medium">₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{cartSummary?.subtotal?.toFixed(2) || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-medium">₹{deliveryFee}</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-lg text-primary-600">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                variant="primary"
                fullWidth
                onClick={handlePlaceOrder}
                disabled={loading}
                className="mb-2"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </Button>
              <Button
                variant="ghost"
                fullWidth
                onClick={() => navigate('/public/cart')}
                disabled={loading}
              >
                Back to Cart
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Checkout;
