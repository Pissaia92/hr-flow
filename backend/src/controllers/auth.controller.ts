import { Request, Response } from 'express';
import { UserModel } from '../models/user.model';
import { HashUtils } from '../utils/hash.utils';
import { JwtUtils } from '../utils/jwt.utils';
import { supabase } from '../config/supabase';

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

  // Atualizar perfil do usuário
  static async updateProfile(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email } = req.body;
      const userId = req.user?.id;

      // Validação básica
      if (!name || !email) {
        return res.status(400).json({
          error: 'Nome e email são obrigatórios'
        });
      }

      // Verificar se email já existe para outro usuário
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        return res.status(409).json({
          error: 'Email já está em uso por outro usuário'
        });
      }

      // Atualizar usuário
      const { data, error } = await supabase
        .from('users')
        .update({ name, email })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      // Remover password_hash da resposta
      const { password_hash: _, ...userResponse } = data;

      return res.status(200).json({
        message: 'Perfil atualizado com sucesso',
        user: userResponse
      });

    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Alterar senha do usuário
  static async changePassword(req: Request, res: Response): Promise<Response> {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user?.id;

      // Validação básica
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          error: 'Senha atual e nova senha são obrigatórias'
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          error: 'Nova senha deve ter pelo menos 6 caracteres'
        });
      }

      // Buscar usuário atual
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({
          error: 'Usuário não encontrado'
        });
      }

      // Verificar senha atual
      const isCurrentPasswordValid = HashUtils.verifyPassword(currentPassword, user.password_hash);
      if (!isCurrentPasswordValid) {
        return res.status(401).json({
          error: 'Senha atual incorreta'
        });
      }

      // Hash da nova senha
      const newPasswordHash = HashUtils.hashPassword(newPassword);

      // Atualizar senha
      const { error } = await supabase
        .from('users')
        .update({ password_hash: newPasswordHash })
        .eq('id', userId);

      if (error) throw error;

      return res.status(200).json({
        message: 'Senha alterada com sucesso'
      });

    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }
}