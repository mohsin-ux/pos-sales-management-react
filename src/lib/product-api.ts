import api from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import {
  type ApiResponse,
  type CreateProductRequest,
  type Product,
  type UpdateProductRequest,
} from '@/lib/types';

export const productApi = {
  async list(): Promise<Product[]> {
    const { data } = await api.get<ApiResponse<Product[]>>(API_ENDPOINTS.PRODUCTS.LIST);
    return data.data;
  },
  async getById(id: string): Promise<Product> {
    const { data } = await api.get<ApiResponse<Product>>(API_ENDPOINTS.PRODUCTS.DETAIL(id));
    return data.data;
  },
  async create(payload: CreateProductRequest): Promise<Product> {
    const { data } = await api.post<ApiResponse<Product>>(API_ENDPOINTS.PRODUCTS.LIST, payload);
    return data.data;
  },
  async update(id: string, payload: UpdateProductRequest): Promise<Product> {
    const { data } = await api.patch<ApiResponse<Product>>(
      API_ENDPOINTS.PRODUCTS.DETAIL(id),
      payload,
    );
    return data.data;
  },
  async remove(id: string): Promise<void> {
    await api.delete(API_ENDPOINTS.PRODUCTS.DETAIL(id));
  },
};
