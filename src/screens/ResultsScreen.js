import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const CATEGORY_LABELS = {
  hablar: '💬 Hablar',
  conectar: '❤️ Conectar',
  reir: '😂 Reír',
};

const MESSAGES = {
  5: '🔥 ¡Conexión total! Son una pareja increíble.',
  4: '💜 ¡Muy bien! Están muy conectados.',
  3: '💛 Buen punto de partida. ¡Sigan jugando!',
  2: '🌱 Hay cosas por descubrir. ¡Vuelvan a jugar!',
  1: '🤍 Cada juego los acerca más.',
  0: '🎯 ¡Pura sorpresa! ¿Cuánto se conocen realmente?',
};

export default function ResultsScreen({ route, navigation }) {
  const { results = [] } = route.params || {};
  const totalMatches = results.filter((r) => r.didMatch).length;
  const message = MESSAGES[totalMatches] || MESSAGES[0];

  const handlePlayAgain = () => {
    navigation.navigate('Auth');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.emoji}>🎉</Text>
      <Text style={styles.title}>Resultados</Text>

      <View style={styles.scoreCard}>
        <Text style={styles.scoreNumber}>{totalMatches}/5</Text>
        <Text style={styles.scoreLabel}>COINCIDENCIAS</Text>
        <Text style={styles.scoreMessage}>{message}</Text>
      </View>

      <View style={styles.rounds}>
        <Text style={styles.roundsTitle}>Ronda a ronda</Text>
        {results.map((r, i) => (
          <View key={i} style={[styles.roundRow, r.didMatch ? styles.matchRow : styles.noMatchRow]}>
            <Text style={styles.roundNum}>Ronda {r.round}</Text>
            {r.didMatch ? (
              <Text style={styles.matchLabel}>✅ {CATEGORY_LABELS[r.yourChoice]}</Text>
            ) : (
              <Text style={styles.noMatchLabel}>
                ❌ Vos {CATEGORY_LABELS[r.yourChoice]} · Pareja {CATEGORY_LABELS[r.partnerChoice]}
              </Text>
            )}
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.playAgainBtn} onPress={handlePlayAgain}>
        <Text style={styles.playAgainText}>🔄 Jugar de nuevo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#0D0D1A', padding: 24, paddingTop: 60, alignItems: 'center' },
  emoji: { fontSize: 60, marginBottom: 8 },
  title: { color: '#fff', fontSize: 28, fontWeight: '800', marginBottom: 24 },
  scoreCard: { backgroundColor: '#1a1a2e', borderRadius: 24, padding: 32, alignItems: 'center', marginBottom: 32, width: '100%', borderWidth: 1, borderColor: '#6C63FF' },
  scoreNumber: { color: '#6C63FF', fontSize: 64, fontWeight: '900' },
  scoreLabel: { color: '#888', fontSize: 12, fontWeight: '700', letterSpacing: 3, marginBottom: 12 },
  scoreMessage: { color: '#fff', fontSize: 16, textAlign: 'center', fontWeight: '600' },
  rounds: { width: '100%', marginBottom: 32 },
  roundsTitle: { color: '#888', fontSize: 12, fontWeight: '700', letterSpacing: 2, marginBottom: 12 },
  roundRow: { borderRadius: 12, padding: 14, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  matchRow: { backgroundColor: '#0d2e1a', borderWidth: 1, borderColor: '#43C59E' },
  noMatchRow: { backgroundColor: '#2e0d1a', borderWidth: 1, borderColor: '#FF6584' },
  roundNum: { color: '#fff', fontWeight: '700', fontSize: 14 },
  matchLabel: { color: '#43C59E', fontSize: 13, fontWeight: '600' },
  noMatchLabel: { color: '#FF6584', fontSize: 12 },
  playAgainBtn: { backgroundColor: '#6C63FF', borderRadius: 16, padding: 18, alignItems: 'center', width: '100%' },
  playAgainText: { color: '#fff', fontSize: 17, fontWeight: '800' },
});
