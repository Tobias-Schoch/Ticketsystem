import { api } from './client';
import type { User } from '../types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const authApi = {
  login: (data: LoginRequest) => api.post<LoginResponse>('/auth/login', data),

  logout: () => api.post<null>('/auth/logout'),

  refresh: () => api.post<LoginResponse>('/auth/refresh'),

  me: () => api.get<{ user: User }>('/auth/me'),

  changePassword: (data: ChangePasswordRequest) =>
    api.post<null>('/auth/change-password', data),
};
