// Loading Skeleton Component
export const Skeleton = ({
  className = '',
  count = 1,
  height = 'h-4',
  width = 'w-full',
  circle = false,
  ...props
}) => {
  const skeletonItems = Array(count).fill(0);

  return (
    <>
      {skeletonItems.map((_, i) => (
        <div
          key={i}
          className={`
            bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200
            animate-pulse rounded-md
            ${circle ? 'rounded-full' : ''}
            ${height}
            ${width}
            ${className}
            mb-2
          `}
          {...props}
        />
      ))}
    </>
  );
};

export const SkeletonCard = () => (
  <div className="space-y-4 p-6 bg-white rounded-lg shadow-card">
    <Skeleton height="h-6" width="w-1/2" />
    <Skeleton height="h-4" count={3} />
    <div className="flex gap-2">
      <Skeleton height="h-8" width="w-20" />
      <Skeleton height="h-8" width="w-20" />
    </div>
  </div>
);

export default Skeleton;
