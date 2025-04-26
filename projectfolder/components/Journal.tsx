import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, FlatList, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For icons
import { format, parseISO } from 'date-fns';

interface JournalEntry {
  id: string;
  date: string;
  content: string;
}

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newEntryContent, setNewEntryContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingEntry, setViewingEntry] = useState<JournalEntry | null>(null);

  const sortedEntries = useMemo(() => {
    return [...entries].sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());
  }, [entries]);

  const handleAddEntry = () => {
    if (newEntryContent.trim()) {
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        content: newEntryContent.trim(),
      };
      setEntries([...entries, newEntry]);
      setNewEntryContent('');
      setIsModalOpen(false);
    }
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter((entry) => entry.id !== id));
    setViewingEntry(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Ionicons name="book-outline" size={24} color="#15803D" />
          <Text style={styles.headerTitle}>Journal</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => setIsModalOpen(true)}>
            <Ionicons name="add-circle-outline" size={28} color="white" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Past Entries</Text>

        {sortedEntries.length === 0 ? (
          <Text style={styles.noEntries}>No journal entries yet.</Text>
        ) : (
          <FlatList
            data={sortedEntries}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.entryCard}
                onPress={() => setViewingEntry(item)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.entryDate}>{format(parseISO(item.date), 'PPP p')}</Text>
                  <Text style={styles.entryPreview}>
                    {item.content.length > 100 ? item.content.substring(0, 100) + '...' : item.content}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => handleDeleteEntry(item.id)}>
                  <Ionicons name="trash-outline" size={24} color="red" />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      {/* Modal for Adding New Entry */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Journal Entry - {format(new Date(), 'PPP')}</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Write about your day, thoughts, or feelings..."
              value={newEntryContent}
              onChangeText={setNewEntryContent}
              multiline
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setIsModalOpen(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleAddEntry}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal for Viewing Existing Entry */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={!!viewingEntry}
        onRequestClose={() => setViewingEntry(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {viewingEntry && (
              <>
                <Text style={styles.modalTitle}>Journal Entry - {format(parseISO(viewingEntry.date), 'PPP p')}</Text>
                <ScrollView style={{ marginVertical: 16 }}>
                  <Text style={{ fontSize: 16 }}>{viewingEntry.content}</Text>
                </ScrollView>
                <View style={styles.modalButtons}>
                  <TouchableOpacity style={styles.cancelButton} onPress={() => setViewingEntry(null)}>
                    <Text style={styles.cancelButtonText}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteEntry(viewingEntry.id)}>
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#15803D',
    flex: 1,
    marginLeft: 8,
  },
  addButton: {
    backgroundColor: '#15803D',
    borderRadius: 50,
    padding: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  noEntries: {
    textAlign: 'center',
    color: '#6B7280',
    paddingVertical: 12,
  },
  entryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
  },
  entryDate: {
    fontSize: 16,
    fontWeight: '600',
  },
  entryPreview: {
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
    textAlign: 'center',
    marginBottom: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    height: 150,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  deleteButton: {
    backgroundColor: '#EF4444',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  deleteButtonText: {
    textAlign: 'center',
    fontWeight: '600',
    color: 'white',
  },
});
