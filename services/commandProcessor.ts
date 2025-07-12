import { musicService } from './musicService';
import { getTracksByCategory, getTrackById, getAllTracks, Track } from '../data/musicLibrary';

export interface MusicCommand {
  action: 'play_music' | 'pause_music' | 'stop_music' | 'play_category' | 'play_track';
  category?: string;
  trackId?: string;
  query?: string;
}

export interface CommandResponse {
  hasCommand: boolean;
  command?: MusicCommand;
  displayText: string;
}

export class CommandProcessor {
  
  // Parse Claude's response for music commands
  parseResponse(claudeResponse: string): CommandResponse {
    try {
      // Try to extract JSON command from Claude's response
      const commandMatch = claudeResponse.match(/\{[\s\S]*?"action"[\s\S]*?\}/);
      
      if (commandMatch) {
        const commandJson = JSON.parse(commandMatch[0]);
        
        if (this.isValidMusicCommand(commandJson)) {
          return {
            hasCommand: true,
            command: commandJson as MusicCommand,
            displayText: claudeResponse.replace(commandMatch[0], '').trim()
          };
        }
      }
      
      // If no JSON command, check for natural language music requests
      return this.parseNaturalLanguage(claudeResponse);
      
    } catch (error) {
      console.error('Error parsing command:', error);
      return {
        hasCommand: false,
        displayText: claudeResponse
      };
    }
  }
  
  // Parse natural language for music requests
  private parseNaturalLanguage(text: string): CommandResponse {
    const lowerText = text.toLowerCase();
    
    // Check for play commands
    if (lowerText.includes('play') && (lowerText.includes('music') || lowerText.includes('track') || lowerText.includes('song'))) {
      
      // Check for specific categories
      if (lowerText.includes('motivational') || lowerText.includes('motivation')) {
        return {
          hasCommand: true,
          command: { action: 'play_category', category: 'Motivational' },
          displayText: 'Playing motivational music for you!'
        };
      }
      
      if (lowerText.includes('meditation') || lowerText.includes('meditate')) {
        return {
          hasCommand: true,
          command: { action: 'play_category', category: 'Meditation' },
          displayText: 'Starting meditation music...'
        };
      }
      
      if (lowerText.includes('nature') || lowerText.includes('natural')) {
        return {
          hasCommand: true,
          command: { action: 'play_category', category: 'Nature' },
          displayText: 'Playing nature sounds...'
        };
      }
      
      if (lowerText.includes('rain')) {
        return {
          hasCommand: true,
          command: { action: 'play_category', category: 'Rain Sounds' },
          displayText: 'Playing rain sounds...'
        };
      }
      
      if (lowerText.includes('focus') || lowerText.includes('study') || lowerText.includes('concentration')) {
        return {
          hasCommand: true,
          command: { action: 'play_category', category: 'Focus & Study' },
          displayText: 'Playing focus music for better concentration...'
        };
      }
      
      if (lowerText.includes('relax') || lowerText.includes('calm')) {
        return {
          hasCommand: true,
          command: { action: 'play_category', category: 'Relaxation' },
          displayText: 'Playing relaxing music...'
        };
      }
      
      if (lowerText.includes('sleep') || lowerText.includes('bedtime')) {
        return {
          hasCommand: true,
          command: { action: 'play_category', category: 'Sleep Sounds' },
          displayText: 'Playing sleep sounds...'
        };
      }
      
      if (lowerText.includes('morning') || lowerText.includes('wake up')) {
        return {
          hasCommand: true,
          command: { action: 'play_category', category: 'Morning Routine' },
          displayText: 'Playing morning routine music...'
        };
      }
      
      if (lowerText.includes('fireplace') || lowerText.includes('fire')) {
        return {
          hasCommand: true,
          command: { action: 'play_category', category: 'Fireplace' },
          displayText: 'Playing fireplace sounds...'
        };
      }
      
      // Generic play music request
      return {
        hasCommand: true,
        command: { action: 'play_music' },
        displayText: 'Let me play some music for you...'
      };
    }
    
    // Check for pause/stop commands
    if (lowerText.includes('pause') || lowerText.includes('stop')) {
      if (lowerText.includes('music') || lowerText.includes('song') || lowerText.includes('track')) {
        return {
          hasCommand: true,
          command: { action: 'pause_music' },
          displayText: 'Pausing music...'
        };
      }
    }
    
    return {
      hasCommand: false,
      displayText: text
    };
  }
  
  // Execute music commands
  async executeCommand(command: MusicCommand): Promise<boolean> {
    try {
      switch (command.action) {
        case 'play_music':
          return await this.playAnyAvailableTrack();
          
        case 'play_category':
          if (command.category) {
            return await this.playCategoryTracks(command.category);
          }
          break;
          
        case 'play_track':
          if (command.trackId) {
            return await this.playSpecificTrack(command.trackId);
          }
          break;
          
        case 'pause_music':
          await musicService.togglePlayback();
          return true;
          
        case 'stop_music':
          await musicService.stopPlayback();
          return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error executing music command:', error);
      return false;
    }
  }
  
  // Play any available track
  private async playAnyAvailableTrack(): Promise<boolean> {
    const allTracks = getAllTracks();
    if (allTracks.length > 0) {
      await musicService.playTrack(allTracks[0]);
      return true;
    }
    return false;
  }
  
  // Play tracks from specific category
  private async playCategoryTracks(category: string): Promise<boolean> {
    const tracks = getTracksByCategory(category);
    if (tracks.length > 0) {
      await musicService.playTrack(tracks[0]); // Play first track in category
      return true;
    }
    return false;
  }
  
  // Play specific track by ID
  private async playSpecificTrack(trackId: string): Promise<boolean> {
    const track = getTrackById(trackId);
    if (track) {
      await musicService.playTrack(track);
      return true;
    }
    return false;
  }
  
  // Validate if object is a valid music command
  private isValidMusicCommand(obj: any): boolean {
    return obj && 
           typeof obj === 'object' && 
           obj.action && 
           ['play_music', 'pause_music', 'stop_music', 'play_category', 'play_track'].includes(obj.action);
  }
}

export const commandProcessor = new CommandProcessor();