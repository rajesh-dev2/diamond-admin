import { HttpService } from '@/api/httpService';
import { API_ENDPOINTS } from '@/constants/api-endpoints';

export interface MatchBetsParams {
  gmid: string | number;
  type?: 'all' | 'matched' | 'unmatched';
  status?: string;
  otype?: 'all' | 'back' | 'lay';
  userId?: string;
}

export interface MatchBetItem {
  username: string;
  nation: string;
  rate: number;
  amount: number;
  [key: string]: any;
}

export interface MatchBetsResult {
  matchedBets: MatchBetItem[];
  unmatchedBets: MatchBetItem[];
}

function mapBetItem(item: any): MatchBetItem {
  return {
    ...item,
    username: item.user?.username ?? item.username ?? item.userName ?? item.client ?? '',
    nation: item.nat ?? item.nation ?? item.selection ?? item.team ?? '',
    rate: item.odds ?? item.rate ?? item.userRate ?? 0,
    amount: item.stake ?? item.amount ?? 0,
  };
}

export interface MatchBookItem {
  mid: string | number;
  nat: string;
  value: number;
  [key: string]: any;
}

/**
 * Flattens the nested { items: [{ id, book: [{ team, combinedClientPL }] }] }
 * response shape into one { mid, nat, value } row per team/section.
 */
function flattenBookItems(items: any[]): MatchBookItem[] {
  return items.flatMap((item: any) =>
    (item.book ?? []).map((row: any) => ({
      ...row,
      mid: item.id ?? item.mid ?? item.marketId ?? '',
      nat: row.team ?? row.nat ?? row.nation ?? row.selection ?? '',
      value: row.combinedClientPL ?? row.value ?? row.book ?? row.position ?? row.pl ?? 0,
    }))
  );
}

export const BetsService = {
  /**
   * GET /admin/bets/match?gmid=&type=&status=&otype=&userId=
   * Response: { success, matchedBets: [...], unmatchedBets: [...] }
   */
  getMatchBets: async (params: MatchBetsParams): Promise<MatchBetsResult> => {
    try {
      const data = await HttpService.get<any>(API_ENDPOINTS.BETS.MATCH, {
        gmid: params.gmid,
        type: params.type ?? 'all',
        status: params.status ?? 'PLACED',
        otype: params.otype ?? 'all',
        userId: params.userId ?? '',
      });
      return {
        matchedBets: Array.isArray(data?.matchedBets) ? data.matchedBets.map(mapBetItem) : [],
        unmatchedBets: Array.isArray(data?.unmatchedBets) ? data.unmatchedBets.map(mapBetItem) : [],
      };
    } catch (err) {
      console.error('Error fetching match bets:', err);
      return { matchedBets: [], unmatchedBets: [] };
    }
  },

  /**
   * GET /admin/book/match?gmid=
   * Response: { success, gmid, items: [{ id, type, name, book: [{ team, sid, combinedClientPL, yourShare }] }] }
   */
  getMatchBook: async (gmid: string | number): Promise<MatchBookItem[]> => {
    try {
      const data = await HttpService.get<any>(API_ENDPOINTS.BOOK.MATCH, { gmid });
      const items = Array.isArray(data?.items) ? data.items : [];
      return flattenBookItems(items);
    } catch (err) {
      console.error('Error fetching match book:', err);
      return [];
    }
  },

  /**
   * GET /admin/book?id=<fancyId or marketId>
   */
  getFancyBook: async (id: string | number): Promise<MatchBookItem[]> => {
    try {
      const data = await HttpService.get<any>(API_ENDPOINTS.BOOK.FANCY, { id });
      if (Array.isArray(data?.items)) return flattenBookItems(data.items);
      const list = Array.isArray(data) ? data : Array.isArray(data?.book) ? data.book : Array.isArray(data?.data) ? data.data : [];
      return list.map((row: any) => ({
        ...row,
        mid: row.mid ?? row.marketId ?? id,
        nat: row.team ?? row.nat ?? row.nation ?? row.selection ?? '',
        value: row.combinedClientPL ?? row.value ?? row.book ?? row.position ?? row.pl ?? 0,
      }));
    } catch (err) {
      console.error('Error fetching fancy book:', err);
      return [];
    }
  },
};
