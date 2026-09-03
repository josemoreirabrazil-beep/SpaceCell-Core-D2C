import fs from 'fs';
import path from 'path';
import { RsaSigner } from './rsaSigner.js';

export class ReportGenerator {
  private static reportDir = path.resolve('exported_reports');

  static generateIncidentReport(incidents: any[]): string {
    if (!fs.existsSync(this.reportDir)) {
      fs.mkdirSync(this.reportDir);
    }

    const reportId = `REP-${Math.floor(1000 + Math.random() * 9000)}`;
    const filePath = path.join(this.reportDir, `${reportId}_audit_log.txt`);

    let content = `=======================================================\n` +
                  `🛸 SPACECELL PURE D2C - INCIDENT AUDIT REPORT\n` +
                  `📝 REPORT ID: ${reportId} | DATE: ${new Date().toLocaleDateString()}\n` +
                  `=======================================================\n\n`;

    if (incidents.length === 0) {
      content += `Nenhum incidente critico registrado no periodo de orbita ativo.\n`;
    } else {
      incidents.forEach((inc, index) => {
        content += `${index + 1}. [PROTOCOL: ${inc.id}] STATUS: ${inc.status || 'PENDENTE'}\n` +
                   `📱 LINE: +55 ${inc.msisdn} | ZONE: Regiao de Jequie - BA\n` +
                   `💬 DATA PAYLOAD: "${inc.messageText}"\n` +
                   `-------------------------------------------------------\n`;
      });
    }

    // Gera a assinatura criptográfica assimétrica baseada no conteúdo do texto
    const digitalSignature = RsaSigner.signData(content);
    
    content += `\n🛡️ [SECURITY FOOTER] ASSINATURA DIGITAL RSA-2048:\n${digitalSignature}\n`;
    content += `=======================================================`;

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`📋 [REPORT ENGINE] Relatorio com Assinatura RSA gerado com sucesso.`);
    return filePath;
  }
}
