// Script para testar criação de usuário diretamente no Supabase
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

// Configuração - substitua pelos seus valores
const supabaseUrl = process.env.SUPABASE_URL || 'SUA_URL_AQUI';
const supabaseKey = process.env.SUPABASE_KEY || 'SUA_KEY_AQUI';

console.log('=== Testando conexão e criação de usuário ===');
console.log('URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

// Função para hash de senha
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Dados do usuário de teste
const testUser = {
  name: 'Teste Script',
  email: 'script@teste.com',
  password_hash: hashPassword('123456'),
  role: 'employee'
};

console.log('Criando usuário:', testUser);

// Criar usuário
supabase.from('users').insert([testUser]).select()
  .then(result => {
    console.log('Resultado da criação:', result);
    if (result.error) {
      console.error('Erro:', result.error);
    } else {
      console.log('✅ Usuário criado com sucesso!');
      console.log('ID:', result.data[0].id);
    }
  })
  .catch(error => {
    console.error('Erro catch:', error);
  });