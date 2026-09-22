export interface Artist {
  id: string;
  name: string;
}

export interface Album {
  id: string;
  title: string;
  artistId: string;
  year?: number;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  artistId?: string;
  album: string;
  albumId?: string;
  uri: string;
  duration: number; // milliseconds
  artwork?: string;
  genre?: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  trackIds: string[];
  collaborative?: boolean;
}

export interface UserProfile {
  id: string;
  displayName: string;
}

export interface PlaybackState {
  isPlaying: boolean;
  isLoading: boolean;
  positionMs: number;
  durationMs: number;
}

export type RepeatMode = 'off' | 'all' | 'one';
