interface RequestLog {
  timestamps: number[];
  isBlocked: boolean;
}

export class DdosMitigator {
  private static tracker: Record<string, RequestLog> = {};
  private static readonly RATE_LIMIT = 5; // Limite de 5 requisições por janela
  private static readonly WINDOW_MS = 2000; // Janela de análise de 2 segundos

  // Verifica se o dispositivo está realizando um ataque de inundação de pacotes
  static isMaliciousFlood(msisdn: string): boolean {
    const now = Date.now();
    
    if (!this.tracker[msisdn]) {
      this.tracker[msisdn] = { timestamps: [now], isBlocked: false };
      return false;
    }

    const log = this.tracker[msisdn];

    // Se já estiver bloqueado em auditoria anterior, mantém a rejeição
    if (log.isBlocked) return true;

    // Filtra e mantém apenas os carimbos dentro da janela ativa de tempo
    log.timestamps = log.timestamps.filter(t => now - t < this.WINDOW_MS);
    log.timestamps.push(now);

    if (log.timestamps.length > this.RATE_LIMIT) {
      log.isBlocked = true;
      console.log(`🚨 [ANTI-DDOS EDGE] Ataque detectado! Linha suspensa em nuvem: +55 ${msisdn}`);
      return true;
    }

    return false;
  }

  // Libera manualmente o dispositivo após inspeção do SRE
  static unblockDevice(msisdn: string): void {
    if (this.tracker[msisdn]) {
      this.tracker[msisdn].isBlocked = false;
      this.tracker[msisdn].timestamps = [];
      console.log(`🔓 [ANTI-DDOS] Dispositivo +55 ${msisdn} reabilitado na malha.`);
    }
  }
}
