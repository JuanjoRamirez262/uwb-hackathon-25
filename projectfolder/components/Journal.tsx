import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, ScrollView, StyleSheet, Alert } from 'react-native';
import { format, parseISO } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import type { AppMode } from '@/app/index'; // make sure AppMode is exported

interface JournalEntry {
  id: string;
  date: string;
  content: string;
}

interface Props {
  mode: AppMode;
}

export default function Journal({ mode }: Props) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newEntryContent, setNewEntryContent] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);

  const sortedEntries = useMemo(() => {
    return [...entries].sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());
  }, [entries]);

  const openNewEntryModal = () => {
    setEditingEntry(null);
    setNewEntryContent('');
    setIsModalVisible(true);
  };

  const handleSaveEntry = () => {
    if (!newEntryContent.trim()) {
      Alert.alert('Error', 'Cannot save an empty entry.');
      return;
    }

    if (editingEntry) {
      // Update existing entry
      setEntries(prev => prev.map(entry =>
        entry.id === editingEntry.id
          ? { ...entry, content: newEntryContent.trim(), date: new Date().toISOString() }
          : entry
      ));
      Alert.alert('Success', 'Journal entry updated.');
    } else {
      // Create new entry
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        content: newEntryContent.trim(),
      };
      setEntries(prev => [...prev, newEntry]);
      Alert.alert('Success', 'Journal entry saved.');
    }

    setNewEntryContent('');
    setEditingEntry(null);
    setIsModalVisible(false);
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
    setEditingEntry(null);
    Alert.alert('Deleted', 'Journal entry deleted.');
  };

  const openEditEntryModal = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setNewEntryContent(entry.content);
    setIsModalVisible(true);
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📖 Journal</Text>

        {(mode === 'family' || mode === 'patient') && (
          <TouchableOpacity style={styles.newButton} onPress={openNewEntryModal}>
            <Ionicons name="add-circle-outline" size={24} color="white" />
            <Text style={styles.buttonText}>New Entry</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Past Entries */}
      <View style={styles.entriesContainer}>
        <Text style={styles.subTitle}>Past Entries</Text>

        {sortedEntries.length === 0 ? (
          <Text style={styles.noEntries}>No journal entries yet.</Text>
        ) : (
          <FlatList
            data={sortedEntries}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ gap: 12 }}
            renderItem={({ item }) => (
              <View style={styles.entryItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.entryDate}>{format(parseISO(item.date), 'PPP p')}</Text>
                  <Text numberOfLines={1} style={styles.entryContent}>{item.content}</Text>
                </View>
                <View style={styles.entryButtons}>
                  <TouchableOpacity onPress={() => openEditEntryModal(item)}>
                    <Ionicons name="create-outline" size={24} color="#4B5563" />
                  </TouchableOpacity>
                  {mode === 'family' && (
                    <TouchableOpacity onPress={() => handleDeleteEntry(item.id)}>
                      <Ionicons name="trash-outline" size={24} color="red" style={{ marginLeft: 10 }} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
          />
        )}
      </View>

      {/* Add/Edit Entry Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingEntry ? 'Edit Journal Entry' : 'New Journal Entry'}</Text>

            <TextInput
              style={[styles.input, { height: 120 }]}
              placeholder="Write your entry..."
              multiline
              value={newEntryContent}
              onChangeText={setNewEntryContent}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => {
                setIsModalVisible(false);
                setEditingEntry(null);
                setNewEntryContent('');
              }}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveEntry}>
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#15803D',
  },
  newButton: {
    flexDirection: 'row',
    backgroundColor: '#15803D',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
  },
  entriesContainer: {
    marginTop: 20,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noEntries: {
    textAlign: 'center',
    marginTop: 20,
    color: '#6B7280',
  },
  entryItem: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  entryDate: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  entryContent: {
    color: '#6B7280',
    marginTop: 4,
  },
  entryButtons: {
    flexDirection: 'row',
    marginLeft: 8,
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
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F3F4F6',
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
});
