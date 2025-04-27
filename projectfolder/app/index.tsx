import React, { useState } from 'react';
import { View, Text, Switch, ScrollView, StyleSheet } from 'react-native';
import VoiceRecordings from '@/components/VoiceRecordings';
import TodoList from '@/components/TodoList';
import CalendarView from '@/components/CalendarView';
import Journal from '@/components/Journal';
import Notes from '@/components/Notes';
import MedicationList from '@/components/MedicationList';
import Carousel from '@/components/Carousel';

export type AppMode = 'patient' | 'family';

export default function HomeScreen() {
  const [mode, setMode] = useState<AppMode>('patient');

  const handleModeToggle = (value: boolean) => {
    setMode(value ? 'family' : 'patient');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Hi Tod, welcome to your life!</Text>
      </View>

      {/* Content Sections */}
      <View style={styles.section}>
        <VoiceRecordings mode={mode} />
      </View>

      <View style={styles.section}>
        <Carousel />
      </View>

      <View style={styles.separator} />

      <View style={styles.section}>
        <TodoList mode={mode} />
      </View>

      <View style={styles.separator} />

      <View style={styles.section}>
        <CalendarView mode={mode} />
      </View>

      <View style={styles.separator} />

      <View style={styles.section}>
        <Journal mode={mode} />
      </View>

      <View style={styles.separator} />

      <View style={styles.section}>
        <Notes mode={mode} />
      </View>

      <View style={styles.separator} />

      <View style={styles.section}>
        <MedicationList mode={mode} />
      </View>

      <View style={styles.toggleContainer}>
          <Text style={styles.label}>Patient Mode</Text>
          <Switch
            value={mode === 'family'}
            onValueChange={handleModeToggle}
          />
          <Text style={styles.label}>Family Mode</Text>
        </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  header: {
    marginTop: 24,
    marginBottom: 0,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#15803D',
    marginBottom: 16,
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    padding: 8,
    borderRadius: 12,
  },
  label: {
    fontSize: 16,
    marginHorizontal: 8,
  },
  section: {
    marginVertical: 0,
  },
  separator: {
    height: 1,
    backgroundColor: '#D1D5DB',
    marginVertical: 16,
  },
});
