interface SosMessage {
  id: string;
  msisdn: string;
  latitude: number;
  longitude: number;
  messageText: string;
  timestamp: string;
  priorityLevel: 'CRITICAL' | 'HIGH' | 'ROUTINE';
}

export class SosPipeline {
  private static sosQueue: SosMessage[] = [];

  // Processa e injeta a mensagem de SOS vinda diretamente do satélite
  static queueEmergencyMessage(msisdn: string, lat: number, lon: number, text: string): SosMessage {
    const isEmergency = text.toUpperCase().includes('SOCORRO') || text.toUpperCase().includes('SOS');
    
    const newSos: SosMessage = {
      id: `SOS-${crypto.randomUUID().substring(0, 8).toUpperCase()}`,
      msisdn,
      latitude: lat,
      longitude: lon,
      messageText: text,
      timestamp: new Date().toISOString(),
      priorityLevel: isEmergency ? 'CRITICAL' : 'HIGH'
    };

    this.sosQueue.push(newSos);
    
    console.log(`\n🚨 [PIPELINE SOS ACTIVATED] ID: ${newSos.id}`);
    console.log(`📡 Roteando via satélite para o Centro de Resgate Terrestre mais próximo...`);
    console.log(`📍 Coordenadas de Resgate: https://google.com{lat},${lon}`);
    
    return newSos;
  }

  // Lista todos os pedidos de socorro ativos no ecossistema em nuvem
  static getActiveAlerts(): SosMessage[] {
    return this.sosQueue;
  }
}
