export interface DictionarySchema {
  title: string;
  subtitle: string;
  badge: string;
  telemetryTitle: string;
  activeAlerts: string;
  billingTitle: string;
  billingSub: string;
  brFranchise: string;
  usFranchise: string;
  euFranchise: string;
  totalBrl: string;
  queueTitle: string;
  noIncidents: string;
  originLabel: string;
  zoneLabel: string;
  timeLabel: string;
  mapAction: string;
  dispatchAction: string;
  dispatchOpt1: string;
  dispatchOpt2: string;
}

export class I18nManager {
  private static dictionaries: Record<string, DictionarySchema> = {
    'PT': {
      title: '🛸 SPACECELL GLOBAL CORE',
      subtitle: 'Painel Administrativo de Controle Cambial Unificado',
      badge: 'SISTEMA ONLINE (3GPP REL-19)',
      telemetryTitle: 'Telemetria do Core',
      activeAlerts: 'Alertas de SOS ativos',
      billingTitle: 'Faturamento Consolidado',
      billingSub: 'Receita Recorrente Mensal',
      brFranchise: 'Franquia Brasil (BA-73)',
      usFranchise: 'Franquia EUA (US-01)',
      euFranchise: 'Franquia Europa (EU-01)',
      totalBrl: 'Total Convertido (BRL)',
      queueTitle: 'Mesa de Despacho de Incidentes Humanitários (SOS)',
      noIncidents: 'Nenhum incidente na fila.',
      originLabel: 'Origem',
      zoneLabel: 'Local',
      timeLabel: 'Horário',
      mapAction: '📍 Abrir Mapa',
      dispatchAction: 'Ação...',
      dispatchOpt1: 'Atender Ocorrência',
      dispatchOpt2: 'Marcar como Resolvido'
    },
    'EN': {
      title: '🛸 SPACECELL GLOBAL CORE',
      subtitle: 'Unified Currency Control Administrative Dashboard',
      badge: 'SYSTEM ONLINE (3GPP REL-19)',
      telemetryTitle: 'Core Telemetry',
      activeAlerts: 'Active SOS Alerts',
      billingTitle: 'Consolidated Billing',
      billingSub: 'Monthly Recurring Revenue',
      brFranchise: 'Brazil Franchise (BA-73)',
      usFranchise: 'USA Franchise (US-01)',
      euFranchise: 'Europe Franchise (EU-01)',
      totalBrl: 'Total Converted (BRL)',
      queueTitle: 'Humanitarian Incident Dispatch Desk (SOS)',
      noIncidents: 'No pending incidents in queue.',
      originLabel: 'Source',
      zoneLabel: 'Zone',
      timeLabel: 'Time',
      mapAction: '📍 Open Map',
      dispatchAction: 'Action...',
      dispatchOpt1: 'Attend Incident',
      dispatchOpt2: 'Mark as Resolved'
    }
  };

  // Retorna os textos traduzidos com base na escolha do operador (PT ou EN)
  static getTranslation(lang: string): DictionarySchema {
    return this.dictionaries[lang.toUpperCase()] || this.dictionaries['PT'];
  }

  // Formata o horário de acordo com o fuso local da região selecionada
  static formatTimeByLang(timestamp: string, lang: string): string {
    const date = new Date(timestamp);
    if (lang.toUpperCase() === 'EN') {
      return date.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' EST';
    }
    return date.toLocaleTimeString('pt-BR', { timeZone: 'America/Bahia' });
  }
}
