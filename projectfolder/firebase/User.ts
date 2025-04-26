import { doc, getDoc, setDoc, collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "./firebase";

async function login(email: string, password: string) {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", email));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    localStorage.setItem("user_id",userDoc.id);
    if (userData.password === password) {
      return { email: userData.email, type: userData.type, id: userDoc.id };
    }
  }
  return null;
}

async function register(email: string, password: string, type?: "family" | "patient") {
  const usersRef = collection(db, "users");
  const doc = await addDoc(usersRef, {
    email: email,
    createdAt: new Date(),
    password: password,
    type: type ? type : "family",
  });
  localStorage.setItem("user_id",email);
  return true;
}

export { login, register };