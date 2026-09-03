import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { SpaceCellSecurity } from './security.js';
import { SosPipeline } from './sosPipeline.js';
import { FranchiseManager } from './franchiseManager.js';
import { GeoDecoder } from './geoDecoder.js';
import { AuthManager } from './authManager.js';
import { CurrencyConverter } from './currencyConverter.js';
import { I18nManager } from './i18nManager.js';
import { WireLogger } from './wireLogger.js';
import { LoadBalancer } from './loadBalancer.js';
import { ReportGenerator } from './reportGenerator.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = Number(process.env.PORT) || 3001;
let activeSessionToken: string | null = 'SIMULATED_SESSION_OK';

app.get('/dashboard', (req, res) => {
  if (!activeSessionToken) return res.redirect('/login');

  const currentLang = (req.query.lang as string) || 'PT';
  const text = I18nManager.getTranslation(currentLang);

  const alerts = SosPipeline.getActiveAlerts();
  const livePackets = WireLogger.getLivePackets();
  const clusters = LoadBalancer.getClusterMetrics();
  
  const revenueBA = FranchiseManager.getNetworkRevenue();
  const revenueUS = CurrencyConverter.convertToBrl(4500, 'USD');
  const revenueEU = CurrencyConverter.convertToBrl(2100, 'EUR');
  const globalTotalRevenue = revenueBA + revenueUS.amountInBrl + revenueEU.amountInBrl;

  const alertCards = alerts.map(a => {
    const locationName = GeoDecoder.decodeCoordinates(a.latitude, a.longitude);
    const statusColor = a.status === 'RESOLVIDO' ? '#22c55e' : a.status === 'EM_ATENDIMENTO' ? '#f59e0b' : '#ef4444';
    const localizedTime = I18nManager.formatTimeByLang(a.timestamp, currentLang);
    
    return `
      <div style="background: #1e293b; border-left: 5px solid ${statusColor}; padding: 15px; margin-bottom: 10px; border-radius: 4px;">
        <div style="display: flex; justify-content: space-between;">
          <strong style="color: #ef4444;">[${a.priorityLevel}] ID: ${a.id}</strong>
          <span style="background: ${statusColor}; color: #000; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 11px;">${a.status || 'PENDENTE'}</span>
        </div>
        <p style="margin: 5px 0; color: #94a3b8; font-size: 13px;">
          ${text.originLabel}: +55 ${a.msisdn} | ${text.zoneLabel}: <span style="color: #22c55e;">${locationName}</span> | ${text.timeLabel}: ${localizedTime}
        </p>
        <p style="color: #f1f5f9; margin: 8px 0;">"${a.messageText}"</p>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <a href="https://google.com{a.latitude},${a.longitude}" target="_blank" style="color: #38bdf8; text-decoration: none; font-size: 14px;">${text.mapAction}</a>
        </div>
      </div>
    `;
  }).join('');

  const clusterCards = clusters.map(c => `
    <div style="border-bottom: 1px solid #334155; padding: 8px 0; font-size: 13px;">
      <strong style="color: #38bdf8;">${c.nodeId}</strong> - <span style="color: #64748b;">${c.region}</span><br>
      <span>Carga: ${c.currentConnections} / ${c.maxCapacity}</span> | 
      <span style="color: ${c.status === 'HEALTHY' ? '#22c55e' : '#ef4444'}; font-weight: bold;">${c.status}</span>
    </div>
  `).join('');

  const packetLines = livePackets.map(p => `
    <div style="font-family: monospace; font-size: 11px; padding: 4px 0; border-bottom: 1px solid #1e293b; color: #38bdf8">
      [${p.timestamp.substring(11, 19)}] | ${p.protocol} | <strong>${p.id}</strong><br>
      <span style="color: #64748b;">HEX:</span> ${p.hexDump}
    </div>
  `).join('');

  res.send(`
    <!DOCTYPE html>
    <html lang="${currentLang.toLowerCase()}">
    <head>
      <meta charset="UTF-8">
      <title>SpaceCell Control Center</title>
      <style>
        body { background: #0f172a; color: #f8fafc; font-family: system-ui, sans-serif; margin: 30px; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { border-bottom: 2px solid #334155; padding-bottom: 20px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center; }
        .grid { display: grid; grid-template-columns: 1fr 2fr; gap: 20px; }
        .panel { background: #1e293b; padding: 18px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #334155; }
        .currency-row { display: flex; justify-content: space-between; color: #94a3b8; font-size: 13px; margin: 4px 0; }
        .lang-btn { background: #334155; border: 1px solid #475569; color: white; padding: 5px 10px; border-radius: 4px; cursor: pointer; text-decoration: none; font-size: 12px; font-weight: bold; margin-left: 5px; }
        .lang-btn.active { background: #38bdf8; color: #0f172a; border-color: #38bdf8; }
        .download-btn { display: block; width: 100%; text-align: center; background: #22c55e; color: #052e16; padding: 10px 0; border-radius: 4px; font-weight: bold; text-decoration: none; margin-top: 15px; cursor: pointer; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div>
            <h1 style="margin: 0; font-size: 28px; color: #38bdf8;">${text.title}</h1>
            <p style="color: #94a3b8; margin: 3px 0 0 0; font-size: 14px;">${text.subtitle}</p>
          </div>
          <div>
            <a href="/dashboard?lang=PT" class="lang-btn ${currentLang === 'PT' ? 'active' : ''}">PT</a>
            <a href="/dashboard?lang=EN" class="lang-btn ${currentLang === 'EN' ? 'active' : ''}">EN</a>
          </div>
        </div>
        <div class="grid">
          <div>
            <div class="panel" style="border-top: 4px solid #22c55e;">
              <h3>${text.billingTitle}</h3>
              <p style="font-size: 22px; color: #22c55e; font-weight: bold; margin: 0;">R$ ${globalTotalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
            <div class="panel" style="border-top: 4px solid #38bdf8;">
              <h3>Métricas de Infraestrutura AWS</h3>
              ${clusterCards}
              <a href="/api/ops/export-report" target="_blank" class="download-btn">📥 Exportar Relatório SRE (.txt)</a>
            </div>
            <div class="panel" style="background: #090d16; border-top: 4px solid #a78bfa;">
              <h3>${text.wiresharkTitle}</h3>
              <div>${packetLines}</div>
            </div>
          </div>
          <div class="panel">
            <h3>${text.queueTitle}</h3>
            ${alerts.length === 0 ? `<p style="color: #64748b;">${text.noIncidents}</p>` : alertCards}
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Endpoint de Exportação Física de Arquivo de Auditoria para o Operador
app.get('/api/ops/export-report', (req, res) => {
  const incidents = SosPipeline.getActiveAlerts();
  const generatedPath = ReportGenerator.generateIncidentReport(incidents);
  res.download(generatedPath, path.basename(generatedPath));
});

// [Endpoints de Handshake, Ingestão e SOS preservados]
app.post('/api/telecom/satellite-sos', (req, res) => {
  LoadBalancer.routeToNextAvailableNode(req.body.msisdn);
  const report = SosPipeline.queueEmergencyMessage(req.body.msisdn, req.body.latitude, req.body.longitude, req.body.messageText);
  WireLogger.logIncomingPacket(req.body.msisdn, 'SOS');
  res.json({ success: true, protocol: report.id, payload: report });
});
app.post('/api/telecom/secure-handshake', (req, res) => { res.json({ success: true, zeroTrustToken: SpaceCellSecurity.generateZeroTrustToken(req.body.msisdn, req.body.imei) }); });

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 INSTÂNCIA UNIFICADA ATIVA COM EXPORTAÇÃO DE RELATÓRIO`);
  console.log(`=======================================================`);
});
