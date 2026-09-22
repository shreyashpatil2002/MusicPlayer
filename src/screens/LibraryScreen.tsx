import React, { useMemo, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SongTile from '../components/SongTile';
import MiniPlayer from '../components/MiniPlayer';
import { usePlayer } from '../context/PlayerContext';
import { RootStackParamList } from '../navigation/types';
import { Colors } from '../theme/colors';
import { Song } from '../types';

type RootNav = NativeStackNavigationProp<RootStackParamList>;

function buildPlaylistIndexSongs(trackIds: string[], songs: Song[]): Song[] {
  const map = new Map(songs.map((song) => [song.id, song]));
  return trackIds
    .map((trackId) => map.get(trackId))
    .filter((song): song is Song => Boolean(song));
}

export default function LibraryScreen() {
  const [playlistName, setPlaylistName] = useState('');
  const player = usePlayer();
  const navigation = useNavigation<RootNav>();

  const likedSongs = useMemo(
    () => buildPlaylistIndexSongs(player.likedSongIds, player.songs),
    [player.likedSongIds, player.songs]
  );

  const recentSongs = useMemo(
    () => buildPlaylistIndexSongs(player.recentlyPlayedIds, player.songs),
    [player.recentlyPlayedIds, player.songs]
  );

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Library</Text>
      </View>

      <View style={styles.row}>
        <TextInput
          value={playlistName}
          onChangeText={setPlaylistName}
          placeholder="Create playlist"
          placeholderTextColor={Colors.onSurfaceDim}
          style={styles.input}
        />
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => {
            player.createPlaylist(playlistName);
            setPlaylistName('');
          }}
        >
          <Ionicons name="add" size={18} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Playlists</Text>
      {player.playlists.map((playlist) => (
        <View key={playlist.id} style={styles.playlistRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.playlistName}>{playlist.name}</Text>
            <Text style={styles.playlistMeta}>{playlist.trackIds.length} tracks</Text>
          </View>
          {player.currentSong && (
            <TouchableOpacity
              onPress={() => player.addSongToPlaylist(playlist.id, player.currentSong!.id)}
            >
              <Text style={styles.link}>Add current</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}

      <Text style={styles.sectionTitle}>Liked Songs</Text>
      <FlatList
        data={likedSongs}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
        ListEmptyComponent={<Text style={styles.empty}>Like songs from Home/Search to see them here.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chip}
            onPress={async () => {
              await player.playSong(item);
              navigation.navigate('Player');
            }}
          >
            <Text style={styles.chipText} numberOfLines={1}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />

      <Text style={styles.sectionTitle}>Recently Played</Text>
      <FlatList
        data={recentSongs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.empty}>Nothing played yet.</Text>}
        renderItem={({ item }) => {
          const isActive = item.id === player.currentSong?.id;
          return (
            <SongTile
              song={item}
              isActive={isActive}
              isPlaying={isActive && player.isPlaying}
              onPress={async () => {
                await player.playSong(item);
                navigation.navigate('Player');
              }}
            />
          );
        }}
      />

      <MiniPlayer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  title: {
    color: Colors.onSurface,
    fontSize: 28,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginTop: 8,
  },
  input: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: Colors.surfaceVariant,
    paddingHorizontal: 12,
    color: Colors.onSurface,
  },
  addBtn: {
    width: 42,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    color: Colors.onSurface,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  playlistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  playlistName: {
    color: Colors.onSurface,
    fontSize: 15,
    fontWeight: '600',
  },
  playlistMeta: {
    color: Colors.onSurfaceDim,
    marginTop: 2,
    fontSize: 12,
  },
  link: {
    color: Colors.primary,
    fontWeight: '600',
  },
  horizontalList: {
    paddingHorizontal: 16,
    gap: 8,
    minHeight: 44,
  },
  chip: {
    backgroundColor: Colors.surfaceVariant,
    borderRadius: 999,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  chipText: {
    color: Colors.onSurface,
    fontSize: 13,
    maxWidth: 140,
  },
  listContent: {
    paddingBottom: 8,
  },
  empty: {
    color: Colors.onSurfaceDim,
    paddingHorizontal: 16,
    marginBottom: 6,
  },
});
