import { api } from '@/api/api';
import { API_ENDPOINTS } from '@/constants/api-endpoints';

export interface RegisterAccountPayload {
  accountType: string;
  name: string;
  username: string;
  password: string;
  retypePassword: string;
  city: string;
  phone: string;
  creditReference: string;
  transactionPassword: string;
  commissionDownline: number;
  partnershipDownline: number;
  minBet: number;
  maxBet: number;
  betDelay: number;
}

export interface RegisterAccountResponse {
  success: boolean;
  message?: string;
}

export interface AccountListItem {
  id: string;
  name: string;
  username: string;
  accountType: string;
  creditReference: number;
  balance: number;
  clientPL: number;
  exposure: number;
  availableBalance: number;
  ust: boolean;
  bst: boolean;
  exposureLimit: number;
  defaultPercent: number;
}

export interface AccountListParams {
  search?: string;
  accountType?: string;
  page?: number;
  limit?: number;
}

export interface AccountDownlineParams extends AccountListParams {
  isActive?: string;
}

export interface AccountListResponse {
  success: boolean;
  data: AccountListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AccountTransactionPayload {
  amount: number;
  remark: string;
  transactionPassword: string;
}

export interface AccountTransactionResponse {
  success: boolean;
  message?: string;
}

export interface UpdateExposureLimitPayload {
  newLimit: number;
  transactionPassword: string;
}

export interface UpdateExposureLimitResponse {
  success: boolean;
  id: string;
  username: string;
  oldLimit: number;
  newLimit: number;
}

export interface UpdateCreditPayload {
  newCredit: number;
  transactionPassword: string;
}

export interface UpdateCreditResponse {
  success: boolean;
  id: string;
  username: string;
  oldCredit: number;
  newCredit: number;
}

export interface UpdatePasswordPayload {
  newPassword: string;
  confirmPassword: string;
  transactionPassword: string;
}

export interface UpdatePasswordResponse {
  success: boolean;
  message?: string;
}

export interface UpdateStatusPayload {
  isActive: boolean;
  betStatus: boolean;
  transactionPassword: string;
}

export interface UpdateStatusResponse {
  success: boolean;
  id: string;
  username: string;
  isActive: boolean;
  betStatus: boolean;
}

export const AccountService = {
  /**
   * POST /admin/auth/register
   */
  register: (payload: RegisterAccountPayload): Promise<RegisterAccountResponse> =>
    api.post<RegisterAccountResponse>(API_ENDPOINTS.AUTH.REGISTER, payload),

  /**
   * GET /admin/accounts?search=&accountType=&page=&limit=
   */
  list: (params: AccountListParams): Promise<AccountListResponse> =>
    api.get<AccountListResponse>(API_ENDPOINTS.ACCOUNTS.LIST, {
      search: params.search ?? '',
      accountType: params.accountType ?? '',
      page: params.page ?? 1,
      limit: params.limit ?? 25,
    }),

  /**
   * GET /admin/accounts/:id/balance
   */
  getBalance: async (id: string): Promise<{ balance: number; username?: string; name?: string }> => {
    try {
      const data = await api.get<any>(API_ENDPOINTS.ACCOUNTS.BALANCE(id));
      const payload = data?.data ?? data;
      return { balance: payload?.balance ?? 0, username: payload?.username, name: payload?.name };
    } catch (err) {
      console.error(`Error fetching balance for account ${id}:`, err);
      return { balance: 0 };
    }
  },

  /**
   * GET /admin/accounts/:id/downline?search=&accountType=&isActive=&page=&limit=
   */
  getDownline: (id: string, params: AccountDownlineParams): Promise<AccountListResponse> =>
    api.get<AccountListResponse>(API_ENDPOINTS.ACCOUNTS.DOWNLINE(id), {
      search: params.search ?? '',
      accountType: params.accountType ?? '',
      isActive: params.isActive ?? '',
      page: params.page ?? 1,
      limit: params.limit ?? 25,
    }),

  /**
   * POST /admin/accounts/:id/deposit
   */
  deposit: (id: string, payload: AccountTransactionPayload): Promise<AccountTransactionResponse> =>
    api.post<AccountTransactionResponse>(API_ENDPOINTS.ACCOUNTS.DEPOSIT(id), payload),

  /**
   * POST /admin/accounts/:id/withdraw
   */
  withdraw: (id: string, payload: AccountTransactionPayload): Promise<AccountTransactionResponse> =>
    api.post<AccountTransactionResponse>(API_ENDPOINTS.ACCOUNTS.WITHDRAW(id), payload),

  /**
   * PUT /admin/accounts/:id/exposure-limit
   */
  updateExposureLimit: (
    id: string,
    payload: UpdateExposureLimitPayload
  ): Promise<UpdateExposureLimitResponse> =>
    api.put<UpdateExposureLimitResponse>(API_ENDPOINTS.ACCOUNTS.EXPOSURE_LIMIT(id), payload),

  /**
   * PUT /admin/accounts/:id/credit
   */
  updateCredit: (id: string, payload: UpdateCreditPayload): Promise<UpdateCreditResponse> =>
    api.put<UpdateCreditResponse>(API_ENDPOINTS.ACCOUNTS.CREDIT(id), payload),

  /**
   * PUT /admin/accounts/:id/password
   */
  updatePassword: (id: string, payload: UpdatePasswordPayload): Promise<UpdatePasswordResponse> =>
    api.put<UpdatePasswordResponse>(API_ENDPOINTS.ACCOUNTS.PASSWORD(id), payload),

  /**
   * PUT /admin/accounts/:id/status
   */
  updateStatus: (id: string, payload: UpdateStatusPayload): Promise<UpdateStatusResponse> =>
    api.put<UpdateStatusResponse>(API_ENDPOINTS.ACCOUNTS.STATUS(id), payload),
};
