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

// Debug: mostrar o que está sendo carregado
console.log('SUPABASE_URL from env:', process.env.SUPABASE_URL);
console.log('SUPABASE_KEY from env:', process.env.SUPABASE_KEY);

// Configuração do Supabase
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

console.log('supabaseUrl:', supabaseUrl);
console.log('supabaseKey:', supabaseKey ? '***KEY_PRESENT***' : '***KEY_MISSING***');

if (!supabaseUrl || !supabaseKey) {
  console.error('ERRO: Variáveis de ambiente não encontradas!');
  console.error('Verifique se o arquivo .env existe e está no diretório correto');
  console.error('Caminho atual:', process.cwd());
  throw new Error('SUPABASE_URL e SUPABASE_KEY devem ser definidos no .env');
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

console.log('✅ Supabase client inicializado');