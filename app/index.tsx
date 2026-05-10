import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../src/styles/theme';
import LeftPanel from '../src/components/LeftPanel';
import RightPanel from '../src/components/RightPanel';
import AltimeterDial from '../src/components/AltimeterDial';

export interface LogData {
  time: string;
  event: string;
  alt: number;
  qnh: number;
}

export default function App() {
  const [altitude, setAltitude] = useState(0);
  const [qnh, setQnh] = useState(1013.25);
  const [unitMode, setUnitMode] = useState('ft');
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [isFailed, setIsFailed] = useState(false);
  const [logs, setLogs] = useState<LogData[]>([]);

  // Log ekleme motoru
  const addLog = (eventMsg: string) => {
    const timeStr = new Date().toLocaleTimeString('tr-TR', { hour12: false });
    setLogs(prev => [{ time: timeStr, event: eventMsg, alt: altitude, qnh: qnh }, ...prev]);
  };

  // Olayları izle ve logla
  useEffect(() => {
    if (isFailed) {
      addLog("SİSTEM ARIZASI: FAIL");
    } else if (activeScenario) {
      addLog(`SENARYO: ${activeScenario.toUpperCase()}`);
    } else {
      addLog("SİSTEM: BEKLEMEDE");
    }
  }, [activeScenario, isFailed]);

  // Otomatik İrtifa Değişim Motoru
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (activeScenario && !isFailed) {
      interval = setInterval(() => {
        setAltitude((prev) => {
          if (activeScenario === 'kalkis') {
            return prev >= 15000 ? (setActiveScenario(null), 15000) : prev + 50;
          } else if (activeScenario === 'seyir') {
            return prev + (Math.random() * 20 - 10);
          } else if (activeScenario === 'inis') {
            return prev <= 0 ? (setActiveScenario(null), 0) : prev - 50;
          }
          return prev;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [activeScenario, isFailed]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>⟨ Altimetre Simülatörü ⟩</Text>
          <Text style={styles.badge}>EGS DERSİ — KOKPİT GÖSTERGELERİ</Text>
        </View>

        <View style={styles.mainLayout}>
          <LeftPanel altitude={altitude} qnh={qnh} setQnh={setQnh} unitMode={unitMode} setUnitMode={setUnitMode} />
          <AltimeterDial altitude={altitude} qnh={qnh} isFailed={isFailed} />
          <RightPanel 
            altitude={altitude} setAltitude={setAltitude}
            activeScenario={activeScenario} setActiveScenario={setActiveScenario}
            isFailed={isFailed} setIsFailed={setIsFailed}
            logs={logs}
          />
        </View>
      </ScrollView>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bg },
  container: { flexGrow: 1, alignItems: 'center', paddingVertical: 40, paddingHorizontal: 20 },
  header: { width: '100%', alignItems: 'center', marginBottom: 24, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerTitle: { fontSize: 20, fontWeight: '700', color: COLORS.accent, letterSpacing: 2 },
  badge: { fontSize: 10, color: COLORS.textDim, letterSpacing: 1.5, marginTop: 5 },
  mainLayout: { width: '100%', maxWidth: 500, flexDirection: 'column', gap: 20 }
});