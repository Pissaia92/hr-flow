import { Router } from 'express';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { MetricsService } from '../services/metrics.service';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Metrics
 *   description: Rotas de métricas e dashboard
 */

/**
 * @swagger
 * /metrics/demands:
 *   get:
 *     summary: Obtém métricas de demandas
 *     tags: [Metrics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Métricas de demandas retornadas com sucesso
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/demands', AuthMiddleware.authenticate, async (req, res) => {
  try {
    const metrics = await MetricsService.getDemandMetrics();
    res.json({ metrics });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar métricas' });
  }
});

/**
 * @swagger
 * /metrics/urgent-count:
 *   get:
 *     summary: Obtém contagem de demandas urgentes
 *     tags: [Metrics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Contagem de demandas urgentes retornada com sucesso
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/urgent-count', AuthMiddleware.authenticate, async (req, res) => {
  try {
    const count = await MetricsService.getUrgentDemandsCount();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar contagem de demandas urgentes' });
  }
});

/**
 * @swagger
 * /metrics/average-response-time:
 *   get:
 *     summary: Obtém tempo médio de resposta
 *     tags: [Metrics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tempo médio de resposta retornado com sucesso
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/average-response-time', AuthMiddleware.authenticate, async (req, res) => {
  try {
    const time = await MetricsService.getAverageResponseTime();
    res.json({ time });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao calcular tempo médio de resposta' });
  }
});

export default router;