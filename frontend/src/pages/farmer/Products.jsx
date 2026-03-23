// Farmer Products Page
import { useState, useContext } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { Card, Button, Input, Modal, Badge, Skeleton, ErrorMessage, Pagination } from '../../components/index.js';
import useAsync from '../../hooks/useAsync.js';
import ProductService from '../../services/productService.js';
import { PRODUCT_CATEGORIES, PAGINATION } from '../../constants/index.js';
import toast from 'react-hot-toast';
import { AppContext } from '../../context/AppContextObject.js';

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

export const FarmerProducts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    pricePerKg: '',
    quantity: '',
    description: '',
  });

  const { triggerDashboardRefresh } = useContext(AppContext);

  const { data: response, isLoading, error, execute } = useAsync(
    () => ProductService.getMyProducts({ page: currentPage - 1, size: PAGINATION.DEFAULT_PAGE_SIZE }),
    true,
    [currentPage]
  );

  const pageData = response?.data || response;
  const products = pageData?.content || pageData?.products || [];
  const totalPages = pageData?.totalPages || 1;

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({ name: '', category: '', pricePerKg: '', quantity: '', description: '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert numeric fields to proper types
      const data = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        pricePerKg: parseFloat(formData.pricePerKg) || 0,
        quantity: parseFloat(formData.quantity) || 0,
      };

      if (editingProduct) {
        const updateResponse = await ProductService.updateProduct(editingProduct.id, data);
        if (updateResponse.success) {
          toast.success('Product updated successfully!');
          triggerDashboardRefresh();
        } else {
          console.error('Update error:', updateResponse.error);
          toast.error(updateResponse.error?.message || 'Failed to update product');
          return;
        }
      } else {
        const createResponse = await ProductService.createProduct(data);
        if (createResponse.success) {
          toast.success('Product added successfully!');
          // whenever a fresh product is added make sure dashboard stats update
          triggerDashboardRefresh();
          setCurrentPage(1);
        } else {
          console.error('Create error:', createResponse.error);
          toast.error(createResponse.error?.message || 'Failed to add product');
          return;
        }
      }
      setShowModal(false);
      // Refresh the products list
      await execute();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const deleteResponse = await ProductService.deleteProduct(id);
        if (!deleteResponse.success) {
          toast.error(deleteResponse.error?.message || 'Failed to delete product');
          return;
        }

        toast.success('Product deleted successfully!');
        triggerDashboardRefresh();
        execute();
      } catch (deleteError) {
        console.error('Delete error:', deleteError);
        toast.error('Failed to delete product');
      }
    }
  };

  return (
    <DashboardLayout menuItems={FARMER_MENU_ITEMS}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600">Manage your agricultural products</p>
          </div>
          <Button variant="primary" onClick={handleAddProduct}>
            ➕ Add New Product
          </Button>
        </div>

        {/* Error State */}
        {error && <ErrorMessage error={error} onRetry={execute} />}

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <Skeleton count={4} />
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">No products yet</p>
            <Button variant="primary" onClick={handleAddProduct}>
              Add Your First Product
            </Button>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} hoverable>
                  <div className="h-40 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-5xl">🌾</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="primary" size="sm">
                      {product.category}
                    </Badge>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">
                      <strong>Price:</strong> ₹{product.pricePerKg}/kg
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Available:</strong> {product.quantity} kg
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setEditingProduct(product);
                        setFormData({
                          name: product.name,
                          category: product.category,
                          pricePerKg: product.pricePerKg,
                          quantity: product.quantity,
                          description: product.description,
                        });
                        setShowModal(true);
                      }}
                      fullWidth
                    >
                      ✏️ Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                      fullWidth
                    >
                      🗑️ Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}

        {/* Add/Edit Product Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={editingProduct ? 'Edit Product' : 'Add New Product'}
          size="lg"
          footer={
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSubmit}>
                {editingProduct ? 'Update' : 'Add'} Product
              </Button>
            </div>
          }
        >
          <form className="space-y-4">
            <Input
              label="Product Name"
              placeholder="e.g., Fresh Tomatoes"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="">Select Category</option>
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Price per kg (₹)"
                type="number"
                placeholder="0"
                value={formData.pricePerKg}
                onChange={(e) => setFormData({ ...formData, pricePerKg: e.target.value })}
                required
              />
            </div>

            <Input
              label="Available Quantity (kg)"
              type="number"
              placeholder="0"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
            />

            <Input
              label="Description"
              placeholder="Tell us more about this product..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default FarmerProducts;
