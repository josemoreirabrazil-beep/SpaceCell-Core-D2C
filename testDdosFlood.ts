import http from 'http';

function sendPostRequest(path: string, data: object): Promise<any> {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const options = { hostname: 'localhost', port: 3001, path, method: 'POST', headers: { 'Content-Type': 'application/json' } };
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: body }));
    });
    req.on('error', (err) => reject(err));
    req.write(payload);
    req.end();
  });
}

async function runDdosTest() {
  console.log('🏁 INICIANDO DISPAROS SIMULTÂNEOS DE INSÚSTRIA PARA TESTE DE SEGURANÇA');
  const target = { msisdn: '73999991111', latitude: -13.85, longitude: -40.08, messageText: 'Flood Attack' };

  for (let i = 1; i <= 8; i++) {
    try {
      const res = await sendPostRequest('/api/telecom/satellite-sos', target);
      console.log(`[Disparo #${i}] Status HTTP da AWS: ${res.status} | Resposta: ${res.data}`);
    } catch (e) {
      console.error(e);
    }
  }
}
runDdosTest();
