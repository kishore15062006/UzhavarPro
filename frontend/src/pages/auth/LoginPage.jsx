// Login Page
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import { Input, Button, Card, ErrorMessage } from '../../components/index.js';
import { Validators } from '../../utils/index.js';
import toast from 'react-hot-toast';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!Validators.isRequired(formData.email)) {
      newErrors.email = 'Email is required';
    } else if (!Validators.isEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!Validators.isRequired(formData.password)) {
      newErrors.password = 'Password is required';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const response = await login(formData.email, formData.password);

    if (response.success) {
      toast.success('Login successful!');
      const role = response.data.role;
      const roleRoutes = {
        FARMER: '/farmer/dashboard',
        PUBLIC: '/public/marketplace',
        ADMIN: '/admin/dashboard',
        DELIVERY_AGENT: '/delivery/dashboard',
      };
      const destination = roleRoutes[role] || '/login';
      navigate(destination, { replace: true });
    } else {
      toast.error(response.error?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🌾</div>
          <h1 className="text-2xl font-bold text-gray-900">FarmConnect</h1>
          <p className="text-gray-600 text-sm">Agriculture Marketplace</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <ErrorMessage error={error} />}

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-medium hover:underline">
              Register
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
