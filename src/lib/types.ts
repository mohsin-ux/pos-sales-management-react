import type { InternalAxiosRequestConfig } from 'axios';

export interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export interface ApiError {
  status?: number;
  message: string;
  errors?: Record<string, string[]>;
}

export interface ApiErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// 1. Define the strict Role interface
export interface Role {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// 2. Define the strict User interface
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  roleId: string;
  storeId: string;
  isSuperAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  role: Role;
}

export interface RefreshResponse {
  access_token: string;
  refresh_token: string;
}

export interface LoginResponse extends RefreshResponse {
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}
