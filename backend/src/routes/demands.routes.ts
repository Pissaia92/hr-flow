import { Router } from 'express';
import { DemandsController } from '../controllers/demands.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Rotas protegidas (requer autenticação)
router.post('/', AuthMiddleware.authenticate, DemandsController.create);
router.get('/me', AuthMiddleware.authenticate, DemandsController.getByUser);
router.get('/', AuthMiddleware.authenticate, AuthMiddleware.authorizeRole(['hr']), DemandsController.getAll);
router.get('/:id', AuthMiddleware.authenticate, DemandsController.getById);
router.put('/:id', AuthMiddleware.authenticate, DemandsController.update);
router.delete('/:id', AuthMiddleware.authenticate, DemandsController.delete);

export default router;