import express from 'express';
import dotenv from 'dotenv';
import { SpaceCellSecurity } from './security.js';
import { SosPipeline } from './sosPipeline.js';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 3001;

// Rota de Ingestão de Sinal e Handshake Criptografado Zero-Trust
app.post('/api/telecom/secure-handshake', (req, res) => {
  const { msisdn, imei, latitude, longitude } = req.body;

  if (!msisdn || !imei) {
    return res.status(400).json({ success: false, error: 'Dados insuficientes.' });
  }

  // Executa o Módulo 1: Criptografia e Emissão de Chaves do eSIM Virtual
  const cryptoKeys = SpaceCellSecurity.generateVirtualEsimKeys();
  const sessionToken = SpaceCellSecurity.generateZeroTrustToken(msisdn, imei);

  return res.json({
    success: true,
    connection: 'SECURE_D2C_LINK',
    zeroTrustToken: sessionToken,
    virtualEsimProfile: {
      publicKey: cryptoKeys.publicKey,
      status: 'VERIFIED_BY_SOFTWARE_CORE'
    }
  });
});

// Rota do Módulo 2: Envio de Mensagem Crítica de SOS via Satélite para a Nuvem
app.post('/api/telecom/satellite-sos', (req, res) => {
  const { msisdn, imei, token, latitude, longitude, messageText } = req.body;

  // Validação Zero-Trust em tempo real na nuvem antes de aceitar o dado
  const isAuthorized = SpaceCellSecurity.validateSatLink(token, msisdn, imei);

  if (!isAuthorized) {
    return res.status(401).json({ success: false, error: 'SECURITY_BREACH', message: 'Assinatura satelital inválida.' });
  }

  // Processa o envio no pipeline humanitário
  const incidentReport = SosPipeline.queueEmergencyMessage(msisdn, latitude, longitude, messageText);

  return res.json({
    success: true,
    protocol: incidentReport.id,
    deliveryStatus: 'SENT_TO_EMERGENCY_CENTRAL',
    payload: incidentReport
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 SPACECELL PURE D2C CLOUD ACTIVE`);
  console.log(`🔒 MÓDULO 1: ZERO-TRUST SECURITY INTEGRATED`);
  console.log(`🚨 MÓDULO 2: HUMANITARIAN SOS PIPELINE ONLINE`);
  console.log(`=======================================================`);
});
