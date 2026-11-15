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

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export type RefreshResponse = AuthTokens;

export type LoginResponse = AuthTokens;

export interface LoginRequest {
  email: string;
  password: string;
}
