'use client';
import EnhancedCharts from '@/components/charts/EnhancedCharts';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MetricsServer() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Verificar se estamos no cliente antes de acessar localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      loadMetrics(token);
    }
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
        setError('Metrics error');
      }
    } catch (error) {
      setError('Server error');
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
        <p className="text-gray-500 dark:text-gray-400">No metrics available</p>
      </div>
    );
  }

  // Usar o componente EnhancedCharts que já contém todos os gráficos e KPIs
  return (
    <div className="space-y-8">
      <EnhancedCharts metrics={metrics} />
    </div>
  );
}