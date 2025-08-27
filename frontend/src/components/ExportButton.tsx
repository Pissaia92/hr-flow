'use client';

import { useState } from 'react';
import { ExportService } from '@/services/export.service';

interface ExportButtonProps {
  data: any[];
  filename?: string;
  title?: string;
}

export default function ExportButton({ data, filename = 'export', title = 'Relatório' }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportCSV = () => {
    try {
      setIsExporting(true);
      ExportService.exportToCSV(data, filename);
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
      alert('Erro ao exportar para CSV');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = () => {
    try {
      setIsExporting(true);
      ExportService.exportToPDF(data, filename, title);
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      alert('Erro ao exportar para PDF');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
          id="export-menu-button"
          aria-expanded="false"
          aria-haspopup="true"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Exportar
        </button>
      </div>

      <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none hidden" role="menu" aria-orientation="vertical" aria-labelledby="export-menu-button">
        <div className="py-1" role="none">
          <button
            onClick={handleExportCSV}
            disabled={isExporting}
            className="disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
            role="menuitem"
          >
            <div className="flex items-center">
              <svg className="mr-3 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm7.293-7.707a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 11.414V15a1 1 0 11-2 0v-3.586L7.707 12.707a1 1 0 01-1.414-1.414l3-3z" clipRule="evenodd" />
              </svg>
              Exportar para CSV
            </div>
          </button>
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
            role="menuitem"
          >
            <div className="flex items-center">
              <svg className="mr-3 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Exportar para PDF
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}