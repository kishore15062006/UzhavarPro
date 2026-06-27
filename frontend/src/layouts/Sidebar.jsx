// Sidebar Component
import { Link, useLocation } from 'react-router-dom';

export const Sidebar = ({ 
  menuItems = [], 
  collapsed = false, 
  setCollapsed, 
  isMobileOpen = false, 
  setIsMobileOpen 
}) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Sidebar Overlay Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        bg-white border-r border-gray-100 transition-all duration-300
        fixed left-0 top-16 bottom-0 overflow-y-auto
        ${collapsed ? 'lg:w-20' : 'lg:w-64'}
        w-64 z-30
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Menu Items */}
        <nav className="space-y-6 p-4">
          {menuItems.map((item, idx) => (
            <div key={item.id || `sidebar-group-${idx}`} className="space-y-1">
              {item.label && (!collapsed || isMobileOpen) && (
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
                  {item.label}
                </p>
              )}

              <div className="space-y-1">
                {item.items?.map((subitem) => (
                  <Link
                    key={subitem.path}
                    to={subitem.path}
                    onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg
                      transition-all duration-200 group
                      ${isActive(subitem.path)
                        ? 'bg-primary-50 text-primary-700 font-semibold shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                    title={collapsed ? subitem.label : ''}
                  >
                    <span className={`text-xl transition-transform duration-200 group-hover:scale-110 ${
                      isActive(subitem.path) ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'
                    }`}>
                      {subitem.icon}
                    </span>
                    {(!collapsed || isMobileOpen) && (
                      <span className="text-sm tracking-wide">{subitem.label}</span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
        
        {/* Desktop Collapse Toggle Button at bottom */}
        <div className="hidden lg:block absolute bottom-4 left-0 right-0 px-4">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full py-2 flex items-center justify-center bg-gray-50 border border-gray-100 hover:bg-gray-100 text-gray-500 rounded-lg text-sm transition-colors"
          >
            {collapsed ? '📂' : '📁 Collapse'}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
