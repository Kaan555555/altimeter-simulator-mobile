import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../styles/theme';

export default function RightPanel() {
  return (
    <View style={styles.container}>
      {/* Manuel Kontrol */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>| MANUEL KONTROL</Text>
        <View style={styles.sliderHeader}>
          <Text style={styles.sliderLabel}>İrtifa</Text>
          <Text style={styles.sliderLabel}>0 ft</Text>
        </View>
        <View style={styles.sliderTrack}><View style={styles.sliderThumb} /></View>
      </View>

      {/* Senaryo */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>| SENARYO</Text>
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.btn}><Text style={styles.btnText}>⯈ Kalkış</Text></TouchableOpacity>
          <TouchableOpacity style={styles.btn}><Text style={styles.btnText}>⯈ Seyir</Text></TouchableOpacity>
          <TouchableOpacity style={styles.btn}><Text style={styles.btnText}>⯈ İniş</Text></TouchableOpacity>
        </View>
        <TouchableOpacity style={[styles.btn, styles.dangerBtn, {marginTop: 8}]}><Text style={styles.dangerText}>■ Durdur</Text></TouchableOpacity>
        <View style={styles.scenarioBar}><View style={styles.scenarioFill} /></View>
        <Text style={styles.scenarioLabel}>— Senaryo seçilmedi —</Text>
      </View>

      {/* Enstrüman Durumu */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>| ENSTRÜMAN DURUMU</Text>
        <View style={styles.btnRow}>
          <TouchableOpacity style={[styles.btn, styles.dangerBtn]}><Text style={styles.dangerText}>⚠ Arıza</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.successBtn]}><Text style={styles.successText}>✓ Kurtar</Text></TouchableOpacity>
        </View>
      </View>

      {/* Log */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>| SİMÜLASYON LOGU</Text>
        <View style={styles.logArea}>
          <Text style={styles.logText}>[12:00:00] Simülasyon başlatıldı</Text>
        </View>
        <TouchableOpacity style={[styles.btn, styles.successBtn, {marginTop: 8}]}><Text style={styles.successText}>⬇ CSV İndir</Text></TouchableOpacity>
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
  btnText: { color: COLORS.text, fontSize: 12, fontWeight: 'bold' },
  dangerBtn: { borderColor: COLORS.danger },
  dangerText: { color: COLORS.danger, fontSize: 12, fontWeight: 'bold' },
  successBtn: { borderColor: COLORS.green },
  successText: { color: COLORS.green, fontSize: 12, fontWeight: 'bold' },
  sliderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  sliderLabel: { color: COLORS.textDim, fontSize: 10, letterSpacing: 1 },
  sliderTrack: { height: 4, backgroundColor: COLORS.dim, borderRadius: 2, justifyContent: 'center' },
  sliderThumb: { width: 16, height: 16, backgroundColor: COLORS.accent, borderRadius: 8 },
  scenarioBar: { height: 3, backgroundColor: COLORS.dim, borderRadius: 2, marginTop: 12 },
  scenarioFill: { height: '100%', width: '0%', backgroundColor: COLORS.accent, borderRadius: 2 },
  scenarioLabel: { fontSize: 10, color: COLORS.textDim, textAlign: 'center', marginTop: 8 },
  logArea: { backgroundColor: 'rgba(0,0,0,0.3)', borderColor: COLORS.border, borderWidth: 1, borderRadius: 5, padding: 8, height: 80 },
  logText: { color: COLORS.textDim, fontSize: 10 }
});