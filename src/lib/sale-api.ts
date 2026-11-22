import api from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import { type ApiResponse, type CreateSaleRequest } from '@/lib/types';

export const saleApi = {
  async create(payload: CreateSaleRequest): Promise<unknown> {
    const { data } = await api.post<ApiResponse<unknown>>(API_ENDPOINTS.SALES.CREATE, payload);
    return data.data;
  },
};
