import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { PlayerProvider } from './src/context/PlayerContext';
import HomeScreen from './src/screens/HomeScreen';
import PlayerScreen from './src/screens/PlayerScreen';
import { RootStackParamList } from './src/navigation/types';
import { Colors } from './src/theme/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <PlayerProvider>
      <NavigationContainer>
        <StatusBar style="light" backgroundColor={Colors.background} />
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{ headerShown: false, animation: 'slide_from_bottom' }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Player" component={PlayerScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PlayerProvider>
  );
}
