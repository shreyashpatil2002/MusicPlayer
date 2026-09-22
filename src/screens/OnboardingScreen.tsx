import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../theme/colors';

export default function OnboardingScreen() {
  const [name, setName] = useState('');
  const { signInAsGuest } = useAuth();

  return (
    <SafeAreaView style={styles.root}>
      <LinearGradient
        colors={[Colors.primaryDark, Colors.background]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Music Hub</Text>
        <Text style={styles.subtitle}>A legal Spotify-like listener demo built with Expo.</Text>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Display name"
          placeholderTextColor={Colors.onSurfaceDim}
          style={styles.input}
        />

        <TouchableOpacity style={styles.btn} onPress={() => signInAsGuest(name)}>
          <Text style={styles.btnText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    color: Colors.onSurface,
    fontSize: 34,
    fontWeight: '800',
  },
  subtitle: {
    color: Colors.onSurfaceDim,
    marginTop: 10,
    marginBottom: 24,
    fontSize: 15,
  },
  input: {
    borderRadius: 12,
    backgroundColor: Colors.surface,
    color: Colors.onSurface,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  btn: {
    marginTop: 12,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 12,
  },
  btnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
});
