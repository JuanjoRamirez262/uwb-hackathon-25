import { doc, collection, addDoc, updateDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";


// Function to add a new calendar event
async function addEvent(title: string, desc: string, start: Date, end: Date) {
  const userId = localStorage.getItem("user_id");
  if (!userId) {
    throw new Error("User ID not found in local storage.");
  }

  const eventsRef = collection(db, "calender");
  const docRef = await addDoc(eventsRef, {
    title,
    desc,
    start,
    end,
    user_id: userId,
    createdAt: new Date(),
  });
  return docRef.id; // Return the auto-generated document ID
}

// Function to get calendar events based on user_id
async function getEventsByUserId() {
  const userId = localStorage.getItem("user_id");
  if (!userId) {
    throw new Error("User ID not found in local storage.");
  }

  const eventsRef = collection(db, "calender");
  const q = query(eventsRef, where("user_id", "==", userId));
  const querySnapshot = await getDocs(q);

  const events = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return events; // Return an array of events
}

// Function to update an existing calendar event
async function updateEvent(id: string, data: { title?: string; desc?: string; start?: Date; end?: Date }) {
  const userId = localStorage.getItem("user_id");
  if (!userId) {
    throw new Error("User ID not found in local storage.");
  }

  const eventDocRef = doc(db, "calender", id);
  await updateDoc(eventDocRef, {
    ...data,
    updatedAt: new Date(),
  });
  return true;
}

export { addEvent, getEventsByUserId, updateEvent };