/**
 *  Jest Setup File
 *   Configurações globais para testes
 */

import '@testing-library/jest-dom';

// Mock de funções globais
global.console = {
  ...console,
  log: jest.fn(),     //  Mock console.log para não poluir output
  error: jest.fn(),
  warn: jest.fn(),
};