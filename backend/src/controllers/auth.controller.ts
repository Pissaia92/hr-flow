import { Request, Response } from 'express';
import { UserModel } from '../models/user.model';
import { HashUtils } from '../utils/hash.utils';
import { JwtUtils } from '../utils/jwt.utils';

export class AuthController {
  // Registro de novo usuário
  static async register(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password, role } = req.body;

      // Validação básica
      if (!name || !email || !password) {
        return res.status(400).json({
          error: 'Nome, email e senha são obrigatórios'
        });
      }

      // Verificar se usuário já existe
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          error: 'Usuário com este email já existe'
        });
      }

      // Hash da senha
      const password_hash = HashUtils.hashPassword(password);

      // Criar usuário
      const user = await UserModel.create({
        name,
        email,
        password_hash,
        role: role || 'employee'
      });

      if (!user) {
        return res.status(500).json({
          error: 'Erro ao criar usuário'
        });
      }

      // Gerar token JWT
      const token = JwtUtils.generateToken({
        userId: user.id!,
        role: user.role
      });

      // Remover password_hash da resposta
      const { password_hash: _, ...userResponse } = user as any;

      return res.status(201).json({
        message: 'Usuário criado com sucesso',
        user: userResponse,
        token
      });

    } catch (error) {
      console.error('Erro no registro:', error);
      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Login de usuário
  static async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      // Validação básica
      if (!email || !password) {
        return res.status(400).json({
          error: 'Email e senha são obrigatórios'
        });
      }

      // Buscar usuário por email
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          error: 'Credenciais inválidas'
        });
      }

      // Verificar senha
      const isPasswordValid = HashUtils.verifyPassword(password, user.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json({
          error: 'Credenciais inválidas'
        });
      }

      // Gerar token JWT
      const token = JwtUtils.generateToken({
        userId: user.id!,
        role: user.role
      });

      // Remover password_hash da resposta
      const { password_hash: _, ...userResponse } = user as any;

      return res.status(200).json({
        message: 'Login realizado com sucesso',
        user: userResponse,
        token
      });

    } catch (error) {
      console.error('Erro no login:', error);
      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Perfil do usuário (requer autenticação)
  static async profile(req: Request, res: Response): Promise<Response> {
    try {
      // req.user será adicionado pelo middleware de autenticação
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({
          error: 'Não autorizado'
        });
      }

      // Remover password_hash da resposta
      const { password_hash: _, ...userResponse } = user as any;

      return res.status(200).json({
        user: userResponse
      });

    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }
}