import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
// İŞTE SİHİRLİ DOKUNUŞ: Expo 54 uyumluluğu için "legacy" ekledik!
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { COLORS } from '../styles/theme';
import { LogData } from '../../app/index';

interface RightPanelProps {
  altitude: number;
  setAltitude: (val: number) => void;
  activeScenario: string | null;
  setActiveScenario: (val: string | null) => void;
  isFailed: boolean;
  setIsFailed: (val: boolean) => void;
  logs: LogData[];
}

export default function RightPanel({ altitude, setAltitude, activeScenario, setActiveScenario, isFailed, setIsFailed, logs }: RightPanelProps) {
  
  const exportToCSV = async () => {
    if (logs.length === 0) {
      Alert.alert("Bilgi", "Henüz kayıtlı veri yok.");
      return;
    }
    try {
      let csvString = "Saat,Olay,Irtifa(ft),QNH(hPa)\n";
      logs.forEach(l => csvString += `${l.time},${l.event},${Math.round(l.alt)},${l.qnh.toFixed(2)}\n`);
      
      const fileUri = `${FileSystem.documentDirectory}altimetre_kayit.csv`;
      
      // Artık temiz temiz orijinal fonksiyonları kullanabiliyoruz
      await FileSystem.writeAsStringAsync(fileUri, csvString, { encoding: FileSystem.EncodingType.UTF8 });
      
      const canShare = await Sharing.isAvailableAsync();
      
      if (canShare) { 
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/csv',
          dialogTitle: 'Simülasyon Logunu İndir',
          UTI: 'public.comma-separated-values-text'
        }); 
      } else {
        Alert.alert("Desteklenmiyor", "Bu cihazda dosya paylaşımı yapılamıyor.");
      }
    } catch (e: any) { 
      Alert.alert("Sistem Hatası", e.message || String(e)); 
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>| MANUEL KONTROL</Text>
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={0} maximumValue={45000} step={50} value={altitude}
          onValueChange={(val) => !activeScenario && setAltitude(val)}
          disabled={activeScenario !== null || isFailed}
          minimumTrackTintColor={COLORS.accent} thumbTintColor={COLORS.accent}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>| SENARYO KONTROL</Text>
        <View style={styles.btnRow}>
          <TouchableOpacity style={[styles.btn, activeScenario === 'kalkis' && styles.btnActive]} onPress={() => !isFailed && setActiveScenario('kalkis')}>
            <Text style={activeScenario === 'kalkis' ? styles.btnTextActive : styles.btnText}>⯈ KALKIŞ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, activeScenario === 'inis' && styles.btnActive]} onPress={() => !isFailed && setActiveScenario('inis')}>
            <Text style={activeScenario === 'inis' ? styles.btnTextActive : styles.btnText}>⯈ İNİŞ</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={[styles.btn, styles.dangerBtn, {marginTop: 10}]} onPress={() => setActiveScenario(null)}>
          <Text style={styles.dangerText}>■ DURDUR</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>| SİSTEM DURUMU</Text>
        <View style={styles.btnRow}>
          <TouchableOpacity style={[styles.btn, styles.dangerBtn, isFailed && {backgroundColor: 'rgba(255,59,59,0.2)'}]} onPress={() => { setIsFailed(true); setActiveScenario(null); }}>
            <Text style={styles.dangerText}>⚠ ARIZA VER</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.successBtn]} onPress={() => setIsFailed(false)}>
            <Text style={styles.successText}>✓ SIFIRLA</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>| SİMÜLASYON LOGU</Text>
        <View style={styles.logArea}>
          <ScrollView nestedScrollEnabled={true}>
            {logs.length > 0 ? (
              logs.map((log, i) => (
                <Text key={i} style={styles.logText}>[{log.time}] {log.event} - {Math.round(log.alt)}ft</Text>
              ))
            ) : (
              <Text style={styles.logText}>— Veri bekleniyor... —</Text>
            )}
          </ScrollView>
        </View>
        <TouchableOpacity style={[styles.btn, styles.successBtn, {marginTop: 10}]} onPress={exportToCSV}>
          <Text style={styles.successText}>⬇ CSV OLARAK İNDİR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 14, width: '100%' },
  card: { backgroundColor: COLORS.panel, borderColor: COLORS.border, borderWidth: 1, borderRadius: 8, padding: 16 },
  cardTitle: { fontSize: 10, color: COLORS.textDim, letterSpacing: 1.5, marginBottom: 10, fontWeight: '700' },
  btnRow: { flexDirection: 'row', gap: 8 },
  btn: { flex: 1, paddingVertical: 12, borderWidth: 1, borderColor: COLORS.border, borderRadius: 6, alignItems: 'center' },
  btnActive: { backgroundColor: 'rgba(0,212,255,0.1)', borderColor: COLORS.accent },
  btnText: { color: COLORS.text, fontSize: 11, fontWeight: 'bold' },
  btnTextActive: { color: COLORS.accent, fontSize: 11, fontWeight: 'bold' },
  dangerBtn: { borderColor: COLORS.danger },
  dangerText: { color: COLORS.danger, fontSize: 11, fontWeight: 'bold' },
  successBtn: { borderColor: COLORS.green },
  successText: { color: COLORS.green, fontSize: 11, fontWeight: 'bold' },
  logArea: { backgroundColor: '#000', borderRadius: 4, padding: 8, height: 100, borderWidth: 1, borderColor: '#333' },
  logText: { color: '#0f0', fontSize: 10, fontFamily: 'monospace', marginBottom: 2 }
});