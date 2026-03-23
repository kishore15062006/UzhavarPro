// Public Marketplace Page
import { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { Card, Button, Input, Badge, Pagination, Skeleton } from '../../components/index.js';
import useAsync from '../../hooks/useAsync.js';
import useCart from '../../hooks/useCart.js';
import ProductService from '../../services/productService.js';
import { PAGINATION, PRODUCT_CATEGORIES } from '../../constants/index.js';
import { Formatters } from '../../utils/index.js';
import toast from 'react-hot-toast';

const PUBLIC_MENU_ITEMS = [
  { label: 'MAIN', items: [{ icon: '🏠', label: 'Marketplace', path: '/public/marketplace' }, { icon: '🛒', label: 'Cart', path: '/public/cart' }] },
  { label: 'ACCOUNT', items: [{ icon: '📋', label: 'My Orders', path: '/public/orders' }, { icon: '👤', label: 'Profile', path: '/public/profile' }] },
];

export const PublicMarketplace = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCart();
  
  const { data: response, isLoading } = useAsync(
    () => ProductService.getAllProducts({ page: currentPage, category: selectedCategory, search: searchTerm }),
    true,
    [currentPage, selectedCategory, searchTerm]
  );

  const products = response?.products || [];
  const totalPages = response?.totalPages || 1;

  const handleAddToCart = (product) => {
    addToCart({ ...product, quantity: 1 });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <DashboardLayout menuItems={PUBLIC_MENU_ITEMS}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">🌾 Farmer Marketplace</h1>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select className="px-4 py-2 border rounded-lg" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="">All Categories</option>
            {PRODUCT_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.name}>{cat.icon} {cat.name}</option>
            ))}
          </select>
          <select className="px-4 py-2 border rounded-lg">
            <option value="">Sort By</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Card key={i}><Skeleton count={4} /></Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card key={product.id} hoverable>
                  <div className="h-40 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg mb-3 flex items-center justify-center">
                    <span className="text-4xl">🌾</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <Badge variant="primary" size="sm">{product.category}</Badge>
                  <div className="mt-3 space-y-1">
                    <p className="text-sm text-gray-600"><strong>₹{product.price}</strong>/kg</p>
                    <p className="text-xs text-gray-500">{product.availableQuantity} kg available</p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Link to={`/public/product/${product.id}`} className="flex-1">
                      <Button variant="outline" size="sm" fullWidth>👁️ View</Button>
                    </Link>
                    <Button variant="primary" size="sm" onClick={() => handleAddToCart(product)} fullWidth>
                      🛒 Add
                    </Button>
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

export default PublicMarketplace;
