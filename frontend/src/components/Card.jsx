// Card Component
export const Card = ({
  children,
  className = '',
  onClick,
  hoverable = false,
  ...props
}) => {
  const hoverClass = hoverable ? 'hover:shadow-lg cursor-pointer transition-shadow duration-200' : '';

  return (
    <div
      className={`
        bg-white rounded-lg p-6 shadow-card
        ${hoverClass}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
