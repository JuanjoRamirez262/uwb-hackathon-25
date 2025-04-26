import { doc, collection, deleteDoc, updateDoc, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";


// Function to add a new picture
async function addPicture(url: string, desc: string, title: string) {
  const userId = localStorage.getItem("user_id");
  if (!userId) {
    throw new Error("User ID not found in local storage.");
  }

  const picturesRef = collection(db, "pictures");
  const docRef = await addDoc(picturesRef, {
    url,
    desc,
    title,
    user_id: userId,
    createdAt: new Date(),
  });
  return docRef.id; 
}

// Function to get pictures based on user_id
async function getPicturesByUserId() {
  const userId = localStorage.getItem("user_id");
  if (!userId) {
    throw new Error("User ID not found in local storage.");
  }

  const picturesRef = collection(db, "pictures");
  const q = query(picturesRef, where("user_id", "==", userId));
  const querySnapshot = await getDocs(q);

  const pictures = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return pictures; // Return an array of pictures
}

// Function to edit an existing picture
async function editPicture(id: string, data: { url?: string; desc?: string; title?: string }) {
  const userId = localStorage.getItem("user_id");
  if (!userId) {
    throw new Error("User ID not found in local storage.");
  }

  const pictureDocRef = doc(db, "pictures", id);
  await updateDoc(pictureDocRef, {
    ...data,
    updatedAt: new Date(),
  });
  return true;
}

// Function to remove a picture
async function removePicture(id: string) {
  const userId = localStorage.getItem("user_id");
  if (!userId) {
    throw new Error("User ID not found in local storage.");
  }

  const pictureDocRef = doc(db, "pictures", id);
  await deleteDoc(pictureDocRef);
  return true;
}

export { addPicture, getPicturesByUserId, editPicture, removePicture };