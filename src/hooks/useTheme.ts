import { useUIStore } from '../stores/uiStore';

export function useTheme() {
  const { theme, setTheme, toggleTheme } = useUIStore();

  return {
    theme,
    isDark: theme === 'dark',
    setTheme,
    toggleTheme,
  };
}
