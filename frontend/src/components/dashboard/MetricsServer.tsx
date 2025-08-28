// Server Component - executa no servidor, zero JS no client
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Função para verificar token JWT
async function verifyToken(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'hrflow_jwt_secret_key_2024');
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}

// Função para buscar métricas do backend
async function fetchMetrics(token: string) {
  try {
    // Buscar métricas de demandas
    const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:3000'}/metrics/demands`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store' // Sempre buscar dados frescos
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch metrics');
    }
    
    const data = await response.json();
    return data.metrics;
  } catch (error) {
    console.error('Erro ao buscar métricas:', error);
    return null;
  }
}

// Cores para os gráficos
const COLORS = ['#ef4444', '#f59e0b', '#10b981'];
const STATUS_COLORS = ['#3b82f6', '#f59e0b', '#10b981'];

// Server Component principal
export default async function MetricsServer() {
  const token = cookies().get('token')?.value;
  
  if (!token) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        <p className="text-gray-500 dark:text-gray-400">Não autorizado</p>
      </div>
    );
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        <p className="text-gray-500 dark:text-gray-400">Token inválido</p>
      </div>
    );
  }

  const metrics = await fetchMetrics(token);
  
  if (!metrics) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        <p className="text-gray-500 dark:text-gray-400">Erro ao carregar métricas</p>
      </div>
    );
  }

  // Preparar dados para gráficos
  const priorityData = [
    { name: 'Urgente', value: metrics.byPriority.urgent },
    { name: 'Importante', value: metrics.byPriority.important },
    { name: 'Normal', value: metrics.byPriority.normal },
  ];

  const statusData = [
    { name: 'Abertas', value: metrics.byStatus.open },
    { name: 'Em Progresso', value: metrics.byStatus.in_progress },
    { name: 'Fechadas', value: metrics.byStatus.closed },
  ];

  return (
    <div className="space-y-8">
      {/* KPIs Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-2xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total de Demandas</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{metrics.total}</p>
            </div>
            <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-2xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Demandas Urgentes</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">{metrics.byPriority.urgent}</p>
            </div>
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-2xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Em Progresso</p>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">{metrics.byStatus.in_progress}</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
              <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-2xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Fechadas</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{metrics.byStatus.closed}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de Prioridades */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Demandas por Prioridade</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [value, 'Demandas']}
                  labelFormatter={(name) => {
                    const labels: any = {
                      'urgent': 'Urgente',
                      'important': 'Importante',
                      'normal': 'Normal'
                    };
                    return labels[name] || name;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Status */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Demandas por Status</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={statusData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value) => [value, 'Demandas']}
                />
                <Bar 
                  dataKey="value" 
                  fill="#8884d8"
                  radius={[4, 4, 0, 0]}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}