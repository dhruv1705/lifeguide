import axios from 'axios';
import { CLAUDE_API_KEY } from '@env';
import { musicLibrary, getAllTracks } from '../data/musicLibrary';

const API_KEY = CLAUDE_API_KEY || '';
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClaudeResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
  id: string;
  model: string;
  role: string;
  stop_reason: string;
  stop_sequence: null;
  type: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export class ClaudeApiService {
  private conversationHistory: ClaudeMessage[] = [];

  // Generate system prompt with music library knowledge
  private generateSystemPrompt(): string {
    const availableCategories = musicLibrary.map(cat => 
      `${cat.name} ${cat.emoji} (${cat.tracks.length} tracks)`
    ).join(', ');
    
    const availableTracks = getAllTracks().map(track => 
      `"${track.title}" by ${track.artist || 'Unknown'} in ${track.category}`
    ).join(', ');

    return `You are a helpful voice assistant with access to a music library. You can play music for users.

AVAILABLE MUSIC LIBRARY:
Categories: ${availableCategories}
Tracks: ${availableTracks}

MUSIC COMMANDS:
When users request music, respond naturally while including a JSON command in your response.

Example responses:
- "Playing motivational music for you! {"action": "play_category", "category": "Motivational"}"
- "I'll play that track now. {"action": "play_track", "trackId": "1"}"
- "Let me pause the music. {"action": "pause_music"}"

Available actions:
- play_category: Play tracks from a specific category
- play_track: Play a specific track by ID
- play_music: Play any available track
- pause_music: Pause current playback
- stop_music: Stop current playback

Always be helpful and conversational while providing music functionality when requested.`;
  }

  async sendMessage(userMessage: string): Promise<string> {
    try {
      // Add user message to conversation history
      this.conversationHistory.push({
        role: 'user',
        content: userMessage
      });

      // Prepare the API request with system prompt
      const requestData = {
        model: 'claude-3-haiku-20240307', // Fast and cost-effective model
        max_tokens: 1000,
        system: this.generateSystemPrompt(),
        messages: this.conversationHistory
      };

      const response = await axios.post<ClaudeResponse>(
        CLAUDE_API_URL,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
            'anthropic-version': '2023-06-01'
          },
          timeout: 30000 // 30 second timeout
        }
      );

      // Extract the assistant's response
      const assistantMessage = response.data.content[0]?.text || 'Sorry, I could not process your request.';

      // Add assistant response to conversation history
      this.conversationHistory.push({
        role: 'assistant',
        content: assistantMessage
      });

      return assistantMessage;

    } catch (error) {
      console.error('Claude API Error:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          return 'Authentication error. Please check the API key.';
        } else if (error.response?.status === 429) {
          return 'Rate limit exceeded. Please try again later.';
        } else if (error.code === 'ECONNABORTED') {
          return 'Request timeout. Please try again.';
        }
      }
      
      return 'Sorry, I encountered an error. Please try again.';
    }
  }

  // Clear conversation history
  clearHistory(): void {
    this.conversationHistory = [];
  }

  // Get conversation history
  getHistory(): ClaudeMessage[] {
    return [...this.conversationHistory];
  }
}

// Export a singleton instance
export const claudeApi = new ClaudeApiService();