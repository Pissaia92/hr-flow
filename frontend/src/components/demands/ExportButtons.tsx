'use client';
// Importações necessárias do React
import { useState, useEffect } from 'react';

// Definição das props esperadas pelo componente
interface ExportButtonsProps {
  data: any[]; // Os dados a serem exportados
  filename?: string; // Nome base do arquivo (opcional)
}

// Componente funcional React
export default function ExportButtons({ data, filename = 'dados_exportados' }: ExportButtonsProps) {
  // Estados para controlar a aparência e comportamento
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [includeTimestamp, setIncludeTimestamp] = useState(true);
  const [notification, setNotification] = useState<{ message: string; isError: boolean } | null>(null);

  // Efeito para esconder a notificação após alguns segundos
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Função para mostrar notificações
  const showNotification = (message: string, isError: boolean = false) => {
    setNotification({ message, isError });
  };

  // Função para gerar o nome do arquivo final
  const getFinalFilename = (extension: string) => {
    let finalName = filename;
    if (includeTimestamp) {
      const now = new Date();
      const timestamp = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
      finalName = `${finalName}_${timestamp}`;
    }
    return `${finalName}.${extension}`;
  };

  // Função para exportar para CSV
  const exportToCSV = () => {
    if (!data || data.length === 0) {
      showNotification('No data to export', true);
      return;
    }

    try {
      // Determinar cabeçalhos
      const headers = includeHeaders ? Object.keys(data[0]) : [];
      
      // Criar conteúdo CSV
      let csvContent = '';
      if (includeHeaders) {
        csvContent += headers.join(',') + '\n';
      }
      
      data.forEach(row => {
        const rowValues = headers.map(header => {
          let value = row[header];
          // Escapar valores se necessário (ex: se contiver vírgula)
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            // Escapa aspas duplas e envolve em aspas
            value = `"${value.replace(/"/g, '""')}"`; 
          }
          return value;
        });
        csvContent += rowValues.join(',') + '\n';
      });

      // Criar e baixar o arquivo
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', getFinalFilename('csv'));
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showNotification('CSV exported!');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      showNotification('Erro to generate CSV. Please, try again.', true);
    }
  };

  // Função para exportar para PDF
  const exportToPDF = async () => {
    if (!data || data.length === 0) {
      showNotification('No data to export', true);
      return;
    }

    try {
      // Carregar dinamicamente as bibliotecas para melhor performance inicial
      const { jsPDF } = await import('jspdf');
      await import('jspdf-autotable');

      // Criar instância do jsPDF
      const doc = new jsPDF();

      // Adicionar título
      doc.text('Exported data report', 14, 15);

      // Extrair cabeçalhos e dados para a tabela
      const headers = Object.keys(data[0]);
      const tableData = data.map(row => {
        return headers.map(header => {
          const value = row[header];
          if (value === null || value === undefined) return '';
          if (typeof value === 'object') return JSON.stringify(value);
          return String(value);
        });
      });

      // @ts-ignore - jspdf-autotable adiciona este método
      doc.autoTable({
        head: includeHeaders ? [headers] : [],
        body: tableData,
        startY: 25,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [79, 70, 229] }, // Cor indigo do projeto
        alternateRowStyles: { fillColor: [243, 244, 246] } // Cinza claro
      });

      // Salvar o PDF
      doc.save(getFinalFilename('pdf'));
      
      showNotification('PDF exported!!');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      showNotification('Generate PDF error. Try again.', true);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Botões de Exportação */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={exportToCSV}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-colors duration-200"
        >
          Export CSV
        </button>
        <button
          onClick={exportToPDF}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-grayar-800 transition-colors duration-200"
        >
          Export PDF
        </button>
      </div>

      {/* Opções de Configuração (Simplificadas) */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700 dark:text-gray-300">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={includeHeaders}
            onChange={(e) => setIncludeHeaders(e.target.checked)}
            className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 shadow-sm focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:focus:ring-offset-gray-800"
          />
          <span>Includ Headers</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={includeTimestamp}
            onChange={(e) => setIncludeTimestamp(e.target.checked)}
            className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 shadow-sm focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:focus:ring-offset-gray-800"
          />
          <span>Timestamp</span>
        </label>
        <input
          type="text"
          value={filename}
          onChange={(e) => {}} // Não permitir mudança direta aqui, ou passe uma função setter via props
          placeholder="Nome do arquivo"
          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white text-sm"
          readOnly // Torna o campo somente leitura
        />
      </div>

      {/* Notificação */}
      {notification && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded-md shadow-lg z-50 text-white animate-fadeInOut ${
            notification.isError ? 'bg-red-500' : 'bg-indigo-600'
          }`}
        >
          {notification.message}
        </div>
      )}
    </div>
  );
}