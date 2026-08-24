import { HttpService } from '@/api/httpService';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { SelectOption } from '@/components/common/FormSelect';

function getArrayFromResponse(data: any): any[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.types)) return data.types;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.result)) return data.result;
  if (Array.isArray(data.records)) return data.records;
  if (Array.isArray(data.statement)) return data.statement;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.bets)) return data.bets;
  if (Array.isArray(data.levels)) return data.levels;
  return [];
}

export interface AccountStatementParams {
  type: string;
  clientId: string;
  gameType: string;
  gameName: string;
  from: string;
  to: string;
}

export interface CurrentBetsParams {
  status: string;
  type: string;
  otype: string;
  clientId: string;
  search: string;
  limit: number;
  page: number;
}

export interface CurrentBetsResult {
  data: any[];
  total: number;
  totalPages: number;
  totalBets: number;
  totalAmount: number;
}

export interface GeneralReportParams {
  type: string;
  search: string;
}

export interface ProfitLossParams {
  level: string;
  search: string;
  from: string;
  to: string;
}

export interface BalanceSummary {
  upperLevelCreditReference: number;
  totalMasterBalance: number;
  availableBalance: number;
  downLevelOccupyBalance: number;
  upperLevel: number;
  availableBalanceWithProfitLoss: number;
  downLevelCreditReference: number;
  downLevelProfitLoss: number;
  myProfitLoss: number;
}

export interface UserRegisterDetailParams {
  search: string;
  page: number;
  limit: number;
}

export interface UserRegisterDetailResult {
  data: any[];
  total: number;
  totalPages: number;
}

