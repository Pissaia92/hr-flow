'use client';

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

const COLORS = {
  primary: '#6366f1',    // Indigo
  secondary: '#8b5cf6',  // Violet
  accent: '#ec4899',    // Pink
  success: '#10b981',    // Emerald
  warning: '#f59e0b',   // Amber
  danger: '#ef4444',    // Red
  info: '#0ea5e9'       // Sky
};

// Paleta para gráficos
const CHART_COLORS = [
  COLORS.primary,
  COLORS.secondary, 
  COLORS.accent,
  COLORS.success,
  COLORS.warning,
  COLORS.danger,
  COLORS.info
];

interface EnhancedChartsProps {
  metrics: any;
}

export default function EnhancedChartsMock({ metrics }: EnhancedChartsProps) {
  // Dados para gráficos de prioridade
  const priorityData = metrics ? [
    { name: 'Urgent', value: metrics.byPriority.urgent, color: COLORS.danger },
    { name: 'Important', value: metrics.byPriority.important, color: COLORS.warning },
    { name: 'Normal', value: metrics.byPriority.normal, color: COLORS.success }
  ] : [];

  // Dados para gráficos de status
  const statusData = metrics ? [
    { name: 'Open', value: metrics.byStatus.open, color: COLORS.primary },
    { name: 'In progress', value: metrics.byStatus.in_progress, color: COLORS.warning },
    { name: 'Closed', value: metrics.byStatus.closed, color: COLORS.success }
  ] : [];

  // Dados para evolução temporal (últimos 6 meses)
  const evolutionData = metrics?.evolution || [];

  // Dados para radar chart (distribuição por tipo)
  const typeDistribution = [
    { subject: 'Vacancy', A: 120, B: 110, fullMark: 150 },
    { subject: 'Licenses', A: 98, B: 130, fullMark: 150 },
    { subject: 'Trainings', A: 86, B: 130, fullMark: 150 },
    { subject: 'Benefits', A: 99, B: 100, fullMark: 150 },
    { subject: 'Other', A: 85, B: 90, fullMark: 150 },
  ];

  return (
    <div className="space-y-8">
      {/* Grid de KPIs com gráficos embutidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card com mini gráfico de área */}
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-base font-medium text-gray-200 dark:text-gray-300">Demands total</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-6">{metrics?.total || 0}</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">↗ 12% since lest month</p>
            </div>
            <div className="p-5 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className="mt-0.5 h-4">
         </div>
        </div>

        {/* Card com mini gráfico */}
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-base font-medium text-gray-300 dark:text-2ray-400">Urgent Demands</p>
                      <p className="text-4xl font-bold text-red-600 dark:text-red-400 mt-6">{metrics?.byPriority?.urgent || 0}</p>
                      <p className="text-base text-red-600 dark:text-red-400 mt-1"> High priority</p>
                    </div>
                    <div className="p-5 rounded-full bg-red-100 dark:bg-red-900/30">
                      <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4 h-6 flex items-center justify-center">
                 </div>
                </div>
        
                {/* Card com mini gráfico de barra */}
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-base font-medium text-gray-200 dark:text-gray-300">In progress</p>
                      <p className="text-4xl font-bold text-yellow-600 dark:text-yellow-400 mt-6">{metrics?.byStatus?.in_progress || 0}</p>            
                    </div>
                    <div className="p-5 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                      <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4 h-16">
                  </div>
                </div>
        
                {/* Card com mini gráfico radial */}
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-base font-medium text-gray-200 dark:text-gray-300">Resolution rate</p>
                      <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-6">
                        {metrics?.byStatus?.closed ? Math.round((metrics.byStatus.closed / metrics.total) * 100) : 0}%
                      </p>
                    </div>
                    <div className="p-5 rounded-full bg-green-100 dark:bg-green-900/30">
                      <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4 h-16 flex items-center justify-center">
                  </div>
                </div>
              </div>
        
              {/* Gráficos principais em grid elegante */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Gráfico de Evolução Temporal - Área Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-2xl">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <svg className="w-6 6-5 mr-2 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Monthly demands evolution
                  </h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={evolutionData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.9}/>
                            <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" strokeOpacity={0.2} />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => {
                            const [year, month] = value.split('-');
                            return `${month}/${year.slice(2)}`;
                          }}
                        />
                        <YAxis tick={{ fontSize: 14 }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(155, 155, 155, 0.1)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '12px',
                            border: '1px solid rgba(0,0,0,1)'
                          }}
                          wrapperStyle={{ zIndex: 1000 }}
                          formatter={(value) => [value, 'Demands']}
                          labelFormatter={(label) => `Month: ${label}`}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="count" 
                          stroke={COLORS.primary} 
                          fillOpacity={0.9} 
                          fill="url(#colorCount)" 
                          strokeWidth={3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
        
                {/* Gráfico de Distribuição por Prioridade - Pie Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-2xl">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-300 mb-6 flex items-center">
                    <svg className="w-10 h-5 mr-2 text-red-900 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 20 20">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Priority distribution
                  </h3>
                  <div className="h-80 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={priorityData}
                          cx="58%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {priorityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '12px',
                            border: '1px solid rgba(0,0,0,0.1)'
                          }}
                          formatter={(value, name) => {
                            const entry = priorityData.find(item => item.name === name);
                            return [value, entry?.name || name];
                          }}
                        />
                        <Legend 
                          layout="vertical" 
                          verticalAlign="middle" 
                          align="right"
                          formatter={(value) => {
                            const entry = priorityData.find(item => item.name === value);
                            return entry?.name || value;
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

        {/* Gráfico de Status - Linhas Horizontais */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-2xl lg:col-span-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Demands Status
          </h3>
          <div className="space-y-6">
            {statusData.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <span className="flex items-center">
                    <span 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: item.color }}
                    ></span>
                    {item.name}
                  </span>
                  <span>{item.value}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full transition-all duration-700 ease-out"
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