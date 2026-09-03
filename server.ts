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
import { ChatManager } from './chatManager.js';
import { DdosMitigator } from './ddosMitigator.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = Number(process.env.PORT) || 3001;
let activeSessionToken: string | null = 'SIMULATED_SESSION_OK';

export const MfaSessionStore = {
  currentMfaCode: "7294",
  isVerified: false
};

let securityIncidentsLog: string[] = [
  "INFO [" + new Date().toLocaleTimeString() + "] Sistema de Defesa de Borda inicializado com sucesso."
];

app.get('/dashboard', (req, res) => {
  if (!activeSessionToken) return res.redirect('/login');

  const currentLang = (req.query.lang as string) || 'PT';
  const text = I18nManager.getTranslation(currentLang);
  const alerts = SosPipeline.getActiveAlerts();
  const livePackets = WireLogger.getLivePackets();
  
  const clusters = [
    ...LoadBalancer.getClusterMetrics(),
    { nodeId: "AWS-US-EAST-1", region: "N. Virgínia (Failover Global)", currentConnections: 120, maxCapacity: 10000, status: 'HEALTHY' },
    { nodeId: "AWS-EU-CENTRAL-1", region: "Frankfurt (Backup Continente)", currentConnections: 45, maxCapacity: 10000, status: 'HEALTHY' }
  ];
  
  const targetMsisdn = '73998599213';
  const chatHistory = ChatManager.getHistoryForUser(targetMsisdn);
  const globalTotalRevenue = FranchiseManager.getNetworkRevenue() + CurrencyConverter.convertToBrl(4500, 'USD').amountInBrl + CurrencyConverter.convertToBrl(2100, 'EUR').amountInBrl;

  let alertCards = '';
  alerts.forEach(a => {
    alertCards += '<div style="background: #1e293b; border-left: 5px solid #ef4444; padding: 15px; margin-bottom: 10px; border-radius: 4px;">' +
                  '<strong>[' + a.priorityLevel + '] ID: ' + a.id + '</strong><br>' +
                  '<small style="color: #94a3b8;">' + text.originLabel + ': +55 ' + a.msisdn + ' | ' + text.zoneLabel + ': ' + GeoDecoder.decodeCoordinates(a.latitude, a.longitude) + '</small>' +
                  '<p style="color: #f1f5f9; margin: 8px 0;">"' + a.messageText + '"</p>' +
                  '</div>';
  });

  let clusterCards = '';
  clusters.forEach(c => {
    clusterCards += '<div style="border-bottom: 1px solid #334155; padding: 8px 0; font-size: 13px;">' +
                    '<strong style="color: #38bdf8;">' + c.nodeId + '</strong> - <small style="color:#64748b;">' + c.region + '</small><br>' +
                    '<span>Carga: ' + c.currentConnections + ' / ' + c.maxCapacity + '</span> | ' +
                    '<span style="color: #22c55e; font-weight: bold;">' + c.status + '</span>' +
                    '</div>';
  });

  let packetLines = '';
  livePackets.forEach(p => {
    packetLines += '<div style="font-family: monospace; font-size: 11px; padding: 2px 0; color: #38bdf8;">[' + p.protocol + '] Hex: ' + p.hexDump + '</div>';
  });

  let chatLines = '';
  chatHistory.forEach(c => {
    const isMaster = c.senderMsisdn === 'CORE_MASTER';
    chatLines += '<div style="margin-bottom: 6px; font-size: 13px; text-align: ' + (isMaster ? 'right' : 'left') + ';">' +
                 '<span style="background: #334155; padding: 4px 8px; border-radius: 4px; display: inline-block;">' + Buffer.from(c.encryptedPayload, 'base64').toString('utf8') + '</span>' +
                 '</div>';
  });

  let securityAuditLines = securityIncidentsLog.map(log => 
    '<div style="font-family: monospace; font-size: 11px; color: #f43f5e; padding: 2px 0; border-bottom: 1px solid #311218;">' + log + '</div>'
  ).join('');

  // HTML com o CSS do Osciloscópio simplificado em animação de opacidade contínua
  let htmlHtml = '<!DOCTYPE html><html><head><title>SpaceCell Control</title>' +
                 '<style>' +
                 'body { background: #0f172a; color: #f8fafc; font-family: sans-serif; margin: 30px; }' +
                 '@keyframes blinkWave { 0% { opacity: 0.2; } 50% { opacity: 1; } 100% { opacity: 0.2; } }' +
                 '.wave-bar { display: inline-block; width: 6px; height: 25px; background: #38bdf8; margin: 0 3px; border-radius: 3px; animation: blinkWave 1s infinite ease-in-out; }' +
                 '.w2 { animation-delay: 0.2s; background: #22c55e; }' +
                 '.w3 { animation-delay: 0.4s; background: #a78bfa; }' +
                 '</style>' +
                 '</head><body>' +
                 '<div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 2px solid #334155; padding-bottom: 20px; margin-bottom: 25px;">' +
                 '  <div><h1 style="margin:0;color:#38bdf8;">' + text.title + '</h1><p style="color: #94a3b8; margin:5px 0 0 0;">' + text.subtitle + '</p></div>' +
                 '  <div style="background:#090d16; padding:12px 20px; border-radius:8px; display:flex; align-items:center; border:1px solid #334155;">' +
                 '    <span style="color:#64748b; font-size:12px; font-family:monospace; margin-right:12px; font-weight:bold;">SATELLITE BEAM LINK:</span>' +
                 '    <div class="wave-bar w1"></div><div class="wave-bar w2"></div><div class="wave-bar w3"></div>' +
                 '  </div>' +
                 '</div>' +
                 '<div style="margin-bottom: 20px;">' +
                 '  <a href="/dashboard?lang=PT" style="color: #38bdf8; margin-right: 15px; font-weight:bold; text-decoration:none;">[ PT ]</a>' +
                 '  <a href="/dashboard?lang=EN" style="color: #38bdf8; font-weight:bold; text-decoration:none;">[ EN ]</a>' +
                 '</div>' +
                 '<div style="display: grid; grid-template-columns: 1fr 2fr; gap: 20px;">' +
                 '  <div>' +
                 '    <div style="background: #1e293b; padding: 18px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #334155; border-top: 4px solid #22c55e;">' +
                 '      <h3 style="margin-top:0;">' + text.billingTitle + '</h3>' +
                 '      <p style="font-size:24px; color:#22c55e; font-weight:bold; margin:0;">R$ ' + globalTotalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + '</p>' +
                 '    </div>' +
                 '    <div style="background: #1e293b; padding: 18px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #334155; border-top: 4px solid #38bdf8;">' +
                 '      <h3 style="margin-top:0;">AWS Multi-Region</h3>' +
                 '      ' + clusterCards +
                 '      <a href="/api/ops/export-report" target="_blank" style="display:block; text-align:center; background:#22c55e; color:#052e16; padding:10px; margin-top:15px; border-radius:4px; font-weight:bold; text-decoration:none;">📥 Exportar Relatório SRE (.txt)</a>' +
                 '    </div>' +
                 '    <div style="background: #1e293b; padding: 18px; border-radius: 8px; margin-bottom: 20px; border-top: 4px solid #f59e0b; border-1px solid #334155;">' +
                 '      <h3 style="margin-top:0;">🛡️ Segundo Fator MFA Satelital</h3>' +
                 '      <p style="font-size:13px; color:#94a3b8; margin:0 0 12px 0;">Status: ' + (MfaSessionStore.isVerified ? '<span style="color:#22c55e;font-weight:bold;">VERIFICADO</span>' : '<span style="color:#ef4444;font-weight:bold;">PENDENTE</span>') + '</p>' +
                 '      <form action="/api/ops/verify-mfa" method="POST" style="display:flex; gap:10px;">' +
                 '        <input type="text" name="mfaCode" placeholder="Código (Ex: 7294)" style="flex:1; background:#0f172a; color:white; border:1px solid #334155; padding:8px; border-radius:4px;" required>' +
                 '        <button type="submit" style="background:#38bdf8; color:#0f172a; border:none; font-weight:bold; padding:0 15px; border-radius:4px; cursor:pointer;">Validar</button>' +
                 '      </form>' +
                 '    </div>' +
                 '    <div style="background: #1c0d12; border: 1px solid #991b1b; padding: 18px; border-radius: 8px; margin-bottom: 20px;">' +
                 '      <h3 style="color: #f43f5e; margin-top:0;">🛡️ Auditoria de Segurança (Anti-DDoS)</h3>' +
                        '<div style="max-height: 120px; overflow-y:auto;">' + securityAuditLines + '</div>' +
                 '    </div>' +
                 '    <div style="background: #090d16; padding: 18px; border-radius: 8px; border: 1px solid #334155; border-top: 4px solid #a78bfa;">' +
                 '      <h3 style="margin-top:0; color:#a78bfa;">' + text.wiresharkTitle + '</h3>' +
                 '      <div style="max-height:180px; overflow-y:auto;">' + packetLines + '</div>' +
                 '    </div>' +
                 '  </div>' +
                 '  <div style="background: #1e293b; padding: 18px; border-radius: 8px; border: 1px solid #334155;">' +
                 '    <h3 style="margin-top:0;">' + text.queueTitle + '</h3>' +
                 '    ' + alertCards +
                 '    <hr style="border-color: #334155; margin: 25px 0;">' +
                 '    <h3 style="color:#f59e0b;">' + text.chatTitle + '</h3>' +
                 '    <div style="background:#0f172a; height:150px; overflow-y:auto; padding:12px; margin-bottom:12px; border-radius:4px; border:1px solid #334155;">' + chatLines + '</div>' +
                 '  </div>' +
                 '</div></body></html>';

  res.send(htmlHtml);
});

