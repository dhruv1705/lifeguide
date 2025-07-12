import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { musicService, PlaybackState } from '../../services/musicService';

const { width } = Dimensions.get('window');

interface MusicPlayerProps {
  visible: boolean;
}

export default function MusicPlayer({ visible }: MusicPlayerProps) {
  const [playbackState, setPlaybackState] = useState<PlaybackState>(musicService.getPlaybackState());

  useEffect(() => {
    const unsubscribe = musicService.subscribe(setPlaybackState);
    return unsubscribe;
  }, []);

  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    musicService.togglePlayback();
  };

  const handleStop = () => {
    musicService.stopPlayback();
  };

  const handleSeek = (progress: number) => {
    const position = progress * playbackState.duration;
    musicService.seekTo(position);
  };

  if (!visible || !playbackState.currentTrack) {
    return null;
  }

  const progress = playbackState.duration > 0 
    ? playbackState.position / playbackState.duration 
    : 0;

  return (
    <View style={styles.container}>
      <View style={styles.trackInfo}>
        <View style={styles.defaultArtwork}>
          <Text style={styles.defaultArtworkText}>♪</Text>
        </View>
        
        <View style={styles.textInfo}>
          <Text style={styles.trackTitle} numberOfLines={1}>
            {playbackState.currentTrack.title}
          </Text>
          {playbackState.currentTrack.artist && (
            <Text style={styles.trackArtist} numberOfLines={1}>
              {playbackState.currentTrack.artist}
            </Text>
          )}
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <TouchableOpacity
          style={styles.progressBar}
          onPress={(event) => {
            const { locationX } = event.nativeEvent;
            const progressBarWidth = width - 40;
            const progress = locationX / progressBarWidth;
            handleSeek(Math.max(0, Math.min(1, progress)));
          }}
          activeOpacity={0.8}
        >
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
            <View style={[styles.progressThumb, { left: `${progress * 100}%` }]} />
          </View>
        </TouchableOpacity>
        
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(playbackState.position)}</Text>
          <Text style={styles.timeText}>{formatTime(playbackState.duration)}</Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={handleStop}>
          <Text style={styles.controlIcon}>⏹</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.controlButton, styles.playButton]}
          onPress={handlePlayPause}
          disabled={playbackState.isLoading}
        >
          <Text style={styles.playIcon}>
            {playbackState.isLoading ? '⏳' : playbackState.isPlaying ? '⏸' : '▶️'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.controlButton}>
          <Text style={styles.controlIcon}>⏭</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2a3642',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#3a4652',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  trackInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  artwork: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  defaultArtwork: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#3a4652',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  defaultArtworkText: {
    fontSize: 24,
    color: '#00ccff',
  },
  textInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  trackArtist: {
    fontSize: 14,
    color: '#888',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    marginBottom: 8,
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#3a4652',
    borderRadius: 2,
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00ccff',
    borderRadius: 2,
  },
  progressThumb: {
    position: 'absolute',
    top: -6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#00ccff',
    marginLeft: -8,
    shadowColor: '#00ccff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
    color: '#888',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3a4652',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#00aaff',
  },
  controlIcon: {
    fontSize: 18,
    color: 'white',
  },
  playIcon: {
    fontSize: 20,
    color: 'white',
  },
});