import { createContext } from 'react';

export const AppContext = createContext({
  dashboardRefreshKey: 0,
  triggerDashboardRefresh: () => {},
});
