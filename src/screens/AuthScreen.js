import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../services/supabase';

export default function AuthScreen({ navigation }) {
  const [step, setStep] = useState('menu');
  const [code, setCode] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');

  const generateCode = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const handleCreateRoom = async () => {
    setLoading(true);
    try {
      const newCode = generateCode();
      const { data, error: err } = await supabase
        .from('rooms')
        .insert([{ code: newCode, player1_id: 'player1', status: 'waiting' }])
        .select()
        .single();

      if (err) throw err;

      setCode(newCode);
      setRoomId(data.id);
      setStep('create');
    } catch (err) {
      console.error(err);
      setError('Error creando sala');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!joinCode || joinCode.length !== 4) {
      setError('Ingresa un código válido (4 dígitos)');
      return;
    }

    setLoading(true);
    try {
      const { data: foundRoom, error: err } = await supabase
        .from('rooms')
        .select('*')
        .eq('code', joinCode)
        .single();

      if (err || !foundRoom) {
        setError('Código no encontrado');
        setLoading(false);
        return;
      }

      await supabase
        .from('rooms')
        .update({ status: 'connected' })
        .eq('id', foundRoom.id);

      setRoomId(foundRoom.id);
      setStep('joined');
    } catch (err) {
      console.error(err);
      setError('Error conectando');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'menu') {
    return (
      <LinearGradient colors={['#0a0a0a', '#1a0030', '#0a0a0a']} style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.title}>PUENTE</Text>
          <Text style={styles.subtitle}>Juego para parejas</Text>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity onPress={handleCreateRoom} style={styles.primaryBtn} disabled={loading}>
            {loading ? <ActivityIndicator color='#fff' /> : <Text style={styles.btnText}>+ CREAR SALA</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setStep('join')} style={styles.secondaryBtn}>
            <Text style={styles.btnTextAlt}>↪ UNIRME A SALA</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  if (step === 'create') {
    return (
      <LinearGradient colors={['#0a0a0a', '#1a0030', '#0a0a0a']} style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.label}>Dale este código a tu pareja</Text>
          <View style={styles.codeBox}>
            <Text style={styles.codeText}>PUENTE-{code}</Text>
          </View>
          <ActivityIndicator size='large' color='#ff00ff' style={{ marginVertical: 20 }} />
          <Text style={styles.waiting}>⏳ Esperando a tu pareja...</Text>
          <TouchableOpacity
            style={styles.playBtn}
            onPress={() => navigation.navigate('Landing', { roomId })}
          >
            <Text style={styles.btnText}>JUGAR AHORA ▶</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setStep('menu')} style={styles.backLink}>
            <Text style={styles.backText}>← Volver</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  if (step === 'join') {
    return (
      <LinearGradient colors={['#0a0a0a', '#1a0030', '#0a0a0a']} style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.label}>Ingresa el código de tu pareja</Text>
          <TextInput style={styles.input} placeholder='Ej: 6865' placeholderTextColor='#555' value={joinCode} onChangeText={setJoinCode} maxLength={4} keyboardType='numeric' />
          {error && <Text style={styles.errorText}>{error}</Text>}
          <TouchableOpacity onPress={handleJoinRoom} style={styles.primaryBtn} disabled={loading}>
            {loading ? <ActivityIndicator color='#fff' /> : <Text style={styles.btnText}>CONECTAR ✓</Text>}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setStep('menu')} style={styles.backLink}>
            <Text style={styles.backText}>← Volver al menú</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  if (step === 'joined') {
    return (
      <LinearGradient colors={['#0a0a0a', '#1a0030', '#0a0a0a']} style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.connected}>✅ ¡Conectado!</Text>
          <TouchableOpacity
            style={styles.playBtn}
            onPress={() => navigation.navigate('Landing', { roomId })}
          >
            <Text style={styles.btnText}>JUGAR AHORA ▶</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setStep('menu')} style={styles.backLink}>
            <Text style={styles.backText}>← Volver al menú</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  hero: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 64, fontWeight: '900', color: '#fff', marginBottom: 8, letterSpacing: 4 },
  subtitle: { color: '#9b59b6', fontSize: 16, letterSpacing: 2 },
  buttons: { gap: 12, marginBottom: 20 },
  primaryBtn: { backgroundColor: '#ff00ff', borderRadius: 50, paddingVertical: 18, alignItems: 'center' },
  secondaryBtn: { borderWidth: 2, borderColor: '#ff00ff', borderRadius: 50, paddingVertical: 18, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 18, fontWeight: '900', letterSpacing: 2 },
  btnTextAlt: { color: '#ff00ff', fontSize: 18, fontWeight: '900', letterSpacing: 2 },
  content: { flex: 1, justifyContent: 'center' },
  label: { color: '#9b59b6', fontSize: 14, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20, textAlign: 'center' },
  codeBox: { backgroundColor: 'rgba(255,0,255,0.1)', borderWidth: 2, borderColor: '#ff00ff', borderRadius: 16, padding: 30, marginBottom: 30, alignItems: 'center' },
  codeText: { color: '#fff', fontSize: 32, fontWeight: '900', letterSpacing: 4 },
  input: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 2, borderColor: '#333', borderRadius: 12, padding: 16, color: '#fff', fontSize: 20, textAlign: 'center', marginBottom: 20, fontWeight: 'bold' },
  waiting: { color: '#9b59b6', textAlign: 'center', fontSize: 14, fontStyle: 'italic', marginBottom: 20 },
  connected: { color: '#00ff00', textAlign: 'center', fontSize: 20, fontWeight: 'bold', marginBottom: 30 },
  playBtn: { backgroundColor: '#ff00ff', borderRadius: 50, paddingVertical: 16, alignItems: 'center', marginBottom: 20 },
  backLink: { alignItems: 'center', marginTop: 20 },
  backText: { color: '#666', fontSize: 14 },
  errorText: { color: '#ff4444', textAlign: 'center', marginBottom: 12, fontSize: 12 },
});
