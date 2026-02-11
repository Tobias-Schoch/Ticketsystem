import { create } from 'zustand';
import type { User } from '../types';
import type { UserWithPassword } from '../data/mockUsers';
import { STORAGE_KEYS } from '../constants';
import { getStorageItem, setStorageItem } from '../utils/storage';
import { generateId, getNow } from '../utils/dateUtils';
import { hashPassword, generatePassword } from '../utils/passwordGenerator';

interface UserState {
  users: User[];
  isLoading: boolean;

  loadUsers: () => void;
  getUserById: (id: string) => User | undefined;
  createUser: (email: string, name: string, role: 'admin' | 'member') => { user: User; password: string };
  updateUser: (id: string, updates: Partial<User>) => void;
  deactivateUser: (id: string) => void;
  activateUser: (id: string) => void;
  changePassword: (userId: string, newPassword: string) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  isLoading: true,

  loadUsers: () => {
    const savedUsers = getStorageItem<UserWithPassword[]>(STORAGE_KEYS.USERS) || [];
    // Strip password hashes for the user list
    const usersWithoutPasswords: User[] = savedUsers.map(({ passwordHash: _, ...user }) => user);
    set({ users: usersWithoutPasswords, isLoading: false });
  },

  getUserById: (id) => {
    return get().users.find((user) => user.id === id);
  },

  createUser: (email, name, role) => {
    const password = generatePassword(12);
    const passwordHash = hashPassword(password);

    const newUserWithPassword: UserWithPassword = {
      id: generateId(),
      email,
      name,
      avatarUrl: null,
      role,
      isActive: true,
      createdAt: getNow(),
      passwordHash,
    };

    const { passwordHash: _, ...newUser } = newUserWithPassword;

    // Update storage with password
    const savedUsers = getStorageItem<UserWithPassword[]>(STORAGE_KEYS.USERS) || [];
    setStorageItem(STORAGE_KEYS.USERS, [...savedUsers, newUserWithPassword]);

    // Update state without password
    set((state) => ({
      users: [...state.users, newUser],
    }));

    return { user: newUser, password };
  },

  updateUser: (id, updates) => {
    // Update users list in storage (with passwords)
    const savedUsers = getStorageItem<UserWithPassword[]>(STORAGE_KEYS.USERS) || [];
    const updatedSavedUsers = savedUsers.map((user) =>
      user.id === id ? { ...user, ...updates } : user
    );
    setStorageItem(STORAGE_KEYS.USERS, updatedSavedUsers);

    // Update state (without passwords)
    set((state) => ({
      users: state.users.map((user) =>
        user.id === id ? { ...user, ...updates } : user
      ),
    }));
  },

  deactivateUser: (id) => {
    get().updateUser(id, { isActive: false });
  },

  activateUser: (id) => {
    get().updateUser(id, { isActive: true });
  },

  changePassword: (userId, newPassword) => {
    const savedUsers = getStorageItem<UserWithPassword[]>(STORAGE_KEYS.USERS) || [];
    const updatedUsers = savedUsers.map((user) =>
      user.id === userId
        ? { ...user, passwordHash: hashPassword(newPassword) }
        : user
    );
    setStorageItem(STORAGE_KEYS.USERS, updatedUsers);
  },
}));
