import { Router } from 'express';
import { DemandsController } from '../controllers/demands.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /demands/search:
 *   get:
 *     summary: Busca demandas com filtros avançados
 *     tags: [Demands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Texto para busca em tipo e descrição
 *       - in: query
 *         name: priority
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum: [normal, important, urgent]
 *         description: Filtro por prioridades
 *       - in: query
 *         name: status
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum: [open, in_progress, closed]
 *         description: Filtro por status
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Data inicial (formato YYYY-MM-DD)
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Data final (formato YYYY-MM-DD)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [created_at, type, priority, status]
 *         description: Campo para ordenação
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Ordem de ordenação
 *     responses:
 *       200:
 *         description: Lista de demandas filtradas
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */

router.delete('/:id', AuthMiddleware.authenticate, DemandsController.delete);
router.get('/search', AuthMiddleware.authenticate, DemandsController.search);
export default router;