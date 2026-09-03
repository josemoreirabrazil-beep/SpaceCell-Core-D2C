import crypto from 'crypto';

interface ChatMessage {
  messageId: string;
  senderMsisdn: string;
  recipientMsisdn: string;
  encryptedPayload: string;
  timestamp: string;
}

export class ChatManager {
  private static messageStore: ChatMessage[] = [];

  // Transmite a mensagem encapsulando o texto em payloads Base64 para canais de satélite LEO
  static routeMessage(sender: string, recipient: string, text: string): ChatMessage {
    const newMessage: ChatMessage = {
      messageId: "MSG-" + crypto.randomUUID().substring(0, 8).toUpperCase(),
      senderMsisdn: sender,
      recipientMsisdn: recipient,
      encryptedPayload: Buffer.from(text, 'utf8').toString('base64'),
      timestamp: new Date().toISOString()
    };

    this.messageStore.push(newMessage);
    console.log("\n💬 [CHAT CORE] Mensagem transmitida via satélite: " + newMessage.messageId);
    return newMessage;
  }

  // Recupera as sessões de conversas armazenadas em memória por número de telefone
  static getHistoryForUser(msisdn: string): ChatMessage[] {
    return this.messageStore.filter(m => m.senderMsisdn === msisdn || m.recipientMsisdn === msisdn);
  }
}
