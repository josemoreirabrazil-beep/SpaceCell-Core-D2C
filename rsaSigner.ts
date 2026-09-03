import crypto from 'crypto';

export class RsaSigner {
  private static privateKey: string;
  private static publicKey: string;

  // Inicializa o par de chaves criptográficas RSA de 2048 bits da central de comando
  static generateKeyPair(): void {
    if (this.privateKey && this.publicKey) return;

    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs1', format: 'pem' }
    });

    this.privateKey = privateKey;
    this.publicKey = publicKey;
  }

  // Gera uma assinatura digital criptográfica baseada no conteúdo textual do relatório
  static signData(dataContent: string): string {
    this.generateKeyPair();
    const sign = crypto.createSign('SHA256');
    sign.update(dataContent);
    sign.end();
    return sign.sign(this.privateKey, 'hex');
  }

  // Valida se o relatório em disco permanece íntegro, autêntico e intocado
  static verifyData(dataContent: string, signatureHex: string): boolean {
    this.generateKeyPair();
    const verify = crypto.createVerify('SHA256');
    verify.update(dataContent);
    verify.end();
    return verify.verify(this.publicKey, signatureHex, 'hex');
  }
}
