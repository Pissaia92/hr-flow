'use client';

import React from 'react';
import PriorityChart from '@/components/charts/PriorityChart';
import StatusChart from '@/components/charts/StatusChart';
import EvolutionChart from '@/components/charts/EvolutionChart';

interface ChartSectionProps {
  metrics: any;
}

export default function ChartSection({ metrics }: ChartSectionProps) {
  const priorityData = [
    { name: 'urgent', value: metrics.byPriority.urgent },
    { name: 'important', value: metrics.byPriority.important },
    { name: 'normal', value: metrics.byPriority.normal },
  ];

  const statusData = [
    { name: 'open', value: metrics.byStatus.open },
    { name: 'in_progress', value: metrics.byStatus.in_progress },
    { name: 'closed', value: metrics.byStatus.closed },
  ];

  return (
    <>
      {/* Gráficos de Prioridade e Status */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mb-8">
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 transition-all duration-300">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Priority Demands</h2>
          <PriorityChart data={priorityData} />
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 transition-all duration-300">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Status Demands</h2>
          <StatusChart data={statusData} />
        </div>
      </div>
      
      {/* Gráfico de Evolução */}
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 mb-8 transition-all duration-300">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Monthly Evolution</h2>
        <EvolutionChart data={metrics.evolution} />
      </div>
    </>
  );
}