import { VoiceServiceCallbacks } from './voiceService';

export class WebVoiceService {
  private recognition: any = null;
  private isListening = false;
  private callbacks: VoiceServiceCallbacks = {};

  constructor() {
    // Check if Web Speech API is available
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.setupRecognition();
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.onstart = () => {
      console.log('Web speech recognition started');
      this.isListening = true;
      this.callbacks.onSpeechStart?.();
    };

    this.recognition.onend = () => {
      console.log('Web speech recognition ended');
      this.isListening = false;
      this.callbacks.onSpeechEnd?.();
    };

    this.recognition.onresult = (event: any) => {
      const results = [];
      const partialResults = [];

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          results.push(result[0].transcript);
        } else {
          partialResults.push(result[0].transcript);
        }
      }

      if (partialResults.length > 0) {
        this.callbacks.onSpeechPartialResults?.(partialResults);
      }

      if (results.length > 0) {
        this.callbacks.onSpeechResults?.(results);
      }
    };

    this.recognition.onerror = (event: any) => {
      console.error('Web speech recognition error:', event.error);
      this.isListening = false;
      this.callbacks.onSpeechError?.(event.error);
    };
  }

  setCallbacks(callbacks: VoiceServiceCallbacks) {
    this.callbacks = callbacks;
  }

  async startListening(): Promise<void> {
    if (!this.recognition) {
      throw new Error('Speech recognition not supported in this browser');
    }

    if (this.isListening) {
      await this.stopListening();
    }

    try {
      this.recognition.start();
    } catch (error) {
      console.error('Error starting web speech recognition:', error);
      throw error;
    }
  }

  async stopListening(): Promise<void> {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  async cancelListening(): Promise<void> {
    if (this.recognition && this.isListening) {
      this.recognition.abort();
      this.isListening = false;
    }
  }

  getIsListening(): boolean {
    return this.isListening;
  }

  async checkPermissions(): Promise<boolean> {
    return !!this.recognition;
  }

  async destroy(): Promise<void> {
    if (this.recognition) {
      this.recognition.onstart = null;
      this.recognition.onend = null;
      this.recognition.onresult = null;
      this.recognition.onerror = null;
      this.recognition = null;
    }
  }
}

// Export singleton instance
export const webVoiceService = new WebVoiceService();