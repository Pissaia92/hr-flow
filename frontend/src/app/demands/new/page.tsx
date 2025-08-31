'use client';

import { useFormState } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Tipos para o estado do formulário
interface FormState {
  error?: string;
  success?: boolean;
  demand?: any;
}

// Ação do servidor (vai ser criada separadamente)
async function createDemand(prevState: FormState, formData: FormData): Promise<FormState> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return { error: 'Unauthorized' };
    }

    const type = formData.get('type') as string;
    const description = formData.get('description') as string;
    const priority = formData.get('priority') as string;
    
    if (!type || !description) {
      return { error: 'Type and description are mandatory' };
    }
    
    const response = await fetch('http://localhost:3000/demands', {
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
    
    return { success: true, demand: data.demand };
    
  } catch (error) {
    console.error('Erro ao criar demanda:', error);
    return { error: 'Erro de conexão com o servidor' };
  }
}

export default function NewDemandPage() {
  const [state, formAction] = useFormState<FormState, FormData>(createDemand, { error: '' });
  const router = useRouter();

  // Redirecionar se sucesso
  useEffect(() => {
    if (state?.success) {
      router.push('/demands');
    }
  }, [state, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Cabeçalho */}
      <nav className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">HRFlow</h1>
              </div>
              <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
                <a 
                  href="/dashboard" 
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200"
                >
                  Dashboard
                </a>
                <a 
                  href="/demands" 
                  className="border-indigo-500 text-gray-900 dark:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
                >
                  Demands
                </a>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => router.push('/demands')}
                className="ml-4 inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-colors duration-200"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Conteúdo Principal */}
      <main className="max-w-3xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden transition-all duration-300">
            <div className="px-6 py-6 sm:px-8 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                New Demand
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Fill details of your new demand
              </p>
            </div>
            
            <form action={formAction} className="px-6 py-8 sm:p-8">
              {state?.error && (
                <div className="mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                        {state.error}
                      </h3>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Demand type
                  </label>
                  <div className="mt-1">
                    <select
                      id="type"
                      name="type"
                      className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm py-3 px-4 transition-colors duration-200"
                      required
                    >
                      <option value="">Choose one type</option>
                      <option value="Férias">Vacancy</option>
                      <option value="Licença Médica">Medical License</option>
                      <option value="Treinamento">Trainings</option>
                      <option value="Benefícios">Benefits</option>
                      <option value="Outro">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="description"
                      name="description"
                      rows={5}
                      className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm py-3 px-4 transition-colors duration-200"
                      placeholder="Descreva detalhadamente sua demanda..."
                      required
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    If you include words like "urgent" or "immediate," the priority will be set automatically.
                  </p>
                </div>

                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Priority
                  </label>
                  <div className="mt-1">
                    <select
                      id="priority"
                      name="priority"
                      className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm py-3 px-4 transition-colors duration-200"
                    >
                      <option value="normal">Normal</option>
                      <option value="important">Important</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Priority can be automatically adjusted based on description.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => router.push('/demands')}
                  className="inline-flex items-center px-5 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-lg shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-all duration-200 transform hover:scale-105"
                >
                  Create Demand
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}