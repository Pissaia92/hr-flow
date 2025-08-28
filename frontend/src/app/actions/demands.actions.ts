// Server Action para criar demanda - executa no servidor
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtVerify } from 'jose';

// Função para verificar token JWT
async function verifyToken(token: string) {
  try {
    // Implementação simplificada sem jose por enquanto
    // Em produção, você usaria o jose corretamente
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (error) {
    return null;
  }
}

// Server Action para criar demanda
export async function createDemand(formData: FormData) {
  const token = cookies().get('token')?.value;
  
  if (!token) {
    redirect('/login');
    return { error: 'Não autorizado' };
  }

  const payload = await verifyToken(token);
  if (!payload) {
    redirect('/login');
    return { error: 'Token inválido' };
  }

  try {
    // Extrair dados do formulário
    const type = formData.get('type') as string;
    const description = formData.get('description') as string;
    const priority = formData.get('priority') as string;
    
    // Validar dados
    if (!type || !description) {
      return { error: 'Tipo e descrição são obrigatórios' };
    }
    
    // Chamar API backend para criar demanda
    const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:3000'}/demands`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        type,
        description,
        priority: priority || 'normal'
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { error: data.error || 'Erro ao criar demanda' };
    }
    
    // Redirecionar para lista de demandas após sucesso
    redirect('/demands');
    return { success: true, demand: data.demand };
    
  } catch (error) {
    console.error('Erro ao criar demanda:', error);
    return { error: 'Erro de conexão com o servidor' };
  }
}