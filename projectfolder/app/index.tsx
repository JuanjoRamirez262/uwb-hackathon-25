import { View, Text, StyleSheet, ScrollView } from "react-native";
import VoiceRecordings from "@/components/VoiceRecordings";
import TodoList from "@/components/TodoList";
import CalendarView from "@/components/CalendarView";
import Journal from "@/components/Journal";
import Notes from "@/components/Notes";
import MedicationList from "@/components/MedicationList";

export default function Home() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>MemoryLane Dashboard</Text>

      <View style={styles.section}>
        <VoiceRecordings />
      </View>

      <View style={styles.separator} />

      <View style={styles.section}>
        <TodoList />
      </View>

      <View style={styles.separator} />

      <View style={styles.section}>
        <CalendarView />
      </View>

      <View style={styles.separator} />

      <View style={styles.section}>
        <Journal />
      </View>

      <View style={styles.separator} />

      <View style={styles.section}>
        <Notes />
      </View>

      <View style={styles.separator} />

      <View style={styles.section}>
        <MedicationList />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16, 
    paddingTop: 32,
    alignItems: 'center',
    backgroundColor: '#F0F0F0', // or your secondary background color
  },
  title: {
    fontSize: 32, // similar to text-4xl
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#15803D', // text-green-700
    backgroundColor: '#FFFFFF', // primary background if you want
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3, // for shadow
  },
  section: {
    width: '100%',
    maxWidth: 800, // similar to max-w-5xl
  },
  separator: {
    height: 8,
    backgroundColor: '#D1D5DB', // bg-border
    borderRadius: 999,
    marginVertical: 16,
    width: '100%',
    maxWidth: 800,
  },
});

