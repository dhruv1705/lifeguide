import Voice, {
  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechErrorEvent,
  SpeechStartEvent,
  SpeechEndEvent,
} from '@react-native-voice/voice';
import { Platform } from 'react-native';
import { webVoiceService } from './webVoiceService';

export interface VoiceServiceCallbacks {
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
  onSpeechResults?: (results: string[]) => void;
  onSpeechPartialResults?: (results: string[]) => void;
  onSpeechError?: (error: any) => void;
  onSpeechVolumeChanged?: (volume: number) => void;
}

export class VoiceService {
  private isListening = false;
  private callbacks: VoiceServiceCallbacks = {};
  private isWeb = Platform.OS === 'web';

  constructor() {
    if (this.isWeb) {
      // Use Web Speech API for web platform
      webVoiceService.setCallbacks({
        onSpeechStart: () => this.callbacks.onSpeechStart?.(),
        onSpeechEnd: () => this.callbacks.onSpeechEnd?.(),
        onSpeechResults: (results) => this.callbacks.onSpeechResults?.(results),
        onSpeechPartialResults: (results) => this.callbacks.onSpeechPartialResults?.(results),
        onSpeechError: (error) => this.callbacks.onSpeechError?.(error),
      });
    } else {
      this.initializeVoiceEvents();
    }
  }

  private initializeVoiceEvents() {
    Voice.onSpeechStart = this.onSpeechStart;
    Voice.onSpeechEnd = this.onSpeechEnd;
    Voice.onSpeechResults = this.onSpeechResults;
    Voice.onSpeechPartialResults = this.onSpeechPartialResults;
    Voice.onSpeechError = this.onSpeechError;
    Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged;
  }

  setCallbacks(callbacks: VoiceServiceCallbacks) {
    this.callbacks = callbacks;
    if (this.isWeb) {
      webVoiceService.setCallbacks({
        onSpeechStart: () => this.callbacks.onSpeechStart?.(),
        onSpeechEnd: () => this.callbacks.onSpeechEnd?.(),
        onSpeechResults: (results) => this.callbacks.onSpeechResults?.(results),
        onSpeechPartialResults: (results) => this.callbacks.onSpeechPartialResults?.(results),
        onSpeechError: (error) => this.callbacks.onSpeechError?.(error),
      });
    }
  }

  private onSpeechStart = (event: SpeechStartEvent) => {
    console.log('Speech started');
    this.isListening = true;
    this.callbacks.onSpeechStart?.();
  };

  private onSpeechEnd = (event: SpeechEndEvent) => {
    console.log('Speech ended');
    this.isListening = false;
    this.callbacks.onSpeechEnd?.();
  };

  private onSpeechResults = (event: SpeechResultsEvent) => {
    console.log('Speech results:', event.value);
    this.callbacks.onSpeechResults?.(event.value || []);
  };

  private onSpeechPartialResults = (event: SpeechResultsEvent) => {
    console.log('Partial results:', event.value);
    this.callbacks.onSpeechPartialResults?.(event.value || []);
  };

  private onSpeechError = (event: SpeechErrorEvent) => {
    console.log('Speech error:', event.error);
    this.isListening = false;
    this.callbacks.onSpeechError?.(event.error);
  };

  private onSpeechVolumeChanged = (event: any) => {
    this.callbacks.onSpeechVolumeChanged?.(event.value || 0);
  };

  async startListening(): Promise<void> {
    if (this.isWeb) {
      return webVoiceService.startListening();
    }

    try {
      if (this.isListening) {
        await this.stopListening();
      }

      await Voice.start('en-US', {
        EXTRA_LANGUAGE_MODEL: 'LANGUAGE_MODEL_FREE_FORM',
        EXTRA_CALLING_PACKAGE: 'com.example.voiceassistantorb',
        EXTRA_PARTIAL_RESULTS: true,
        REQUEST_PERMISSIONS_AUTO: true,
      });
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      throw error;
    }
  }

  async stopListening(): Promise<void> {
    if (this.isWeb) {
      return webVoiceService.stopListening();
    }

    try {
      await Voice.stop();
      this.isListening = false;
    } catch (error) {
      console.error('Error stopping voice recognition:', error);
      throw error;
    }
  }

  async cancelListening(): Promise<void> {
    if (this.isWeb) {
      return webVoiceService.cancelListening();
    }

    try {
      await Voice.cancel();
      this.isListening = false;
    } catch (error) {
      console.error('Error canceling voice recognition:', error);
      throw error;
    }
  }

  getIsListening(): boolean {
    if (this.isWeb) {
      return webVoiceService.getIsListening();
    }
    return this.isListening;
  }

  async checkPermissions(): Promise<boolean> {
    if (this.isWeb) {
      return webVoiceService.checkPermissions();
    }

    try {
      const available = await Voice.isAvailable();
      return !!available;
    } catch (error) {
      console.error('Error checking voice permissions:', error);
      return false;
    }
  }

  async destroy(): Promise<void> {
    if (this.isWeb) {
      return webVoiceService.destroy();
    }

    try {
      await Voice.destroy();
      Voice.removeAllListeners();
    } catch (error) {
      console.error('Error destroying voice service:', error);
    }
  }
}

// Export singleton instance
export const voiceService = new VoiceService();