import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
  role: string;
}

export class JwtUtils {
  private static secret = process.env.JWT_SECRET || 'hrflow_jwt_secret_key_2024';
  private static expiresIn = process.env.JWT_EXPIRES_IN || '24h';

  static generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  static verifyToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, this.secret) as JwtPayload;
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      return null;
    }
  }
}