import { doc, collection, addDoc, updateDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";


// Function to add a new medication
async function addMed(name: string, amount: number, period: string, last_time: Date) {
  const userId = localStorage.getItem("user_id");
  if (!userId) {
    throw new Error("User ID not found in local storage.");
  }

  const medsRef = collection(db, "meds");
  const docRef = await addDoc(medsRef, {
    name,
    amount,
    period,
    last_time,
    user_id: userId,
    createdAt: new Date(),
  });
  return docRef.id; // Return the auto-generated document ID
}

// Function to get medications based on user_id
async function getMedsByUserId() {
  const userId = localStorage.getItem("user_id");
  if (!userId) {
    throw new Error("User ID not found in local storage.");
  }

  const medsRef = collection(db, "meds");
  const q = query(medsRef, where("user_id", "==", userId));
  const querySnapshot = await getDocs(q);

  const meds = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return meds; 
}

// Function to update an existing medication
async function updateMed(id: string, data: { name?: string; amount?: number; period?: string; last_time?: Date }) {
  const userId = localStorage.getItem("user_id");
  if (!userId) {
    throw new Error("User ID not found in local storage.");
  }

  const medDocRef = doc(db, "meds", id);
  await updateDoc(medDocRef, {
    ...data,
    updatedAt: new Date(),
  });
  return true;
}

export { addMed, getMedsByUserId, updateMed };