export class ExportService {
  // Exportar para CSV
  static exportToCSV(data: any[], filename: string) {
    if (!data || data.length === 0) {
      console.warn('Nenhum dado para exportar');
      return;
    }

    // Criar cabeçalhos
    const headers = Object.keys(data[0]);
    
    // Criar linhas CSV
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(fieldName => {
          let field = row[fieldName];
          // Tratar valores especiais
          if (typeof field === 'string') {
            field = `"${field.replace(/"/g, '""')}"`;
          }
          return field;
        }).join(',')
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
  }

  // Exportar para PDF
  static async exportToPDF(data: any[], filename: string, title: string) {
    try {
      // Para simplificar, vamos usar a biblioteca jsPDF
      // Na prática, você pode querer importar isso ou usar uma CDN
      
      // Criar conteúdo HTML para o PDF
      const htmlContent = this.generatePDFHtml(data, title);
      
      // Aqui você normalmente usaria jsPDF ou html2pdf
      // Para este exemplo, vamos criar um PDF simples usando print
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>${title}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              h1 { color: #333; }
              .header { text-align: center; margin-bottom: 20px; }
              .footer { margin-top: 20px; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            ${htmlContent}
            <div class="footer">
              Relatório gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}
            </div>
          </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        // printWindow.print(); // Descomente para imprimir automaticamente
      }
    } catch (error) {
      console.error('Erro ao exportar para PDF:', error);
      alert('Erro ao gerar PDF. Por favor, tente novamente.');
    }
  }

  // Gerar HTML para PDF
  private static generatePDFHtml(data: any[], title: string): string {
    if (!data || data.length === 0) {
      return `<div class="header"><h1>${title}</h1><p>Nenhum dado encontrado</p></div>`;
    }

    // Determinar colunas (usar chaves do primeiro objeto)
    const columns = Object.keys(data[0]).filter(key => key !== 'password_hash');

    // Criar tabela HTML
    const tableHeaders = columns
      .map(col => `<th>${this.formatHeader(col)}</th>`)
      .join('');

    const tableRows = data
      .map(row => {
        const cells = columns
          .map(col => `<td>${this.formatCell(row[col])}</td>`)
          .join('');
        return `<tr>${cells}</tr>`;
      })
      .join('');

    return `
      <div class="header">
        <h1>${title}</h1>
        <p>Total de registros: ${data.length}</p>
      </div>
      <table>
        <thead>
          <tr>${tableHeaders}</tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    `;
  }

  // Formatar cabeçalhos
  private static formatHeader(header: string): string {
    const headerMap: { [key: string]: string } = {
      'id': 'ID',
      'type': 'Tipo',
      'description': 'Descrição',
      'priority': 'Prioridade',
      'status': 'Status',
      'created_at': 'Data de Criação',
      'user_id': 'ID do Usuário',
      'name': 'Nome',
      'email': 'Email',
      'role': 'Função'
    };
    
    return headerMap[header] || header.charAt(0).toUpperCase() + header.slice(1).replace(/_/g, ' ');
  }

  // Formatar células
  private static formatCell(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }
    
    if (typeof value === 'boolean') {
      return value ? 'Sim' : 'Não';
    }
    
    if (value instanceof Date || (typeof value === 'string' && !isNaN(Date.parse(value)))) {
      return new Date(value).toLocaleDateString('pt-BR');
    }
    
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    
    return String(value);
  }
}