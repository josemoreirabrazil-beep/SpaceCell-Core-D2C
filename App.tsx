import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, StatusBar, Dimensions } from 'react-native';

interface SatelliteTelemetry {
  signalStrengthDbm: number;
  orbitLatencyMs: number;
  calculatedLatitude: number;
  calculatedLongitude: number;
  marginOfErrorMeters: number;
}

export default function App() {
  const [telemetry, setTelemetry] = useState<SatelliteTelemetry>({
    signalStrengthDbm: -72,
    orbitLatencyMs: 45,
    calculatedLatitude: -13.8564,
    calculatedLongitude: -40.0812,
    marginOfErrorMeters: 850
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        ...prev,
        signalStrengthDbm: Math.floor(Math.random() * (-85 - -65 + 1)) + -65,
        orbitLatencyMs: Math.floor(Math.random() * (55 - 40 + 1)) + 40,
        marginOfErrorMeters: Math.floor(Math.random() * (900 - 800 + 1)) + 800
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🛸 MESA DE DESPACHO MÓVEL</Text>
          <Text style={styles.headerSubtitle}>SpaceCell NTN Tactical Locator</Text>
        </View>

        {/* Componente Gráfico Simulado do Mapa de Borda */}
        <View style={styles.mapBox}>
          <Text style={styles.mapTitle}>📍 Radar de Cobertura Espacial (Boaçu - BA)</Text>
          <View style={styles.radarCircle}>
            <View style={styles.radarTarget} />
          </View>
          <Text style={styles.coordinatesText}>
            Lat: {telemetry.calculatedLatitude} | Lon: {telemetry.calculatedLongitude}
          </Text>
          <Text style={styles.errorText}>
            Precisão de Borda: ± {telemetry.marginOfErrorMeters} metros
          </Text>
        </View>

        {/* Telemetria de Recepção em Decibéis */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📡 Nível de Sinal do Satélite</Text>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Ganho de Antena:</Text>
            <Text style={[styles.metricValue, { color: telemetry.signalStrengthDbm > -78 ? '#22c55e' : '#ef4444' }]}>
              {telemetry.signalStrengthDbm} dBm
            </Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Atraso de Órbita:</Text>
            <Text style={styles.metricValue}>{telemetry.orbitLatencyMs} ms</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  scrollContainer: { padding: 20, alignItems: 'center', width: '100%' },
  header: { alignItems: 'center', marginBottom: 25, marginTop: 10 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#38bdf8', letterSpacing: 0.5 },
  headerSubtitle: { fontSize: 12, color: '#94a3b8', marginTop: 4 },
  mapBox: { width: '100%', backgroundColor: '#090d16', borderPadding: 16, borderRadius: 12, padding: 15, borderWidth: 1, borderColor: '#1e293b', alignItems: 'center', marginBottom: 20 },
  mapTitle: { fontSize: 13, fontWeight: 'bold', color: '#94a3b8', marginBottom: 15 },
  radarCircle: { width: 140, height: 140, borderRadius: 70, borderWidth: 2, borderColor: '#38bdf8', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', marginVertical: 10, opacity: 0.8 },
  radarTarget: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#ef4444' },
  coordinatesText: { fontSize: 13, fontFamily: 'monospace', color: '#f1f5f9', marginTop: 12 },
  errorText: { fontSize: 11, color: '#64748b', marginTop: 4 },
  card: { width: '100%', backgroundColor: '#1e293b', borderRadius: 12, padding: 18, borderWidth: 1, borderColor: '#334155' },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#f8fafc', marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#334155', paddingBottom: 6 },
  metricRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 6 },
  metricLabel: { fontSize: 13, color: '#94a3b8' },
  metricValue: { fontSize: 13, fontWeight: '600', color: '#f1f5f9' }
});
