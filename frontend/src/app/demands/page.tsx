'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DemandsTable from '@/components/DemandsTable';
import AdvancedSearch from '@/components/AdvancedSearch';
import ExportButton from '@/components/ExportButton';

export default function DemandsPage() {
  const [demands, setDemands] = useState<any[]>([]);
  const [allDemands, setAllDemands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
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
        loadDemands(token);
      } else {
        localStorage.removeItem('token');
        router.push('/login');
      }
    })
    .catch(() => {
      localStorage.removeItem('token');
      router.push('/login');
    });
  }, [router]);

  const loadDemands = async (token: string) => {
    try {
      setLoading(true);
      const endpoint = user?.role === 'hr' 
        ? 'http://localhost:3000/demands' 
        : 'http://localhost:3000/demands/me';
      
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setAllDemands(data.demands || data);
        setDemands(data.demands || data);
      }
    } catch (error) {
      console.error('Erro ao carregar demandas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (filters: any) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Construir query string
      const queryParams = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          if (Array.isArray(filters[key])) {
            filters[key].forEach((value: string) => {
              queryParams.append(key, value);
            });
          } else {
            queryParams.append(key, filters[key]);
          }
        }
      });

      const response = await fetch(`http://localhost:3000/demands/search?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDemands(data.demands);
      }
    } catch (error) {
      console.error('Erro na busca:', error);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/demands/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta demanda?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`http://localhost:3000/demands/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Recarregar demandas após exclusão
        loadDemands(token);
      } else {
        alert('Erro ao excluir demanda');
      }
    } catch (error) {
      console.error('Erro ao excluir demanda:', error);
      alert('Erro ao excluir demanda');
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
                <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">HRFlow</h1>
              </div>
              <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
                <a 
                  href="/dashboard" 
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200"
                >
                  Dashboard
                </a>
                <a 
                  href="/demands" 
                  className="border-indigo-500 text-gray-900 dark:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
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
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Minhas Demandas</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Gerencie todas as suas solicitações de RH
              </p>
            </div>
            <div className="flex space-x-3">
              <ExportButton 
                data={demands} 
                filename="demandas-hrflow" 
                title="Relatório de Demandas HRFlow" 
              />
              <button
                onClick={() => router.push('/demands/new')}
                className="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-all duration-200 transform hover:scale-105"
              >
                <svg className="-ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Nova Demanda
              </button>
            </div>
          </div>

          {/* Componente de Busca Avançada */}
          <AdvancedSearch onSearch={handleSearch} />

          {/* Tabela de Demandas Avançada */}
          <DemandsTable 
            demands={demands} 
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </main>
    </div>
  );
}