import dotenv from 'dotenv';
dotenv.config();

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';
import authRoutes from './routes/auth.routes';
import demandsRoutes from './routes/demands.routes';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Rota de teste
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'HRFlow API está rodando!',
    version: '1.0.0',
    documentation: '/api-docs'
  });
});

// Rota de health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Rotas
app.use('/auth', authRoutes);
app.use('/demands', demandsRoutes);

// Middleware de tratamento de erros
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({
    error: 'Erro interno do servidor'
  });
});

// Middleware para rotas não encontradas
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Rota não encontrada'
  });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 HRFlow Backend rodando na porta ${PORT}`);
  console.log(`📝 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📚 Documentação: http://localhost:${PORT}/api-docs`);
});

export default app;