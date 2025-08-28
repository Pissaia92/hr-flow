'use client';

import { useState } from 'react';

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
      
      if (!data || data.length === 0) {
        alert('Nenhum dado para exportar');
        return;
      }

      // Criar CSV
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(fieldName => {
            let field = row[fieldName];
            if (typeof field === 'string') {
              field = `"${field.replace(/"/g, '""')}"`;
            }
            return field;
          }).join(',')
        )
      ].join('\n');

      // Baixar arquivo
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
      alert('Erro ao exportar para CSV');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = () => {
    try {
      setIsExporting(true);
      
      if (!data || data.length === 0) {
        alert('Nenhum dado para exportar');
        return;
      }

      // Criar conteúdo HTML para PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${title}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              color: #333;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 20px; 
            }
            th, td { 
              border: 1px solid #ddd; 
              padding: 8px; 
              text-align: left; 
            }
            th { 
              background-color: #f2f2f2; 
              font-weight: bold;
            }
            h1 { 
              color: #333; 
              text-align: center;
            }
            .header { 
              text-align: center; 
              margin-bottom: 20px; 
            }
            .footer { 
              margin-top: 20px; 
              font-size: 12px; 
              color: #666; 
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${title}</h1>
            <p>Total de registros: ${data.length}</p>
            <p>Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
          </div>
          
          <table>
            <thead>
              <tr>
                ${Object.keys(data[0]).map(key => `<th>${key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${data.map(row => `
                <tr>
                  ${Object.keys(data[0]).map(key => `<td>${row[key] || ''}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            Relatório gerado automaticamente pelo HRFlow
          </div>
        </body>
        </html>
      `;

      // Abrir em nova aba para impressão
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        // printWindow.print(); // Descomente para imprimir automaticamente
      }
      
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      alert('Erro ao gerar PDF');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-all duration-200"
          id="export-menu-button"
          aria-expanded="false"
          aria-haspopup="true"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          Exportar
        </button>
      </div>

      <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none hidden group-hover:block z-50">
        <div className="py-1" role="none">
          <button
            onClick={handleExportCSV}
            disabled={isExporting}
            className="disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
            role="menuitem"
          >
            <div className="flex items-center">
              <svg className="mr-3 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 110-16 8 8 0 0118 0 8 8 0 01-18 0zm0 0V9a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" clipRule="evenodd" />
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
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              Exportar para PDF
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}