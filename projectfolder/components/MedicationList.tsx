import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, StyleSheet, Alert, Switch, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, parse, isValid } from 'date-fns';
import type { AppMode } from '@/app/index'; // make sure AppMode exported properly

interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  takenToday: boolean;
  lastTakenDate?: string;
}

interface Props {
  mode: AppMode;
}

export default function MedicationList({ mode }: Props) {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');
  const [newMedTime, setNewMedTime] = useState('');
  const [editingMed, setEditingMed] = useState<Medication | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const updated = medications.map(med =>
      med.lastTakenDate !== todayStr ? { ...med, takenToday: false } : med
    );

    if (JSON.stringify(updated) !== JSON.stringify(medications)) {
      setMedications(updated);
    }
  }, []);

  const handleSaveMedication = () => {
    if (!newMedName.trim() || !newMedDosage.trim() || !newMedTime.trim()) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const parsedTime = parse(newMedTime, 'HH:mm', new Date());
    if (!isValid(parsedTime)) {
      Alert.alert('Error', 'Invalid time format. Use HH:mm.');
      return;
    }

    const newMed: Medication = {
      id: editingMed ? editingMed.id : Date.now().toString(),
      name: newMedName.trim(),
      dosage: newMedDosage.trim(),
      time: newMedTime.trim(),
      takenToday: editingMed ? editingMed.takenToday : false,
      lastTakenDate: editingMed ? editingMed.lastTakenDate : undefined,
    };

    const updatedMeds = editingMed
      ? medications.map(med => med.id === newMed.id ? newMed : med)
      : [...medications, newMed];

    setMedications(updatedMeds.sort((a, b) => a.time.localeCompare(b.time)));
    setNewMedName('');
    setNewMedDosage('');
    setNewMedTime('');
    setEditingMed(null);
    setIsModalVisible(false);

    Alert.alert('Success', editingMed ? 'Medication updated' : 'Medication added');
  };

  const handleDeleteMedication = (id: string) => {
    setMedications(prev => prev.filter(med => med.id !== id));
    Alert.alert('Deleted', 'Medication removed.');
    setIsModalVisible(false);
  };

  const handleToggleTaken = (id: string) => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    setMedications(prev =>
      prev.map(med =>
        med.id === id
          ? { ...med, takenToday: !med.takenToday, lastTakenDate: todayStr }
          : med
      )
    );
  };

  const openNewModal = () => {
    setEditingMed(null);
    setNewMedName('');
    setNewMedDosage('');
    setNewMedTime('');
    setIsModalVisible(true);
  };

  const openEditModal = (med: Medication) => {
    setEditingMed(med);
    setNewMedName(med.name);
    setNewMedDosage(med.dosage);
    setNewMedTime(med.time);
    setIsModalVisible(true);
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>💊 Medication List</Text>
        {mode === 'family' && (
          <TouchableOpacity style={styles.addButton} onPress={openNewModal}>
            <Ionicons name="add-circle-outline" size={24} color="white" />
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Medication List */}
      <ScrollView style={{ marginTop: 20 }}>
        {medications.length === 0 ? (
          <Text style={styles.noMedsText}>No medications added yet.</Text>
        ) : (
          medications.map(med => (
            <View key={med.id} style={styles.medItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.medName}>{med.name}</Text>
                <Text style={styles.medDetails}>{med.dosage} - {med.time}</Text>
              </View>

              {/* Toggle */}
              <Switch
                value={med.takenToday}
                onValueChange={() => handleToggleTaken(med.id)}
              />

              {/* Family Buttons */}
              {mode === 'family' && (
                <View style={styles.medButtons}>
                  <TouchableOpacity onPress={() => openEditModal(med)}>
                    <Ionicons name="create-outline" size={24} color="#4B5563" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteMedication(med.id)} style={{ marginLeft: 10 }}>
                    <Ionicons name="trash-outline" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingMed ? 'Edit Medication' : 'Add Medication'}</Text>

            <TextInput
              style={styles.input}
              placeholder="Medication Name"
              value={newMedName}
              onChangeText={setNewMedName}
            />
            <TextInput
              style={styles.input}
              placeholder="Dosage"
              value={newMedDosage}
              onChangeText={setNewMedDosage}
            />
            <TextInput
              style={styles.input}
              placeholder="Time (HH:mm)"
              value={newMedTime}
              onChangeText={setNewMedTime}
            />

            <View style={styles.modalButtons}>
              {editingMed && (
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteMedication(editingMed.id)}>
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveMedication}>
                <Text style={styles.buttonText}>{editingMed ? 'Save Changes' : 'Save'}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.cancelButton} onPress={() => setIsModalVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
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
  medItem: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  medName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  medDetails: {
    fontSize: 14,
    color: '#6B7280',
  },
  medButtons: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  noMedsText: {
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
    marginBottom: 10,
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
    marginVertical: 10,
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
  cancelButton: {
    backgroundColor: '#6B7280',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
