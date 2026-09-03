import { SatTriangulator } from './satTriangulator.js';

function runSpaceTriangulationTest() {
  console.log('🛸 INICIANDO COMPUTAÇÃO ORBITAL - TRIANGULAÇÃO DE ANTENAS ESPACIAIS NTN');

  // Coleta a potência de sinal (RSSI) de 3 satélites LEO de órbita baixa
  const activeBeacons = [
    { satelliteId: "SPACECELL-LEO-01", signalStrengthDbm: -68, estimatedDistanceKm: 550 },
    { satelliteId: "SPACECELL-LEO-02", signalStrengthDbm: -72, estimatedDistanceKm: 580 },
    { satelliteId: "SPACECELL-LEO-03", signalStrengthDbm: -85, estimatedDistanceKm: 610 }
  ];

  console.log('📡 Analisando feixes de rádio da constelação aeroespacial...');
  
  // Executa o algoritmo do triangulador espacial
  const locationPayload = SatTriangulator.calculatePosition(activeBeacons);

  console.log('\n=======================================================');
  console.log('🎯 POSIÇÃO CALCULADA VIA HARDWARE ESPACIAL (CapEx Zero)');
  console.log('📍 Latitude Estimada: ' + locationPayload.calculatedLatitude);
  console.log('📍 Longitude Estimada: ' + locationPayload.calculatedLongitude);
  console.log('📏 Margem de Erro de Borda: ' + locationPayload.marginOfErrorMeters + ' metros');
  console.log('=======================================================');
}

runSpaceTriangulationTest();
