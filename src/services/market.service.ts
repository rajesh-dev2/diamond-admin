import { api } from '@/api/api';

export const MarketService = {
  /**
   * PUT /admin/markets/:id/lock
   * Body: { locked: boolean }
   */
  setLock: (marketId: string | number, locked: boolean): Promise<void> =>
    api.put<void>(`/admin/markets/${marketId}/lock`, { locked }),
};
