import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function LandingScreen({ route, navigation }) {
  const { roomId } = route.params || {};
  const [mode, setMode] = useState(null);

  const handleStartGame = (selectedMode) => {
    // USA EL ROOMID QUE VIENE DE AUTHSCREEN, no crea uno nuevo
    navigation.navigate('Home', { mode: selectedMode, roomId: roomId });
  };

  return (
    <ImageBackground source={require('../../assets/images/background.png')} style={styles.bg} blurRadius={2}>
      <LinearGradient colors={['rgba(10,10,10,0.75)', 'rgba(26,0,48,0.85)', 'rgba(10,10,10,0.75)']} style={styles.container}>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>EL JUEGO PARA</Text>
          <Text style={styles.title}>PAREJAS</Text>
          <View style={styles.divider} />
          <Text style={styles.tagline}>Verdades. Retos. Sin filtros.</Text>
        </View>

        <View style={styles.cards}>
          <TouchableOpacity onPress={() => setMode('normal')} activeOpacity={0.85}>
            <LinearGradient colors={mode === 'normal' ? ['#4a00e0', '#8e2de2'] : ['#1a1a2e', '#16213e']} style={styles.card}>
              <Text style={styles.cardEmoji}>😏</Text>
              <Text style={styles.cardTitle}>NORMAL</Text>
              <Text style={styles.cardSub}>Para todos</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setMode('adult')} activeOpacity={0.85}>
            <LinearGradient colors={mode === 'adult' ? ['#c62828', '#ff6f00'] : ['#1a0a0a', '#2d1515']} style={styles.card}>
              <Text style={styles.cardEmoji}>🔥</Text>
              <Text style={styles.cardTitle}>+18</Text>
              <Text style={styles.cardSub}>Solo adultos</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {mode ? (
          <TouchableOpacity onPress={() => handleStartGame(mode)} activeOpacity={0.9}>
            <LinearGradient colors={['#ff00cc', '#cc00ff']} style={styles.playBtn}>
              <Text style={styles.playText}>JUGAR AHORA ▶</Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <View style={styles.playBtnDisabled}>
            <Text style={styles.playTextDisabled}>Elegí un modo para jugar</Text>
          </View>
        )}

        <Text style={styles.footer}>Creada por Yeye  •  v1.0</Text>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 70, paddingBottom: 30 },
  hero: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  eyebrow: { color: '#9b59b6', fontSize: 13, letterSpacing: 6, marginBottom: 8 },
  title: { fontSize: 52, fontWeight: '900', color: '#fff', letterSpacing: 4, textShadowColor: '#cc00ff', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 20 },
  divider: { width: 60, height: 3, backgroundColor: '#cc00ff', borderRadius: 2, marginVertical: 16 },
  tagline: { color: '#aaa', fontSize: 15, letterSpacing: 2 },
  cards: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  card: { width: (width - 60) / 2, borderRadius: 20, padding: 24, alignItems: 'center' },
  cardEmoji: { fontSize: 36, marginBottom: 10 },
  cardTitle: { color: '#fff', fontWeight: '900', fontSize: 20, letterSpacing: 3 },
  cardSub: { color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 4 },
  playBtn: { borderRadius: 50, paddingVertical: 18, alignItems: 'center', marginBottom: 20, shadowColor: '#cc00ff', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 15 },
  playText: { color: '#fff', fontSize: 18, fontWeight: '900', letterSpacing: 4 },
  playBtnDisabled: { borderRadius: 50, paddingVertical: 18, alignItems: 'center', borderWidth: 1, borderColor: '#333', marginBottom: 20 },
  playTextDisabled: { color: '#555', fontSize: 14 },
  footer: { color: '#444', textAlign: 'center', fontSize: 12, letterSpacing: 1 },
});
