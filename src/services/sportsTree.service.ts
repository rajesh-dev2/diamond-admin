import { HttpService } from '@/api/httpService';
import {
  TreeSportItem,
  TreeLeagueItem,
  TreeDateItem,
  TreeMatchItem,
  TreeMarketItem,
} from '@/types/sportsTree.types';

const ADMIN_BASE = '/admin';
const TREE_BASE = '/admin/tree';

// Helper function to extract array from response object ({ data: [...] }, { result: [...] }, or direct array)
function getArrayFromResponse(data: any): any[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.result)) return data.result;
  return [];
}

export const SportsTreeService = {
  /**
   * GET /admin/sports
   * Response items: { etid, etname }
   */
  getSports: async (): Promise<TreeSportItem[]> => {
    try {
      const data = await HttpService.get<any>(`${ADMIN_BASE}/sports`);
      const list = getArrayFromResponse(data);
      return list.map((item: any) => ({
        etid: item.etid ?? item.id,
        ename: item.etname ?? item.ename ?? item.name ?? '',
      }));
    } catch (err) {
      console.error('Error fetching sports:', err);
      return [];
    }
  },

  /**
   * GET /admin/tree/series?etid=4
   * Response items: { cid, cname }
   */
  getLeagues: async (etid: number | string): Promise<TreeLeagueItem[]> => {
    try {
      const data = await HttpService.get<any>(`${TREE_BASE}/series`, { etid });
      const list = getArrayFromResponse(data);
      return list.map((item: any) => ({
        cid: item.cid ?? item.id,
        cname: item.cname ?? item.name ?? '',
      }));
    } catch (err) {
      console.error(`Error fetching series for etid=${etid}:`, err);
      return [];
    }
  },

  /**
   * GET /admin/tree/dates?cid=8710947
   * Response items: { dt } (dates the series has matches on)
   */
  getDates: async (cid: string | number): Promise<TreeDateItem[]> => {
    try {
      const data = await HttpService.get<any>(`${TREE_BASE}/dates`, { cid });
      const list = getArrayFromResponse(data);
      return list.map((item: any) => ({
        dt: typeof item === 'string' ? item : item.dt ?? item.date ?? '',
      }));
    } catch (err) {
      console.error(`Error fetching dates for cid=${cid}:`, err);
      return [];
    }
  },

  /**
   * GET /admin/tree/matches?cid=8710947&dt=2026-08-12
   * Response items: { gmid, ename }
   */
  getMatches: async (cid: string | number, dt: string): Promise<TreeMatchItem[]> => {
    try {
      const data = await HttpService.get<any>(`${TREE_BASE}/matches`, { cid, dt });
      const list = getArrayFromResponse(data);
      return list.map((item: any) => ({
        eid: item.gmid ?? item.eid ?? item.id,
        gmid: item.gmid ?? item.eid ?? item.id,
        ename: item.ename ?? item.name ?? '',
      }));
    } catch (err) {
      console.error(`Error fetching matches for cid=${cid}, dt=${dt}:`, err);
      return [];
    }
  },

  /**
   * GET /admin/tree/markets?gmid=483208524
   * Response items: market name/id only (no odds)
   */
  getMarkets: async (gmid: string | number): Promise<TreeMarketItem[]> => {
    try {
      const data = await HttpService.get<any>(`${TREE_BASE}/markets`, { gmid });
      const list = getArrayFromResponse(data);
      return list.map((item: any) => ({
        mid: item.mid ?? item.id ?? item.marketId,
        mname: item.mname ?? item.name ?? item.marketName ?? '',
      }));
    } catch (err) {
      console.error(`Error fetching markets for gmid=${gmid}:`, err);
      return [];
    }
  },
};
