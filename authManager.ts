import crypto from 'crypto';

export class AuthManager {
  private static adminUser = {
    username: 'admin',
    passwordHash: '8c9ac99201f893112cf4600e1cf79cbf260a927d76c117d98be38531bc7cfc48'
  };

  static login(username: string, passwordPlain: string): { success: boolean; token?: string } {
    const hash = crypto.createHash('sha256').update(passwordPlain).digest('hex');
    if (username === this.adminUser.username && hash === this.adminUser.passwordHash) {
      const sessionToken = crypto.randomBytes(16).toString('hex');
      return { success: true, token: sessionToken };
    }
    return { success: false };
  }
}
