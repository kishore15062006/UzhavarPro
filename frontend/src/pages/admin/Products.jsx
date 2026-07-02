// Admin Products Page
import { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { Card, Button, Input, Badge, Pagination, Skeleton, ErrorMessage } from '../../components/index.js';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContextObject.js';
import useAsync from '../../hooks/useAsync.js';
import AdminService from '../../services/adminService.js';
import toast from 'react-hot-toast';

const ADMIN_MENU_ITEMS = [
  { label: 'MAIN', items: [{ icon: '📊', label: 'Dashboard', path: '/admin/dashboard' }] },
  { label: 'MANAGEMENT', items: [{ icon: '👥', label: 'Users', path: '/admin/users' }, { icon: '🛒', label: 'Products', path: '/admin/products' }, { icon: '📋', label: 'Orders', path: '/admin/orders' }] },
  { label: 'ANALYTICS', items: [{ icon: '📈', label: 'Analytics', path: '/admin/analytics' }] },
];

export const AdminProducts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const { triggerDashboardRefresh } = useContext(AppContext);

  const { data: response, isLoading, error, execute: fetchProducts } = useAsync(
    () => AdminService.getAllProducts({ page: currentPage - 1, size: 10 }),
    true,
    [currentPage]
  );

  const products = response?.content || [];
  const totalPages = response?.totalPages || 1;

  const handleRemoveProduct = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to remove "${productName}"?`)) {
      try {
        const res = await AdminService.removeProduct(productId);
        if (res.success) {
          toast.success('Product removed successfully');
          fetchProducts();
          triggerDashboardRefresh();
        } else {
          toast.error('Failed to remove product');
        }
      } catch (err) {
        toast.error(err?.message || 'Error removing product');
      }
    }
  };

  return (
    <DashboardLayout menuItems={ADMIN_MENU_ITEMS}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <Input 
            placeholder="Search products..." 
            className="max-w-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {error && <ErrorMessage error={error} onRetry={fetchProducts} />}

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <Skeleton count={2} />
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <p className="text-gray-500">No products found</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <Card key={product.id}>
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
                  <div>
                    <p className="text-sm text-gray-600">Product</p>
                    <p className="font-semibold">{product.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Farmer</p>
                    <p className="font-semibold text-sm">{product.farmerName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium text-sm text-gray-800 truncate" title={product.farmerLocation}>
                      {product.farmerLocation || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Price per kg</p>
                    <p className="font-semibold text-sm">₹{product.pricePerKg || 0}/kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Stock</p>
                    <p className="font-semibold text-sm">{product.quantity || 0} kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Category</p>
                    <Badge variant="primary" size="sm">{product.category || 'N/A'}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm">View</Button>
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => handleRemoveProduct(product.id, product.name)}
                    >
                      🗑️ Remove
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
      </div>
    </DashboardLayout>
  );
};

export default AdminProducts;
