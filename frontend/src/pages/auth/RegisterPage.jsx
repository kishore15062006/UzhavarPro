// Register Page
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import { Input, Button, Card, Select, ErrorMessage } from '../../components/index.js';
import { Validators } from '../../utils/index.js';
import { USER_ROLES } from '../../constants/index.js';
import toast from 'react-hot-toast';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!Validators.isRequired(formData.name)) {
      newErrors.name = 'Full name is required';
    }

    if (!Validators.isRequired(formData.email)) {
      newErrors.email = 'Email is required';
    } else if (!Validators.isEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!Validators.isRequired(formData.password)) {
      newErrors.password = 'Password is required';
    } else if (!Validators.isPassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!Validators.isRequired(formData.phone)) {
      newErrors.phone = 'Phone number is required';
    } else if (!Validators.isPhone(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    if (!Validators.isRequired(formData.role)) {
      newErrors.role = 'Please select a role';
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

    const response = await register(formData);

    if (response.success) {
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } else {
      toast.error(response.error?.message || 'Registration failed');
    }
  };

  const roleOptions = [
    { value: USER_ROLES.FARMER, label: '👨‍🌾 Farmer' },
    { value: USER_ROLES.PUBLIC, label: '🛍️ Public Buyer' },
    { value: USER_ROLES.ADMIN, label: '👨‍💼 Admin' },
    { value: USER_ROLES.DELIVERY_AGENT, label: '🚗 Delivery Agent' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🌾</div>
          <h1 className="text-2xl font-bold text-gray-900">Join FarmConnect</h1>
          <p className="text-gray-600 text-sm">Create your account to get started</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <ErrorMessage error={error} />}

          <Input
            label="Full Name"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
          />

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />

          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            placeholder="10 digit number"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            required
          />

          <Select
            label="Role"
            name="role"
            options={roleOptions}
            value={formData.role}
            onChange={handleChange}
            error={errors.role}
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            helperText="Min 8 chars, 1 uppercase, 1 lowercase, 1 number"
            required
          />

          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Register'}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;
