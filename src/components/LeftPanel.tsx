import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../styles/theme';

// TypeScript için prop tiplerini tanımlıyoruz
interface LeftPanelProps {
  altitude: number;
  qnh: number;
  setQnh: (val: number) => void;
  unitMode: string;
  setUnitMode: (val: string) => void;
}

export default function LeftPanel({ altitude, qnh, setQnh, unitMode, setUnitMode }: LeftPanelProps) {
  const m = Math.round(altitude * 0.3048);
  const inHg = (qnh * 0.02953).toFixed(2);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>| İRTİFA DEĞERİ</Text>
        <Text style={styles.readout}>{Math.round(altitude)}</Text>
        <Text style={styles.unit}>FEET</Text>
        <Text style={[styles.readout, { fontSize: 16, color: '#5a9aaa', marginTop: 10 }]}>{m}</Text>
        <Text style={styles.unit}>METRE</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>| BİRİM</Text>
        <View style={styles.btnRow}>
          <TouchableOpacity style={[styles.btn, unitMode === 'ft' && styles.btnActive]} onPress={() => setUnitMode('ft')}>
            <Text style={unitMode === 'ft' ? styles.btnTextActive : styles.btnText}>FEET</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, unitMode === 'm' && styles.btnActive]} onPress={() => setUnitMode('m')}>
            <Text style={unitMode === 'm' ? styles.btnTextActive : styles.btnText}>METRE</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>| QNH AYARI</Text>
        <View style={styles.qnhRow}>
          <TouchableOpacity style={styles.btnSmall} onPress={() => setQnh(Math.max(900, qnh - 0.25))}><Text style={styles.btnText}>-</Text></TouchableOpacity>
          <View style={styles.qnhDisplay}><Text style={styles.qnhText}>{qnh.toFixed(2)} hPa</Text></View>
          <TouchableOpacity style={styles.btnSmall} onPress={() => setQnh(Math.min(1050, qnh + 0.25))}><Text style={styles.btnText}>+</Text></TouchableOpacity>
        </View>
        <Text style={styles.qnhInhg}>{inHg} inHg</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>| ALARM DURUMU</Text>
        <View style={styles.alarmStatus}>
          <View style={styles.dot} />
          <Text style={styles.alarmText}>Normal — Alarm Yok</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 14, width: '100%' },
  card: { backgroundColor: COLORS.panel, borderColor: COLORS.border, borderWidth: 1, borderRadius: 8, padding: 16 },
  cardTitle: { fontSize: 10, color: COLORS.textDim, letterSpacing: 1.5, marginBottom: 10, fontWeight: '700' },
  readout: { fontSize: 32, fontWeight: 'bold', color: COLORS.accent, textAlign: 'center' },
  unit: { fontSize: 10, color: COLORS.textDim, textAlign: 'center', letterSpacing: 2, marginTop: 4 },
  btnRow: { flexDirection: 'row', gap: 8 },
  btn: { flex: 1, paddingVertical: 10, borderWidth: 1, borderColor: COLORS.border, borderRadius: 5, alignItems: 'center' },
  btnActive: { backgroundColor: 'rgba(0,212,255,0.12)', borderColor: COLORS.accent },
  btnText: { color: COLORS.text, fontSize: 12, fontWeight: 'bold' },
  btnTextActive: { color: COLORS.accent, fontSize: 12, fontWeight: 'bold' },
  qnhRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qnhDisplay: { flex: 1, backgroundColor: 'rgba(255,179,0,0.06)', borderColor: 'rgba(255,179,0,0.2)', borderWidth: 1, borderRadius: 5, padding: 8, alignItems: 'center' },
  qnhText: { color: COLORS.amber, fontWeight: 'bold', fontSize: 16 },
  btnSmall: { paddingHorizontal: 15, paddingVertical: 8, borderWidth: 1, borderColor: COLORS.border, borderRadius: 5 },
  qnhInhg: { textAlign: 'center', fontSize: 10, color: COLORS.textDim, marginTop: 8 },
  alarmStatus: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, borderWidth: 1, borderColor: COLORS.border, borderRadius: 5 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.dim },
  alarmText: { color: COLORS.textDim, fontSize: 12 }
});