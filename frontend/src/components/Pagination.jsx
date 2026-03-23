// Pagination Component
import Button from './Button.jsx';

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  size = 'md',
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxPages = 7;

    if (totalPages <= maxPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size={size}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ← Prev
      </Button>

      {pages.map((page, idx) => (
        <div key={idx}>
          {page === '...' ? (
            <span className="px-2 py-1">...</span>
          ) : (
            <button
              onClick={() => onPageChange(page)}
              className={`
                px-3 py-1 rounded-md text-sm font-medium transition-colors
                ${
                  currentPage === page
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              {page}
            </button>
          )}
        </div>
      ))}

      <Button
        variant="outline"
        size={size}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next →
      </Button>
    </div>
  );
};

export default Pagination;
