import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout, AuthLayout } from './layouts';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { KanbanPage } from './pages/KanbanPage';
import { TicketListPage } from './pages/TicketListPage';
import { CreateTicketPage } from './pages/CreateTicketPage';
import { TicketDetailPage } from './pages/TicketDetailPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';
import { useAuthStore } from './stores/authStore';
import { useUIStore } from './stores/uiStore';
import { useTicketStore } from './stores/ticketStore';
import { useUserStore } from './stores/userStore';
import { seedInitialData } from './data/seedData';
import { ROUTES } from './constants';

function AppInitializer({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const initializeTheme = useUIStore((state) => state.initializeTheme);
  const loadTickets = useTicketStore((state) => state.loadTickets);
  const loadUsers = useUserStore((state) => state.loadUsers);

  useEffect(() => {
    // Seed initial data on first load
    seedInitialData();

    // Initialize stores
    initializeTheme();
    initializeAuth();
    loadTickets();
    loadUsers();
  }, [initializeAuth, initializeTheme, loadTickets, loadUsers]);

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <AppInitializer>
        <Routes>
          {/* Auth routes */}
          <Route element={<AuthLayout />}>
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          </Route>

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
              <Route path={ROUTES.BOARD} element={<KanbanPage />} />
              <Route path={ROUTES.TICKETS} element={<TicketListPage />} />
              <Route path={ROUTES.TICKET_NEW} element={<CreateTicketPage />} />
              <Route path={ROUTES.TICKET_DETAIL} element={<TicketDetailPage />} />
              <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
            </Route>
          </Route>

          {/* Admin routes */}
          <Route element={<ProtectedRoute requireAdmin />}>
            <Route element={<AppLayout />}>
              <Route path={ROUTES.ADMIN} element={<AdminPage />} />
            </Route>
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        </Routes>
      </AppInitializer>
    </BrowserRouter>
  );
}

export default App;
