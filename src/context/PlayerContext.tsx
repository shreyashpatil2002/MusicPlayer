import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { Playlist, Song, RepeatMode } from '../types';
import { DEMO_SONGS } from '../data/demoSongs';

interface PlayerContextValue {
  // Library
  songs: Song[];
  isLoading: boolean;

  // Current track
  currentSong: Song | null;
  currentIndex: number;

  // Playback state
  isPlaying: boolean;
  positionMs: number;
  durationMs: number;
  isBuffering: boolean;

  // Modes
  shuffle: boolean;
  repeatMode: RepeatMode;

  // Listener library state
  likedSongIds: string[];
  recentlyPlayedIds: string[];
  playlists: Playlist[];

  // Actions
  playSong: (song: Song) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  seekTo: (ms: number) => Promise<void>;
  skipToNext: () => Promise<void>;
  skipToPrevious: () => Promise<void>;
  toggleShuffle: () => void;
  cycleRepeatMode: () => void;

  // Library actions
  toggleLikeSong: (songId: string) => void;
  isSongLiked: (songId: string) => boolean;
  createPlaylist: (name: string) => void;
  addSongToPlaylist: (playlistId: string, songId: string) => void;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;
  searchSongs: (query: string) => Song[];
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

const RECENTLY_PLAYED_LIMIT = 25;

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const soundRef = useRef<Audio.Sound | null>(null);

  const [songs] = useState<Song[]>(DEMO_SONGS);
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [positionMs, setPositionMs] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');

  const [likedSongIds, setLikedSongIds] = useState<string[]>([]);
  const [recentlyPlayedIds, setRecentlyPlayedIds] = useState<string[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([
    {
      id: 'playlist-favorites',
      name: 'Favorites',
      description: 'Your saved tracks',
      trackIds: [],
    },
  ]);

  // Keep refs for latest values accessible inside callbacks without stale closure
  const shuffleRef = useRef(shuffle);
  const repeatRef = useRef(repeatMode);
  const currentIndexRef = useRef(currentIndex);
  const songsRef = useRef(songs);

  useEffect(() => {
    shuffleRef.current = shuffle;
  }, [shuffle]);
  useEffect(() => {
    repeatRef.current = repeatMode;
  }, [repeatMode]);
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);
  useEffect(() => {
    songsRef.current = songs;
  }, [songs]);

