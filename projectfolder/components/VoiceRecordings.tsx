import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

// Sample recordings (replace with real ones later)
const sampleRecordings = [
  {
    id: 'sample-1',
    name: 'Message from Sarah',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 'sample-2',
    name: 'Reminder from John',
    url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3',
  },
];

interface Recording {
  id: string;
  name: string;
  url: string;
}

export default function VoiceRecordings() {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    // Only set sample data if recordings are empty
    if (recordings.length === 0) {
      setRecordings(sampleRecordings);
    }
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
      try {
        setIsLoading(true);
        await unloadSound();
        const { sound } = await Audio.Sound.createAsync(
          { uri: recording.url },
          { shouldPlay: true }
        );
        soundRef.current = sound;
        setCurrentPlayingId(recording.id);

        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            setCurrentPlayingId(null);
          }
        });

      } catch (error) {
        console.error('Audio playback error:', error);
        alert('Failed to play the recording.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Ionicons name="volume-high-outline" size={24} color="#15803D" />
          <Text style={styles.headerTitle}>Voice Recordings</Text>
        </View>

        <Text style={styles.sectionTitle}>Listen to Recordings</Text>

        {isLoading && (
          <ActivityIndicator size="large" color="#15803D" style={{ marginVertical: 16 }} />
        )}

        {recordings.length === 0 ? (
          <Text style={styles.emptyText}>No recordings available yet. Ask a loved one to add one!</Text>
        ) : (
          <FlatList
            data={recordings}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.recordingCard}>
                <Text style={styles.recordingName} numberOfLines={1}>
                  {item.name}
                </Text>
                <TouchableOpacity
                  style={styles.playButton}
                  onPress={() => handlePlayPause(item)}
                >
                  {currentPlayingId === item.id ? (
                    <Ionicons name="pause" size={24} color="#15803D" />
                  ) : (
                    <Ionicons name="play" size={24} color="#15803D" />
                  )}
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#15803D',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#6B7280',
    marginVertical: 24,
  },
  recordingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  recordingName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  playButton: {
    backgroundColor: '#E5E7EB',
    padding: 8,
    borderRadius: 8,
  },
});

