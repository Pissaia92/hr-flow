import { Request, Response, NextFunction } from 'express';
import { JwtUtils } from '../utils/jwt.utils';
import { UserModel } from '../models/user.model';

// Extender a interface Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export class AuthMiddleware {
  static async authenticate(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      // Verificar se o header de autorização existe
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          error: 'Token de acesso não fornecido'
        });
      }

      // Extrair token
      const token = authHeader.split(' ')[1];

      // Verificar token
      const decoded = JwtUtils.verifyToken(token);
      
      if (!decoded) {
        return res.status(401).json({
          error: 'Token inválido ou expirado'
        });
      }

      // Buscar usuário
      const user = await UserModel.findById(decoded.userId);
      
      if (!user) {
        return res.status(401).json({
          error: 'Usuário não encontrado'
        });
      }

      // Adicionar usuário ao request
      req.user = user;
      
      // Continuar para a próxima função
      next();

    } catch (error) {
      console.error('Erro na autenticação:', error);
      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  static authorizeRole(roles: string[]) {
    return (req: Request, res: Response, next: NextFunction): void | Response => {
      try {
        if (!req.user) {
          return res.status(401).json({
            error: 'Não autorizado'
          });
        }

        if (!roles.includes(req.user.role)) {
          return res.status(403).json({
            error: 'Acesso negado. Permissões insuficientes.'
          });
        }

        next();
      } catch (error) {
        console.error('Erro na autorização:', error);
        return res.status(500).json({
          error: 'Erro interno do servidor'
        });
      }
    };
  }
}