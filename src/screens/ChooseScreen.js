import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../services/supabase';

export default function ChooseScreen({ route, navigation }) {
  const { roomId } = route.params || {};
  const [roundId, setRoundId] = useState(null);
  const [myPlayerId, setMyPlayerId] = useState(null);
  const [myChoice, setMyChoice] = useState(null);
  const [partnerChoice, setPartnerChoice] = useState(null);
  const [bothChose, setBothChose] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initRound = async () => {
      try {
        const { data: existingRound } = await supabase
          .from('rounds')
          .select('*')
          .eq('room_id', roomId)
          .single();

        if (existingRound) {
          setRoundId(existingRound.id);
          setMyPlayerId('player2');
        } else {
          const { data: newRound } = await supabase
            .from('rounds')
            .insert([{ room_id: roomId, player1_choice: null, player2_choice: null }])
            .select()
            .single();
          setRoundId(newRound.id);
          setMyPlayerId('player1');
        }
      } catch (err) {
        console.error('Error init round:', err);
      }
    };
    initRound();
  }, [roomId]);

  useEffect(() => {
    if (!roundId || !myPlayerId) return;

    const channel = supabase
      .channel(`round-${roundId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'rounds',
          filter: `id=eq.${roundId}`,
        },
        (payload) => {
          const updated = payload.new;
          if (myPlayerId === 'player1') {
            setMyChoice(updated.player1_choice);
            setPartnerChoice(updated.player2_choice);
          } else {
            setMyChoice(updated.player2_choice);
            setPartnerChoice(updated.player1_choice);
          }
          if (updated.player1_choice && updated.player2_choice) {
            setBothChose(true);
          }
        }
      )
      .subscribe();

    setLoading(false);
    return () => {
      supabase.removeChannel(channel);
    };
  }, [roundId, myPlayerId]);

  const handleChoose = async (choice) => {
    if (!roundId || myChoice) return;
    try {
      const updates = myPlayerId === 'player1' ? { player1_choice: choice } : { player2_choice: choice };
      await supabase.from('rounds').update(updates).eq('id', roundId);
      setMyChoice(choice);
    } catch (err) {
      console.error('Error choosing:', err);
    }
  };

  const getCategoryEmoji = (cat) => {
    return cat === 'talk' ? '🗣️' : cat === 'connect' ? '🔥' : '😂';
  };

  const getCategoryName = (cat) => {
    return cat === 'talk' ? 'Hablar' : cat === 'connect' ? 'Conectar' : 'Reír';
  };

  if (loading) {
    return (
      <LinearGradient colors={['#0a0a0a', '#1a0030', '#0a0a0a']} style={styles.container}>
        <ActivityIndicator size='large' color='#ff00ff' />
      </LinearGradient>
    );
  }

  const didMatch = myChoice && partnerChoice && myChoice === partnerChoice;

  return (
    <LinearGradient colors={['#0a0a0a', '#1a0030', '#0a0a0a']} style={styles.container}>
      {bothChose ? (
        <View style={styles.result}>
          <Text style={styles.resultTitle}>{didMatch ? '✅ COINCIDIERON' : '❌ NO COINCIDIERON'}</Text>
          <Text style={styles.resultSub}>
            {didMatch ? 'Sus respuestas van juntas 🔥' : 'Uno quería ' + getCategoryName(myChoice) + ' y otro ' + getCategoryName(partnerChoice)}
          </Text>
          <TouchableOpacity style={styles.nextBtn} onPress={() => navigation.navigate('Question', { yourChoice: myChoice, partnerChoice })}>
            <Text style={styles.nextText}>Siguiente Pregunta →</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={styles.label}>{myChoice ? '💭 ' + getCategoryName(myChoice) + ' ✓' : '💭 Vos elegís primero'}</Text>
          <Text style={styles.subtitle}>{partnerChoice ? '⏳ Tu pareja ya eligió' : '(Sin verse la opción)'}</Text>
          <View style={styles.choices}>
            {['talk', 'connect', 'laugh'].map((cat) => (
              <TouchableOpacity key={cat} style={[styles.choice, myChoice === cat && styles.choiceSelected, myChoice && myChoice !== cat && styles.choiceDisabled]} onPress={() => handleChoose(cat)} disabled={!!myChoice}>
                <Text style={styles.choiceEmoji}>{getCategoryEmoji(cat)}</Text>
                <Text style={styles.choiceName}>{getCategoryName(cat)}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {partnerChoice && !myChoice && <Text style={styles.waiting}>⏳ Tu pareja eligió... ahora vos</Text>}
        </>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  label: { fontSize: 20, fontWeight: '900', color: '#fff', textAlign: 'center', marginBottom: 8 },
  subtitle: { color: '#888', textAlign: 'center', marginBottom: 40, fontSize: 14 },
  choices: { gap: 16, marginBottom: 40 },
  choice: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 24, alignItems: 'center', borderWidth: 2, borderColor: '#333' },
  choiceSelected: { borderColor: '#ff00ff', backgroundColor: 'rgba(255,0,255,0.1)' },
  choiceDisabled: { opacity: 0.4 },
  choiceEmoji: { fontSize: 40, marginBottom: 12 },
  choiceName: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  waiting: { color: '#9b59b6', textAlign: 'center', fontSize: 14, fontStyle: 'italic' },
  result: { alignItems: 'center' },
  resultTitle: { fontSize: 32, fontWeight: '900', color: '#fff', marginBottom: 12 },
  resultSub: { color: '#aaa', fontSize: 14, marginBottom: 30, textAlign: 'center' },
  nextBtn: { backgroundColor: '#ff00ff', borderRadius: 50, paddingVertical: 16, paddingHorizontal: 40 },
  nextText: { color: '#fff', fontWeight: '900', letterSpacing: 2 },
});
