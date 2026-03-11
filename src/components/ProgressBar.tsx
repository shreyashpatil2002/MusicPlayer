import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Slider from '@react-native-community/slider';
import { Colors } from '../theme/colors';
import { formatDuration } from '../utils/helpers';

interface Props {
  positionMs: number;
  durationMs: number;
  onSeek: (ms: number) => void;
}

export default function ProgressBar({ positionMs, durationMs, onSeek }: Props) {
  const [sliding, setSliding] = useState(false);
  const [slideValue, setSlideValue] = useState(0);

  const displayPosition = sliding ? slideValue : positionMs;
  const progress = durationMs > 0 ? positionMs / durationMs : 0;

  return (
    <View style={styles.container}>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={durationMs > 0 ? durationMs : 1}
        value={positionMs}
        minimumTrackTintColor={Colors.primary}
        maximumTrackTintColor={Colors.divider}
        thumbTintColor={Colors.primary}
        onSlidingStart={() => { setSliding(true); setSlideValue(positionMs); }}
        onValueChange={setSlideValue}
        onSlidingComplete={(v) => { setSliding(false); onSeek(v); }}
      />
      <View style={styles.labels}>
        <Text style={styles.time}>{formatDuration(displayPosition)}</Text>
        <Text style={styles.time}>{formatDuration(durationMs)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  slider: {
    width: '100%',
    height: Platform.OS === 'web' ? 24 : 40,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginTop: -4,
  },
  time: {
    color: Colors.onSurfaceDim,
    fontSize: 12,
  },
});
