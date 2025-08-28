import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Tipos para o nosso projeto
export interface User {
  id?: string;
  name: string;
  email: string;
  password_hash: string;
  role: 'employee' | 'hr';
  created_at?: string;
}

export interface Demand {
  id?: string;
  type: string;
  description: string;
  priority: 'normal' | 'important' | 'urgent';
  status: 'open' | 'in_progress' | 'closed';
  created_at?: string;
  user_id: string;
}

// Configuração do Supabase
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('SUPABASE_URL e SUPABASE_KEY devem ser definidos no .env');
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

// Testar conexão imediatamente
async function testSupabaseConnection() {
  try {
    console.log('🔍 Testando conexão com Supabase...');
    const { data, error } = await supabase
      .from('users')
      .select('count', { count: 'exact', head: true });

    if (error) {
      console.error('❌ Erro na conexão com Supabase:', error);
    } else {
      console.log('✅ Conexão com Supabase estabelecida com sucesso');
    }
  } catch (error) {
    console.error('❌ Erro ao testar conexão:', error);
  }
}

testSupabaseConnection();