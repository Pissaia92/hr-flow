// Adicione essas importações no topo do arquivo
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export class ExportService {
  // Exportar para CSV (mantém o código existente)
  static exportToCSV(data: any[], filename: string) {
    if (!data || data.length === 0) {
      console.warn('Nothing to export');
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

  // Exportar para PDF (CORRIGIDO)
  static async exportToPDF(data: any[], filename: string, title: string) {
    try {
      // Criar elemento temporário para renderizar o conteúdo
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.width = '800px'; // Largura fixa para melhor renderização
      tempContainer.style.backgroundColor = 'white';
      tempContainer.style.padding = '20px';
      
      // Gerar conteúdo HTML
      tempContainer.innerHTML = this.generatePDFHtml(data, title);
      
      // Adicionar estilos
      const style = document.createElement('style');
      style.textContent = `
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        h1 { color: #333; margin-bottom: 10px; }
        .header { text-align: center; margin-bottom: 20px; }
        .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
        .report-info { text-align: center; margin-bottom: 20px; color: #666; }
      `;
      tempContainer.appendChild(style);
      
      // Adicionar ao documento
      document.body.appendChild(tempContainer);
      
      // Aguardar um pouco para garantir que o conteúdo foi renderizado
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Capturar o elemento como canvas
      const canvas = await html2canvas(tempContainer, {
        scale: 2, // Melhor qualidade
        useCORS: true,
        logging: false
      });
      
      // Criar PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // Largura A4 em mm
      const pageHeight = 295; // Altura A4 em mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      // Adicionar primeira página
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Adicionar páginas subsequentes se necessário
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Salvar o PDF
      pdf.save(`${filename}.pdf`);
      
      // Remover elemento temporário
      document.body.removeChild(tempContainer);
      
    } catch (error) {
      console.error('Erro ao exportar para PDF:', error);
      alert('Erro ao gerar PDF. Por favor, tente novamente.');
      
      // Remover elemento temporário em caso de erro
      const tempContainer = document.getElementById('temp-pdf-container');
      if (tempContainer && tempContainer.parentNode) {
        tempContainer.parentNode.removeChild(tempContainer);
      }
    }
  }

  // Gerar HTML para PDF (mantém o código existente, com pequenas melhorias)
  private static generatePDFHtml(data: any[], title: string): string {
    if (!data || data.length === 0) {
      return `
        <div class="header">
          <h1>${title}</h1>
        </div>
        <div class="report-info">
          <p>Nenhum dado encontrado</p>
          <p>Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
        </div>
      `;
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
      </div>
      <div class="report-info">
        <p>Total de registros: ${data.length}</p>
        <p>Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
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

  // Formatar cabeçalhos (mantém o código existente)
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

  // Formatar células (mantém o código existente)
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