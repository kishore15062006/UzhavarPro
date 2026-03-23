// Error Component
import Button from './Button.jsx';

export const ErrorMessage = ({
  error,
  onRetry,
  showIcon = true,
  ...props
}) => {
  return (
    <div
      className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md"
      {...props}
    >
      <div className="flex items-start gap-3">
        {showIcon && <span className="text-2xl">⚠️</span>}
        <div className="flex-1">
          <p className="font-medium text-red-900">
            {typeof error === 'string' ? error : error?.message || 'An error occurred'}
          </p>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="mt-2 border-red-500 text-red-600 hover:bg-red-50"
            >
              Retry
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export const ErrorBoundary = ({ error, children }) => {
  if (error) {
    return <ErrorMessage error={error} />;
  }
  return children;
};

export default ErrorMessage;
