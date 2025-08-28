import { Router } from 'express';
import { DemandsController } from '../controllers/demands.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Demands
 *   description: Rotas de gestão de demandas
 */

/**
 * @swagger
 * /demands:
 *   post:
 *     summary: Cria uma nova demanda
 *     tags: [Demands]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - description
 *             properties:
 *               type:
 *                 type: string
 *                 description: Tipo da demanda
 *               description:
 *                 type: string
 *                 description: Descrição da demanda
 *               priority:
 *                 type: string
 *                 enum: [normal, important, urgent]
 *                 description: Prioridade da demanda
 *               status:
 *                 type: string
 *                 enum: [open, in_progress, closed]
 *                 description: Status da demanda
 *     responses:
 *       201:
 *         description: Demanda criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', AuthMiddleware.authenticate, DemandsController.create);

/**
 * @swagger
 * /demands:
 *   get:
 *     summary: Lista todas as demandas (apenas para RH)
 *     tags: [Demands]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de demandas retornada com sucesso
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', AuthMiddleware.authenticate, AuthMiddleware.authorizeRole(['hr']), DemandsController.getAll);

/**
 * @swagger
 * /demands/open:
 *   get:
 *     summary: Obtém todas as demandas abertas (apenas para RH)
 *     tags: [Demands]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de demandas abertas
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/open', AuthMiddleware.authenticate, AuthMiddleware.authorizeRole(['hr']), DemandsController.getOpenDemands);

/**
 * @swagger
 * /demands/closed:
 *   get:
 *     summary: Obtém todas as demandas fechadas (apenas para RH)
 *     tags: [Demands]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de demandas fechadas
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/closed', AuthMiddleware.authenticate, AuthMiddleware.authorizeRole(['hr']), DemandsController.getClosedDemands);

/**
 * @swagger
 * /demands/me:
 *   get:
 *     summary: Lista demandas do usuário logado
 *     tags: [Demands]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de demandas do usuário retornada com sucesso
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/me', AuthMiddleware.authenticate, DemandsController.getByUser);

/**
 * @swagger
 * /demands/{id}:
 *   get:
 *     summary: Obtém uma demanda específica
 *     tags: [Demands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da demanda
 *     responses:
 *       200:
 *         description: Demanda retornada com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Demanda não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id', AuthMiddleware.authenticate, DemandsController.getById);

/**
 * @swagger
 * /demands/{id}:
 *   put:
 *     summary: Atualiza uma demanda
 *     tags: [Demands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da demanda
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 description: Tipo da demanda
 *               description:
 *                 type: string
 *                 description: Descrição da demanda
 *               priority:
 *                 type: string
 *                 enum: [normal, important, urgent]
 *                 description: Prioridade da demanda
 *               status:
 *                 type: string
 *                 enum: [open, in_progress, closed]
 *                 description: Status da demanda
 *     responses:
 *       200:
 *         description: Demanda atualizada com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Demanda não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:id', AuthMiddleware.authenticate, DemandsController.update);

/**
 * @swagger
 * /demands/{id}:
 *   delete:
 *     summary: Fecha uma demanda
 *     tags: [Demands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da demanda
 *     responses:
 *       200:
 *         description: Demanda fechada com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Demanda não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:id', AuthMiddleware.authenticate, DemandsController.delete);

export default router;