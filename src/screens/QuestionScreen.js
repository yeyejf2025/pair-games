import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const QUESTIONS = {
  talk: ['¿Hay algo que quisiste preguntarme pero no te animaste?', '¿Cuál fue el momento en que más me amaste?', '¿Qué te preocupa que no hayas compartido?'],
  connect: ['¿Qué parte de mí te atrae más?', '¿Cuándo fue la última vez que me deseaste?', '¿Hay algo que quisiste probar conmigo?'],
  laugh: ['¿Cuál es mi costumbre más ridicula?', '¿Qué me hace diferente?', '¿Cuándo reímos más juntos?'],
};

export default function QuestionScreen({ route, navigation }) {
  const { mode, yourChoice, partnerChoice } = route.params || {};
  const [response, setResponse] = useState('');
  const [step, setStep] = useState('input');

  const category = yourChoice || partnerChoice || 'talk';
  const question = QUESTIONS[category][0];

  return (
    <LinearGradient colors={['#0a0a0a', '#1a0030', '#0a0a0a']} style={styles.container}>
      <ScrollView>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Volver</Text>
        </TouchableOpacity>
        <View style={styles.card}>
          <Text style={styles.question}>{question}</Text>
          {step === 'input' ? (
            <>
              <TextInput style={styles.input} placeholder='Tu respuesta...' placeholderTextColor='#555' multiline value={response} onChangeText={setResponse} />
              <TouchableOpacity style={styles.btn} onPress={() => setStep('done')}>
                <Text style={styles.btnText}>Siguiente →</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.responseBox}>
                <Text style={styles.response}>{response || 'Sin respuesta'}</Text>
              </View>
              <TouchableOpacity style={styles.anotherBtn} onPress={() => { setResponse(''); setStep('input'); }}>
                <Text style={styles.btnText}>Otra pregunta</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.endBtn} onPress={() => navigation.navigate('Landing')}>
                <Text style={styles.btnText}>Nos vemos</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  back: { color: '#666', marginBottom: 20 },
  card: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: '#333' },
  question: { color: '#fff', fontSize: 24, fontWeight: '900', marginBottom: 30, lineHeight: 32 },
  input: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 16, color: '#fff', minHeight: 100, marginBottom: 20, borderWidth: 1, borderColor: '#333' },
  btn: { backgroundColor: '#ff00ff', borderRadius: 50, padding: 16, alignItems: 'center', marginBottom: 20 },
  anotherBtn: { backgroundColor: '#6200ea', borderRadius: 50, padding: 16, alignItems: 'center', marginBottom: 12 },
  endBtn: { backgroundColor: '#333', borderRadius: 50, padding: 16, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '900', letterSpacing: 1 },
  responseBox: { backgroundColor: 'rgba(100,0,200,0.1)', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#6200ea', marginBottom: 20 },
  response: { color: '#fff', fontSize: 16, lineHeight: 24 },
});
