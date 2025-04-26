import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // for icons
import { format, parse, isValid } from 'date-fns';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string; // "HH:mm"
  takenToday: boolean;
  lastTakenDate?: string; // "yyyy-MM-dd"
}

export default function MedicationList() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');
  const [newMedTime, setNewMedTime] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingMed, setEditingMed] = useState<Medication | null>(null);

  useEffect(() => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const updatedMeds = medications.map(med => {
      if (med.lastTakenDate !== todayStr) {
        return { ...med, takenToday: false };
      }
      return med;
    });
    setMedications(updatedMeds);
  }, []);

  const openNewMedicationModal = () => {
    setEditingMed(null);
    setNewMedName('');
    setNewMedDosage('');
    setNewMedTime('');
    setModalOpen(true);
  };

  const openEditMedicationModal = (med: Medication) => {
    setEditingMed({ ...med });
    setModalOpen(true);
  };

  const handleSaveMedication = () => {
    const name = editingMed ? editingMed.name : newMedName.trim();
    const dosage = editingMed ? editingMed.dosage : newMedDosage.trim();
    const time = editingMed ? editingMed.time : newMedTime.trim();
    const id = editingMed ? editingMed.id : Date.now().toString();

    const parsedTime = parse(time, 'HH:mm', new Date());
    if (!isValid(parsedTime)) {
      alert('Invalid time format. Use HH:mm.');
      return;
    }

    if (name && dosage && time) {
      const savedMed: Medication = {
        id,
        name,
        dosage,
        time,
        takenToday: editingMed ? editingMed.takenToday : false,
        lastTakenDate: editingMed ? editingMed.lastTakenDate : undefined,
      };

      let updatedMeds: Medication[];
      if (editingMed) {
        updatedMeds = medications.map(med => med.id === id ? savedMed : med);
      } else {
        updatedMeds = [...medications, savedMed];
      }

      updatedMeds.sort((a, b) => a.time.localeCompare(b.time));

      setMedications(updatedMeds);
      setModalOpen(false);
      setNewMedName('');
      setNewMedDosage('');
      setNewMedTime('');
      setEditingMed(null);
    } else {
      alert('Please fill all fields.');
    }
  };

  const handleDeleteMedication = (id: string) => {
    setMedications(medications.filter(med => med.id !== id));
    setModalOpen(false);
    setEditingMed(null);
  };

  const handleToggleTaken = (id: string) => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    setMedications(medications.map(med =>
      med.id === id
        ? { ...med, takenToday: !med.takenToday, lastTakenDate: !med.takenToday ? todayStr : med.lastTakenDate }
        : med
    ));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="medkit-outline" size={24} color="#15803D" />
            <Text style={styles.headerTitle}>Medication List</Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={openNewMedicationModal}>
            <Ionicons name="add-circle-outline" size={28} color="white" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Today's Medications</Text>

        {medications.length === 0 ? (
          <Text style={styles.noMeds}>No medications added yet.</Text>
        ) : (
          <FlatList
            data={medications}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.medCard}>
                <TouchableOpacity onPress={() => handleToggleTaken(item.id)}>
                  {item.takenToday ? (
                    <Ionicons name="checkbox-outline" size={28} color="#15803D" />
                  ) : (
                    <Ionicons name="square-outline" size={28} color="#6B7280" />
                  )}
                </TouchableOpacity>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={[styles.medName, item.takenToday && styles.takenMed]}>
                    {item.name}
                  </Text>
                  <Text style={styles.medDetails}>{item.dosage} - {item.time}</Text>
                </View>
                <TouchableOpacity onPress={() => openEditMedicationModal(item)}>
                  <Ionicons name="create-outline" size={24} color="#4B5563" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteMedication(item.id)}>
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
              {editingMed ? 'Edit Medication' : 'Add New Medication'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Medication Name"
              value={editingMed ? editingMed.name : newMedName}
              onChangeText={(text) => editingMed ? setEditingMed({ ...editingMed, name: text }) : setNewMedName(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Dosage (e.g., 1 tablet)"
              value={editingMed ? editingMed.dosage : newMedDosage}
              onChangeText={(text) => editingMed ? setEditingMed({ ...editingMed, dosage: text }) : setNewMedDosage(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Time (HH:mm)"
              value={editingMed ? editingMed.time : newMedTime}
              onChangeText={(text) => editingMed ? setEditingMed({ ...editingMed, time: text }) : setNewMedTime(text)}
            />

            <View style={styles.modalButtons}>
              {editingMed && (
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteMedication(editingMed.id)}>
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={[styles.saveButton, editingMed && {marginLeft: 8}]} onPress={handleSaveMedication}>
                <Text style={styles.saveButtonText}>
                  {editingMed ? 'Save Changes' : 'Add Medication'}
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
  noMeds: {
    textAlign: 'center',
    color: '#6B7280',
    paddingVertical: 12,
  },
  medCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
  },
  medName: {
    fontSize: 16,
    fontWeight: '600',
  },
  takenMed: {
    textDecorationLine: 'line-through',
    color: '#6B7280',
  },
  medDetails: {
    color: '#6B7280',
    marginTop: 2,
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
