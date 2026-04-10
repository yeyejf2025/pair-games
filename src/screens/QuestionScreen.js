import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const QUESTIONS = {
  hablar: [
    '¿Hay algo que quisiste preguntarme pero no te animaste?',
    '¿Cuál fue el momento más difícil que viviste solo/a este año?',
    '¿Hay algo que sientes que no te entiendo bien?',
    '¿Qué cosa mía te sorprende todavía?',
    '¿Qué es lo que más valorás de nuestra comunicación?',
    '¿Hay algo que necesitás de mí y no me lo dijiste?',
    '¿Qué conversación pendiente tenemos?',
  ],
  conectar: [
    '¿Cuándo fue la última vez que me sentiste realmente presente/a?',
    '¿Qué detalle mío te hace sentir más amado/a?',
    '¿Hay algo que hacemos juntos que querés que hagamos más?',
    '¿En qué momento del día pensás más en mí?',
    '¿Qué ritual nuestro te parece más especial?',
    '¿Qué es lo que más extrañás de cuando recién nos conocimos?',
    '¿Cómo me demuestro que me importás cuando estás ocupado/a?',
  ],
  reir: [
    '¿Cuál es el chiste interno nuestro que más te hace reír?',
    '¿Qué cosa ridícula hacemos juntos que amamos?',
    '¿Cuál fue el momento más embarazoso que vivimos?',
    '¿Si fuéramos personajes de una serie, quiénes seríamos?',
    '¿Qué cosa mía te parece graciosa aunque no lo admitas?',
    '¿Cuál fue la situación más absurda que vivimos?',
    '¿Qué canción nos define como pareja aunque sea horrible?',
  ],
};

const CATEGORY_LABELS = {
  hablar: '💬 Hablar',
  conectar: '❤️ Conectar',
  reir: '😂 Reír',
};

export default function QuestionScreen({ route, navigation }) {
  const {
    roomId,
    yourChoice,
    partnerChoice,
    roundNumber = 1,
    results = [],
  } = route.params || {};

  const didMatch = yourChoice === partnerChoice;
  const category = didMatch ? yourChoice : yourChoice;
  const questions = QUESTIONS[category] || QUESTIONS.hablar;
  const questionIndex = (roundNumber - 1) % questions.length;
  const question = questions[questionIndex];

  const [answer, setAnswer] = useState('');
  const isLastRound = roundNumber >= 5;

  const handleNext = () => {
    const newResults = [
      ...results,
      {
        round: roundNumber,
        didMatch,
        yourChoice,
        partnerChoice,
      },
    ];

    if (isLastRound) {
      navigation.navigate('Results', { results: newResults });
    } else {
      navigation.navigate('Choose', {
        roomId,
        roundNumber: roundNumber + 1,
        results: newResults,
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.roundLabel}>RONDA {roundNumber} DE 5</Text>
        {didMatch ? (
          <View style={styles.matchBadge}>
            <Text style={styles.matchText}>✨ ¡Coincidieron en {CATEGORY_LABELS[yourChoice]}!</Text>
          </View>
        ) : (
          <View style={styles.noMatchBadge}>
            <Text style={styles.noMatchText}>
              Vos: {CATEGORY_LABELS[yourChoice]} · Pareja: {CATEGORY_LABELS[partnerChoice]}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.questionCard}>
        <Text style={styles.questionLabel}>PREGUNTA</Text>
        <Text style={styles.questionText}>{question}</Text>
      </View>

      <Text style={styles.instruction}>
        Respondan de forma independiente, luego compártanla en voz alta.
      </Text>

      <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
        <Text style={styles.nextText}>
          {isLastRound ? '🎉 Ver resultados' : `Siguiente ronda →`}
        </Text>
      </TouchableOpacity>

      <Text style={styles.progressText}>
        {results.length} de {roundNumber} rondas completadas
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#0D0D1A', padding: 24, paddingTop: 60 },
  header: { marginBottom: 32, alignItems: 'center' },
  roundLabel: { color: '#6C63FF', fontSize: 13, fontWeight: '700', letterSpacing: 2, marginBottom: 12 },
  matchBadge: { backgroundColor: '#1a1a2e', borderWidth: 1, borderColor: '#43C59E', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  matchText: { color: '#43C59E', fontWeight: '700', fontSize: 15 },
  noMatchBadge: { backgroundColor: '#1a1a2e', borderWidth: 1, borderColor: '#FF6584', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  noMatchText: { color: '#FF6584', fontWeight: '600', fontSize: 13 },
  questionCard: { backgroundColor: '#1a1a2e', borderRadius: 20, padding: 28, marginBottom: 24, borderWidth: 1, borderColor: '#2a2a4e' },
  questionLabel: { color: '#6C63FF', fontSize: 11, fontWeight: '700', letterSpacing: 3, marginBottom: 16 },
  questionText: { color: '#fff', fontSize: 22, fontWeight: '700', lineHeight: 32 },
  instruction: { color: '#666', fontSize: 13, textAlign: 'center', marginBottom: 40, lineHeight: 20 },
  nextBtn: { backgroundColor: '#6C63FF', borderRadius: 16, padding: 18, alignItems: 'center', marginBottom: 16 },
  nextText: { color: '#fff', fontSize: 17, fontWeight: '800' },
  progressText: { color: '#444', textAlign: 'center', fontSize: 12 },
});
