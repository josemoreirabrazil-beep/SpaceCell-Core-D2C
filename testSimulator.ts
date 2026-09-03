import http from 'http';

const API_URL = 'http://localhost:3001';

// Função auxiliar para disparar requisições POST HTTP nativas
function postRequest(path: string, data: object): Promise<any> {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve(JSON.parse(body)));
    });

    req.on('error', (err) => reject(err));
    req.write(payload);
    req.end();
  });
}

async function runSimulation() {
  console.log('🏁 INICIANDO SIMULAÇÃO DE LINK SATELITAL DIRECT-TO-DEVICE');
  
  const mockUserData = {
    msisdn: '73998599213',
    imei: '354829091827364',
    latitude: -13.8564,
    longitude: -40.0812
  };

  try {
    // 1. Executa o Handshake Seguro Zero-Trust
    console.log('\n🔐 [Passo 1] Solicitando Handshake Criptografado com a Nuvem...');
    const handshakeResult = await postRequest('/api/telecom/secure-handshake', mockUserData);
    
    if (!handshakeResult.success) {
      console.error('❌ Falha no Handshake.');
      return;
    }
    
    const token = handshakeResult.zeroTrustToken;
    console.log(`✅ Handshake Autorizado! Token de Sessão Gerado: ${token.substring(0, 20)}...`);

    // 2. Dispara o Alerta de Emergência Humatária (SOS)
    console.log('\n🚨 [Passo 2] Disparando Mensagem de Socorro via Satélite...');
    const sosPayload = {
      ...mockUserData,
      token: token,
      messageText: 'SOS - Falha mecânica em área isolada sem cobertura terrestre. Solicito apoio.'
    };

    const sosResult = await postRequest('/api/telecom/satellite-sos', sosPayload);
    
    console.log('\n=======================================================');
    console.log('🎉 SIMULAÇÃO CONCLUÍDA COM SUCESSO!');
    console.log(`📡 Protocolo de Resgate: ${sosResult.protocol}`);
    console.log(`🎯 Status na AWS: ${sosResult.deliveryStatus}`);
    console.log(`📋 Nível de Prioridade: ${sosResult.payload.priorityLevel}`);
    console.log('=======================================================');

  } catch (error) {
    console.error('❌ Erro durante a execução do simulador:', error);
  }
}

// Executa a simulação
runSimulation();
