export class PriorityUtils {
  static calculatePriority(description: string): 'normal' | 'important' | 'urgent' {
    // Converter para minúsculas para facilitar a busca
    const lowerDescription = description.toLowerCase();
    
    // Verificar palavras-chave de urgência
    const urgentKeywords = ['urgente', 'imediato', 'imediata', 'necessito', 'preciso', 'hoje', 'agora'];
    const importantKeywords = ['importante', 'breve', 'curto prazo', 'prioridade'];
    
    // Verificar se contém palavras de urgência
    if (urgentKeywords.some(keyword => lowerDescription.includes(keyword))) {
      return 'urgent';
    }
    
    // Verificar se contém palavras importantes
    if (importantKeywords.some(keyword => lowerDescription.includes(keyword))) {
      return 'important';
    }
    
    // Prioridade normal por padrão
    return 'normal';
  }
}