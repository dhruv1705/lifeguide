import { Audio } from 'expo-av';
import { Track } from '../data/musicLibrary';

export interface PlaybackState {
  isPlaying: boolean;
  isLoading: boolean;
  position: number;
  duration: number;
  currentTrack: Track | null;
}

class MusicService {
  private sound: Audio.Sound | null = null;
  private playbackState: PlaybackState = {
    isPlaying: false,
    isLoading: false,
    position: 0,
    duration: 0,
    currentTrack: null,
  };
  private listeners: ((state: PlaybackState) => void)[] = [];

  constructor() {
    this.initializeAudio();
  }

  private async initializeAudio() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (error) {
      console.error('Error initializing audio:', error);
    }
  }

  // Play a track
  async playTrack(track: Track) {
    try {
      this.updateState({ isLoading: true });

      // Stop current track if playing
      if (this.sound) {
        await this.sound.unloadAsync();
        this.sound = null;
      }

      // Load and play new track
      const { sound } = await Audio.Sound.createAsync(
        { uri: track.url },
        { shouldPlay: true, isLooping: false },
        this.onPlaybackStatusUpdate.bind(this)
      );

      this.sound = sound;
      this.updateState({
        currentTrack: track,
        isLoading: false,
        isPlaying: true,
      });

    } catch (error) {
      console.error('Error playing track:', error);
      this.updateState({ isLoading: false, isPlaying: false });
    }
  }

  // Pause/Resume playback
  async togglePlayback() {
    if (!this.sound) return;

    try {
      if (this.playbackState.isPlaying) {
        await this.sound.pauseAsync();
      } else {
        await this.sound.playAsync();
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
    }
  }

  // Stop playback
  async stopPlayback() {
    if (!this.sound) return;

    try {
      await this.sound.stopAsync();
      this.updateState({
        isPlaying: false,
        position: 0,
      });
    } catch (error) {
      console.error('Error stopping playback:', error);
    }
  }

  // Seek to position
  async seekTo(position: number) {
    if (!this.sound) return;

    try {
      await this.sound.setPositionAsync(position);
    } catch (error) {
      console.error('Error seeking:', error);
    }
  }

  // Playback status update callback
  private onPlaybackStatusUpdate(status: any) {
    if (status.isLoaded) {
      this.updateState({
        isPlaying: status.isPlaying,
        position: status.positionMillis || 0,
        duration: status.durationMillis || 0,
      });

      // Track ended
      if (status.didJustFinish) {
        this.updateState({
          isPlaying: false,
          position: 0,
        });
      }
    }
  }

  // Update state and notify listeners
  private updateState(updates: Partial<PlaybackState>) {
    this.playbackState = { ...this.playbackState, ...updates };
    this.listeners.forEach(listener => listener(this.playbackState));
  }

  // Subscribe to playback state changes
  subscribe(listener: (state: PlaybackState) => void) {
    this.listeners.push(listener);
    listener(this.playbackState); // Send current state immediately
    
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Get current playback state
  getPlaybackState(): PlaybackState {
    return this.playbackState;
  }

  // Cleanup
  async cleanup() {
    if (this.sound) {
      await this.sound.unloadAsync();
      this.sound = null;
    }
  }
}

export const musicService = new MusicService();