  // Configure audio mode once on mount
  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
    }).catch(() => {});
    return () => {
      soundRef.current?.unloadAsync().catch(() => {});
    };
  }, []);

  const rememberRecentlyPlayed = useCallback((songId: string) => {
    setRecentlyPlayedIds((prev) => {
      const deduped = prev.filter((id) => id !== songId);
      return [songId, ...deduped].slice(0, RECENTLY_PLAYED_LIMIT);
    });
  }, []);

  const onPlaybackStatusUpdate = useCallback(
    (status: AVPlaybackStatus) => {
      if (!status.isLoaded) return;
      setIsPlaying(status.isPlaying);
      setPositionMs(status.positionMillis ?? 0);
      setDurationMs(status.durationMillis ?? 0);
      setIsBuffering(status.isBuffering ?? false);

      // Track ended
      if (status.didJustFinish) {
        const mode = repeatRef.current;
        const idx = currentIndexRef.current;
        const list = songsRef.current;

        if (mode === 'one') {
          soundRef.current?.replayAsync().catch(() => {});
        } else if (mode === 'all' || idx < list.length - 1) {
          const nextIndex = shuffleRef.current
            ? Math.floor(Math.random() * list.length)
            : (idx + 1) % list.length;
          _loadAndPlay(list[nextIndex], nextIndex);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const _loadAndPlay = useCallback(
    async (song: Song, index: number) => {
      setIsLoading(true);
      setPositionMs(0);
      setDurationMs(0);

      try {
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }

        setCurrentIndex(index);
        rememberRecentlyPlayed(song.id);

        if (!song.uri) {
          setIsLoading(false);
          setIsPlaying(true);
          setDurationMs(song.duration);
          return;
        }

        const { sound } = await Audio.Sound.createAsync(
          { uri: song.uri },
          { shouldPlay: true, progressUpdateIntervalMillis: 500 },
          onPlaybackStatusUpdate
        );
        soundRef.current = sound;
      } catch {
        // Demo data can fail to load if no stream URL is configured.
      } finally {
        setIsLoading(false);
      }
    },
    [onPlaybackStatusUpdate, rememberRecentlyPlayed]
  );

  const playSong = useCallback(
    async (song: Song) => {
      const index = songs.findIndex((s) => s.id === song.id);
      await _loadAndPlay(song, index === -1 ? 0 : index);
    },
    [songs, _loadAndPlay]
  );

  const togglePlayPause = useCallback(async () => {
    if (!soundRef.current) {
      setIsPlaying((p) => !p);
      return;
    }
    if (isPlaying) {
      await soundRef.current.pauseAsync();
    } else {
      await soundRef.current.playAsync();
    }
  }, [isPlaying]);

  const seekTo = useCallback(async (ms: number) => {
    setPositionMs(ms);
    if (soundRef.current) {
      await soundRef.current.setPositionAsync(ms);
    }
  }, []);

  const skipToNext = useCallback(async () => {
    const idx = currentIndexRef.current;
    const list = songsRef.current;
    if (list.length === 0) return;
    const nextIndex = shuffle
      ? Math.floor(Math.random() * list.length)
      : (idx + 1) % list.length;
    await _loadAndPlay(list[nextIndex], nextIndex);
  }, [shuffle, _loadAndPlay]);

  const skipToPrevious = useCallback(async () => {
    if (positionMs > 3000 && soundRef.current) {
      await soundRef.current.setPositionAsync(0);
      setPositionMs(0);
      return;
    }
    const idx = currentIndexRef.current;
    const list = songsRef.current;
    if (list.length === 0) return;
    const prevIndex = shuffle
      ? Math.floor(Math.random() * list.length)
      : (idx - 1 + list.length) % list.length;
    await _loadAndPlay(list[prevIndex], prevIndex);
  }, [positionMs, shuffle, _loadAndPlay]);

  const toggleShuffle = useCallback(() => setShuffle((s) => !s), []);

  const cycleRepeatMode = useCallback(() => {
    setRepeatMode((m) => {
      if (m === 'off') return 'all';
      if (m === 'all') return 'one';
      return 'off';
    });
  }, []);

  const toggleLikeSong = useCallback((songId: string) => {
    setLikedSongIds((prev) =>
      prev.includes(songId) ? prev.filter((id) => id !== songId) : [songId, ...prev]
    );

    setPlaylists((prev) =>
      prev.map((playlist) => {
        if (playlist.id !== 'playlist-favorites') return playlist;
        const alreadyAdded = playlist.trackIds.includes(songId);
        return {
          ...playlist,
          trackIds: alreadyAdded
            ? playlist.trackIds.filter((id) => id !== songId)
            : [songId, ...playlist.trackIds],
        };
      })
    );
  }, []);

  const isSongLiked = useCallback(
    (songId: string) => likedSongIds.includes(songId),
    [likedSongIds]
  );

  const createPlaylist = useCallback((name: string) => {
    const cleanName = name.trim();
    if (!cleanName) return;

    setPlaylists((prev) => {
      const duplicateName = prev.some(
        (playlist) => playlist.name.toLowerCase() === cleanName.toLowerCase()
      );
      if (duplicateName) return prev;

      return [
        ...prev,
        {
          id: `playlist-${Date.now()}`,
          name: cleanName,
          trackIds: [],
        },
      ];
    });
  }, []);

  const addSongToPlaylist = useCallback((playlistId: string, songId: string) => {
    setPlaylists((prev) =>
      prev.map((playlist) => {
        if (playlist.id !== playlistId || playlist.trackIds.includes(songId)) {
          return playlist;
        }
        return { ...playlist, trackIds: [...playlist.trackIds, songId] };
      })
    );
  }, []);

  const removeSongFromPlaylist = useCallback((playlistId: string, songId: string) => {
    setPlaylists((prev) =>
      prev.map((playlist) =>
        playlist.id === playlistId
          ? { ...playlist, trackIds: playlist.trackIds.filter((id) => id !== songId) }
          : playlist
      )
    );
  }, []);

  const searchSongs = useCallback(
    (query: string) => {
      const normalizedQuery = query.trim().toLowerCase();
      if (!normalizedQuery) return songs;

      return songs.filter((song) => {
        const haystack = `${song.title} ${song.artist} ${song.album} ${song.genre ?? ''}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      });
    },
    [songs]
  );

  const value: PlayerContextValue = useMemo(
    () => ({
      songs,
      isLoading,
      currentSong: currentIndex >= 0 ? songs[currentIndex] : null,
      currentIndex,
      isPlaying,
      positionMs,
      durationMs,
      isBuffering,
      shuffle,
      repeatMode,
      likedSongIds,
      recentlyPlayedIds,
      playlists,
      playSong,
      togglePlayPause,
      seekTo,
      skipToNext,
      skipToPrevious,
      toggleShuffle,
      cycleRepeatMode,
      toggleLikeSong,
      isSongLiked,
      createPlaylist,
      addSongToPlaylist,
      removeSongFromPlaylist,
      searchSongs,
    }),
    [
      songs,
      isLoading,
      currentIndex,
      isPlaying,
      positionMs,
      durationMs,
      isBuffering,
      shuffle,
      repeatMode,
      likedSongIds,
      recentlyPlayedIds,
      playlists,
      playSong,
      togglePlayPause,
      seekTo,
      skipToNext,
      skipToPrevious,
      toggleShuffle,
      cycleRepeatMode,
      toggleLikeSong,
      isSongLiked,
      createPlaylist,
      addSongToPlaylist,
      removeSongFromPlaylist,
      searchSongs,
    ]
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer(): PlayerContextValue {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
}
