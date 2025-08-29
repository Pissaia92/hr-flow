'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                    HRFlow
                  </h1>
                </div>
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
                  Olá, {user?.name}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-500 dark:bg-indigo-900/30 dark:text-indigo-100">
                  {user?.role === 'hr' ? 'RH' : 'Funcionário'}
                </span>
                <Link
                  href="/profile"
                  className="ml-4 inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-colors duration-200"
                >
                  Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-all duration-200"
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
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Aqui está uma visão geral das atividades mais recentes
            </p>
          </div>
          
          {/* Métricas em Tempo Real */}
          <MetricsServer />
          
          {/* Ações Rápidas */}
          <div className="mt-12 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Ações Rápidas
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
               <Link
                href={user?.role === 'hr' ? '/demands?status=open' : '/demands'}
                className="relative rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 px-6 py-5 shadow-sm flex items-center space-x-4 hover:border-indigo-300 dark:hover:border-indigo-500 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-400 dark:focus-within:ring-offset-gray-800 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                    <svg className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="absolute inset-0" aria-hidden="true"></span>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Ver Demandas</p>
                  <p className="text-sm text-gray-300 dark:text-gray-300 truncate">
                    {user?.role === 'hr' ? 'Gerenciar demandas abertas' : 'Gerenciar minhas demandas'}
                  </p>
                </div>
              </Link>
              <Link
                href="/demands/new"
                className="relative rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 px-6 py-5 shadow-sm flex items-center space-x-4 hover:border-green-300 dark:hover:border-green-500 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500 dark:focus-within:ring-offset-gray-800 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/30">
                    <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="absolute inset-0" aria-hidden="true"></span>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Nova Demanda</p>
                  <p className="text-sm text-gray-300 dark:text-gray-300 truncate">Criar nova solicitação</p>
                </div>
              </Link>
              {user?.role === 'hr' && (
                <Link
                  href="/reports"
                  className="relative rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 px-6 py-5 shadow-sm flex items-center space-x-4 hover:border-purple-300 dark:hover:border-purple-500 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500 dark:focus-within:ring-offset-gray-800 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                      <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="absolute inset-0" aria-hidden="true"></span>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Relatórios</p>
                    <p className="text-sm text-gray-300 dark:text-gray-300 truncate">Ver demandas resolvidas</p>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}