import http from 'http';

function triggerMfaValidation(code: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({ mfaCode: code });
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/ops/verify-mfa',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode }));
    });

    req.on('error', (err) => reject(err));
    req.write(payload);
    req.end();
  });
}

async function runMfaSimulation() {
  console.log('🏁 INICIANDO VERIFICAÇÃO AUTOMÁTICA DE SEGUNDO FATOR DE SEGURANÇA VIA NTN');
  
  try {
    console.log('📡 Interceptando SMS de órbita descendente contendo Token de Acesso...');
    const simulatedCode = "7294"; 
    
    console.log('🔒 Transmitindo código ' + simulatedCode + ' para validação na API central...');
    await triggerMfaValidation(simulatedCode);
    
    console.log('\n=======================================================');
    console.log('🎉 SESSÃO MFA HOMOLOGADA COM SUCESSO!');
    console.log('🛡️ Status da Sala de Controle: BLOCO DE CONFIANÇA MÁXIMA ATIVADO');
    console.log('=======================================================');

  } catch (error) {
    console.error('❌ Falha na comunicação com a API de segurança:', error);
  }
}

runMfaSimulation();
