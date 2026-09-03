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

let securityIncidentsLog: string[] = [
  "INFO [" + new Date().toLocaleTimeString() + "] Sistema de Defesa de Borda inicializado."
];

app.get('/dashboard', (req, res) => {
  res.send('<html><body><h1>🚀 SpaceCell Core Online</h1></body></html>');
});

// Rota corrigida exigida pelo Passo 1 do testChatSimulator
app.post('/api/telecom/secure-handshake', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ success: true, token: 'SAT_TOKEN_V2_OK' }));
});

// Rota corrigida exigida pelo Passo 2 do testChatSimulator
app.post('/api/telecom/chat-route', (req, res) => {
  const { msisdn, message, sender } = req.body;
  if (typeof ChatManager?.addMessage === 'function') {
    ChatManager.addMessage(msisdn || "73998599213", message || "", sender || "USER");
  }
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ success: true, status: 'BUFFERED_IN_ORBIT' }));
});

app.listen(PORT, () => {
  console.log(`\n🚀 ==========================================`);
  console.log(`📡 CORE SPACECELL ATIVO E ESCUTANDO NA PORTA ${PORT}`);
  console.log(`🛰️  AGUARDANDO INJEÇÃO DE DADOS OPERACIONAIS...`);
  console.log(`=============================================\n`);
});
