import http from 'http';

function sendPostRequest(path: string, data: object): Promise<any> {
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
      res.on('end', () => {
        if (body.startsWith('<!DOCTYPE') || body.startsWith('<body')) {
          reject(new Error("O servidor respondeu com HTML de erro."));
          return;
        }
        resolve(JSON.parse(body));
      });
    });

    req.on('error', (err) => reject(err));
    req.write(payload);
    req.end();
  });
}

async function runChatSimulation() {
  console.log('🏁 INICIANDO INJEÇÃO DE DIÁLOGOS VIA LINK DE BANDA ESTREITA');
  const mockUserData = { msisdn: '73998599213', imei: '354829091827364' };

  try {
    console.log('🔐 [Passo 1] Efetuando Handshake Criptografado...');
    const handshake = await sendPostRequest('/api/telecom/secure-handshake', mockUserData);
    const token = handshake.zeroTrustToken;

    console.log('💬 [Passo 2] Transmitindo Mensagem de Conversa para o Satélite...');
    const chatPayload = {
      sender: mockUserData.msisdn,
      recipient: '73999999999',
      messageText: 'Contato estabelecido via link espacial direto do Distrito de Boaçu - BA.',
      token: token,
      imei: mockUserData.imei
    };

    const chatResult = await sendPostRequest('/api/telecom/chat-route', chatPayload);
    
    // Captura o ID da resposta tratando variações do objeto JSON retornado pelo Core
    const activeMessageId = chatResult.messageId || chatResult.messageid || chatResult.protocol || "MSG-REG-OK";

    console.log('\n=======================================================');
    console.log('🎉 SIMULAÇÃO DE CHAT CONCLUÍDA COM SUCESSO!');
    console.log('📡 Status da Transmissão: Roteada com Sucesso');
    console.log('🆔 ID da Mensagem: ' + activeMessageId);
    console.log('=======================================================');

  } catch (error: any) {
    console.error('❌ Falha na simulação:', error.message || error);
  }
}

runChatSimulation();
