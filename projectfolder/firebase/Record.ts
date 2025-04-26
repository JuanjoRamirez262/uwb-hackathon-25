import { doc, collection, addDoc, updateDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";


// Function to add a new record
async function addRecord(url: string, name: string) {
  const userId = localStorage.getItem("user_id");
  if (!userId) {
    throw new Error("User ID not found in local storage.");
  }

  const recordsRef = collection(db, "records");
  const docRef = await addDoc(recordsRef, {
    url,
    name,
    user_id: userId,
    createdAt: new Date(),
  });
  return docRef.id; // Return the auto-generated document ID
}

// Function to get records based on user_id
async function getRecordsByUserId() {
  const userId = localStorage.getItem("user_id");
  if (!userId) {
    throw new Error("User ID not found in local storage.");
  }

  const recordsRef = collection(db, "records");
  const q = query(recordsRef, where("user_id", "==", userId));
  const querySnapshot = await getDocs(q);

  const records = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return records; // Return an array of records
}

// Function to update an existing record
async function updateRecord(id: string, data: { url?: string; name?: string }) {
  const userId = localStorage.getItem("user_id");
  if (!userId) {
    throw new Error("User ID not found in local storage.");
  }

  const recordDocRef = doc(db, "records", id);
  await updateDoc(recordDocRef, {
    ...data,
    updatedAt: new Date(),
  });
  return true;
}

export { addRecord, getRecordsByUserId, updateRecord };