import React, { useState, useEffect, useReducer } from 'react';
import { StyleSheet, Text, View, FlatList, Pressable, TextInput, TouchableOpacity } from 'react-native';
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from './fireBaseConfig';

function todosReducer(state, action) {
  switch (action.type) {
    case "SET":
      return action.payload;
    case "ADD":
      return [...state, { text: action.text, completed: false, id: action.id }];
    case "TOGGLE":
      return state.map((todo, index) =>
        index === action.index ? { ...todo, completed: !todo.completed } : todo
      );
    case "REMOVE":
      return state.filter((_, index) => index !== action.index);
    default:
      throw new Error();
  }
}

export default function App() {
  const [text, setText] = useState(""); 
  const [tasks, dispatch] = useReducer(todosReducer, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        console.log("Fetching...");
        const querySnapshot = await getDocs(collection(db, "List"));
        const todosFromFirestore = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        dispatch({ type: "SET", payload: todosFromFirestore });
        console.log("Fetching Done");
        console.log(tasks)
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  async function addTodo() {
    console.log("Adding to database...");
    if (text.trim()) {
      const docRef = doc(collection(db, "List"));
      await setDoc(docRef, { name: text });
      dispatch({ type: "ADD", name: text, id: docRef.id });
      setText("");
      console.log("adding Done");
    }
  }

  async function removeTodo(index, id) {
    dispatch({ type: 'REMOVE', index });
    await deleteDoc(doc(db, "List", id));
  }

  const renderItem = ({ item, index }) => (
    <TouchableOpacity onLongPress={() => removeTodo(index, item.id)}>
      <Text style={[styles.todoItem, item.completed && styles.completed]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24 }}>Shopping List</Text>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Add new task..."
        style={styles.input}
      />
      <Pressable onPress={addTodo}>
        <Text style={{color: "blue"}}>Save</Text>
      </Pressable>
      
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
  },
  todoItem: {
    padding: 15,
    fontSize: 18,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
});
