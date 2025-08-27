import { EmailService } from '../services/email.service';
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

const emailService = new EmailService();
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Rotas de autenticação
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome completo do usuário
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do usuário
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Senha do usuário
 *               role:
 *                 type: string
 *                 enum: [employee, hr]
 *                 description: Função do usuário
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Usuário já existe
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/register', AuthController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autentica um usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do usuário
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Senha do usuário
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Credenciais inválidas
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/login', AuthController.login);

/**
 * @swagger
 * /auth/test-email:
 *   post:
 *     summary: Testa o envio de email
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Email de teste enviado com sucesso
 *       500:
 *         description: Erro ao enviar email de teste
 */
router.post('/test-email', AuthMiddleware.authenticate, async (req, res) => {
  try {
    const success = await emailService.sendTestEmail();
    if (success) {
      res.json({ message: 'Email de teste enviado com sucesso!' });
    } else {
      res.status(500).json({ error: 'Falha ao enviar email de teste' });
    }
  } catch (error) {
    console.error('Erro no endpoint de teste de email:', error);
    res.status(500).json({ error: 'Erro ao enviar email de teste' });
  }
});

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Obtém o perfil do usuário autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil do usuário retornado com sucesso
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/profile', AuthMiddleware.authenticate, AuthController.profile);

export default router;