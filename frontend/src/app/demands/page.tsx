'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DemandsTable from '@/components/demands/DemandsTable';

export default function DemandsPage() {
  const [demands, setDemands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get('status');

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
        loadDemands(token);
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
  }, [router, statusFilter]);

  const loadDemands = async (token: string) => {
    try {
      setLoading(true);
      
      let endpoint;
      if (user?.role === 'hr') {
        // Para usuários RH, verificar se é para mostrar apenas abertas ou todas
        if (statusFilter === 'open') {
          endpoint = 'http://localhost:3000/demands/open';  // Endpoint para demandas abertas de todos os usuários
        } else {
          endpoint = 'http://localhost:3000/demands';  // Todas as demandas
        }
      } else {
        // Para funcionários, mostrar apenas as próprias demandas
        endpoint = 'http://localhost:3000/demands/me';
      }
      
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setDemands(data.demands || data);
      }
    } catch (error) {
      console.error('Erro ao carregar demandas:', error);
    } finally {
      setLoading(false);
    }
  };

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
                  className="border-indigo-500 text-gray-900 dark:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
                >
                  Demands
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
                <a
                  href="/profile"
                  className="ml-4 inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-all duration-200"
                >
                  Profile
                </a>
                <button
                  onClick={handleLogout}
                  className="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-all duration-200"
                >
                  Exit
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {user?.role === 'hr' 
                  ? (statusFilter === 'open' ? 'Open Demands' : 'All Demands') 
                  : 'My Demands'}
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {user?.role === 'hr' 
                  ? (statusFilter === 'open' ? 'Unsolved demands from all users' : 'All demands from all users') 
                  : 'Manage all your HR requests'}
              </p>
            </div>
            <button
              onClick={() => router.push('/demands/new')}
              className="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-all duration-200 transform hover:scale-105"
            >
              <svg className="-ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              New Demand
            </button>
          </div>
          {/* Tabela de Demandas */}
          <DemandsTable demands={demands} />
        </div>
      </main>
    </div>
  );
}