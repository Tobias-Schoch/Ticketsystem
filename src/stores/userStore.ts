import { create } from 'zustand';
import type { User } from '../types';
import { usersApi, adminApi, ApiError } from '../api';

interface UserState {
  users: User[];
  isLoading: boolean;
  error: string | null;

  loadUsers: () => Promise<void>;
  getUserById: (id: string) => User | undefined;
  createUser: (
    email: string,
    name: string,
    role: 'teamLead' | 'member'
  ) => Promise<{ user: User; password: string } | { error: string }>;
  updateUser: (id: string, updates: Partial<User>) => Promise<void>;
  deactivateUser: (id: string) => Promise<void>;
  activateUser: (id: string) => Promise<void>;
  refreshUsers: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  isLoading: true,
  error: null,

  loadUsers: async () => {
    try {
      set({ isLoading: true, error: null });
      const users = await usersApi.getAll();
      set({ users, isLoading: false });
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Fehler beim Laden der Benutzer';
      set({ error: message, isLoading: false });
    }
  },

  getUserById: (id) => {
    return get().users.find((user) => user.id === id);
  },

  createUser: async (email, name, role) => {
    try {
      const response = await adminApi.createUser({ email, name, role });
      // Add new user to state
      set((state) => ({
        users: [...state.users, response.user],
      }));
      return { user: response.user, password: response.temporaryPassword };
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Fehler beim Erstellen des Benutzers';
      return { error: message };
    }
  },

  updateUser: async (id, updates) => {
    try {
      const updatedUser = await usersApi.update(id, updates);
      set((state) => ({
        users: state.users.map((user) => (user.id === id ? updatedUser : user)),
      }));
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Fehler beim Aktualisieren des Benutzers';
      throw new Error(message);
    }
  },

  deactivateUser: async (id) => {
    try {
      const updatedUser = await adminApi.deactivateUser(id);
      set((state) => ({
        users: state.users.map((user) => (user.id === id ? updatedUser : user)),
      }));
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Fehler beim Deaktivieren des Benutzers';
      throw new Error(message);
    }
  },

  activateUser: async (id) => {
    try {
      const updatedUser = await adminApi.activateUser(id);
      set((state) => ({
        users: state.users.map((user) => (user.id === id ? updatedUser : user)),
      }));
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Fehler beim Aktivieren des Benutzers';
      throw new Error(message);
    }
  },

  refreshUsers: async () => {
    await get().loadUsers();
  },
}));
