import { useAuthStore } from '../stores/authStore';

export function useAuth() {
  const { user, isAuthenticated, isLoading, login, logout, updateUser } = useAuthStore();

  const isAdmin = user?.role === 'admin';

  return {
    user,
    isAuthenticated,
    isLoading,
    isAdmin,
    login,
    logout,
    updateUser,
  };
}
