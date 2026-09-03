import fs from 'fs';
import path from 'path';

const DB_FILE = path.resolve('spacecell_storage.json');

export class SpaceCellDatabase {
  static initializeDiskStorage() {
    if (!fs.existsSync(DB_FILE)) {
      const initialSchema = { logs: [], incidents: [], createdAt: new Date().toISOString() };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialSchema, null, 2), 'utf8');
    }
  }

  static persistIncident(incident: any) {
    this.initializeDiskStorage();
    const currentData = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    currentData.incidents.push({ ...incident, status: 'PENDENTE', savedAt: new Date().toISOString() });
    fs.writeFileSync(DB_FILE, JSON.stringify(currentData, null, 2), 'utf8');
  }

  static loadStoredIncidents(): any[] {
    this.initializeDiskStorage();
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')).incidents;
  }

  // Atualiza o status de atendimento de um pedido de SOS diretamente no arquivo físico
  static updateIncidentStatus(id: string, newStatus: 'EM_ATENDIMENTO' | 'RESOLVIDO'): boolean {
    this.initializeDiskStorage();
    const currentData = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    
    const incident = currentData.incidents.find((i: any) => i.id === id);
    if (incident) {
      incident.status = newStatus;
      fs.writeFileSync(DB_FILE, JSON.stringify(currentData, null, 2), 'utf8');
      return true;
    }
    return false;
  }
}
