import * as crypto from 'crypto';

export class HashUtils {
  static hashPassword(password: string): string {
    const hash = crypto
      .createHash('sha256')
      .update(password)
      .digest('hex');
    return hash;
  }

  static verifyPassword(password: string, hash: string): boolean {
    const hashedPassword = this.hashPassword(password);
    const isValid = hashedPassword === hash;
    console.log(`🔍 Verificação de senha - Input: ${password}, Stored: ${hash.substring(0, 10)}..., Computed: ${hashedPassword.substring(0, 10)}..., Result: ${isValid}`);
    return isValid;
  }
}