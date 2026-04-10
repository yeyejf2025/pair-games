import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import AuthScreen from './src/screens/AuthScreen';
import LandingScreen from './src/screens/LandingScreen';
import HomeScreen from './src/screens/HomeScreen';
import ChooseScreen from './src/screens/ChooseScreen';
import QuestionScreen from './src/screens/QuestionScreen';
import ResultsScreen from './src/screens/ResultsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Auth' component={AuthScreen} />
        <Stack.Screen name='Landing' component={LandingScreen} />
        <Stack.Screen name='Home' component={HomeScreen} />
        <Stack.Screen name='Choose' component={ChooseScreen} />
        <Stack.Screen name='Question' component={QuestionScreen} />
        <Stack.Screen name='Results' component={ResultsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
