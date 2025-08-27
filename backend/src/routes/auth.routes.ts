import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Rotas públicas
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Rota protegida (requer autenticação)
router.get('/profile', AuthMiddleware.authenticate, AuthController.profile);

export default router;