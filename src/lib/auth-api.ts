import api from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import {
  type ApiResponse,
  type LoginRequest,
  type LoginResponse,
  type RefreshResponse,
} from '@/lib/types';

export const authApi = {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const { data } = await api.post<ApiResponse<LoginResponse>>(API_ENDPOINTS.AUTH.LOGIN, payload);
    console.log('it is the data comes from the backend', data.data);

    return data.data;
  },
  async refresh(refreshToken: string): Promise<RefreshResponse> {
    const { data } = await api.post<ApiResponse<RefreshResponse>>(API_ENDPOINTS.AUTH.REFRESH, {
      refreshToken,
    });
    return data.data;
  },
};
