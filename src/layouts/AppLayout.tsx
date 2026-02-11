import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { ToastContainer } from '../components/feedback/ToastContainer';

export function AppLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar - Desktop */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile nav */}
      <MobileNav />

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
}
