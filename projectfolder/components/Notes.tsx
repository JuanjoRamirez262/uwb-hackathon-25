import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

interface Note {
  id: string;
  title: string;
  content: string;
  lastModified: string;
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const sortedNotes = useMemo(() => {
    return [...notes].sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
  }, [notes]);

  const openNewNoteModal = () => {
    setEditingNote(null);
    setNewNoteTitle('');
    setNewNoteContent('');
    setModalOpen(true);
  };

  const openEditNoteModal = (note: Note) => {
    setEditingNote({ ...note });
    setModalOpen(true);
  };

  const handleSaveNote = () => {
    const title = editingNote ? editingNote.title : newNoteTitle.trim();
    const content = editingNote ? editingNote.content : newNoteContent.trim();
    const id = editingNote ? editingNote.id : Date.now().toString();

    if (title && content) {
      const now = new Date().toISOString();
      const savedNote: Note = {
        id,
        title,
        content,
        lastModified: now,
      };

      const updatedNotes = editingNote
        ? notes.map(note => note.id === id ? savedNote : note)
        : [...notes, savedNote];

      setNotes(updatedNotes);
      setModalOpen(false);
      setNewNoteTitle('');
      setNewNoteContent('');
      setEditingNote(null);
    } else {
      alert('Please provide both title and content.');
    }
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    setEditingNote(null);
    setModalOpen(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="document-text-outline" size={24} color="#15803D" />
            <Text style={styles.headerTitle}>Notes</Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={openNewNoteModal}>
            <Ionicons name="add-circle-outline" size={28} color="white" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Your Notes</Text>

        {sortedNotes.length === 0 ? (
          <Text style={styles.noNotes}>No notes saved yet.</Text>
        ) : (
          <FlatList
            data={sortedNotes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.noteCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.noteTitle}>{item.title}</Text>
                  <Text style={styles.noteDate}>
                    Last modified: {format(new Date(item.lastModified), 'PPP p')}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => openEditNoteModal(item)}>
                  <Ionicons name="eye-outline" size={24} color="#4B5563" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteNote(item.id)}>
                  <Ionicons name="trash-outline" size={24} color="red" style={{ marginLeft: 8 }} />
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalOpen}
        onRequestClose={() => setModalOpen(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingNote ? 'Edit Note' : 'New Note'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Note Title"
              value={editingNote ? editingNote.title : newNoteTitle}
              onChangeText={(text) => editingNote ? setEditingNote({ ...editingNote, title: text }) : setNewNoteTitle(text)}
            />
            <TextInput
              style={[styles.input, { height: 120 }]}
              placeholder="Write your note..."
              value={editingNote ? editingNote.content : newNoteContent}
              onChangeText={(text) => editingNote ? setEditingNote({ ...editingNote, content: text }) : setNewNoteContent(text)}
              multiline
            />

            <View style={styles.modalButtons}>
              {editingNote && (
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteNote(editingNote.id)}>
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveNote}>
                <Text style={styles.saveButtonText}>
                  {editingNote ? 'Save Changes' : 'Save Note'}
                </Text>
              </TouchableOpacity>
            </View>

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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#15803D',
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
  noNotes: {
    textAlign: 'center',
    color: '#6B7280',
    paddingVertical: 12,
  },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  noteDate: {
    color: '#6B7280',
    marginTop: 2,
    fontSize: 12,
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
  },
  saveButton: {
    backgroundColor: '#15803D',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  saveButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    padding: 12,
    borderRadius: 8,
    flex: 1,
  },
  deleteButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
});
