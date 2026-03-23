// Not Found Page
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import useAuth from '../hooks/useAuth.js';

export const NotFoundPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const getHomeRoute = () => {
    if (!user) return '/login';
    const routes = {
      FARMER: '/farmer/dashboard',
      PUBLIC: '/public/marketplace',
      ADMIN: '/admin/dashboard',
      DELIVERY_AGENT: '/delivery/dashboard',
    };
    return routes[user.role] || '/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="text-center">
        <div className="text-7xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
          404
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-600 mb-8 text-lg">
          Sorry, the page you're looking for doesn't exist.
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="primary" onClick={() => navigate(getHomeRoute())}>
            Go Home
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
