import express from 'express';
import dotenv from 'dotenv';
import { SpaceCellSecurity } from './security.js';
import { SosPipeline } from './sosPipeline.js';
import { FranchiseManager } from './franchiseManager.js';
import { GeoDecoder } from './geoDecoder.js';
import { AuthManager } from './authManager.js';
import { CurrencyConverter } from './currencyConverter.js';
import { I18nManager } from './i18nManager.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = Number(process.env.PORT) || 3001;
let activeSessionToken: string | null = null;

// Painel Master com suporte a Internacionalização (i18n)
app.get('/dashboard', (req, res) => {
  if (!activeSessionToken) return res.redirect('/login');

  // Captura o idioma da URL (?lang=EN ou ?lang=PT). O padrão será PT
  const currentLang = (req.query.lang as string) || 'PT';
  const text = I18nManager.getTranslation(currentLang);

  const alerts = SosPipeline.getActiveAlerts();
  
  // Lógica Financeira Global
  const revenueBA = FranchiseManager.getNetworkRevenue();
  const revenueUS = CurrencyConverter.convertToBrl(4500, 'USD');
  const revenueEU = CurrencyConverter.convertToBrl(2100, 'EUR');
  const globalTotalRevenue = revenueBA + revenueUS.amountInBrl + revenueEU.amountInBrl;

  // Renderização dos cards de alerta baseados no idioma ativo
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
        <p style="margin: 5px 0; color: #94a3b8;">
          ${text.originLabel}: +55 ${a.msisdn} | 
          ${text.zoneLabel}: <span style="color: #22c55e;">${locationName}</span> | 
          ${text.timeLabel}: <span style="color: #38bdf8;">${localizedTime}</span>
        </p>
        <p style="color: #f1f5f9; margin: 8px 0;">"${a.messageText}"</p>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <a href="https://google.com{a.latitude},${a.longitude}" target="_blank" style="color: #38bdf8; text-decoration: none; font-size: 14px;">${text.mapAction}</a>
          <form action="/api/ops/dispatch" method="POST" style="margin: 0;">
            <input type="hidden" name="id" value="${a.id}">
            <input type="hidden" name="lang" value="${currentLang}">
            <select name="status" onchange="this.form.submit()" style="background: #0f172a; color: white; border: 1px solid #334155; padding: 4px; border-radius: 4px;">
              <option value="">${text.dispatchAction}</option>
              <option value="EM_ATENDIMENTO">${text.dispatchOpt1}</option>
              <option value="RESOLVIDO">${text.dispatchOpt2}</option>
            </select>
          </form>
        </div>
      </div>
    `;
  }).join('');

  res.send(`
    <!DOCTYPE html>
    <html lang="${currentLang.toLowerCase()}">
    <head>
      <meta charset="UTF-8">
      <title>SpaceCell Master Control Room</title>
      <style>
        body { background: #0f172a; color: #f8fafc; font-family: system-ui, sans-serif; margin: 40px; }
        .container { max-width: 1100px; margin: 0 auto; }
        .header { border-bottom: 2px solid #334155; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
        .badge { background: #22c55e; color: #052e16; padding: 6px 12px; border-radius: 9999px; font-weight: bold; font-size: 12px; }
        .grid { display: grid; grid-template-columns: 1fr 2fr; gap: 20px; }
        .panel { background: #1e293b; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .currency-row { display: flex; justify-content: space-between; color: #94a3b8; font-size: 13px; margin: 4px 0; }
        .lang-btn { background: #334155; border: 1px solid #475569; color: white; padding: 6px 12px; border-radius: 4px; cursor: pointer; text-decoration: none; font-size: 13px; font-weight: bold; margin-left: 5px; }
        .lang-btn.active { background: #38bdf8; color: #0f172a; border-color: #38bdf8; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div>
            <h1>${text.title}</h1>
            <p style="color: #94a3b8; margin: 0;">${text.subtitle}</p>
          </div>
          <div style="display: flex; align-items: center;">
            <div style="margin-right: 15px;">
              <a href="/dashboard?lang=PT" class="lang-btn ${currentLang === 'PT' ? 'active' : ''}">PT</a>
              <a href="/dashboard?lang=EN" class="lang-btn ${currentLang === 'EN' ? 'active' : ''}">EN</a>
            </div>
            <span class="badge">${text.badge}</span>
          </div>
        </div>
        
        <div class="grid">
          <div>
            <div class="panel">
              <h2>${text.telemetryTitle}</h2>
              <p style="color: #94a3b8;">${text.activeAlerts}: <span style="color: #ef4444; font-weight: bold;">${alerts.length}</span></p>
            </div>
            <div class="panel" style="border-top: 4px solid #22c55e;">
              <h2>${text.billingTitle}</h2>
              <p style="color: #64748b; font-size: 12px; margin: 0 0 10px 0;">${text.billingSub}</p>
              <div class="currency-row"><span>${text.brFranchise}:</span> <span style="color: white;">R$ ${revenueBA.toLocaleString('pt-BR')}</span></div>
              <div class="currency-row"><span>${text.usFranchise}:</span> <span style="color: white;">US$ 4.500,00</span></div>
              <div class="currency-row"><span>${text.euFranchise}:</span> <span style="color: white;">€ 2.100,00</span></div>
              <hr style="border-color: #334155; margin: 10px 0;">
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">${text.totalBrl}:</p>
              <p style="font-size: 26px; color: #22c55e; font-weight: bold; margin: 5px 0;">R$ ${globalTotalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
          <div class="panel">
            <h2>${text.queueTitle}</h2>
            ${alerts.length === 0 ? `<p style="color: #64748b;">${text.noIncidents}</p>` : alertCards}
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
});

// [Rotas obrigatórias de sinalização aeroespacial preservadas]
app.get('/login', (req, res) => { res.send('<body style="background: #0f172a; color: white; font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh;"><form action="/login" method="POST" style="background: #1e293b; padding: 40px; border-radius: 8px; border: 1px solid #334155;"><h2>🛸 SpaceCell Login</h2><input type="text" name="username" placeholder="Usuário" style="width: 100%; padding: 8px; margin: 10px 0; background: #0f172a; border: 1px solid #334155; color: white;" required><br><input type="password" name="password" placeholder="Senha" style="width: 100%; padding: 8px; margin: 10px 0; background: #0f172a; border: 1px solid #334155; color: white;" required><br><button type="submit" style="width: 100%; padding: 10px; background: #38bdf8; font-weight: bold; cursor: pointer;">Entrar</button></form></body>'); });
app.post('/login', (req, res) => { const { username, password } = req.body; const auth = AuthManager.login(username, password); if (auth.success && auth.token) { activeSessionToken = auth.token; return res.redirect('/dashboard'); } res.send('Erro de login.'); });
app.post('/api/telecom/secure-handshake', (req, res) => { res.json({ success: true, zeroTrustToken: SpaceCellSecurity.generateZeroTrustToken(req.body.msisdn, req.body.imei) }); });
app.post('/api/telecom/satellite-sos', (req, res) => { const report = SosPipeline.queueEmergencyMessage(req.body.msisdn, req.body.latitude, req.body.longitude, req.body.messageText); res.json({ success: true, protocol: report.id, payload: report }); });
app.post('/api/ops/dispatch', (req, res) => { const { id, status, lang } = req.body; const db = JSON.parse(require('fs').readFileSync(require('path').resolve('spacecell_relational.db'), 'utf8')); const inc = db.table_incidents.find((i: any) => i.id === id); if (inc) inc.statusAtendimento = status; require('fs').writeFileSync(require('path').resolve('spacecell_relational.db'), JSON.stringify(db, null, 2), 'utf8'); res.redirect(`/dashboard?lang=${lang || 'PT'}`); });

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 CORE ENGINE INTERNACIONALIZADO OPERANDO EM PT/EN`);
  console.log(`=======================================================`);
});
