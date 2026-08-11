import { HttpService, RequestOptions } from './httpService';

export const api = {
  get: <T>(url: string, params?: Record<string, any>, options?: RequestOptions) =>
    HttpService.get<T>(url, params, options),

  post: <T>(url: string, data?: any, options?: RequestOptions) =>
    HttpService.post<T>(url, data, options),

  put: <T>(url: string, data?: any, options?: RequestOptions) =>
    HttpService.put<T>(url, data, options),

  patch: <T>(url: string, data?: any, options?: RequestOptions) =>
    HttpService.patch<T>(url, data, options),

  delete: <T>(url: string, options?: RequestOptions) =>
    HttpService.delete<T>(url, options),
};
