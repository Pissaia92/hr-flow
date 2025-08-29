import express from 'express';
import cors from 'cors';
import { routes } from '../src/routes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

// Exporta o app para testes
export { app };

// Só inicia o servidor se não estiver em teste
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3333;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}