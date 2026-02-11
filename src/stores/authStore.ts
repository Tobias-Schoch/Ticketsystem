import { create } from 'zustand';
import type { User } from '../types';
import { STORAGE_KEYS } from '../constants';
import { getStorageItem, setStorageItem, removeStorageItem } from '../utils/storage';
import { verifyPassword } from '../utils/passwordGenerator';
import type { UserWithPassword } from '../data/mockUsers';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email: string, password: string) => {
    const users = getStorageItem<UserWithPassword[]>(STORAGE_KEYS.USERS) || [];
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return false;
    }

    if (!verifyPassword(password, user.passwordHash)) {
      return false;
    }

    if (!user.isActive) {
      return false;
    }

    // Create user object without password
    const { passwordHash: _, ...userWithoutPassword } = user;

    setStorageItem(STORAGE_KEYS.AUTH, userWithoutPassword);
    set({ user: userWithoutPassword, isAuthenticated: true });

    return true;
  },

  logout: () => {
    removeStorageItem(STORAGE_KEYS.AUTH);
    set({ user: null, isAuthenticated: false });
  },

  updateUser: (updates: Partial<User>) => {
    const currentUser = get().user;
    if (!currentUser) return;

    const updatedUser = { ...currentUser, ...updates };
    setStorageItem(STORAGE_KEYS.AUTH, updatedUser);

    // Also update in users list
    const users = getStorageItem<UserWithPassword[]>(STORAGE_KEYS.USERS) || [];
    const userIndex = users.findIndex((u) => u.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      setStorageItem(STORAGE_KEYS.USERS, users);
    }

    set({ user: updatedUser });
  },

  initializeAuth: () => {
    const savedUser = getStorageItem<User>(STORAGE_KEYS.AUTH);
    if (savedUser) {
      // Verify user still exists and is active
      const users = getStorageItem<UserWithPassword[]>(STORAGE_KEYS.USERS) || [];
      const user = users.find((u) => u.id === savedUser.id && u.isActive);

      if (user) {
        set({ user: savedUser, isAuthenticated: true, isLoading: false });
      } else {
        removeStorageItem(STORAGE_KEYS.AUTH);
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } else {
      set({ isLoading: false });
    }
  },
}));
