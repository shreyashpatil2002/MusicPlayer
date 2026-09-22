import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { PlayerProvider } from './src/context/PlayerContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import HomeScreen from './src/screens/HomeScreen';
import PlayerScreen from './src/screens/PlayerScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { RootStackParamList } from './src/navigation/types';
import { Colors } from './src/theme/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor={Colors.background} />
      <Stack.Navigator
        initialRouteName={isAuthenticated ? 'Home' : 'Onboarding'}
        screenOptions={{ headerShown: false, animation: 'slide_from_bottom' }}
      >
        {!isAuthenticated ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Player" component={PlayerScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <AppNavigator />
      </PlayerProvider>
    </AuthProvider>
  );
}
