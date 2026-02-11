import { api } from './client';
import type { User } from '../types';

export interface CreateUserRequest {
  email: string;
  name: string;
  role: 'teamLead' | 'member';
}

export interface CreateUserResponse {
  user: User;
  temporaryPassword: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  avatarUrl?: string | null;
}

export const usersApi = {
  // Get all active users
  getAll: async (): Promise<User[]> => {
    const response = await api.get<{ users: User[] }>('/users');
    return response.users;
  },

  // Get user by ID
  getById: async (id: string): Promise<User> => {
    const response = await api.get<{ user: User }>(`/users/${id}`);
    return response.user;
  },

  // Update user profile (self or admin)
  update: async (id: string, data: UpdateUserRequest): Promise<User> => {
    const response = await api.patch<{ user: User }>(`/users/${id}`, data);
    return response.user;
  },

  // Upload avatar
  uploadAvatar: (formData: FormData) =>
    api.upload<{ avatarUrl: string }>('/images/avatar', formData),
};

// Admin endpoints
export const adminApi = {
  // Get all users (including inactive)
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get<{ users: User[] }>('/admin/users');
    return response.users;
  },

  // Create/invite new user
  createUser: async (data: CreateUserRequest): Promise<CreateUserResponse> => {
    const response = await api.post<CreateUserResponse>('/admin/users', data);
    return response;
  },

  // Change user role
  changeRole: async (id: string, role: 'teamLead' | 'member'): Promise<User> => {
    const response = await api.patch<{ user: User }>(`/admin/users/${id}/role`, { role });
    return response.user;
  },

  // Deactivate user
  deactivateUser: async (id: string): Promise<User> => {
    const response = await api.patch<{ user: User }>(`/admin/users/${id}/deactivate`);
    return response.user;
  },

  // Activate user
  activateUser: async (id: string): Promise<User> => {
    const response = await api.patch<{ user: User }>(`/admin/users/${id}/activate`);
    return response.user;
  },

  // Get audit logs
  getAuditLogs: (params?: { page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    const query = searchParams.toString();
    return api.get<unknown[]>(`/admin/audit-logs${query ? `?${query}` : ''}`);
  },
};
