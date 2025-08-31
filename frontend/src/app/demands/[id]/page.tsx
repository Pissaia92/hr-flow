'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function DemandDetailPage() {
  const [demand, setDemand] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    loadDemand(token);
  }, [params.id, router]);

  const loadDemand = async (token: string) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`http://localhost:3000/demands/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setDemand(data.demand);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erro ao carregar demanda');
      }
    } catch (error) {
      setError('Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/demands');
  };

  const handleEdit = () => {
    router.push(`/demands/${params.id}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir esta demanda?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`http://localhost:3000/demands/${params.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        router.push('/demands');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Erro ao excluir demanda');
      }
    } catch (error) {
      alert('Erro de conexão com o servidor');
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
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
                    className="text-gray-200 dark:text-gray-200 hover:text-gray-700 dark:hover:text-gray-50 inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200"
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
                <button
                  onClick={handleLogout}
                  className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-colors duration-200"
                >
                  Exit
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto py-8 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Erro</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {error}
                </p>
                <div className="mt-6">
                  <button
                    onClick={handleBack}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                  >
                    return to Demands
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const getPriorityBadge = (priority: string) => {
    const priorityMap: any = {
      'urgent': { text: 'Urgente', class: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200' },
      'important': { text: 'Importante', class: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200' },
      'normal': { text: 'Normal', class: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' }
    };
    
    const config = priorityMap[priority] || { text: priority, class: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' };
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.class}`}>
        {config.text}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusMap: any = {
      'open': { text: 'Aberta', class: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200' },
      'in_progress': { text: 'Em Progresso', class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200' },
      'closed': { text: 'Fechada', class: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' }
    };
    
    const config = statusMap[status] || { text: status, class: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' };
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.class}`}>
        {config.text}
      </span>
    );
  };

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
                  Demands
                </a>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-colors duration-200"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Conteúdo Principal */}
      <main className="max-w-3xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Demand's details</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Complete information about the selected demand
              </p>
            </div>
            <button
              onClick={handleBack}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-colors duration-200"
            >
              Back
            </button>
          </div>

          {/* Detalhes da Demanda */}
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
            <div className="px-6 py-6 sm:px-8 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{demand?.type}</h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Created in {demand?.created_at ? new Date(demand.created_at).toLocaleDateString('pt-BR') : 'Data não disponível'}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleEdit}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-colors duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800 transition-colors duration-200"
                  >
                    Exclude
                  </button>
                </div>
              </div>
            </div>

            <div className="px-6 py-8 sm:p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-950 dark:text-gray-50 mb-2">Description</h3>
                  <div className="bg-gray-300 dark:bg-gray-750 rounded-lg p-4">
                    <p className="text-gray-300 dark:text-gray-700 whitespace-pre-wrap">{demand?.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Prioridade</h3>
                    <div className="bg-gray-700 dark:bg-gray-750 rounded-lg p-4">
                      {getPriorityBadge(demand?.priority)}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Status</h3>
                    <div className="bg-gray-700 dark:bg-gray-750 rounded-lg p-4">
                      {getStatusBadge(demand?.status)}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Informações Adicionais</h3>
                  <div className="bg-gray-300 dark:bg-gray-700 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-base font-bold text-gray-900 dark:text-gray-200">ID da Demanda</p>
                        <p className="text-extralight text-gray-900 dark:text-white">{demand?.id}</p>
                      </div>
                      <div>
                        <p className="text-base font-bold text-gray-900 dark:text-gray-200">ID do Usuário</p>
                        <p className="text-extralight text-gray-900 dark:text-white">{demand?.user_id}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}