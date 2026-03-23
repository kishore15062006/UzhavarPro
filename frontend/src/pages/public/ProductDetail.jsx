// ProductDetail Page
import { useParams } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { Card, Button, Badge, Skeleton } from '../../components/index.js';
import useAsync from '../../hooks/useAsync.js';
import useCart from '../../hooks/useCart.js';
import ProductService from '../../services/productService.js';
import RatingService from '../../services/ratingService.js';
import toast from 'react-hot-toast';

const PUBLIC_MENU_ITEMS = [
  { label: 'MAIN', items: [{ icon: '🏠', label: 'Marketplace', path: '/public/marketplace' }, { icon: '🛒', label: 'Cart', path: '/public/cart' }] },
  { label: 'ACCOUNT', items: [{ icon: '📋', label: 'My Orders', path: '/public/orders' }, { icon: '👤', label: 'Profile', path: '/public/profile' }] },
];

export const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { data: product, isLoading: productLoading } = useAsync(
    () => ProductService.getProductById(id),
    true,
    [id]
  );
  const { data: ratings, isLoading: ratingsLoading } = useAsync(
    () => RatingService.getRatingsForProduct(id),
    true,
    [id]
  );

  const handleAddToCart = () => {
    if (product) {
      addToCart({ ...product, quantity: 1 });
      toast.success('Added to cart!');
    }
  };

  return (
    <DashboardLayout menuItems={PUBLIC_MENU_ITEMS}>
      <div className="max-w-4xl mx-auto space-y-6">
        {productLoading ? (
          <Card><Skeleton count={5} /></Card>
        ) : product ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-80 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
                <span className="text-6xl">🌾</span>
              </div>
              <div className="md:col-span-2 space-y-4">
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                <Badge variant="primary">{product.category}</Badge>
                <div className="space-y-2">
                  <p className="text-4xl font-bold text-primary-600">₹{product.price}/kg</p>
                  <p className="text-gray-600">Available: {product.availableQuantity} kg</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="primary" size="lg" onClick={handleAddToCart} fullWidth>
                    🛒 Add to Cart
                  </Button>
                  <Button variant="outline" size="lg">❤️ Wishlist</Button>
                </div>
                <p className="text-gray-700">{product.description}</p>
              </div>
            </div>

            <Card>
              <h2 className="text-lg font-semibold mb-4">Customer Reviews</h2>
              {ratingsLoading ? (
                <Skeleton count={3} />
              ) : (ratings || []).length === 0 ? (
                <p className="text-gray-600">No reviews yet</p>
              ) : (
                <div className="space-y-3">
                  {ratings.map((rating) => (
                    <div key={rating.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{rating.userName}</span>
                        <span>{'⭐'.repeat(rating.rating)}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{rating.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </>
        ) : (
          <Card className="text-center py-12">
            <p className="text-gray-600">Product not found</p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProductDetail;
