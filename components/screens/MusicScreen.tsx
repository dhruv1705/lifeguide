import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { musicService, PlaybackState } from '../../services/musicService';
import { musicLibrary, Track, getAllTracks, getCategoriesWithTracks } from '../../data/musicLibrary';
import MusicPlayer from '../music/MusicPlayer';
import ProfileIcon from '../ProfileIcon';

export default function MusicScreen() {
  const [playbackState, setPlaybackState] = useState<PlaybackState>(musicService.getPlaybackState());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = musicService.subscribe(setPlaybackState);
    return unsubscribe;
  }, []);

  const handlePlayTrack = async (track: Track) => {
    try {
      await musicService.playTrack(track);
    } catch (error) {
      Alert.alert('Error', 'Failed to play track. Please check your internet connection.');
    }
  };

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(selectedCategory === categoryName ? null : categoryName);
  };

  const getDisplayedTracks = (): Track[] => {
    if (selectedCategory) {
      const category = musicLibrary.find(cat => cat.name === selectedCategory);
      return category ? category.tracks : [];
    }
    return getAllTracks();
  };

  return (
    <View style={styles.container}>
      <ProfileIcon />
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Music & Sounds</Text>
          <Text style={styles.subtitle}>Enhance your focus and relaxation</Text>
        </View>

        {/* Music Player */}
        <MusicPlayer visible={playbackState.currentTrack !== null} />

        {/* Categories Section */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoryGrid}>
            {musicLibrary.map((category) => (
              <TouchableOpacity 
                key={category.name}
                style={[
                  styles.categoryCard,
                  selectedCategory === category.name && styles.categoryCardActive,
                  category.tracks.length === 0 && styles.categoryCardDisabled
                ]}
                onPress={() => category.tracks.length > 0 && handleCategorySelect(category.name)}
                disabled={category.tracks.length === 0}
              >
                <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                <Text style={[
                  styles.categoryName,
                  category.tracks.length === 0 && styles.categoryNameDisabled
                ]}>
                  {category.name}
                </Text>
                <Text style={[
                  styles.categoryCount,
                  category.tracks.length === 0 && styles.categoryCountDisabled
                ]}>
                  {category.tracks.length} tracks
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tracks Section */}
        <View style={styles.tracksSection}>
          <Text style={styles.sectionTitle}>
            {selectedCategory ? `${selectedCategory} Tracks` : 'All Tracks'}
          </Text>
          
          {selectedCategory && (
            <TouchableOpacity 
              style={styles.clearFilterButton}
              onPress={() => setSelectedCategory(null)}
            >
              <Text style={styles.clearFilterText}>Show All</Text>
            </TouchableOpacity>
          )}

          {getDisplayedTracks().length > 0 ? (
            getDisplayedTracks().map((track) => (
              <TouchableOpacity 
                key={track.id} 
                style={[
                  styles.songItem,
                  playbackState.currentTrack?.id === track.id && styles.currentSong
                ]}
                onPress={() => handlePlayTrack(track)}
              >
                <View style={styles.songLeft}>
                  <View style={styles.songIcon}>
                    <Text style={styles.songIconText}>♪</Text>
                  </View>
                  <View style={styles.songInfo}>
                    <Text style={[
                      styles.songItemTitle,
                      playbackState.currentTrack?.id === track.id && styles.currentSongText
                    ]}>
                      {track.title}
                    </Text>
                    <Text style={styles.songItemArtist}>
                      {track.artist || track.category}
                    </Text>
                  </View>
                </View>
                <View style={styles.songRight}>
                  <Text style={styles.songDuration}>
                    {track.duration || '--:--'}
                  </Text>
                  {playbackState.currentTrack?.id === track.id && playbackState.isPlaying && (
                    <Text style={styles.playingIndicator}>♪</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {selectedCategory 
                  ? `No tracks in ${selectedCategory} yet` 
                  : 'No music tracks available'
                }
              </Text>
            </View>
          )}
        </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a2332',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40, // Basic bottom padding
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  nowPlayingSection: {
    marginBottom: 30,
  },
  nowPlayingCard: {
    backgroundColor: '#2a3642',
    padding: 25,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#3a4652',
    alignItems: 'center',
  },
  nowPlayingTitle: {
    fontSize: 16,
    color: '#00ccff',
    marginBottom: 20,
    fontWeight: '600',
  },
  albumArt: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#3a4652',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#00ccff',
  },
  albumEmoji: {
    fontSize: 50,
  },
  songTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
    textAlign: 'center',
  },
  artistName: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#3a4652',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00ccff',
    borderRadius: 2,
  },
  duration: {
    fontSize: 14,
    color: '#888',
    marginBottom: 25,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3a4652',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#00aaff',
  },
  controlIcon: {
    fontSize: 20,
    color: 'white',
  },
  playIcon: {
    fontSize: 24,
    color: 'white',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#00ccff',
    marginBottom: 15,
  },
  tracksSection: {
    marginBottom: 30,
  },
  clearFilterButton: {
    backgroundColor: '#2a3642',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#3a4652',
  },
  clearFilterText: {
    color: '#00ccff',
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
  },
  songItem: {
    backgroundColor: '#2a3642',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#3a4652',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currentSong: {
    backgroundColor: '#1a3a4a',
    borderColor: '#2a4a5a',
  },
  songLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  songIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#3a4652',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  songIconText: {
    fontSize: 18,
    color: '#00ccff',
  },
  songInfo: {
    flex: 1,
  },
  songItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 2,
  },
  currentSongText: {
    color: '#00ccff',
  },
  songItemArtist: {
    fontSize: 14,
    color: '#888',
  },
  songRight: {
    alignItems: 'flex-end',
  },
  songDuration: {
    fontSize: 14,
    color: '#888',
    marginBottom: 2,
  },
  playingIndicator: {
    fontSize: 12,
    color: '#00ccff',
  },
  categoriesSection: {
    marginBottom: 40,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  categoryCard: {
    width: '47%',
    backgroundColor: '#2a3642',
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#3a4652',
    alignItems: 'center',
  },
  categoryCardActive: {
    backgroundColor: '#1a3a4a',
    borderColor: '#2a4a5a',
    borderWidth: 2,
  },
  categoryCardDisabled: {
    opacity: 0.5,
  },
  categoryEmoji: {
    fontSize: 30,
    marginBottom: 10,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginBottom: 5,
  },
  categoryCount: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  categoryNameDisabled: {
    color: '#555',
  },
  categoryCountDisabled: {
    color: '#555',
  },
});