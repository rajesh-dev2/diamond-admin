export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/admin/auth/login',
    REGISTER: '/admin/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/user/auth/me',
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
  ACCOUNTS: {
    LIST: '/admin/accounts',
    DOWNLINE: (id: string) => `/admin/accounts/${id}/downline`,
    DEPOSIT: (id: string) => `/admin/accounts/${id}/deposit`,
    WITHDRAW: (id: string) => `/admin/accounts/${id}/withdraw`,
    EXPOSURE_LIMIT: (id: string) => `/admin/accounts/${id}/exposure-limit`,
    CREDIT: (id: string) => `/admin/accounts/${id}/credit`,
    PASSWORD: (id: string) => `/admin/accounts/${id}/password`,
    STATUS: (id: string) => `/admin/accounts/${id}/status`,
  },
  SPORTS: {
    TREE: '/sports/tree',
    MARKETS: (sportId: string) => `/sports/${sportId}/markets`,
  },
  BETS: {
    MATCH: '/admin/bets/match',
  },
  BOOK: {
    MATCH: '/admin/book/match',
    FANCY: '/admin/book',
  },
  REPORTS: {
    PROFIT_LOSS: '/admin/reports/profit-loss',
    PROFIT_LOSS_LEVELS: '/admin/reports/profit-loss-levels',
    BET_HISTORY: '/reports/bet-history',
    STATEMENT_TYPES: '/admin/reports/statement-types',
    GAME_TYPES: '/admin/reports/game-types',
    ACCOUNT_STATEMENT: '/admin/reports/account-statement',
    CURRENT_BETS: '/admin/reports/current-bets',
    GENERAL_REPORT: '/admin/reports/general-report',
  },
} as const;
