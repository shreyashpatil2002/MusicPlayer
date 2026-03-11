import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { usePlayer } from '../context/PlayerContext';
import ArtworkCard from './ArtworkCard';
import { Colors } from '../theme/colors';
import { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function MiniPlayer() {
  const player = usePlayer();
  const navigation = useNavigation<Nav>();

  if (!player.currentSong) return null;

  return (
    <TouchableOpacity
      style={styles.wrapper}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('Player')}
    >
      <View style={styles.container}>
        {/* Artwork */}
        <ArtworkCard song={player.currentSong} size={44} borderRadius={8} />

        {/* Info */}
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {player.currentSong.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {player.currentSong.artist}
          </Text>
        </View>

        {/* Controls */}
        <TouchableOpacity
          onPress={(e) => { e.stopPropagation(); player.skipToPrevious(); }}
          style={styles.btn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="play-skip-back" size={22} color={Colors.onSurface} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={(e) => { e.stopPropagation(); player.togglePlayPause(); }}
          style={styles.btn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={player.isPlaying ? 'pause-circle' : 'play-circle'}
            size={38}
            color={Colors.primary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={(e) => { e.stopPropagation(); player.skipToNext(); }}
          style={styles.btn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="play-skip-forward" size={22} color={Colors.onSurface} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 12,
    marginBottom: Platform.OS === 'ios' ? 4 : 8,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceVariant,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  info: {
    flex: 1,
  },
  title: {
    color: Colors.onSurface,
    fontSize: 14,
    fontWeight: '600',
  },
  artist: {
    color: Colors.onSurfaceDim,
    fontSize: 12,
    marginTop: 1,
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
