'use client';
import { useState } from 'react';

interface ExportButtonsProps {
  data: any[];
  filename: string;
}

export default function ExportButtons({ data, filename }: ExportButtonsProps) {
  const [loading, setLoading] = useState(false);

  const exportToCSV = () => {
    setLoading(true);
    try {
      // Converter dados para CSV
      const headers = Object.keys(data[0] || {});
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(fieldName => JSON.stringify(row[fieldName] || '')).join(',')
        )
      ].join('\n');

      // Criar e baixar arquivo
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = async () => {
    setLoading(true);
    try {
      // Lazy load das dependências para melhor performance
      const { jsPDF } = await import('jspdf');
      import('jspdf-autotable').then(() => {
        const doc = new jsPDF();
        
        // Adicionar título
        doc.text(filename, 14, 15);
        
        // Converter dados para tabela
        const headers = Object.keys(data[0] || {});
        const rows = data.map(row => 
          headers.map(fieldName => row[fieldName] || '')
        );
        
        // @ts-ignore - jspdf-autotable adiciona este método
        doc.autoTable({
          head: [headers],
          body: rows,
          startY: 25
        });
        
        // Baixar PDF
        doc.save(`${filename}.pdf`);
      });
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={exportToCSV}
        disabled={loading}
        className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:opacity-50"
      >
        {loading ? 'Exportando...' : 'Exportar CSV'}
      </button>
      <button
        onClick={exportToPDF}
        disabled={loading}
        className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:opacity-50"
      >
        {loading ? 'Exportando...' : 'Exportar PDF'}
      </button>
    </div>
  );
}