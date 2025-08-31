'use client';
import ExportButtons from './ExportButtons';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type PaginationState,
  type ColumnFiltersState,
} from '@tanstack/react-table';

interface Demand {
  id: string;
  type: string;
  description: string;
  priority: string;
  status: string;
  created_at: string;
  user_id: string;
}

interface DemandsTableProps {
  demands: Demand[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void; 
}

export default function DemandsTable({ demands, onEdit, onDelete }: DemandsTableProps) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Definir colunas da tabela com tipagem correta
  const columns: ColumnDef<Demand>[] = [
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ getValue }) => getValue() as string,
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ getValue }) => (
        <div className="max-w-xs truncate" title={getValue() as string}>
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      cell: ({ getValue }) => {
        const priority = getValue() as string;
        const priorityMap: any = {
          'urgent': { text: 'Urgent', class: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200' },
          'important': { text: 'Important', class: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200' },
          'normal': { text: 'Normal', class: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' }
        };
        
        const config = priorityMap[priority] || { text: priority, class: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' };
        return (
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.class}`}>
            {config.text}
          </span>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => {
        const status = getValue() as string;
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
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Data',
      cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString('pt-BR'),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={() => router.push(`/demands/${row.original.id}`)}
            className="text-indigo-800 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 text-sm font-medium">
            Ver
          </button>
          <button
            onClick={() => router.push(`/demands/${row.original.id}/edit`)}
            className="text-blue-800 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 text-sm font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => {
              if (confirm('Tem certeza que deseja excluir esta demanda?')) {
                // Implementar exclusão
                console.log('Excluir demanda:', row.original.id);
              }
            }}
            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-600 text-sm font-medium"
          >
            Exclude
          </button>
        </div>
      ),
    },
  ];

  // Criar instância da tabela
  const table = useReactTable<Demand>({
    data: demands,
    columns,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // Função auxiliar para renderizar o indicador de ordenação
  const renderSortIndicator = (isSorted: false | "asc" | "desc") => {
    if (isSorted === "asc") return <span className="ml-1">↑</span>;
    if (isSorted === "desc") return <span className="ml-1">↓</span>;
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
      {/* Barra de exportação e título */}
      <div className="flex justify-between items-center p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Demands List
        </h3>
        <ExportButtons data={demands} filename="demandas-hrflow" />
      </div>

      {/* Filtros */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type filter
            </label>
            <input
              id="type-filter"
              type="text"
              value={(table.getColumn('type')?.getFilterValue() as string) ?? ''}
              onChange={(e) => table.getColumn('type')?.setFilterValue(e.target.value)}
              placeholder="Buscar tipo..."
              className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm py-2 px-3 transition-colors duration-200"
            />
          </div>
          
          <div>
            <label htmlFor="priority-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Priority filter
            </label>
            <select
              id="priority-filter"
              value={(table.getColumn('priority')?.getFilterValue() as string) ?? ''}
              onChange={(e) => table.getColumn('priority')?.setFilterValue(e.target.value || undefined)}
              className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm py-2 px-3 transition-colors duration-200"
            >
              <option value="">All</option>
              <option value="urgent">Urgent</option>
              <option value="important">Important</option>
              <option value="normal">Normal</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Filter per Status
            </label>
            <select
              id="status-filter"
              value={(table.getColumn('status')?.getFilterValue() as string) ?? ''}
              onChange={(e) => table.getColumn('status')?.setFilterValue(e.target.value || undefined)}
              className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm py-2 px-3 transition-colors duration-200"
            >
              <option value="">all</option>
              <option value="open">open</option>
              <option value="in_progress">In progress</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-slate-800 dark:bg-gray-700">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th 
                    key={header.id}
                    className="px-6 py-3 text-left text-sm font-bold text-gray-900 dark:text-gray-200 uppercase tracking-wider cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-800 transition-colors duration-150"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {renderSortIndicator(header.column.getIsSorted())}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-gray-400 dark:bg-gray-800 divide-y divide-gray-700 dark:divide-gray-750">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map(row => (
                <tr 
                  key={row.id} 
                  className="hover:bg-gray-400 dark:hover:bg-gray-700 transition-colors duration-150"
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-base text-gray-700 dark:text-gray-300">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <svg className="mx-auto h-14 w-14 text-gray-900 dark:text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No demand found</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Try adjusting your filters or creating a new demand.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            showing <span className="font-medium">{table.getRowModel().rows.length}</span> de{' '}
            <span className="font-medium">{demands.length}</span> results
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Last
          </button>
          
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Page {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </span>
          
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}