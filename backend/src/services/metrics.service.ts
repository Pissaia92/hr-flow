import { DemandModel } from '../models/demand.model';
import { UserModel } from '../models/user.model';

export interface DemandMetrics {
  total: number;
  byPriority: {
    urgent: number;
    important: number;
    normal: number;
  };
  byStatus: {
    open: number;
    in_progress: number;
    closed: number;
  };
  evolution: {
    date: string;
    count: number;
  }[];
}

export class MetricsService {
  static async getDemandMetrics(): Promise<DemandMetrics> {
    try {
      // Buscar todas as demandas
      const demands = await DemandModel.findAll();
      
      // Calcular métricas básicas
      const total = demands.length;
      
      // Contar por prioridade
      const byPriority = {
        urgent: demands.filter(d => d.priority === 'urgent').length,
        important: demands.filter(d => d.priority === 'important').length,
        normal: demands.filter(d => d.priority === 'normal').length,
      };
      
      // Contar por status
      const byStatus = {
        open: demands.filter(d => d.status === 'open').length,
        in_progress: demands.filter(d => d.status === 'in_progress').length,
        closed: demands.filter(d => d.status === 'closed').length,
      };
      
      // Calcular evolução mensal (últimos 6 meses)
      const evolution = this.calculateMonthlyEvolution(demands);
      
      return {
        total,
        byPriority,
        byStatus,
        evolution
      };
    } catch (error) {
      console.error('Erro ao buscar métricas:', error);
      throw error;
    }
  }
  
  static async getUrgentDemandsCount(): Promise<number> {
    try {
      const demands = await DemandModel.findAll();
      return demands.filter(d => d.priority === 'urgent').length;
    } catch (error) {
      console.error('Erro ao buscar demandas urgentes:', error);
      return 0;
    }
  }
  
  static async getAverageResponseTime(): Promise<number> {
    try {
      // Esta é uma implementação simplificada
      // Em um sistema real, você teria timestamps de criação e resolução
      const demands = await DemandModel.findAll();
      if (demands.length === 0) return 0;
      
      // Simular tempo médio de resposta (em horas)
      const totalHours = demands.reduce((sum, demand) => {
        // Simulação: tempo baseado na prioridade
        const hours = demand.priority === 'urgent' ? 2 : 
                     demand.priority === 'important' ? 24 : 72;
        return sum + hours;
      }, 0);
      
      return Math.round(totalHours / demands.length);
    } catch (error) {
      console.error('Erro ao calcular tempo médio de resposta:', error);
      return 0;
    }
  }
  
  private static calculateMonthlyEvolution(demands: any[]): { date: string; count: number }[] {
    // Criar um mapa para contar demandas por mês
    const monthlyCount: { [key: string]: number } = {};
    
    // Últimos 6 meses
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyCount[monthKey] = 0;
      months.push({
        date: monthKey,
        label: date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
        count: 0
      });
    }
    
    // Contar demandas por mês
    demands.forEach(demand => {
      if (demand.created_at) {
        const date = new Date(demand.created_at);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (monthlyCount[monthKey] !== undefined) {
          monthlyCount[monthKey]++;
        }
      }
    });
    
    // Converter para formato esperado
    return Object.keys(monthlyCount).map(date => ({
      date,
      count: monthlyCount[date]
    }));
  }
}