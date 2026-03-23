// DashboardLayout Component
import TopNavigation from './TopNavigation.jsx';
import Sidebar from './Sidebar.jsx';

export const DashboardLayout = ({ children, menuItems }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      <div className="flex">
        <Sidebar menuItems={menuItems} />
        <main className="flex-1 ml-64 mt-16 p-6 overflow-y-auto">
          <div className="max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
