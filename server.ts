import express from 'express';
import dotenv from 'dotenv';
import { SpaceCellSecurity } from './security.js';
import { SosPipeline } from './sosPipeline.js';
import { FranchiseManager } from './franchiseManager.js';
import { GeoDecoder } from './geoDecoder.js';
import { AuthManager } from './authManager.js';
import { SpaceCellDatabase } from './database.js';


dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = Number(process.env.PORT) || 3001;

// Sessão simples em memória para controle do painel administrativo
let activeSessionToken: string | null = null;

// Rota da Tela de Login
app.get('/login', (req, res) => {
  res.send(`
    <body style="background: #0f172a; color: #f8fafc; font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
      <form action="/login" method="POST" style="background: #1e293b; padding: 40px; border-radius: 8px; width: 300px; border: 1px solid #334155;">
        <h2 style="margin-top: 0; color: #38bdf8;">🛸 SpaceCell Control Room</h2>
        <p style="color: #94a3b8; font-size: 14px;">Autenticação Master Necessária</p>
        <label>Usuário:</label><br>
        <input type="text" name="username" style="width: 100%; padding: 8px; margin: 10px 0; background: #0f172a; border: 1px solid #334155; color: white;" required><br>
        <label>Senha:</label><br>
        <input type="password" name="password" style="width: 100%; padding: 8px; margin: 10px 0; background: #0f172a; border: 1px solid #334155; color: white;" required><br>
        <button type="submit" style="width: 100%; padding: 10px; background: #38bdf8; border: none; color: #0f172a; font-weight: bold; border-radius: 4px; cursor: pointer;">Entrar no Sistema</button>
      </form>
    </body>
  `);
});

// Processamento do formulário de login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const auth = AuthManager.login(username, password);
  
  if (auth.success && auth.token) {
    activeSessionToken = auth.token;
    return res.redirect('/dashboard');
  }
  res.send('<h3>❌ Credenciais incorretas! <a href="/login">Tentar novamente</a></h3>');
});

// Rota de Despacho Operacional (Muda status do SOS)
app.post('/api/ops/dispatch', (req, res) => {
  const { id, status } = req.body;
  SpaceCellDatabase.updateIncidentStatus(id, status);
  res.redirect('/dashboard');
});

// Interface Principal Segura (Dashboard Master)
app.get('/dashboard', (req, res) => {
  if (!activeSessionToken) return res.redirect('/login');

  const alerts = SosPipeline.getActiveAlerts();
  const totalRevenue = FranchiseManager.getNetworkRevenue();
  
  const alertCards = alerts.map(a => {
    const locationName = GeoDecoder.decodeCoordinates(a.latitude, a.longitude);
    const statusColor = a.status === 'RESOLVIDO' ? '#22c55e' : a.status === 'EM_ATENDIMENTO' ? '#f59e0b' : '#ef4444';
    
    return `
      <div style="background: #1e293b; border-left: 5px solid ${statusColor}; padding: 15px; margin-bottom: 10px; border-radius: 4px;">
        <div style="display: flex; justify-content: space-between;">
          <strong style="color: #ef4444;">[${a.priorityLevel}] ID: ${a.id}</strong>
          <span style="background: ${statusColor}; color: #000; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 11px;">${a.status || 'PENDENTE'}</span>
        </div>
        <span style="color: #94a3b8;">Telefone:</span> +55 ${a.msisdn} | 
        <span style="color: #94a3b8;">Localidade:</span> <span style="color: #22c55e;">${locationName}</span><br>
        <p style="color: #f1f5f9; margin: 8px 0;">"${a.messageText}"</p>
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
          <a href="https://google.com{a.latitude},${a.longitude}" target="_blank" style="color: #38bdf8; text-decoration: none; font-size: 14px;">📍 Google Maps</a>
          <form action="/api/ops/dispatch" method="POST" style="margin: 0;">
            <input type="hidden" name="id" value="${a.id}">
            <select name="status" onchange="this.form.submit()" style="background: #0f172a; color: white; border: 1px solid #334155; padding: 4px; border-radius: 4px;">
              <option value="">Ação do Operador...</option>
              <option value="EM_ATENDIMENTO">Atender Ocorrência</option>
              <option value="RESOLVIDO">Marcar como Resolvido</option>
            </select>
          </form>
        </div>
      </div>
    `;
  }).join('');

  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>SpaceCell D2C - Master Control Room</title>
      <style>
        body { background: #0f172a; color: #f8fafc; font-family: system-ui, sans-serif; margin: 40px; }
        .container { max-width: 1000px; margin: 0 auto; }
        .header { border-bottom: 2px solid #334155; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
        .badge { background: #22c55e; color: #052e16; padding: 6px 12px; border-radius: 9999px; font-weight: bold; font-size: 12px; }
        .grid { display: grid; grid-template-columns: 1fr 2fr; gap: 20px; }
        .panel { background: #1e293b; padding: 20px; border-radius: 8px; height: fit-content; margin-bottom: 20px; }
        .stat { font-size: 24px; font-weight: bold; color: #38bdf8; margin-top: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div>
            <h1>🛸 SPACECELL PURE D2C</h1>
            <p style="color: #94a3b8; margin: 0;">Nuvem Global de Telecomunicação Satelital Resiliente</p>
          </div>
          <span class="badge">SISTEMA ONLINE (3GPP REL-19)</span>
        </div>
        <div class="grid">
          <div>
            <div class="panel">
              <h2>Telemetria</h2>
              <p style="color: #94a3b8; margin: 5px 0;">Alertas na Nuvem: <span style="color: #ef4444; font-weight: bold;">${alerts.length}</span></p>
            </div>
            <div class="panel" style="border-top: 4px solid #38bdf8;">
              <h2>Faturamento Global</h2>
              <div class="stat">R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            </div>
          </div>
          <div class="panel" style="background: #1e293b; border: 1px solid #334155;">
            <h2>Mesa de Despacho de Incidentes Humanitários (SOS)</h2>
            ${alerts.length === 0 ? '<p style="color: #64748b;">Nenhum incidente pendente no momento.</p>' : alertCards}
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Rotas de Comunicação Satelital Direct-to-Device (Preservadas)
app.post('/api/telecom/secure-handshake', (req, res) => {
  const { msisdn, imei } = req.body;
  const cryptoKeys = SpaceCellSecurity.generateVirtualEsimKeys();
  const sessionToken = SpaceCellSecurity.generateZeroTrustToken(msisdn, imei);
  return res.json({ success: true, zeroTrustToken: sessionToken, publicKey: cryptoKeys.publicKey });
});

app.post('/api/telecom/satellite-sos', (req, res) => {
  const { msisdn, imei, token, latitude, longitude, messageText } = req.body;
  if (!SpaceCellSecurity.validateSatLink(token, msisdn, imei)) return res.status(401).json({ success: false });
  const incidentReport = SosPipeline.queueEmergencyMessage(msisdn, latitude, longitude, messageText);
  return res.json({ success: true, protocol: incidentReport.id, deliveryStatus: 'SENT_TO_EMERGENCY_CENTRAL', payload: incidentReport });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 CORE ENGINE SPACECELL INTEGRADO COM ABA DE OPS`);
  console.log(`🔒 ACESSO PROTEGIDO: http://localhost:${PORT}/login`);
  console.log(`=======================================================`);
});
