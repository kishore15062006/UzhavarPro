// Unauthorized Page
import { Link } from 'react-router-dom';
import Button from '../components/Button.jsx';

export const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <div className="text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6 text-lg">
          You don't have permission to access this resource.
        </p>
        <Link to="/">
          <Button variant="primary">
            Go to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
