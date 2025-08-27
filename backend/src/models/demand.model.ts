import { supabase, Demand } from '../config/supabase';

export class DemandModel {
  static async create(demandData: Omit<Demand, 'id' | 'created_at'>): Promise<Demand | null> {
    try {
      const { data, error } = await supabase
        .from('demands')
        .insert([demandData])
        .select()
        .single();

      if (error) throw error;
      return data as Demand;
    } catch (error) {
      console.error('Erro ao criar demanda:', error);
      return null;
    }
  }

  static async findByUserId(userId: string): Promise<Demand[]> {
    try {
      const { data, error } = await supabase
        .from('demands')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Demand[];
    } catch (error) {
      console.error('Erro ao buscar demandas por usuário:', error);
      return [];
    }
  }

  static async findAll(): Promise<Demand[]> {
    try {
      // Versão mock temporária
      console.log('Mock: Buscando todas as demandas');
      return [];
    } catch (error) {
      console.error('Erro ao buscar todas as demandas:', error);
      return [];
    }
  }

  static async findById(id: string): Promise<Demand | null> {
    try {
      // Versão mock temporária
      console.log('Mock: Buscando demanda por ID', id);
      return null;
    } catch (error) {
      console.error('Erro ao buscar demanda por ID:', error);
      return null;
    }
  }

  static async update(id: string, updates: Partial<Demand>): Promise<Demand | null> {
    try {
      // Versão mock temporária
      console.log('Mock: Atualizando demanda', id, updates);
      return null;
    } catch (error) {
      console.error('Erro ao atualizar demanda:', error);
      return null;
    }
  }
}