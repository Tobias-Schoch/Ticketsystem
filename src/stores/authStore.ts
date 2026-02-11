import { create } from 'zustand';
import type { User } from '../types';
import { authApi, usersApi, ApiError } from '../api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (updates: { name?: string; email?: string; avatarUrl?: string | null }) => Promise<void>;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      set({ user: response.user, isAuthenticated: true });
      return { success: true };
    } catch (error) {
      if (error instanceof ApiError) {
        return { success: false, error: error.message };
      }
      return { success: false, error: 'Ein unerwarteter Fehler ist aufgetreten' };
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore logout errors - clear state anyway
    }
    set({ user: null, isAuthenticated: false });
  },

  updateUser: async (updates: { name?: string; email?: string; avatarUrl?: string | null }) => {
    const currentUser = get().user;
    if (!currentUser) throw new Error('No user logged in');

    try {
      // Call API to save changes to backend
      const updatedUser = await usersApi.update(currentUser.id, updates);
      // Update local state with response from backend
      set({ user: updatedUser });
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      throw new Error('Fehler beim Aktualisieren des Profils');
    }
  },

  initializeAuth: async () => {
    try {
      // Try to get current user from session (cookies)
      const response = await authApi.me();
      set({ user: response.user, isAuthenticated: true, isLoading: false });
    } catch {
      // Not authenticated or session expired
      try {
        // Try to refresh the token
        const response = await authApi.refresh();
        set({ user: response.user, isAuthenticated: true, isLoading: false });
      } catch {
        // Refresh also failed - user needs to login
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    }
  },
}));
