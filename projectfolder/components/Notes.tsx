import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import type { AppMode } from '@/app/index'; // Correct your import based on your app!

interface Note {
  id: string;
  title: string;
  content: string;
  lastModified: string;
}

interface NotesProps {
  mode: AppMode;
}

export default function Notes({ mode }: NotesProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const sortedNotes = useMemo(() => {
    return [...notes].sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
  }, [notes]);

  const openNewNoteModal = () => {
    setEditingNote(null);
    setTitle('');
    setContent('');
    setIsModalVisible(true);
  };

  const openEditNoteModal = (note: Note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setIsModalVisible(true);
  };

  const handleSaveNote = () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Please fill out both the title and content.');
      return;
    }

    if (editingNote) {
      // Update
      setNotes(prev => prev.map(n =>
        n.id === editingNote.id
          ? { ...n, title: title.trim(), content: content.trim(), lastModified: new Date().toISOString() }
          : n
      ));
      Alert.alert('Success', 'Note updated.');
    } else {
      // Add
      const newNote: Note = {
        id: Date.now().toString(),
        title: title.trim(),
        content: content.trim(),
        lastModified: new Date().toISOString(),
      };
      setNotes(prev => [...prev, newNote]);
      Alert.alert('Success', 'Note saved.');
    }

    setTitle('');
    setContent('');
    setEditingNote(null);
    setIsModalVisible(false);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    setEditingNote(null);
    setIsModalVisible(false);
    Alert.alert('Deleted', 'Note deleted.');
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📝 Notes</Text>
        <TouchableOpacity style={styles.addButton} onPress={openNewNoteModal}>
          <Ionicons name="add-circle-outline" size={24} color="white" />
          <Text style={styles.buttonText}>New</Text>
        </TouchableOpacity>
      </View>

      {/* Notes List */}
      <ScrollView style={{ marginTop: 20 }}>
        {sortedNotes.length === 0 ? (
          <Text style={styles.noNotesText}>No notes yet.</Text>
        ) : (
          sortedNotes.map(note => (
            <View key={note.id} style={styles.noteItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.noteTitle}>{note.title}</Text>
                <Text numberOfLines={1} style={styles.noteContent}>{note.content}</Text>
                <Text style={styles.noteDate}>Last modified: {format(new Date(note.lastModified), 'PPP p')}</Text>
              </View>

              <View style={styles.noteActions}>
                <TouchableOpacity onPress={() => openEditNoteModal(note)}>
                  <Ionicons
                    name={mode === 'patient' ? 'create-outline' : 'create-outline'}
                    size={24}
                    color="#4B5563"
                  />
                </TouchableOpacity>
                {mode === 'family' && (
                  <TouchableOpacity onPress={() => handleDeleteNote(note.id)} style={{ marginLeft: 10 }}>
                    <Ionicons name="trash-outline" size={24} color="red" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Modal */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingNote ? 'Edit Note' : 'New Note'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={[styles.input, { minHeight: 100 }]}
              placeholder="Content"
              value={content}
              multiline
              onChangeText={setContent}
            />

            <View style={styles.modalButtons}>
              {mode === 'family' && editingNote && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteNote(editingNote.id)}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveNote}
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
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#15803D',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  noteItem: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  noteContent: {
    color: '#6B7280',
    marginTop: 2,
  },
  noteDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  noteActions: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  noNotesText: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 20,
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
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#15803D',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
