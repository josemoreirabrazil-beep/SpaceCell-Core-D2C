import express from 'express';
import dotenv from 'dotenv';
import { SpaceCellSecurity } from './security.js';
import { SosPipeline } from './sosPipeline.js';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 3001;

// Módulo do Dashboard: Renderiza a tela administrativa futurista
app.get('/dashboard', (req, res) => {
  const alerts = SosPipeline.getActiveAlerts();
  
  const alertCards = alerts.map(a => `
    <div style="background: #1e293b; border-left: 5px solid #ef4444; padding: 15px; margin-bottom: 10px; border-radius: 4px;">
      <strong style="color: #ef4444;">[${a.priorityLevel}] ID: ${a.id}</strong><br>
      <span style="color: #94a3b8;">Telefone:</span> +55 ${a.msisdn} | 
      <span style="color: #94a3b8;">Horário:</span> ${new Date(a.timestamp).toLocaleTimeString()}<br>
      <p style="color: #f1f5f9; margin: 8px 0;">"${a.messageText}"</p>
      <a href="https://google.com{a.latitude},${a.longitude}" target="_blank" style="color: #38bdf8; text-decoration: none; font-size: 14px;">📍 Ver Localização no Google Maps</a>
    </div>
  `).join('');

  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>SpaceCell D2C - Master Control Room</title>
      <style>
        body { background: #0f172a; color: #f8fafc; font-family: system-ui, sans-serif; margin: 40px; }
        .container { max-width: 900px; margin: 0 auto; }
        .header { border-bottom: 2px solid #334155; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
        .badge { background: #22c55e; color: #052e16; padding: 6px 12px; border-radius: 9999px; font-weight: bold; font-size: 12px; }
        .grid { display: grid; grid-template-columns: 1fr 2fr; gap: 20px; }
        .panel { background: #1e293b; padding: 20px; border-radius: 8px; height: fit-content; }
        h1, h2 { margin: 0 0 10px 0; }
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
          <div class="panel">
            <h2>Telemetria do Core</h2>
            <p style="color: #94a3b8;">Servidor: <span style="color: #38bdf8;">AWS Cloud (Edge)</span></p>
            <p style="color: #94a3b8;">Porta Ativa: <span style="color: #f59e0b;">${PORT}</span></p>
            <p style="color: #94a3b8;">Alertas Ativos: <span style="color: #ef4444; font-weight: bold;">${alerts.length}</span></p>
          </div>
          
          <div class="panel" style="background: #1e293b; border: 1px solid #334155;">
            <h2>Fila de Incidentes Humanitários (SOS)</h2>
            ${alerts.length === 0 ? '<p style="color: #64748b;">Nenhum pedido de socorro na fila neste momento.</p>' : alertCards}
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Rota de Handshake Seguro (Ajustada)
app.post('/api/telecom/secure-handshake', (req, res) => {
  const { msisdn, imei } = req.body;
  if (!msisdn || !imei) return res.status(400).json({ success: false, error: 'Dados incompletos.' });
  const cryptoKeys = SpaceCellSecurity.generateVirtualEsimKeys();
  const sessionToken = SpaceCellSecurity.generateZeroTrustToken(msisdn, imei);
  return res.json({ success: true, zeroTrustToken: sessionToken, publicKey: cryptoKeys.publicKey });
});

// Rota de SOS Satelital (Corrigida para responder com a estrutura idêntica esperada)
app.post('/api/telecom/satellite-sos', (req, res) => {
  const { msisdn, imei, token, latitude, longitude, messageText } = req.body;
  
  if (!SpaceCellSecurity.validateSatLink(token, msisdn, imei)) {
    return res.status(401).json({ success: false, error: 'Assinatura inválida.' });
  }
  
  const incidentReport = SosPipeline.queueEmergencyMessage(msisdn, latitude, longitude, messageText);
  
  return res.json({ 
    success: true, 
    protocol: incidentReport.id, 
    deliveryStatus: 'SENT_TO_EMERGENCY_CENTRAL', 
    payload: {
      id: incidentReport.id,
      priorityLevel: incidentReport.priorityLevel,
      messageText: incidentReport.messageText
    }
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 SPACECELL CENTRAL INTEGRADA ATIVA`);
  console.log(`📊 DASHBOARD ADMINISTRATIVO: http://localhost:${PORT}/dashboard`);
  console.log(`=======================================================`);
});
