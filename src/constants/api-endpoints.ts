export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH_TOKEN: '/auth/refresh-token',
  },
  DASHBOARD: {
    METRICS: '/dashboard/metrics',
    LIVE_SUMMARY: '/dashboard/live-summary',
  },
  CLIENTS: {
    LIST: '/clients',
    DETAILS: (id: string) => `/clients/${id}`,
    CREATE: '/clients',
    UPDATE_STATUS: (id: string) => `/clients/${id}/status`,
  },
  SPORTS: {
    TREE: '/sports/tree',
    MARKETS: (sportId: string) => `/sports/${sportId}/markets`,
  },
  REPORTS: {
    PROFIT_LOSS: '/reports/profit-loss',
    BET_HISTORY: '/reports/bet-history',
  },
} as const;
