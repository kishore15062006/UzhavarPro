// Sidebar Component
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Sidebar = ({ menuItems, isCollapsed = false }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(isCollapsed);

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className={`
      bg-white shadow-md transition-all duration-300
      fixed left-0 top-16 bottom-0 overflow-y-auto
      ${collapsed ? 'w-20' : 'w-64'}
      z-30
    `}>
      {/* Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full p-4 flex justify-center hover:bg-gray-50 transition-colors"
      >
        {collapsed ? '→' : '←'}
      </button>

      {/* Menu Items */}
      <nav className="space-y-2 p-4">
        {menuItems.map((item) => (
          <div key={item.id}>
            {item.label && !collapsed && (
              <p className="text-xs font-semibold text-gray-500 uppercase mp-2 mt-4">
                {item.label}
              </p>
            )}

            {item.items?.map((subitem) => (
              <Link
                key={subitem.path}
                to={subitem.path}
                className={`
                  flex items-center gap-3 px-4 py-2 rounded-lg
                  transition-colors duration-200
                  ${isActive(subitem.path)
                    ? 'bg-primary-100 text-primary-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
                title={collapsed ? subitem.label : ''}
              >
                <span className="text-xl">{subitem.icon}</span>
                {!collapsed && <span>{subitem.label}</span>}
              </Link>
            ))}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
