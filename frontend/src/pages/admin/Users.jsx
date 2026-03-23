// Admin Users Page
import { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { Card, Button, Input, Badge, Pagination, Modal, Skeleton, ErrorMessage } from '../../components/index.js';
import useAsync from '../../hooks/useAsync.js';
import AdminService from '../../services/adminService.js';
import { USER_ROLES } from '../../constants/index.js';
import toast from 'react-hot-toast';

const ADMIN_MENU_ITEMS = [
  { label: 'MAIN', items: [{ icon: '📊', label: 'Dashboard', path: '/admin/dashboard' }] },
  { label: 'MANAGEMENT', items: [{ icon: '👥', label: 'Users', path: '/admin/users' }, { icon: '🛒', label: 'Products', path: '/admin/products' }, { icon: '📋', label: 'Orders', path: '/admin/orders' }] },
  { label: 'ANALYTICS', items: [{ icon: '📈', label: 'Analytics', path: '/admin/analytics' }] },
];

export const AdminUsers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: response, isLoading, error, execute: fetchUsers } = useAsync(
    () => AdminService.getAllUsers({ page: currentPage - 1, size: 10 }),
    true,
    [currentPage]
  );

  const users = response?.content || [];
  const totalPages = response?.totalPages || 1;

  const handleChangeRole = async (userId, newRole) => {
    try {
      const res = await AdminService.updateUserRole(userId, newRole);
      if (res.success) {
        toast.success('User role updated!');
        fetchUsers();
        setShowModal(false);
      } else {
        toast.error('Failed to update role');
      }
    } catch (err) {
      toast.error(err?.message || 'Error updating role');
    }
  };

  const handleSuspendUser = async (userId) => {
    if (window.confirm('Are you sure you want to suspend this user?')) {
      try {
        const res = await AdminService.suspendUser(userId);
        if (res.success) {
          toast.success('User suspended!');
          fetchUsers();
        } else {
          toast.error('Failed to suspend user');
        }
      } catch (err) {
        toast.error(err?.message || 'Error suspending user');
      }
    }
  };

  const getRoleBadgeVariant = (role) => {
    const variants = {
      FARMER: 'primary',
      PUBLIC: 'secondary',
      ADMIN: 'danger',
    };
    return variants[role] || 'gray';
  };

  return (
    <DashboardLayout menuItems={ADMIN_MENU_ITEMS}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <Input
            placeholder="Search users..."
            className="max-w-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {error && <ErrorMessage error={error} onRetry={fetchUsers} />}

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <Skeleton count={2} />
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <Card key={user.id} hoverable>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-semibold">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-sm">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Role</p>
                    <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-semibold text-sm">{user.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Joined</p>
                    <p className="font-semibold text-sm">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowModal(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleSuspendUser(user.id)}
                    >
                      🚫 Suspend
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

        {/* User Edit Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={`Edit User: ${selectedUser?.name}`}
          footer={
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button onClick={() => handleChangeRole(selectedUser?.id, selectedRole)}>
                Update Role
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Role</label>
              <p className="p-2 bg-gray-100 rounded">{selectedUser?.role}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Change Role To</label>
              <select
                value={selectedRole || ''}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select a role</option>
                {Object.entries(USER_ROLES).map(([key, value]) => (
                  <option key={key} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <p className="p-2 bg-gray-100 rounded">{selectedUser?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <p className="p-2 bg-gray-100 rounded">{selectedUser?.phone || 'Not provided'}</p>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default AdminUsers;