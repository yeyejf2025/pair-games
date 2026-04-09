import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { gamesData } from '../constants/games';

export default function GameScreen({ route, navigation }) {
  const { mode } = route.params;
  const [currentCard, setCurrentCard] = useState(null);
  const [cardType, setCardType] = useState(null);

  const getRandomCard = (type) => {
    const list = gamesData[type][mode];
    const random = list[Math.floor(Math.random() * list.length)];
    setCurrentCard(random);
    setCardType(type);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Volver</Text>
      </TouchableOpacity>

      <Text style={styles.modeLabel}>{mode === 'normal' ? 'Modo Normal' : 'Modo +18 🔥'}</Text>

      {currentCard ? (
        <View style={[styles.card, cardType === 'truths' ? styles.cardTruth : styles.cardDare]}>
          <Text style={styles.cardType}>{cardType === 'truths' ? '💬 VERDAD' : '⚡ RETO'}</Text>
          <Text style={styles.cardText}>{currentCard}</Text>
          <TouchableOpacity style={styles.nextButton} onPress={() => getRandomCard(cardType)}>
            <Text style={styles.nextText}>Siguiente →</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.chooseContainer}>
          <Text style={styles.chooseTitle}>¿Qué elegís?</Text>
          <TouchableOpacity style={styles.truthButton} onPress={() => getRandomCard('truths')}>
            <Text style={styles.buttonText}>💬 VERDAD</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dareButton} onPress={() => getRandomCard('dares')}>
            <Text style={styles.buttonText}>⚡ RETO</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d0d', padding: 20 },
  backButton: { marginTop: 50, marginBottom: 10 },
  backText: { color: '#aaa', fontSize: 16 },
  modeLabel: { color: '#ff00ff', fontSize: 14, textAlign: 'center', marginBottom: 30, letterSpacing: 2, textTransform: 'uppercase' },
  chooseContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20 },
  chooseTitle: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  truthButton: { backgroundColor: '#6200ea', width: '100%', padding: 25, borderRadius: 16, alignItems: 'center' },
  dareButton: { backgroundColor: '#d50000', width: '100%', padding: 25, borderRadius: 16, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 22, fontWeight: 'bold', letterSpacing: 2 },
  card: { flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 24, padding: 30, marginTop: 20 },
  cardTruth: { backgroundColor: '#1a0040', borderWidth: 2, borderColor: '#6200ea' },
  cardDare: { backgroundColor: '#3d0000', borderWidth: 2, borderColor: '#d50000' },
  cardType: { color: '#fff', fontSize: 16, letterSpacing: 3, marginBottom: 30, opacity: 0.7 },
  cardText: { color: '#fff', fontSize: 24, fontWeight: 'bold', textAlign: 'center', lineHeight: 36 },
  nextButton: { marginTop: 40, backgroundColor: 'rgba(255,255,255,0.1)', padding: 15, borderRadius: 30, paddingHorizontal: 30 },
  nextText: { color: '#fff', fontSize: 16 },
});
