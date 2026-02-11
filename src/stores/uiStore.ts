import { create } from 'zustand';
import { STORAGE_KEYS } from '../constants';
import { getStorageItem, setStorageItem } from '../utils/storage';

type Theme = 'light' | 'dark';

interface UIState {
  theme: Theme;
  sidebarOpen: boolean;
  mobileNavOpen: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
  setMobileNavOpen: (open: boolean) => void;
  initializeUI: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  theme: 'light',
  sidebarOpen: true,
  mobileNavOpen: false,

  setTheme: (theme: Theme) => {
    setStorageItem(STORAGE_KEYS.THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ theme });
  },

  toggleTheme: () => {
    const newTheme = get().theme === 'light' ? 'dark' : 'light';
    get().setTheme(newTheme);
  },

  setSidebarOpen: (open: boolean) => {
    setStorageItem(STORAGE_KEYS.SIDEBAR, open);
    set({ sidebarOpen: open });
  },

  setMobileNavOpen: (open: boolean) => {
    set({ mobileNavOpen: open });
  },

  initializeUI: () => {
    // Initialize theme
    const savedTheme = getStorageItem<Theme>(STORAGE_KEYS.THEME);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Initialize sidebar
    const savedSidebar = getStorageItem<boolean>(STORAGE_KEYS.SIDEBAR);
    const sidebarOpen = savedSidebar !== null ? savedSidebar : true;

    set({ theme, sidebarOpen });
  },
}));
