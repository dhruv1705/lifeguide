import { StyleSheet, View, TouchableOpacity, Text, TextInput, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import VoiceAssistantOrb from '../VoiceAssistantOrb';
import ProfileIcon from '../ProfileIcon';
import { claudeApi } from '../../services/claudeApi';
import { voiceService } from '../../services/voiceService';

export default function HomeScreen() {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [inputText, setInputText] = useState('');
  const [response, setResponse] = useState('');
  const [partialSpeech, setPartialSpeech] = useState('');

  useEffect(() => {
    // Initialize voice service callbacks
    voiceService.setCallbacks({
      onSpeechStart: () => {
        console.log('Voice recording started');
        setIsRecording(true);
        setIsListening(false);
        setIsProcessing(false);
      },
      onSpeechEnd: () => {
        console.log('Voice recording ended');
        setIsRecording(false);
      },
      onSpeechResults: (results) => {
        console.log('Final speech results:', results);
        if (results.length > 0) {
          const finalText = results[0];
          setPartialSpeech('');
          processVoiceInput(finalText);
        }
      },
      onSpeechPartialResults: (results) => {
        console.log('Partial speech results:', results);
        if (results.length > 0) {
          setPartialSpeech(results[0]);
        }
      },
      onSpeechError: (error) => {
        console.error('Voice recognition error:', error);
        setIsRecording(false);
        setIsListening(false);
        setIsProcessing(false);
        Alert.alert('Voice Error', 'Could not recognize speech. Please try again.');
      }
    });

    return () => {
      voiceService.destroy();
    };
  }, []);

  const processVoiceInput = async (text: string) => {
    try {
      // Simulate listening/processing state
      setIsListening(true);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Process with Claude API
      setIsListening(false);
      setIsProcessing(true);
      
      const claudeResponse = await claudeApi.sendMessage(text);
      
      setIsProcessing(false);
      setResponse(claudeResponse);
      
      // Show response for 8 seconds then clear
      setTimeout(() => setResponse(''), 8000);
      
    } catch (error) {
      setIsProcessing(false);
      setIsListening(false);
      Alert.alert('Error', 'Failed to get response from Claude. Please try again.');
      console.error('Voice interaction error:', error);
    }
  };

  const startVoiceRecording = async () => {
    try {
      const hasPermission = await voiceService.checkPermissions();
      if (!hasPermission) {
        Alert.alert('Permission Required', 'Please enable microphone permission to use voice features.');
        return;
      }

      setResponse(''); // Clear previous response
      setPartialSpeech('');
      await voiceService.startListening();
    } catch (error) {
      console.error('Error starting voice recording:', error);
      Alert.alert('Error', 'Could not start voice recording. Please try again.');
    }
  };

  const stopVoiceRecording = async () => {
    try {
      await voiceService.stopListening();
    } catch (error) {
      console.error('Error stopping voice recording:', error);
    }
  };

  const simulateVoiceInteraction = async () => {
    if (!inputText.trim()) {
      Alert.alert('Please enter a message first');
      return;
    }

    try {
      // Simulate listening
      setIsListening(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Process with Claude API
      setIsListening(false);
      setIsProcessing(true);
      
      const claudeResponse = await claudeApi.sendMessage(inputText);
      
      setIsProcessing(false);
      setResponse(claudeResponse);
      setInputText('');
      
      // Show response for 8 seconds then clear (longer for real responses)
      setTimeout(() => setResponse(''), 8000);
      
    } catch (error) {
      setIsProcessing(false);
      setIsListening(false);
      Alert.alert('Error', 'Failed to get response from Claude. Please try again.');
      console.error('Voice interaction error:', error);
    }
  };

  const clearConversation = () => {
    claudeApi.clearHistory();
    setResponse('');
    setPartialSpeech('');
    Alert.alert('Conversation cleared', 'Chat history has been reset.');
  };

  return (
    <View style={styles.container}>
      <ProfileIcon />
      
      <VoiceAssistantOrb 
        size={300} 
        isListening={isListening}
        isProcessing={isProcessing}
        isRecording={isRecording}
      />
      
      {response ? (
        <View style={styles.responseContainer}>
          <Text style={styles.responseText}>{response}</Text>
        </View>
      ) : null}

      {partialSpeech ? (
        <View style={styles.partialSpeechContainer}>
          <Text style={styles.partialSpeechText}>"{partialSpeech}"</Text>
        </View>
      ) : null}

      {/* Voice Recording Button */}
      <TouchableOpacity 
        style={[
          styles.voiceButton, 
          isRecording && styles.voiceButtonActive,
          (isListening || isProcessing) && styles.voiceButtonDisabled
        ]}
        onPress={isRecording ? stopVoiceRecording : startVoiceRecording}
        disabled={isListening || isProcessing}
      >
        <Text style={styles.voiceButtonText}>
          {isRecording ? '🛑 Stop' : '🎤 Voice'}
        </Text>
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message here..."
          placeholderTextColor="#666"
          multiline
        />
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={simulateVoiceInteraction}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>

      {/* Clear conversation button - only show when there's conversation history */}
      {response && (
        <TouchableOpacity 
          style={styles.clearButton} 
          onPress={clearConversation}
        >
          <Text style={styles.clearButtonText}>✨ Clear</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  responseContainer: {
    position: 'absolute',
    top: 80,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(26, 35, 50, 0.95)',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 204, 255, 0.3)',
    shadowColor: '#00ccff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  responseText: {
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'left',
  },
  inputContainer: {
    position: 'absolute',
    bottom: 140,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  textInput: {
    flex: 1,
    backgroundColor: 'rgba(42, 54, 66, 0.8)',
    color: 'white',
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    fontSize: 16,
    maxHeight: 120,
  },
  sendButton: {
    backgroundColor: '#00aaff',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 24,
    shadowColor: '#00aaff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  clearButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(106, 76, 147, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(138, 108, 184, 0.6)',
  },
  clearButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  voiceButton: {
    position: 'absolute',
    bottom: 220,
    alignSelf: 'center',
    backgroundColor: '#00aaff',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#00ccff',
    shadowColor: '#00aaff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 8,
  },
  voiceButtonActive: {
    backgroundColor: '#ff0066',
    borderColor: '#ff3388',
    shadowColor: '#ff0066',
    transform: [{ scale: 1.05 }],
  },
  voiceButtonDisabled: {
    backgroundColor: 'rgba(102, 102, 102, 0.6)',
    borderColor: 'rgba(136, 136, 136, 0.6)',
    opacity: 0.5,
    shadowOpacity: 0.2,
  },
  voiceButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  partialSpeechContainer: {
    position: 'absolute',
    top: 160,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 102, 0, 0.15)',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 102, 0, 0.4)',
  },
  partialSpeechText: {
    color: '#ffaa44',
    fontSize: 15,
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: '500',
  },
});