export class GeoDecoder {
  static decodeCoordinates(lat: number, lon: number): string {
    if (lat >= -14.0 && lat <= -13.5 && lon >= -40.5 && lon <= -39.8) {
      return "Região de Jequié / Distrito de Boaçu - BA (Área de Risco de Sinal)";
    }
    if (lat >= -13.0 && lat <= -12.0 && lon >= -39.0 && lon <= -38.0) {
      return "Zonamento Metropolitano de Salvador - BA (Canal de Borda)";
    }
    return "Coordenadas Aeroespaciais Remotas - Zona Franca Não Mapeada";
  }
}
