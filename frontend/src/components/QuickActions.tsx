'use client';

import Link from 'next/link';

interface QuickActionsProps {
  userRole: string;
}

export default function QuickActions({ userRole }: QuickActionsProps) {
  const actions = [
    {
      href: '/demands',
      icon: (
        <svg className="h-6 w-6 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      title: 'Ver Demandas',
      description: 'Gerenciar todas as demandas'
    },
    {
      href: '/demands/new',
      icon: (
        <svg className="h-6 w-6 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      title: 'Nova Demanda',
      description: 'Criar nova solicitação'
    }
  ];

  // Adicionar ação de relatórios para usuários do RH
  if (userRole === 'hr') {
    actions.push({
      href: '#',
      icon: (
        <svg className="h-6 w-6 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Relatórios',
      description: 'Ver relatórios completos'
    });
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 transition-all duration-300">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Ações Rápidas</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className="relative rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-750 px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 dark:hover:border-gray-500 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 dark:focus-within:ring-offset-gray-800 transition-all duration-200"
          >
            <div className="flex-shrink-0">
              {action.icon}
            </div>
            <div className="flex-1 min-w-0">
              <span className="absolute inset-0" aria-hidden="true"></span>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{action.title}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}