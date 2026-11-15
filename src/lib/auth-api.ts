import api from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import { type LoginRequest, type LoginResponse, type RefreshResponse } from '@/lib/types';

export const authApi = {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      payload,
    );
    return data;
  },
  async refresh(refreshToken: string): Promise<RefreshResponse> {
    const { data } = await api.post<RefreshResponse>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refreshToken },
    );
    return data;
  },
};
