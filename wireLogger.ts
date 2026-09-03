import crypto from 'crypto';

interface RawPacket {
  id: string;
  protocol: '3GPP-REL19-NTN' | 'UDP-EDGE-NB';
  hexDump: string;
  direction: 'UPLINK' | 'DOWNLINK';
  timestamp: string;
}

export class WireLogger {
  private static livePackets: RawPacket[] = [];

  static logIncomingPacket(msisdn: string, type: 'SOS' | 'CHAT'): RawPacket {
    const rawBuffer = crypto.randomBytes(16);
    const hexDump = `[${type}] ` + rawBuffer.toString('hex').match(/.{1,4}/g)?.join(' ')?.toUpperCase();

    const packet: RawPacket = {
      id: `PKT-${crypto.randomUUID().substring(0, 6).toUpperCase()}`,
      protocol: type === 'SOS' ? '3GPP-REL19-NTN' : 'UDP-EDGE-NB',
      hexDump,
      direction: 'UPLINK',
      timestamp: new Date().toISOString()
    };

    if (this.livePackets.length >= 5) this.livePackets.shift();
    this.livePackets.push(packet);

    return packet;
  }

  static getLivePackets(): RawPacket[] {
    if (this.livePackets.length === 0) {
      return [
        { id: 'PKT-INIT01', protocol: '3GPP-REL19-NTN', hexDump: 'SYS_HEARTBEAT_OK // BEAM_ID_LATAM_01', direction: 'DOWNLINK', timestamp: new Date().toISOString() }
      ];
    }
    return this.livePackets;
  }
}
