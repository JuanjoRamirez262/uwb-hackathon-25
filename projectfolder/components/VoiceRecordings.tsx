import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import type { AppMode } from '@/app/index';

interface Recording {
  id: string;
  name: string;
  url: string;
}

const sampleRecordings: Recording[] = [
  {
    id: 'sample-1',
    name: 'Message from Sarah',
    url: require('../assets/Sarah.mp3'), // Local file
  }
];

interface VoiceRecordingsProps {
  mode: AppMode;
}

export default function VoiceRecordings({ mode }: VoiceRecordingsProps) {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate loading recordings (e.g., from an API or local storage)
    const loadRecordings = async () => {
      setIsLoading(true); // Start loading
      try {
        // Simulate a delay (e.g., fetching data)
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setRecordings(sampleRecordings); // Set the recordings
      } catch (error) {
        console.error('Failed to load recordings:', error);
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    loadRecordings();

    return () => {
      unloadSound();
    };
  }, []);

  const unloadSound = async () => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
  };

  const handlePlayPause = async (recording: Recording) => {
    if (currentPlayingId === recording.id) {
      // Pause
      if (soundRef.current) {
        await soundRef.current.pauseAsync();
        setCurrentPlayingId(null);
      }
    } else {
      // Stop previous sound
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      // Load new sound
      try {
        const { sound } = await Audio.Sound.createAsync(
          typeof recording.url === 'string' ? { uri: recording.url } : recording.url
        );
        soundRef.current = sound;
        await sound.playAsync();
        setCurrentPlayingId(recording.id);

        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            setCurrentPlayingId(null);
            sound.unloadAsync();
            soundRef.current = null;
          }
        });
      } catch (error) {
        console.error('Audio playback error:', error);
        alert('Failed to play the recording.');
      }
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="volume-high-outline" size={24} color="#15803D" />
        <Text style={styles.headerText}>Voice Recordings from Loved Ones</Text>
      </View>

      <Text style={styles.subHeader}>Listen to Recordings</Text>

      {isLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#15803D" />
          <Text style={{ marginTop: 8, color: '#6B7280' }}>Loading recordings...</Text>
        </View>
      ) : recordings.length === 0 ? (
        <Text style={styles.noDataText}>No recordings available yet. Ask a loved one to add one!</Text>
      ) : (
        <ScrollView style={{ maxHeight: 300 }}>
          {recordings.map((recording) => (
            <View key={recording.id} style={styles.recordingItem}>
              <Text style={styles.recordingText}>{recording.name}</Text>
              <TouchableOpacity
                style={styles.playButton}
                onPress={() => handlePlayPause(recording)}
              >
                <Ionicons
                  name={currentPlayingId === recording.id ? 'pause' : 'play'}
                  size={24}
                  color="#15803D"
                />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    marginVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#15803D',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  loader: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 20,
  },
  recordingItem: {
    backgroundColor: '#E5E7EB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recordingText: {
    fontSize: 16,
    flexShrink: 1,
  },
  playButton: {
    backgroundColor: '#ECFDF5',
    padding: 8,
    borderRadius: 50,
  },
});