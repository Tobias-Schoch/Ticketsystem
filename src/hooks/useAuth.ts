import { useAuthStore } from '../stores/authStore';

export function useAuth() {
  const { user, isAuthenticated, isLoading, login, logout, updateUser } = useAuthStore();

  const isAdmin = user?.role === 'teamLead' || user?.role === 'administrator';

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
