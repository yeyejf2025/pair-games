import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen({ route, navigation }) {
  const { mode, roomId } = route.params || {};
  const [lastTalk, setLastTalk] = useState(null);

  return (
    <LinearGradient colors={['#0a0a0a', '#1a0030', '#0a0a0a']} style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Una pregunta antes</Text>
        <Text style={styles.question}>¿Cuándo hablaron DE VERDAD?</Text>
        <View style={styles.options}>
          {[{key:'today',label:'Hoy 💬'},{key:'week',label:'Esta semana 🤔'},{key:'months',label:'Hace meses 😶'}].map((opt) => (
            <TouchableOpacity
              key={opt.key}
              style={[styles.option, lastTalk === opt.key && styles.optionSelected]}
              onPress={() => setLastTalk(opt.key)}
            >
              <Text style={styles.optionText}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {lastTalk && (
          <TouchableOpacity
            style={styles.startBtn}
            onPress={() => navigation.navigate('Choose', { mode, lastTalk, roomId })}
          >
            <Text style={styles.startText}>VAMOS →</Text>
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  back: { color: '#666', fontSize: 14, marginBottom: 30 },
  title: { color: '#9b59b6', fontSize: 13, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16, textAlign: 'center' },
  question: { fontSize: 24, fontWeight: '900', color: '#fff', textAlign: 'center', marginBottom: 36, lineHeight: 32 },
  options: { gap: 12, marginBottom: 36 },
  option: { backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 2, borderColor: '#333', borderRadius: 12, padding: 18, alignItems: 'center' },
  optionSelected: { borderColor: '#ff00ff', backgroundColor: 'rgba(255,0,255,0.08)' },
  optionText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  startBtn: { backgroundColor: '#ff00ff', borderRadius: 50, paddingVertical: 18, alignItems: 'center', shadowColor: '#ff00ff', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 15 },
  startText: { color: '#fff', fontSize: 20, fontWeight: '900', letterSpacing: 4 },
});
