'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MetricsServer() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    loadMetrics(token);
  }, [router]);

  const loadMetrics = async (token: string) => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('http://localhost:3000/metrics/demands', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        cache: 'no-store'
      });

      if (response.ok) {
        const data = await response.json();
        setMetrics(data.metrics);
      } else {
        setError('Erro ao carregar métricas');
      }
    } catch (error) {
      setError('Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        <p className="text-red-500 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        <p className="text-gray-500 dark:text-gray-400">Nenhuma métrica disponível</p>
      </div>
    );
  }

  // Dados para os cards KPI
  const kpiData = [
    {
      title: 'Total de Demandas',
      value: metrics.total,
      icon: (
        <svg className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'bg-indigo-100 dark:bg-indigo-900/30'
    },
    {
      title: 'Demandas Urgentes',
      value: metrics.byPriority.urgent,
      icon: (
        <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      color: 'bg-red-100 dark:bg-red-900/30'
    },
    {
      title: 'Em Progresso',
      value: metrics.byStatus.in_progress,
      icon: (
        <svg className="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-yellow-100 dark:bg-yellow-900/30'
    },
    {
      title: 'Fechadas',
      value: metrics.byStatus.closed,
      icon: (
        <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-green-100 dark:bg-green-900/30'
    }
  ];

  // Dados para gráficos simples com CSS
  const priorityData = [
    { name: 'Urgente', value: metrics.byPriority.urgent, color: '#ef4444' },
    { name: 'Importante', value: metrics.byPriority.important, color: '#f59e0b' },
    { name: 'Normal', value: metrics.byPriority.normal, color: '#10b981' },
  ];

  const statusData = [
    { name: 'Abertas', value: metrics.byStatus.open, color: '#3b82f6' },
    { name: 'Em Progresso', value: metrics.byStatus.in_progress, color: '#f59e0b' },
    { name: 'Fechadas', value: metrics.byStatus.closed, color: '#10b981' },
  ];

  return (
    <div className="space-y-8">
      {/* KPIs Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <div 
            key={index} 
            className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-2xl"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{kpi.title}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{kpi.value}</p>
              </div>
              <div className={`p-3 rounded-full ${kpi.color}`}>
                {kpi.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficos Simples com CSS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de Prioridades - Barras Simples */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Demandas por Prioridade</h3>
          <div className="space-y-4">
            {priorityData.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span>{item.name}</span>
                  <span>{item.value}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                  <div 
                    className="h-4 rounded-full" 
                    style={{ 
                      width: `${(item.value / metrics.total) * 100}%`,
                      backgroundColor: item.color
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gráfico de Status - Barras Simples */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Demandas por Status</h3>
          <div className="space-y-4">
            {statusData.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span>{item.name}</span>
                  <span>{item.value}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                  <div 
                    className="h-4 rounded-full" 
                    style={{ 
                      width: `${(item.value / metrics.total) * 100}%`,
                      backgroundColor: item.color
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}