export class VoiceCompressor {
  // Comprime amostras de áudio brutas para pacotes de rádio NTN de banda estreita
  static compressVoicePayload(rawBufferHex: string): string {
    if (!rawBufferHex) return "0000";
    
    // Remove cabeçalhos duplicados e comprime o tráfego simulando amostragem Codec LBR
    const compressedHex = rawBufferHex.substring(0, Math.min(16, rawBufferHex.length)).toUpperCase();
    console.log("🎚️ [CODEC ESPACIAL] Onda de áudio comprimida para transmissão em banda estreita.");
    return "NTN-LBR-" + compressedHex;
  }

  // Descomprime o payload na central de socorro para reprodução no painel do operador
  static decompressVoicePayload(compressedToken: string): string {
    if (!compressedToken.startsWith("NTN-LBR-")) return compressedToken;
    return compressedToken.replace("NTN-LBR-", "") + "FFFFFFFF";
  }
}
