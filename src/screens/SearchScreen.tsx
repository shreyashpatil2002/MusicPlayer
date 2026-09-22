import React, { useMemo, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SongTile from '../components/SongTile';
import MiniPlayer from '../components/MiniPlayer';
import { usePlayer } from '../context/PlayerContext';
import { RootStackParamList } from '../navigation/types';
import { Colors } from '../theme/colors';

type RootNav = NativeStackNavigationProp<RootStackParamList>;

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const player = usePlayer();
  const navigation = useNavigation<RootNav>();

  const results = useMemo(() => player.searchSongs(query), [player, query]);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Songs, artists, albums"
          placeholderTextColor={Colors.onSurfaceDim}
          style={styles.input}
        />
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.empty}>No matches found.</Text>}
        contentContainerStyle={styles.listContent}
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
    gap: 10,
  },
  title: {
    color: Colors.onSurface,
    fontSize: 28,
    fontWeight: '700',
  },
  input: {
    backgroundColor: Colors.surfaceVariant,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: Colors.onSurface,
    fontSize: 15,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  empty: {
    color: Colors.onSurfaceDim,
    textAlign: 'center',
    marginTop: 24,
  },
});
