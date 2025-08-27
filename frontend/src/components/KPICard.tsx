'use client';

import React from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass: string;
}

export default function KPICard({ title, value, icon, colorClass }: KPICardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl rounded-2xl transition-all duration-300 hover:shadow-2xl">
      <div className="px-6 py-8">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`flex items-center justify-center h-12 w-12 rounded-lg ${colorClass}`}>
              {icon}
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</dt>
              <dd className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}