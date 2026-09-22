import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Song } from '../types';
import { Colors } from '../theme/colors';
import { formatDuration } from '../utils/helpers';
import ArtworkCard from './ArtworkCard';
import { usePlayer } from '../context/PlayerContext';

interface Props {
  song: Song;
  isActive: boolean;
  isPlaying: boolean;
  onPress: () => void;
}

export default function SongTile({ song, isActive, isPlaying, onPress }: Props) {
  const player = usePlayer();

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.artContainer}>
        <ArtworkCard song={song} size={52} borderRadius={10} />
        {isActive && (
          <View style={styles.activeOverlay}>
            <Ionicons
              name={isPlaying ? 'volume-high' : 'pause'}
              size={20}
              color={Colors.primary}
            />
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text
          style={[styles.title, isActive && styles.titleActive]}
          numberOfLines={1}
        >
          {song.title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {song.artist} · {song.album}
        </Text>
      </View>

      <View style={styles.rightMeta}>
        <TouchableOpacity
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          onPress={(e) => {
            e.stopPropagation();
            player.toggleLikeSong(song.id);
          }}
        >
          <Ionicons
            name={player.isSongLiked(song.id) ? 'heart' : 'heart-outline'}
            color={Colors.accent}
            size={18}
          />
        </TouchableOpacity>
        <Text style={styles.duration}>{formatDuration(song.duration)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  artContainer: {
    position: 'relative',
  },
  activeOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  title: {
    color: Colors.onSurface,
    fontSize: 15,
    fontWeight: '500',
  },
  titleActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  subtitle: {
    color: Colors.onSurfaceDim,
    fontSize: 12,
    marginTop: 2,
  },
  rightMeta: {
    alignItems: 'flex-end',
    gap: 6,
    minWidth: 46,
  },
  duration: {
    color: Colors.onSurfaceDim,
    fontSize: 12,
  },
});
