import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Song } from '../types';
import { gradientForSeed } from '../theme/colors';

interface Props {
  song: Song | null;
  size?: number;
  borderRadius?: number;
}

export default function ArtworkCard({ song, size = 56, borderRadius = 12 }: Props) {
  const colors = gradientForSeed(song?.title ?? 'default');

  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, { width: size, height: size, borderRadius }]}
    >
      <Ionicons
        name="musical-note"
        size={size * 0.42}
        color="rgba(255,255,255,0.85)"
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
