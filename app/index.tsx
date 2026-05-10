import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../src/styles/theme';
import LeftPanel from '../src/components/LeftPanel';
import RightPanel from '../src/components/RightPanel';
import AltimeterDial from '../src/components/AltimeterDial';

export default function App() {
  const [altitude, setAltitude] = useState(0);
  const [qnh, setQnh] = useState(1013.25);
  const [unitMode, setUnitMode] = useState('ft');
  
  // YENİ: Senaryo ve Arıza State'leri
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [isFailed, setIsFailed] = useState(false);

  // YENİ: Otomatik Senaryo Motoru
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (activeScenario && !isFailed) {
      interval = setInterval(() => {
        setAltitude((prev) => {
          if (activeScenario === 'kalkis') {
            if (prev >= 15000) { setActiveScenario(null); return 15000; }
            return prev + 50; // Hızlıca tırman
          } else if (activeScenario === 'seyir') {
            return prev + (Math.random() * 20 - 10); // İrtifa hafifçe dalgalansın
          } else if (activeScenario === 'inis') {
            if (prev <= 0) { setActiveScenario(null); return 0; }
            return prev - 50; // Hızlıca alçal
          }
          return prev;
        });
      }, 100); // Saniyede 10 kere güncelle
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
          
          <LeftPanel 
            altitude={altitude} qnh={qnh} setQnh={setQnh}
            unitMode={unitMode} setUnitMode={setUnitMode}
          />

          <AltimeterDial 
            altitude={altitude} qnh={qnh} isFailed={isFailed} 
          />

          <RightPanel 
            altitude={altitude} setAltitude={setAltitude}
            activeScenario={activeScenario} setActiveScenario={setActiveScenario}
            isFailed={isFailed} setIsFailed={setIsFailed}
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