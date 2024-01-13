import { StatusBar } from 'expo-status-bar';
import React from 'react';
 import { SafeAreaView, Text, View } from 'react-native';
import Navigation from './navigation/navigation';
import home from './screens/home';

export default function App() {
  return (
      <Navigation />
  );
}

