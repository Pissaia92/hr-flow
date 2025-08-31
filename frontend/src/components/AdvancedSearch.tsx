'use client';

import { useState } from 'react';

interface SearchFilters {
  search?: string;
  priority?: string[];
  status?: string[];
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  initialFilters?: SearchFilters;
}

export default function AdvancedSearch({ onSearch, initialFilters }: AdvancedSearchProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>(initialFilters || {});

  const handleInputChange = (field: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: 'priority' | 'status', value: string) => {
    setFilters(prev => {
      const currentArray = prev[field] || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return { ...prev, [field]: newArray };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({});
    onSearch({});
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
      <form onSubmit={handleSubmit}>
        {/* Busca por texto */}
        <div className="mb-4">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Search (type, description)
          </label>
          <input
            type="text"
            id="search"
            value={filters.search || ''}
            onChange={(e) => handleInputChange('search', e.target.value)}
            placeholder="Digite palavras-chave..."
            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm py-2 px-3 transition-colors duration-200"
          />
        </div>

        {/* Botão para mostrar/ocultar filtros avançados */}
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-4"
        >
          {showFilters ? 'Hide advanced filters' : 'Show advanced filters'}
        </button>

        {/* Filtros avançados */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Prioridade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <div className="space-y-2">
                {['urgent', 'important', 'normal'].map(priority => (
                  <div key={priority} className="flex items-center">
                    <input
                      id={`priority-${priority}`}
                      type="checkbox"
                      checked={(filters.priority || []).includes(priority)}
                      onChange={() => handleArrayChange('priority', priority)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`priority-${priority}`} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      {priority === 'urgent' ? 'Urgente' : priority === 'important' ? 'Importante' : 'Normal'}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <div className="space-y-2">
                {['open', 'in_progress', 'closed'].map(status => (
                  <div key={status} className="flex items-center">
                    <input
                      id={`status-${status}`}
                      type="checkbox"
                      checked={(filters.status || []).includes(status)}
                      onChange={() => handleArrayChange('status', status)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`status-${status}`} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      {status === 'open' ? 'Aberta' : status === 'in_progress' ? 'Em Progresso' : 'Fechada'}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Período */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Period
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="dateFrom" className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    From
                  </label>
                  <input
                    type="date"
                    id="dateFrom"
                    value={filters.dateFrom || ''}
                    onChange={(e) => handleInputChange('dateFrom', e.target.value)}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="dateTo" className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    To
                  </label>
                  <input
                    type="date"
                    id="dateTo"
                    value={filters.dateTo || ''}
                    onChange={(e) => handleInputChange('dateTo', e.target.value)}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Ordenação */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Order by
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={filters.sortBy || ''}
                  onChange={(e) => handleInputChange('sortBy', e.target.value)}
                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                >
                  <option value="">Standard</option>
                  <option value="created_at">Date</option>
                  <option value="type">Type</option>
                  <option value="priority">Priority</option>
                  <option value="status">Status</option>
                </select>
                <select
                  value={filters.sortOrder || 'desc'}
                  onChange={(e) => handleInputChange('sortOrder', e.target.value as 'asc' | 'desc')}
                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascendending</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Botões de ação */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
          >
            Clean
          </button>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
}