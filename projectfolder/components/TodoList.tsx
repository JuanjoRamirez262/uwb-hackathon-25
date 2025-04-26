import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export default function TodoList() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodoText, setNewTodoText] = useState('');

  const handleAddTodo = () => {
    if (newTodoText.trim()) {
      const newTodo: TodoItem = {
        id: Date.now().toString(),
        text: newTodoText.trim(),
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setNewTodoText('');
    } else {
      alert('Please write a task.');
    }
  };

  const handleToggleComplete = (id: string) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Ionicons name="list-outline" size={24} color="#15803D" />
          <Text style={styles.headerTitle}>To-Do List</Text>
        </View>

        {/* Add Todo */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newTodoText}
            onChangeText={setNewTodoText}
            placeholder="Add a new task..."
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddTodo}>
            <Ionicons name="add-circle-outline" size={28} color="white" />
          </TouchableOpacity>
        </View>

        {/* Todo Items */}
        <View style={{ marginTop: 16 }}>
          <Text style={styles.sectionTitle}>Your Tasks</Text>

          {todos.length === 0 ? (
            <Text style={styles.emptyMessage}>No tasks added yet.</Text>
          ) : (
            <FlatList
              data={todos}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.todoCard}>
                  <TouchableOpacity onPress={() => handleToggleComplete(item.id)}>
                    {item.completed ? (
                      <Ionicons name="checkbox-outline" size={28} color="#15803D" />
                    ) : (
                      <Ionicons name="square-outline" size={28} color="#6B7280" />
                    )}
                  </TouchableOpacity>

                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text
                      style={[
                        styles.todoText,
                        item.completed && styles.completedTodo
                      ]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.text}
                    </Text>
                  </View>

                  <TouchableOpacity onPress={() => handleDeleteTodo(item.id)}>
                    <Ionicons name="trash-outline" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#15803D',
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    padding: 8,
    borderRadius: 8,
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    fontSize: 16,
    padding: 8,
  },
  addButton: {
    backgroundColor: '#15803D',
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#6B7280',
    paddingVertical: 12,
  },
  todoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  todoText: {
    fontSize: 16,
    fontWeight: '500',
  },
  completedTodo: {
    textDecorationLine: 'line-through',
    color: '#6B7280',
  },
});
