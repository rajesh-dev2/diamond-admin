import { HttpService } from '@/api/httpService';
import {
  TreeSportItem,
  TreeLeagueItem,
  TreeDateItem,
  TreeMatchItem,
  TreeMarketItem,
  TreeData2Req,
  TreeData3Req,
  TreeData4Req,
  TreeData5Req,
} from '@/types/sportsTree.types';

// Helper function to extract array from response object ({ t1: [...] }, { t2: [...] }, direct array, or data property)
function getArrayFromResponse(data: any, preferredKey?: string): any[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (preferredKey && Array.isArray(data[preferredKey])) return data[preferredKey];
  if (Array.isArray(data.t1)) return data.t1;
  if (Array.isArray(data.t2)) return data.t2;
  if (Array.isArray(data.t3)) return data.t3;
  if (Array.isArray(data.t4)) return data.t4;
  if (Array.isArray(data.t5)) return data.t5;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.result)) return data.result;
  return [];
}

export const SportsTreeService = {
  /**
   * Fetch Root Sports List: POST /admin/treedata1 or /api/admin/treedata1
   * Response: { "t1": [ { "etid": "1", "etname": "Football" }, ... ] }
   */
  getSports: async (): Promise<TreeSportItem[]> => {
    try {
      const endpoints = ['/admin/treedata1', '/api/admin/treedata1'];
      for (const endpoint of endpoints) {
        try {
          const data = await HttpService.post<any>(endpoint, {});
          const list = getArrayFromResponse(data, 't1');
          if (list.length > 0) {
            return list.map((item: any) => ({
              etid: item.etid ?? item.id ?? item.sportId,
              ename: item.etname ?? item.ename ?? item.name ?? item.sportName ?? '',
            }));
          }
        } catch (_) {}
      }
    } catch (err) {
      console.error('Error fetching sports tree data:', err);
    }
    return [];
  },

  /**
   * Fetch Competitions/Leagues for Sport: POST /admin/treedata2
   * Body: { "etid": 1 }
   * Response: { "t1": [ { "cid": "8521074", "cname": "Caribbean Premier League" }, ... ] }
   */
  getLeagues: async (etid: number | string): Promise<TreeLeagueItem[]> => {
    try {
      const payload: TreeData2Req = { etid };
      const endpoints = ['/admin/treedata2', '/api/admin/treedata2'];
      for (const endpoint of endpoints) {
        try {
          const data = await HttpService.post<any>(endpoint, payload);
          const list = getArrayFromResponse(data, 't1');
          if (list.length > 0) {
            return list.map((item: any) => ({
              cid: item.cid ?? item.id ?? item.competitionId,
              cname: item.cname ?? item.name ?? item.competitionName ?? '',
            }));
          }
        } catch (_) {}
      }
    } catch (err) {
      console.error(`Error fetching leagues for etid=${etid}:`, err);
    }
    return [];
  },

  /**
   * Fetch Dates for Competition: POST /admin/treedata3
   * Body: { "cid": "4839712" }
   * Response: { "t1": [ { "dt": "2026-08-08" } ] }
   */
  getDates: async (cid: string | number): Promise<TreeDateItem[]> => {
    try {
      const payload: TreeData3Req = { cid };
      const endpoints = ['/admin/treedata3', '/api/admin/treedata3'];
      for (const endpoint of endpoints) {
        try {
          const data = await HttpService.post<any>(endpoint, payload);
          const list = getArrayFromResponse(data, 't1');
          if (list.length > 0) {
            return list.map((item: any) => ({
              dt: item.dt ?? item.date ?? '',
            }));
          }
        } catch (_) {}
      }
    } catch (err) {
      console.error(`Error fetching dates for cid=${cid}:`, err);
    }
    return [];
  },

  /**
   * Fetch Matches for Competition & Date: POST /admin/treedata4
   * Body: { "cid": "4839712", "dt": "2026-08-08" }
   * Response: { "t1": [ { "gmid": "885904258", "ename": "..." } ] }
   */
  getMatches: async (cid: string | number, dt: string): Promise<TreeMatchItem[]> => {
    try {
      const payload: TreeData4Req = { cid, dt };
      const endpoints = ['/admin/treedata4', '/api/admin/treedata4'];
      for (const endpoint of endpoints) {
        try {
          const data = await HttpService.post<any>(endpoint, payload);
          const list = getArrayFromResponse(data, 't1');
          if (list.length > 0) {
            return list.map((item: any) => ({
              eid: item.gmid ?? item.eid ?? item.id ?? item.eventId,
              gmid: item.gmid ?? item.eid ?? item.id,
              ename: item.ename ?? item.name ?? item.eventName ?? '',
              markets: item.markets || [],
            }));
          }
        } catch (_) {}
      }
    } catch (err) {
      console.error(`Error fetching matches for cid=${cid}, dt=${dt}:`, err);
    }
    return [];
  },

  /**
   * Fetch Markets for Match: POST /admin/treedata5
   * Body: { "gmid": "885904258" }
   * Response: { "t1": [ { "mid": "...", "mname": "..." } ] }
   */
  getMarkets: async (gmid: string | number): Promise<TreeMarketItem[]> => {
    try {
      const payload: TreeData5Req = { gmid };
      const endpoints = ['/admin/treedata5', '/api/admin/treedata5'];
      for (const endpoint of endpoints) {
        try {
          const data = await HttpService.post<any>(endpoint, payload);
          const list = getArrayFromResponse(data, 't1');
          if (list.length > 0) {
            return list.map((item: any) => ({
              mid: item.mid ?? item.id ?? item.marketId ?? `mkt-${item.mid || Math.random()}`,
              mname: item.mname ?? item.name ?? item.marketName ?? 'Match Odds',
            }));
          }
        } catch (_) {}
      }
    } catch (err) {
      console.error(`Error fetching markets for gmid=${gmid}:`, err);
    }
    return [];
  },
};
