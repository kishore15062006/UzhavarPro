import { useState } from 'react';
import { AppContext } from './AppContextObject.js';

const AppProvider = ({ children }) => {
  const [dashboardRefreshKey, setDashboardRefreshKey] = useState(0);

  const triggerDashboardRefresh = () => {
    setDashboardRefreshKey((k) => k + 1);
  };

  return (
    <AppContext.Provider value={{ dashboardRefreshKey, triggerDashboardRefresh }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
