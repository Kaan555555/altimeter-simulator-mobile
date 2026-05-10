import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { COLORS } from '../styles/theme';

interface RightPanelProps {
  altitude: number;
  setAltitude: (val: number) => void;
  activeScenario: string | null;
  setActiveScenario: (val: string | null) => void;
  isFailed: boolean;
  setIsFailed: (val: boolean) => void;
}

export default function RightPanel({ altitude, setAltitude, activeScenario, setActiveScenario, isFailed, setIsFailed }: RightPanelProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>| MANUEL KONTROL</Text>
        <View style={styles.sliderHeader}>
          <Text style={styles.sliderLabel}>İrtifa</Text>
          <Text style={styles.sliderLabel}>{Math.round(altitude)} ft</Text>
        </View>
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={0} maximumValue={45000} step={50}
          value={altitude}
          onValueChange={(val) => { if(!activeScenario) setAltitude(val); }} // Senaryo varken manuel kapatılır
          minimumTrackTintColor={activeScenario ? COLORS.dim : COLORS.accent}
          maximumTrackTintColor={COLORS.dim}
          thumbTintColor={activeScenario ? COLORS.dim : COLORS.accent}
          disabled={activeScenario !== null || isFailed}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>| SENARYO</Text>
        <View style={styles.btnRow}>
          <TouchableOpacity style={[styles.btn, activeScenario === 'kalkis' && styles.btnActive]} onPress={() => { if(!isFailed) setActiveScenario('kalkis'); }}>
            <Text style={activeScenario === 'kalkis' ? styles.btnTextActive : styles.btnText}>⯈ Kalkış</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, activeScenario === 'seyir' && styles.btnActive]} onPress={() => { if(!isFailed) setActiveScenario('seyir'); }}>
            <Text style={activeScenario === 'seyir' ? styles.btnTextActive : styles.btnText}>⯈ Seyir</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, activeScenario === 'inis' && styles.btnActive]} onPress={() => { if(!isFailed) setActiveScenario('inis'); }}>
            <Text style={activeScenario === 'inis' ? styles.btnTextActive : styles.btnText}>⯈ İniş</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={[styles.btn, styles.dangerBtn, {marginTop: 8}]} onPress={() => setActiveScenario(null)}>
          <Text style={styles.dangerText}>■ Durdur</Text>
        </TouchableOpacity>
        
        <View style={styles.scenarioBar}>
          <View style={[styles.scenarioFill, { width: activeScenario ? '100%' : '0%', backgroundColor: activeScenario ? COLORS.green : COLORS.accent }]} />
        </View>
        <Text style={styles.scenarioLabel}>
          {activeScenario === 'kalkis' ? '— Kalkış Senaryosu Aktif —' : 
           activeScenario === 'seyir' ? '— Seyir İrtifası Dalgalanıyor —' : 
           activeScenario === 'inis' ? '— İniş Senaryosu Aktif —' : '— Senaryo seçilmedi —'}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>| ENSTRÜMAN DURUMU</Text>
        <View style={styles.btnRow}>
          <TouchableOpacity style={[styles.btn, styles.dangerBtn, isFailed && {backgroundColor: 'rgba(255,59,59,0.1)'}]} onPress={() => { setIsFailed(true); setActiveScenario(null); }}>
            <Text style={styles.dangerText}>⚠ Arıza Ver</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.successBtn]} onPress={() => setIsFailed(false)}>
            <Text style={styles.successText}>✓ Kurtar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 14, width: '100%' },
  card: { backgroundColor: COLORS.panel, borderColor: COLORS.border, borderWidth: 1, borderRadius: 8, padding: 16 },
  cardTitle: { fontSize: 10, color: COLORS.textDim, letterSpacing: 1.5, marginBottom: 10, fontWeight: '700' },
  btnRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  btn: { flex: 1, paddingVertical: 10, borderWidth: 1, borderColor: COLORS.border, borderRadius: 5, alignItems: 'center' },
  btnActive: { backgroundColor: 'rgba(0,212,255,0.12)', borderColor: COLORS.accent },
  btnText: { color: COLORS.text, fontSize: 12, fontWeight: 'bold' },
  btnTextActive: { color: COLORS.accent, fontSize: 12, fontWeight: 'bold' },
  dangerBtn: { borderColor: COLORS.danger },
  dangerText: { color: COLORS.danger, fontSize: 12, fontWeight: 'bold' },
  successBtn: { borderColor: COLORS.green },
  successText: { color: COLORS.green, fontSize: 12, fontWeight: 'bold' },
  sliderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: -5 },
  sliderLabel: { color: COLORS.textDim, fontSize: 10, letterSpacing: 1 },
  scenarioBar: { height: 3, backgroundColor: COLORS.dim, borderRadius: 2, marginTop: 12 },
  scenarioFill: { height: '100%' },
  scenarioLabel: { fontSize: 10, color: COLORS.textDim, textAlign: 'center', marginTop: 8 }
});