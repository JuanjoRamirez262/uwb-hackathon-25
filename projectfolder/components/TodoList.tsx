import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { AppMode } from '@/app/index'; // Correct import for your app

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoListProps {
  mode: AppMode;
}

export default function TodoList({ mode }: TodoListProps) {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodoText, setNewTodoText] = useState('');

  const handleAddTodo = () => {
    if (mode !== 'family') return;

    if (newTodoText.trim()) {
      const newTodo: TodoItem = {
        id: Date.now().toString(),
        text: newTodoText.trim(),
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setNewTodoText('');
      Alert.alert('To-Do Added', `"${newTodo.text}" added to the list.`);
    } else {
      Alert.alert('Cannot Add Empty To-Do');
    }
  };

  const handleToggleComplete = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id: string) => {
    if (mode !== 'family') return;

    const todoToDelete = todos.find(todo => todo.id === id);
    setTodos(todos.filter(todo => todo.id !== id));
    if (todoToDelete) {
      Alert.alert('To-Do Removed', `"${todoToDelete.text}" removed from the list.`);
    }
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>✅ To-Do List</Text>
      </View>

      {/* Family Mode Add Todo */}
      {mode === 'family' && (
        <View style={styles.addTodoSection}>
          <TextInput
            style={styles.input}
            placeholder="Add a new task..."
            value={newTodoText}
            onChangeText={setNewTodoText}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddTodo}>
            <Ionicons name="add-circle-outline" size={24} color="white" />
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* List */}
      <View style={{ marginTop: 20 }}>
        <Text style={styles.subHeader}>Your Tasks</Text>
        {todos.length === 0 ? (
          <Text style={styles.noTasksText}>No tasks added yet.</Text>
        ) : (
          <ScrollView style={{ maxHeight: 300 }}>
            {todos.map((todo) => (
              <View key={todo.id} style={styles.todoItem}>
                <TouchableOpacity
                  onPress={() => handleToggleComplete(todo.id)}
                  style={[
                    styles.checkbox,
                    todo.completed && styles.checkboxCompleted
                  ]}
                />
                <Text
                  style={[
                    styles.todoText,
                    todo.completed && styles.todoCompleted
                  ]}
                >
                  {todo.text}
                </Text>

                {mode === 'family' && (
                  <TouchableOpacity onPress={() => handleDeleteTodo(todo.id)}>
                    <Ionicons name="trash-outline" size={24} color="red" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </ScrollView>
        )}
      </View>
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
    alignItems: 'center',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#15803D',
  },
  addTodoSection: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#15803D',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    marginLeft: 6,
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  noTasksText: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 10,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderColor: '#9CA3AF',
    borderWidth: 2,
    marginRight: 12,
  },
  checkboxCompleted: {
    backgroundColor: '#15803D',
  },
  todoText: {
    flex: 1,
    fontSize: 16,
  },
  todoCompleted: {
    textDecorationLine: 'line-through',
    color: '#6B7280',
  },
});

