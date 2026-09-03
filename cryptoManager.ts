import crypto from 'crypto';

export class CryptoManager {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly MASTER_KEY = crypto.scryptSync('SPACECELL_MASTER_PASSPHRASE_2026', 'salt', 32);

  static encryptMessage(text: string): { encryptedData: string; ivHex: string; authTagHex: string } {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(this.ALGORITHM, this.MASTER_KEY, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { encryptedData: encrypted, ivHex: iv.toString('hex'), authTagHex: cipher.getAuthTag().toString('hex') };
  }

  static decryptMessage(encryptedData: string, ivHex: string, authTagHex: string): string {
    const decipher = crypto.createDecipheriv(this.ALGORITHM, this.MASTER_KEY, Buffer.from(ivHex, 'hex'));
    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
