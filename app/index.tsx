import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import { Barometer } from 'expo-sensors';
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
  
  // YENİ: Gerçek Sensör State'i
  const [isSensorActive, setIsSensorActive] = useState(false);

  const addLog = (eventMsg: string) => {
    const timeStr = new Date().toLocaleTimeString('tr-TR', { hour12: false });
    setLogs(prev => [{ time: timeStr, event: eventMsg, alt: altitude, qnh: qnh }, ...prev]);
  };

  // Logları Dinle
  useEffect(() => {
    if (isFailed) addLog("SİSTEM ARIZASI: FAIL");
    else if (activeScenario) addLog(`SENARYO: ${activeScenario.toUpperCase()}`);
    else if (isSensorActive) addLog("GERÇEK SENSÖR BAĞLANDI");
    else addLog("SİSTEM: BEKLEMEDE");
  }, [activeScenario, isFailed, isSensorActive]);

  // Çakışmaları Önle (Sensör açılırsa senaryoyu kapat, senaryo açılırsa sensörü kapat)
  useEffect(() => { if (isSensorActive) setActiveScenario(null); }, [isSensorActive]);
  useEffect(() => { if (activeScenario) setIsSensorActive(false); }, [activeScenario]);

  // YENİ: GERÇEK SENSÖR (BAROMETRE) MOTORU
  useEffect(() => {
    let sub: any = null;
    if (isSensorActive && !isFailed) {
      Barometer.isAvailableAsync().then(available => {
        if (available) {
          Barometer.setUpdateInterval(250); // Saniyede 4 kez veriyi tazele
          sub = Barometer.addListener(({ pressure }) => {
            // Basıncı (hPa) İrtifaya (Feet) çeviren havacılık formülü
            const altMeters = 44330 * (1 - Math.pow(pressure / qnh, 1 / 5.255));
            const altFeet = altMeters * 3.28084;
            setAltitude(altFeet > 0 ? altFeet : 0);
          });
        } else {
          Alert.alert("Sensör Bulunamadı", "Cihazınızda donanımsal barometre yok.");
          setIsSensorActive(false);
        }
      });
    }
    return () => { if (sub) sub.remove(); };
  }, [isSensorActive, isFailed, qnh]);

  // Otomatik Senaryo Motoru
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (activeScenario && !isFailed && !isSensorActive) {
      interval = setInterval(() => {
        setAltitude((prev) => {
          if (activeScenario === 'kalkis') return prev >= 15000 ? (setActiveScenario(null), 15000) : prev + 50;
          else if (activeScenario === 'seyir') return prev + (Math.random() * 20 - 10);
          else if (activeScenario === 'inis') return prev <= 0 ? (setActiveScenario(null), 0) : prev - 50;
          return prev;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [activeScenario, isFailed, isSensorActive]);

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
            isSensorActive={isSensorActive} setIsSensorActive={setIsSensorActive}
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