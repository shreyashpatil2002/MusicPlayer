export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  uri: string;
  duration: number; // milliseconds
  artwork?: string;
}

export interface PlaybackState {
  isPlaying: boolean;
  isLoading: boolean;
  positionMs: number;
  durationMs: number;
}

export type RepeatMode = 'off' | 'all' | 'one';