export const ReportsService = {
  /**
   * GET /admin/reports/statement-types
   * Response: { success, types: [{ value, label }] }
   */
  getStatementTypes: async (): Promise<SelectOption[]> => {
    try {
      const data = await HttpService.get<any>(API_ENDPOINTS.REPORTS.STATEMENT_TYPES);
      const list = getArrayFromResponse(data);
      return list.map((item: any) => ({
        value: item.value ?? item.id ?? item.code ?? '',
        label: item.label ?? item.name ?? item.text ?? '',
      }));
    } catch (err) {
      console.error('Error fetching statement types:', err);
      return [];
    }
  },

  /**
   * GET /admin/reports/statement-types?type=
   * Response: { success, types: [...], options: [{ etid, icon, name }] }
   */
  getGameNames: async (type: string): Promise<SelectOption[]> => {
    try {
      const data = await HttpService.get<any>(API_ENDPOINTS.REPORTS.STATEMENT_TYPES, { type });
      const list = Array.isArray(data?.options) ? data.options : [];
      return list.map((item: any) => ({
        value: item.etid ?? item.value ?? item.id ?? item.code ?? '',
        label: item.name ?? item.label ?? item.text ?? '',
      }));
    } catch (err) {
      console.error(`Error fetching game names for type=${type}:`, err);
      return [];
    }
  },

  /**
   * GET /admin/reports/game-types?etid=
   * Response: { success, etid, gameTypes: [{ label, value }] }
   */
  getGameTypes: async (etid: string | number): Promise<SelectOption[]> => {
    try {
      const data = await HttpService.get<any>(API_ENDPOINTS.REPORTS.GAME_TYPES, { etid });
      const list = Array.isArray(data?.gameTypes) ? data.gameTypes : [];
      return list.map((item: any) => ({
        value: item.value ?? item.id ?? item.code ?? '',
        label: item.label ?? item.name ?? item.text ?? '',
      }));
    } catch (err) {
      console.error(`Error fetching game types for etid=${etid}:`, err);
      return [];
    }
  },

  /**
   * GET /admin/reports/account-statement?type=&clientId=&gameType=&gameName=&from=&to=
   */
  getAccountStatement: async (params: AccountStatementParams): Promise<any[]> => {
    try {
      const data = await HttpService.get<any>(API_ENDPOINTS.REPORTS.ACCOUNT_STATEMENT, params);
      return getArrayFromResponse(data);
    } catch (err) {
      console.error('Error fetching account statement:', err);
      return [];
    }
  },

  /**
   * GET /admin/reports/current-bets?status=&type=&otype=&clientId=&search=&limit=&page=
   */
  getCurrentBets: async (params: CurrentBetsParams): Promise<CurrentBetsResult> => {
    try {
      const data = await HttpService.get<any>(API_ENDPOINTS.REPORTS.CURRENT_BETS, params);
      return {
        data: getArrayFromResponse(data),
        total: data?.total ?? 0,
        totalPages: data?.totalPages ?? 1,
        totalBets: data?.totalBets ?? 0,
        totalAmount: data?.totalAmount ?? 0,
      };
    } catch (err) {
      console.error('Error fetching current bets:', err);
      return { data: [], total: 0, totalPages: 1, totalBets: 0, totalAmount: 0 };
    }
  },

  /**
   * GET /admin/reports/general-report?type=&search=
   */
  getGeneralReport: async (params: GeneralReportParams): Promise<any[]> => {
    try {
      const data = await HttpService.get<any>(API_ENDPOINTS.REPORTS.GENERAL_REPORT, params);
      return getArrayFromResponse(data);
    } catch (err) {
      console.error('Error fetching general report:', err);
      return [];
    }
  },

  /**
   * GET /admin/reports/profit-loss-levels
   * Response: { success, types/levels: [{ value, label }] }
   */
  getProfitLossLevels: async (): Promise<SelectOption[]> => {
    try {
      const data = await HttpService.get<any>(API_ENDPOINTS.REPORTS.PROFIT_LOSS_LEVELS);
      const list = getArrayFromResponse(data);
      return list.map((item: any) => ({
        value: item.value ?? item.id ?? item.code ?? '',
        label: item.label ?? item.name ?? item.text ?? '',
      }));
    } catch (err) {
      console.error('Error fetching profit loss levels:', err);
      return [];
    }
  },

  /**
   * GET /admin/reports/profit-loss?level=&search=&from=&to=
   */
  getProfitLoss: async (params: ProfitLossParams): Promise<any[]> => {
    try {
      const data = await HttpService.get<any>(API_ENDPOINTS.REPORTS.PROFIT_LOSS, params);
      return getArrayFromResponse(data);
    } catch (err) {
      console.error('Error fetching profit loss:', err);
      return [];
    }
  },

  /**
   * GET /admin/reports/user-register-detail?search=&page=&limit=
   */
  getUserRegisterDetail: async (params: UserRegisterDetailParams): Promise<UserRegisterDetailResult> => {
    try {
      const data = await HttpService.get<any>(API_ENDPOINTS.REPORTS.USER_REGISTER_DETAIL, params);
      return {
        data: getArrayFromResponse(data),
        total: data?.total ?? 0,
        totalPages: data?.totalPages ?? 1,
      };
    } catch (err) {
      console.error('Error fetching user register detail:', err);
      return { data: [], total: 0, totalPages: 1 };
    }
  },

  /**
   * GET /admin/reports/balance-summary
   */
  getBalanceSummary: async (): Promise<BalanceSummary> => {
    try {
      const data = await HttpService.get<any>(API_ENDPOINTS.REPORTS.BALANCE_SUMMARY);
      return {
        upperLevelCreditReference: data?.upperLevelCreditReference ?? 0,
        totalMasterBalance: data?.totalMasterBalance ?? 0,
        availableBalance: data?.availableBalance ?? 0,
        downLevelOccupyBalance: data?.downLevelOccupyBalance ?? 0,
        upperLevel: data?.upperLevel ?? 0,
        availableBalanceWithProfitLoss: data?.availableBalanceWithPL ?? 0,
        downLevelCreditReference: data?.downLevelCreditReference ?? 0,
        downLevelProfitLoss: data?.downLevelProfitLoss ?? 0,
        myProfitLoss: data?.myProfitLoss ?? 0,
      };
    } catch (err) {
      console.error('Error fetching balance summary:', err);
      return {
        upperLevelCreditReference: 0,
        totalMasterBalance: 0,
        availableBalance: 0,
        downLevelOccupyBalance: 0,
        upperLevel: 0,
        availableBalanceWithProfitLoss: 0,
        downLevelCreditReference: 0,
        downLevelProfitLoss: 0,
        myProfitLoss: 0,
      };
    }
  },
};
