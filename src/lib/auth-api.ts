import api from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import {
  type ApiResponse,
  type LoginRequest,
  type LoginResponse,
  type RefreshResponse,
  type User,
} from '@/lib/types';

export const authApi = {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const { data } = await api.post<ApiResponse<LoginResponse>>(API_ENDPOINTS.AUTH.LOGIN, payload);
    return data.data;
  },
  async me(): Promise<User> {
    const { data } = await api.get<ApiResponse<User>>(API_ENDPOINTS.AUTH.ME);
    return data.data;
  },
  async logout(): Promise<void> {
    await api.post(API_ENDPOINTS.AUTH.LOGOUT);
  },
  async refresh(refreshToken: string): Promise<RefreshResponse> {
    const { data } = await api.post<ApiResponse<RefreshResponse>>(API_ENDPOINTS.AUTH.REFRESH, {
      refreshToken,
    });
    return data.data;
  },
};
