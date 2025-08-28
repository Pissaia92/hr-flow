'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MetricsServer from '@/components/dashboard/MetricsServer';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Verificar perfil do usuário
    fetch('http://localhost:3000/auth/profile', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    .then(response => response.json())
    .then(data => {
      if (data.user) {
        setUser(data.user);
      } else {
        localStorage.removeItem('token');
        router.push('/login');
      }
      setLoading(false);
    })
    .catch(() => {
      localStorage.removeItem('token');
      router.push('/login');
      setLoading(false);
    });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Cabeçalho */}
      <nav className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">HRFlow</h1>
              </div>
              <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
                <a 
                  href="/dashboard" 
                  className="border-indigo-500 text-gray-900 dark:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
                >
                  Dashboard
                </a>
                <a 
                  href="/demands" 
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200"
                >
                  Demandas
                </a>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user?.name}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200">
                  {user?.role === 'hr' ? 'RH' : 'Funcionário'}
                </span>
                <button
                  onClick={handleLogout}
                  className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-colors duration-200"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Bem-vindo de volta, <span className="text-indigo-600 dark:text-indigo-400">{user?.name}</span>
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Aqui está uma visão geral das suas atividades mais recentes
            </p>
          </div>

          {/* Métricas Server Component - dados carregados no servidor */}
          <MetricsServer />
        </div>
      </main>
    </div>
  );
}