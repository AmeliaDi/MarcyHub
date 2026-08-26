'use client';

import * as React from 'react';
import { Sidebar, TopBar } from '@/components/layout';
import { useAppStore } from '@/stores/app-store';
import { DashboardView } from '@/components/dashboard/dashboard-view';
import { HorarioView } from '@/app/horario/horario-view';
import { TareasView } from '@/app/tareas/tareas-view';
import { RecursosView } from '@/app/recursos/recursos-view';
import { AdminView } from '@/app/admin/admin-view';
import { LoginView } from '@/app/login/login-view';

type Page = 'dashboard' | 'horario' | 'tareas' | 'recursos' | 'admin' | 'login';

const pageTitles: Record<Page, string> = {
  dashboard: 'Dashboard',
  horario: 'Horario',
  tareas: 'Tareas',
  recursos: 'Recursos',
  admin: 'Panel de Administración',
  login: 'Iniciar Sesión'
};

export default function Home() {
  const [currentPage, setCurrentPage] = React.useState<Page>('login');
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [isDark, setIsDark] = React.useState(false);
  
  const { isAuthenticated, user } = useAppStore();

  // Manejar autenticación
  React.useEffect(() => {
    if (isAuthenticated && currentPage === 'login') {
      setCurrentPage('dashboard');
    } else if (!isAuthenticated && currentPage !== 'login') {
      setCurrentPage('login');
    }
  }, [isAuthenticated, currentPage]);

  // Toggle tema oscuro
  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  const toggleTheme = () => setIsDark(!isDark);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginView />;
      case 'dashboard':
        return <DashboardView />;
      case 'horario':
        return <HorarioView />;
      case 'tareas':
        return <TareasView />;
      case 'recursos':
        return <RecursosView />;
      case 'admin':
        return <AdminView />;
      default:
        return <DashboardView />;
    }
  };

  // Mostrar solo login si no está autenticado
  if (!isAuthenticated && currentPage !== 'login') {
    return null;
  }

  if (currentPage === 'login') {
    return <LoginView />;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          pageTitle={pageTitles[currentPage]}
          user={user}
          onMenuClick={() => setSidebarOpen(true)}
          isDark={isDark}
          onToggleTheme={toggleTheme}
        />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 scroll-smooth">
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  );
}
