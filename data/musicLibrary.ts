export interface Track {
  id: string;
  title: string;
  artist?: string;
  url: string;
  duration?: string;
  category: string;
}

export interface Category {
  name: string;
  emoji: string;
  tracks: Track[];
}

// 🎵 MUSIC LIBRARY - Add your tracks here
export const musicLibrary: Category[] = [
  {
    name: 'Meditation',
    emoji: '🧘',
    tracks: [
      {
        id: '1',
        title: 'THE MINDSET TO WIN',
        artist: 'Motivational Speeches',
        url: 'https://storage.googleapis.com/lifesparkbucket/lifespark/motivational/THE%20MINDSET%20TO%20WIN%20-%20Best%20Motivational%20Video%20Speeches%20Compilation.mp3',
        duration: '45:30',
        category: 'Meditation',
      },
      // 👆 Add more meditation tracks here
    ],
  },
  {
    name: 'Nature',
    emoji: '🌊',
    tracks: [
      // 👆 Add your nature sound tracks here
      // Example:
      // {
      //   id: '2',
      //   title: 'Ocean Waves',
      //   artist: 'Nature Sounds',
      //   url: 'https://your-url-here.mp3',
      //   duration: '30:00',
      //   category: 'Nature',
      // },
    ],
  },
  {
    name: 'Rain Sounds',
    emoji: '☔',
    tracks: [
      // 👆 Add your rain sound tracks here
    ],
  },
  {
    name: 'Fireplace',
    emoji: '🔥',
    tracks: [
      // 👆 Add your fireplace sound tracks here
    ],
  },
  {
    name: 'Focus & Study',
    emoji: '🎯',
    tracks: [
      // 👆 Add your focus/study tracks here
    ],
  },
  {
    name: 'Relaxation',
    emoji: '😌',
    tracks: [
      // 👆 Add your relaxation tracks here
    ],
  },
  {
    name: 'Morning Routine',
    emoji: '🌅',
    tracks: [
      // 👆 Add your morning routine tracks here
    ],
  },
  {
    name: 'Sleep Sounds',
    emoji: '🌙',
    tracks: [
      // 👆 Add your sleep sound tracks here
    ],
  },
];

// Helper functions
export const getAllTracks = (): Track[] => {
  return musicLibrary.flatMap(category => category.tracks);
};

export const getTracksByCategory = (categoryName: string): Track[] => {
  const category = musicLibrary.find(cat => cat.name === categoryName);
  return category ? category.tracks : [];
};

export const getTrackById = (id: string): Track | undefined => {
  return getAllTracks().find(track => track.id === id);
};

export const getCategoriesWithTracks = (): Category[] => {
  return musicLibrary.filter(category => category.tracks.length > 0);
};