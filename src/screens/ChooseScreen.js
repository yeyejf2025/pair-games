import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '../services/supabase';

const CATEGORIES = [
  { id: 'hablar', label: '💬 Hablar', color: '#6C63FF' },
  { id: 'conectar', label: '❤️ Conectar', color: '#FF6584' },
  { id: 'reir', label: '😂 Reír', color: '#43C59E' },
];

export default function ChooseScreen({ route, navigation }) {
  const { roomId, roundNumber = 1, results = [] } = route.params || {};
  const [myChoice, setMyChoice] = useState(null);
  const [player1Choice, setPlayer1Choice] = useState(null);
  const [player2Choice, setPlayer2Choice] = useState(null);
  const [myRole, setMyRole] = useState(null);
  const [roundId, setRoundId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('Preparando ronda...');
  const intervalRef = useRef(null);
  const navigatedRef = useRef(false);

  useEffect(() => {
    initRound();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const initRound = async () => {
    try {
      // Get my role from room
      const { data: room } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId)
        .single();

      const role = room?.player2_id ? 'player2' : 'player1';
      setMyRole(role);

      // Check if round for this round_number already exists
      const { data: existingRound } = await supabase
        .from('rounds')
        .select('*')
        .eq('room_id', roomId)
        .eq('round_number', roundNumber)
        .maybeSingle();

      let rid;
      if (existingRound) {
        rid = existingRound.id;
        setPlayer1Choice(existingRound.player1_choice);
        setPlayer2Choice(existingRound.player2_choice);
      } else {
        // Create new round
        const { data: newRound, error } = await supabase
          .from('rounds')
          .insert({ room_id: roomId, round_number: roundNumber })
          .select()
          .single();

        if (error) {
          // Race condition: round was just created by partner
          const { data: retryRound } = await supabase
            .from('rounds')
            .select('*')
            .eq('room_id', roomId)
            .eq('round_number', roundNumber)
            .maybeSingle();
          rid = retryRound?.id;
        } else {
          rid = newRound.id;
        }
      }

      setRoundId(rid);
      setLoading(false);
      setStatus('Elegí una categoría');

      // Start polling
      intervalRef.current = setInterval(() => pollRound(rid), 1500);
    } catch (e) {
      console.error('initRound error:', e);
      setLoading(false);
    }
  };

  const pollRound = async (rid) => {
    if (!rid || navigatedRef.current) return;
    try {
      const { data } = await supabase
        .from('rounds')
        .select('*')
        .eq('id', rid)
        .single();

      if (data) {
        setPlayer1Choice(data.player1_choice);
        setPlayer2Choice(data.player2_choice);
      }
    } catch (e) {
      console.error('poll error:', e);
    }
  };

  useEffect(() => {
    if (!roundId || navigatedRef.current) return;
    if (player1Choice && player2Choice) {
      navigatedRef.current = true;
      if (intervalRef.current) clearInterval(intervalRef.current);

      const yourChoice = myRole === 'player1' ? player1Choice : player2Choice;
      const partnerChoice = myRole === 'player1' ? player2Choice : player1Choice;

      setTimeout(() => {
        navigation.navigate('Question', {
          roomId,
          yourChoice,
          partnerChoice,
          roundNumber,
          results,
        });
      }, 800);
    }
  }, [player1Choice, player2Choice, roundId]);

  const handleChoose = async (categoryId) => {
    if (myChoice || !roundId) return;
    setMyChoice(categoryId);
    setStatus('Esperando a tu pareja...');

    const field = myRole === 'player1' ? 'player1_choice' : 'player2_choice';
    await supabase
      .from('rounds')
      .update({ [field]: categoryId })
      .eq('id', roundId);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={styles.loadingText}>Preparando ronda {roundNumber}...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.roundLabel}>RONDA {roundNumber} DE 5</Text>
      <Text style={styles.title}>Elegí una categoría</Text>
      <Text style={styles.subtitle}>Tu pareja elige al mismo tiempo, sin verse</Text>

      <View style={styles.categories}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryBtn,
              { borderColor: cat.color },
              myChoice === cat.id && { backgroundColor: cat.color },
            ]}
            onPress={() => handleChoose(cat.id)}
            disabled={!!myChoice}
          >
            <Text style={[styles.categoryText, myChoice === cat.id && { color: '#fff' }]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.status}>{status}</Text>

      {myChoice && (
        <View style={styles.waitingContainer}>
          <ActivityIndicator size="small" color="#6C63FF" />
          <Text style={styles.waitingText}>Esperando a tu pareja...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D1A', padding: 24, justifyContent: 'center' },
  center: { flex: 1, backgroundColor: '#0D0D1A', justifyContent: 'center', alignItems: 'center' },
  roundLabel: { color: '#6C63FF', fontSize: 13, fontWeight: '700', textAlign: 'center', letterSpacing: 2, marginBottom: 8 },
  title: { color: '#fff', fontSize: 26, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  subtitle: { color: '#888', fontSize: 14, textAlign: 'center', marginBottom: 40 },
  categories: { gap: 16 },
  categoryBtn: {
    borderWidth: 2, borderRadius: 16, padding: 20,
    alignItems: 'center',
  },
  categoryText: { color: '#fff', fontSize: 20, fontWeight: '700' },
  status: { color: '#888', textAlign: 'center', marginTop: 32, fontSize: 14 },
  waitingContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 16, gap: 8 },
  waitingText: { color: '#6C63FF', fontSize: 14 },
  loadingText: { color: '#888', marginTop: 16, fontSize: 14 },
});
