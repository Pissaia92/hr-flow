/**
 * 🧪 TEST FILE - KPICard Component
 * 
 * ⚠️  Este arquivo é utilizado APENAS para testes automatizados
 * ⚠️  Não é incluído no build de produção
 * 
 * @用途 Testes do componente KPICard do dashboard
 * @执行 npm test ou npm run test:frontend
 */

import { render, screen } from '@testing-library/react';
import KPICard from '../../../components/KPICard';

describe('KPICard Component Tests', () => {
  it('should render title and value correctly', () => {
    render(<KPICard title="Total Users" value="150" />);
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
  });
});