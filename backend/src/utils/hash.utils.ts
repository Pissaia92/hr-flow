import * as crypto from 'crypto';

export class HashUtils {
  static hashPassword(password: string): string {
    const hash = crypto
      .createHash('sha256')
      .update(password)
      .digest('hex');
    console.log('Hashing password:', password, '->', hash);
    return hash;
  }

  static verifyPassword(password: string, hash: string): boolean {
    const hashedPassword = this.hashPassword(password);
    const isValid = hashedPassword === hash;
    console.log('Verifying password:', password);
    console.log('Stored hash:', hash);
    console.log('Computed hash:', hashedPassword);
    console.log('Result:', isValid);
    return isValid;
  }
}