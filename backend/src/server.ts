import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import demandsRoutes from './routes/demands.routes';
import metricsRoutes from './routes/metrics.routes';

// log para debug
console.log('🔧 Iniciando servidor...');



const app = express();

app.use(cors());
app.use(express.json());

// Registrar rotas individualmente
app.use('/auth', authRoutes);
app.use('/demands', demandsRoutes);
app.use('/metrics', metricsRoutes);

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Exporta o app para testes
export { app };

// Só inicia o servidor se não estiver em teste
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}