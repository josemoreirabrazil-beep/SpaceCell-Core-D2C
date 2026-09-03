import fs from 'fs';
import path from 'path';

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
      content += `Nenhum incidente crítico registrado no período de órbita ativo.\n`;
    } else {
      incidents.forEach((inc, index) => {
        content += `${index + 1}. [PROTOCOL: ${inc.id}] STATUS: ${inc.status || 'PENDENTE'}\n` +
                   `📱 LINE: +55 ${inc.msisdn} | ZONE: Região de Jequié - BA\n` +
                   `💬 DATA PAYLOAD: "${inc.messageText}"\n` +
                   `-------------------------------------------------------\n`;
      });
    }

    fs.writeFileSync(filePath, content, 'utf8');
    return filePath;
  }
}
