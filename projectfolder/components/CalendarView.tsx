import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, FlatList, StyleSheet } from 'react-native';
import { format, isSameDay, parseISO } from 'date-fns';
import { Calendar } from 'react-native-calendars'; // We'll use react-native-calendars package for Calendar UI
import { Ionicons } from '@expo/vector-icons'; // or any icon set

interface CalendarEvent {
  id: string;
  date: string; // ISO string
  title: string;
  description?: string;
}

export default function CalendarView() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  const handleDateSelect = (day: any) => {
    setSelectedDate(day.dateString);
  };

  const handleAddEvent = () => {
    if (newEventTitle.trim() === '') return;
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      date: selectedDate,
      title: newEventTitle.trim(),
      description: newEventDescription.trim() || undefined,
    };
    setEvents((prev) => [...prev, newEvent]);
    setNewEventTitle('');
    setNewEventDescription('');
    setModalVisible(false);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter((event) => event.id !== id));
  };

  const eventsForSelectedDate = events.filter((event) => event.date === selectedDate);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>
          <Ionicons name="calendar-outline" size={24} color="#15803D" /> Calendar
        </Text>

        <Calendar
          onDayPress={handleDateSelect}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: '#15803D' },
            ...Object.fromEntries(events.map(event => [event.date, { marked: true }]))
          }}
          theme={{
            todayTextColor: '#15803D',
            selectedDayBackgroundColor: '#15803D',
            arrowColor: '#15803D',
          }}
        />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Events for {selectedDate ? format(parseISO(selectedDate), 'PPP') : 'Select a Date'}
            </Text>
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
              <Ionicons name="add-circle-outline" size={28} color="white" />
            </TouchableOpacity>
          </View>

          {eventsForSelectedDate.length === 0 ? (
            <Text style={styles.noEvents}>No events scheduled for this day.</Text>
          ) : (
            <FlatList
              data={eventsForSelectedDate}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.eventCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.eventTitle}>{item.title}</Text>
                    {item.description ? (
                      <Text style={styles.eventDescription}>{item.description}</Text>
                    ) : null}
                  </View>
                  <TouchableOpacity onPress={() => handleDeleteEvent(item.id)}>
                    <Ionicons name="trash-outline" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add Event for {format(parseISO(selectedDate), 'PPP')}</Text>
              <TextInput
                style={styles.input}
                placeholder="Title"
                value={newEventTitle}
                onChangeText={setNewEventTitle}
              />
              <TextInput
                style={[styles.input, { height: 80 }]}
                placeholder="Description (optional)"
                value={newEventDescription}
                onChangeText={setNewEventDescription}
                multiline
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleAddEvent}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#15803D',
    marginBottom: 16,
    textAlign: 'center',
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#15803D',
    borderRadius: 50,
    padding: 8,
  },
  noEvents: {
    textAlign: 'center',
    color: '#6B7280',
    paddingVertical: 12,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  eventDescription: {
    color: '#6B7280',
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cancelButton: {
    backgroundColor: '#E5E7EB',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  cancelButtonText: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#374151',
  },
  saveButton: {
    backgroundColor: '#15803D',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  saveButtonText: {
    textAlign: 'center',
    fontWeight: '600',
    color: 'white',
  },
});
