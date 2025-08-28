import { supabase, Demand } from '../config/supabase';

export class DemandModel {
  // Criar nova demanda
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

  // Buscar todas as demandas (apenas para RH)
  static async findAll(): Promise<Demand[]> {
    try {
      const { data, error } = await supabase
        .from('demands')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Demand[];
    } catch (error) {
      console.error('Erro ao buscar demandas:', error);
      return [];
    }
  }

  // Buscar demandas do usuário logado
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

  // Buscar demanda por ID
  static async findById(id: string): Promise<Demand | null> {
    try {
      const { data, error } = await supabase
        .from('demands')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // No rows returned
        throw error;
      }
      
      return data as Demand;
    } catch (error) {
      console.error('Erro ao buscar demanda por ID:', error);
      return null;
    }
  }

  // Atualizar demanda
  static async update(id: string, updates: Partial<Demand>): Promise<Demand | null> {
    try {
      const { data, error } = await supabase
        .from('demands')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Demand;
    } catch (error) {
      console.error('Erro ao atualizar demanda:', error);
      return null;
    }
  }
}