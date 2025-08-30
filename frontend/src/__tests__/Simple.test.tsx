import { render, screen } from '@testing-library/react';
import React from 'react';

// Teste básico sem componentes complexos
const TestComponent = () => (
  <div data-testid="test-component">
    <h1>HR Flow App</h1>
    <p>Testing is working!</p>
  </div>
);

describe('Simple React Test', () => {
  it('renders basic component', () => {
    render(<TestComponent />);
    
    expect(screen.getByTestId('test-component')).toBeInTheDocument();
    expect(screen.getByText('HR Flow App')).toBeInTheDocument();
    expect(screen.getByText('Testing is working!')).toBeInTheDocument();
  });

  it('renders with correct structure', () => {
    const { container } = render(<TestComponent />);
    
    expect(container.querySelector('h1')).toBeInTheDocument();
    expect(container.querySelector('p')).toBeInTheDocument();
  });
});