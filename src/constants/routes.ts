export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/admin/dashboard',
  CLIENTS: '/admin/users',
  INSERT_USER: '/admin/users/insertuser',
  ASSIGN_AGENT: '/admin/assign_agent',
  MARKET_ANALYSIS: '/admin/market-analysis',
  LIVE_MARKET: '/admin/live-market',
  LIVE_VIRTUAL_MARKET: '/admin/live-virtual-market',
  REPORTS: '/admin/reports',
  SETTINGS: '/admin/createaccount',
} as const;

export interface NavRoute {
  label: string;
  path: string;
  badge?: string;
  icon?: string;
}

export const TOP_NAV_ROUTES: NavRoute[] = [
  { label: 'List of Clients', path: ROUTES.CLIENTS },
  { label: 'Assign Agent', path: ROUTES.ASSIGN_AGENT },
  { label: 'Market Analysis', path: ROUTES.MARKET_ANALYSIS },
  { label: 'Live Market', path: ROUTES.LIVE_MARKET, badge: 'LIVE' },
  { label: 'Live Virtual Market', path: ROUTES.LIVE_VIRTUAL_MARKET },
  { label: 'Reports', path: ROUTES.REPORTS },
  { label: 'Multi Login', path: ROUTES.SETTINGS },
];
