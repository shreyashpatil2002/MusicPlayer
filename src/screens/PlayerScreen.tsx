import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  FlatList,
  Modal,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { usePlayer } from '../context/PlayerContext';
import ArtworkCard from '../components/ArtworkCard';
import ProgressBar from '../components/ProgressBar';
import { Colors, gradientForSeed } from '../theme/colors';
import { formatDuration } from '../utils/helpers';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ARTWORK_SIZE = Math.min(SCREEN_WIDTH - 64, 320);

export default function PlayerScreen() {
  const navigation = useNavigation();
  const player = usePlayer();
  const [showQueue, setShowQueue] = React.useState(false);

  const song = player.currentSong;
  const bgColors = gradientForSeed(song?.title ?? 'default');

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <LinearGradient
        colors={[bgColors[0] + '30', Colors.background]}
        style={StyleSheet.absoluteFill}
      />

      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="chevron-down" size={30} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.topBarLabel}>Now Playing</Text>
        <TouchableOpacity onPress={() => setShowQueue(true)} style={styles.iconBtn}>
          <Ionicons name="list" size={24} color={Colors.onSurface} />
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        {/* Artwork */}
        <View style={[styles.artworkWrapper, player.isPlaying && styles.artworkActive]}>
          <ArtworkCard song={song} size={ARTWORK_SIZE} borderRadius={24} />
        </View>

        {/* Song info */}
        <View style={styles.infoRow}>
          <View style={styles.infoText}>
            <Text style={styles.songTitle} numberOfLines={1}>
              {song?.title ?? '—'}
            </Text>
            <Text style={styles.songArtist} numberOfLines={1}>
              {song?.artist ?? '—'}
            </Text>
          </View>
          <TouchableOpacity onPress={() => song && player.toggleLikeSong(song.id)}>
            <Ionicons
              name={song && player.isSongLiked(song.id) ? 'heart' : 'heart-outline'}
              size={26}
              color={Colors.accent}
            />
          </TouchableOpacity>
        </View>

        {/* Progress */}
        <ProgressBar
          positionMs={player.positionMs}
          durationMs={player.durationMs > 0 ? player.durationMs : (song?.duration ?? 0)}
          onSeek={player.seekTo}
        />

        {/* Controls */}
        <View style={styles.controls}>
          {/* Shuffle */}
          <TouchableOpacity onPress={player.toggleShuffle}>
            <Ionicons
              name="shuffle"
              size={26}
              color={player.shuffle ? Colors.primary : Colors.onSurfaceDim}
            />
          </TouchableOpacity>

          {/* Previous */}
          <TouchableOpacity onPress={player.skipToPrevious}>
            <Ionicons name="play-skip-back" size={38} color={Colors.onSurface} />
          </TouchableOpacity>

          {/* Play / Pause */}
          <TouchableOpacity onPress={player.togglePlayPause} style={styles.playBtn}>
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              style={styles.playBtnGradient}
            >
              <Ionicons
                name={player.isPlaying ? 'pause' : 'play'}
                size={36}
                color={Colors.white}
                style={player.isPlaying ? undefined : { marginLeft: 4 }}
              />
            </LinearGradient>
          </TouchableOpacity>

          {/* Next */}
          <TouchableOpacity onPress={player.skipToNext}>
            <Ionicons name="play-skip-forward" size={38} color={Colors.onSurface} />
          </TouchableOpacity>

          {/* Repeat */}
          <TouchableOpacity onPress={player.cycleRepeatMode}>
            <Ionicons
              name={player.repeatMode === 'one' ? 'repeat-outline' : 'repeat'}
              size={26}
              color={player.repeatMode !== 'off' ? Colors.primary : Colors.onSurfaceDim}
            />
            {player.repeatMode === 'one' && (
              <View style={styles.repeatOneBadge}>
                <Text style={styles.repeatOneBadgeText}>1</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Album name */}
        <Text style={styles.albumLabel} numberOfLines={1}>
          {song?.album ?? ''}
        </Text>
      </View>

      {/* Queue Modal */}
      <QueueModal
        visible={showQueue}
        onClose={() => setShowQueue(false)}
      />
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Queue modal
// ---------------------------------------------------------------------------

function QueueModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const player = usePlayer();

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={onClose} />
      <View style={styles.queueSheet}>
        {/* Handle */}
        <View style={styles.handle} />
        <Text style={styles.queueTitle}>Queue</Text>
        <View style={styles.queueDivider} />
        <FlatList
          data={player.songs}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            const active = item.id === player.currentSong?.id;
            return (
              <TouchableOpacity
                style={styles.queueItem}
                onPress={() => {
                  player.playSong(item);
                  onClose();
                }}
              >
                <Ionicons
                  name={active ? 'volume-high' : 'musical-note'}
                  size={18}
                  color={active ? Colors.primary : Colors.onSurfaceDim}
                  style={{ width: 24 }}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.queueItemTitle,
                      active && { color: Colors.primary, fontWeight: '700' },
                    ]}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  <Text style={styles.queueItemArtist} numberOfLines={1}>
                    {item.artist}
                  </Text>
                </View>
                <Text style={styles.queueItemDuration}>
                  {formatDuration(item.duration)}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) + 8 : 8,
    paddingBottom: 4,
  },
  topBarLabel: {
    color: Colors.onSurfaceDim,
    fontSize: 14,
    letterSpacing: 0.5,
  },
  iconBtn: {
    padding: 8,
  },
  body: {
    flex: 1,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  artworkWrapper: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
    transform: [{ scale: 0.88 }],
  },
  artworkActive: {
    transform: [{ scale: 1 }],
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 12,
  },
  infoText: {
    flex: 1,
  },
  songTitle: {
    color: Colors.onSurface,
    fontSize: 22,
    fontWeight: 'bold',
  },
  songArtist: {
    color: Colors.onSurfaceDim,
    fontSize: 15,
    marginTop: 4,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  playBtn: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  playBtnGradient: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  repeatOneBadge: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  repeatOneBadgeText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: 'bold',
  },
  albumLabel: {
    color: Colors.onSurfaceDim,
    fontSize: 13,
    textAlign: 'center',
  },
  // Queue modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  queueSheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 32,
    maxHeight: '70%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.divider,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  queueTitle: {
    color: Colors.onSurface,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  queueDivider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginHorizontal: 16,
    marginBottom: 4,
  },
  queueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
  },
  queueItemTitle: {
    color: Colors.onSurface,
    fontSize: 14,
  },
  queueItemArtist: {
    color: Colors.onSurfaceDim,
    fontSize: 12,
    marginTop: 1,
  },
  queueItemDuration: {
    color: Colors.onSurfaceDim,
    fontSize: 12,
  },
});
