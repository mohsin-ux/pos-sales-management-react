import axios, { type AxiosError } from 'axios';

import { API_ENDPOINTS, ROUTES, STORAGE_KEYS } from '@/lib/constants';
import {
  type ApiErrorResponse,
  type RefreshResponse,
  type RetryConfig,
} from '@/lib/types';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30_000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const original = error.config as RetryConfig | undefined;
    const status = error.response?.status;
    const url = original?.url ?? '';
    const isAuthEndpoint =
      url.includes(API_ENDPOINTS.AUTH.LOGIN) ||
      url.includes(API_ENDPOINTS.AUTH.REFRESH);

    if (status !== 401 || !original || original._retry || isAuthEndpoint) {
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      const res = await axios.post<RefreshResponse>(
        API_ENDPOINTS.AUTH.REFRESH,
        {
          refreshToken,
        },
        {
          baseURL: api.defaults.baseURL,
        },
      );

      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, res.data.accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, res.data.refreshToken);

      original.headers.Authorization = `Bearer ${res.data.accessToken}`;
      return api(original);
    } catch {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      if (window.location.pathname !== ROUTES.LOGIN) {
        window.location.href = ROUTES.LOGIN;
      }
      return Promise.reject(error);
    }
  },
);

export function getApiErrorMessage(
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    if (data?.message) {
      return data.message;
    }
    const firstFieldError = Object.values(data?.errors ?? {})[0]?.[0];
    if (firstFieldError) {
      return firstFieldError;
    }
  }
  return fallback;
}

export default api;
