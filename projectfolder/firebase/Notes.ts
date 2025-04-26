import { doc, collection, addDoc, updateDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";

// Function to add a new note
async function addNote(title: string, description: string) {
  const userId = localStorage.getItem("user_id");
  if (!userId) {
    throw new Error("User ID not found in local storage.");
  }

  const notesRef = collection(db, "notes");
  const docRef = await addDoc(notesRef, {
    title,
    description,
    user_id: userId,
    createdAt: new Date(),
  });
  return docRef.id; // Return the auto-generated document ID
}

// Function to get notes based on user_id
async function getNotesByUserId() {
  const userId = localStorage.getItem("user_id");
  if (!userId) {
    throw new Error("User ID not found in local storage.");
  }

  const notesRef = collection(db, "notes");
  const q = query(notesRef, where("user_id", "==", userId));
  const querySnapshot = await getDocs(q);

  const notes = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return notes; // Return an array of notes
}

// Function to update an existing note
async function updateNote(id: string, data: { title?: string; description?: string }) {
  const userId = localStorage.getItem("user_id");
  if (!userId) {
    throw new Error("User ID not found in local storage.");
  }

  const noteDocRef = doc(db, "notes", id);
  await updateDoc(noteDocRef, {
    ...data,
    updatedAt: new Date(),
  });
  return true;
}

export { addNote, getNotesByUserId, updateNote };