import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Modal, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { format, parseISO, isSameDay } from 'date-fns';
import type { AppMode } from '@/app/index'; // Make sure AppMode is exported from index.tsx
import { Ionicons } from '@expo/vector-icons';

interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  description?: string;
}

interface Props {
  mode: AppMode;
}

export default function CalendarView({ mode }: Props) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    // Load from local storage if you want
  }, []);

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
  };

  const handleAddEvent = () => {
    if (!newEventTitle.trim()) {
      Alert.alert('Error', 'Please enter a title.');
      return;
    }

    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      date: selectedDate,
      title: newEventTitle.trim(),
      description: newEventDescription.trim() || undefined,
    };

    setEvents((prev) => [...prev, newEvent]);
    setNewEventTitle('');
    setNewEventDescription('');
    setIsModalVisible(false);
    Alert.alert('Success', `Added event for ${format(parseISO(selectedDate), 'PPP')}`);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
    Alert.alert('Deleted', 'Event has been deleted.');
  };

  const eventsForSelectedDate = events.filter((event) =>
    isSameDay(parseISO(event.date), parseISO(selectedDate))
  );

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={{
          [selectedDate]: { selected: true, marked: true, selectedColor: '#4CAF50' },
        }}
      />

      <View style={styles.eventsContainer}>
        <Text style={styles.eventsTitle}>
          Events for {format(parseISO(selectedDate), 'PPP')}
        </Text>

        {mode === 'family' && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setIsModalVisible(true)}
          >
            <Ionicons name="add-circle-outline" size={24} color="white" />
            <Text style={styles.addButtonText}>Add Event</Text>
          </TouchableOpacity>
        )}

        {eventsForSelectedDate.length === 0 ? (
          <Text style={styles.noEvents}>No events for this day.</Text>
        ) : (
          <FlatList
            data={eventsForSelectedDate}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.eventItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.eventTitle}>{item.title}</Text>
                  {item.description && (
                    <Text style={styles.eventDescription}>{item.description}</Text>
                  )}
                </View>
                {mode === 'family' && (
                  <TouchableOpacity onPress={() => handleDeleteEvent(item.id)}>
                    <Ionicons name="trash-outline" size={24} color="red" />
                  </TouchableOpacity>
                )}
              </View>
            )}
          />
        )}
      </View>

      {/* Modal for adding event */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Event</Text>

            <TextInput
              style={styles.input}
              placeholder="Event Title"
              value={newEventTitle}
              onChangeText={setNewEventTitle}
            />

            <TextInput
              style={[styles.input, { height: 100 }]}
              placeholder="Event Description (optional)"
              multiline
              value={newEventDescription}
              onChangeText={setNewEventDescription}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleAddEvent}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  eventsContainer: {
    marginTop: 20,
  },
  eventsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#15803D',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  addButtonText: {
    color: 'white',
    marginLeft: 6,
    fontSize: 16,
  },
  noEvents: {
    textAlign: 'center',
    marginTop: 20,
    color: '#6B7280',
  },
  eventItem: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  eventTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  eventDescription: {
    color: '#6B7280',
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: '#6B7280',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#15803D',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

