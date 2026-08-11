import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { apiClient } from './axios';

export interface RequestOptions extends AxiosRequestConfig {
  skipAuth?: boolean;
}

export class HttpService {
  /**
   * Centralized GET Request
   */
  static async get<T>(url: string, params?: Record<string, any>, options?: RequestOptions): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.get(url, {
      params,
      ...options,
    });
    return response.data;
  }

  /**
   * Centralized POST Request
   */
  static async post<T>(url: string, data?: any, options?: RequestOptions): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.post(url, data, options);
    return response.data;
  }

  /**
   * Centralized PUT Request
   */
  static async put<T>(url: string, data?: any, options?: RequestOptions): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.put(url, data, options);
    return response.data;
  }

  /**
   * Centralized PATCH Request
   */
  static async patch<T>(url: string, data?: any, options?: RequestOptions): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.patch(url, data, options);
    return response.data;
  }

  /**
   * Centralized DELETE Request
   */
  static async delete<T>(url: string, options?: RequestOptions): Promise<T> {
    const response: AxiosResponse<T> = await apiClient.delete(url, options);
    return response.data;
  }
}
