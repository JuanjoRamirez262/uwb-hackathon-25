import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
async function login(email: string, password: string) {
  const user = await getDoc(doc(db, "users", email));
  if (user.exists()) {
    const userData = user.data();
    if (userData.password === password) {
      console.log(`Logged in with email: ${email}`);
      return { email: email, type: userData.type };
    }
    console.log("Incorrect password");
  }
  return null;
}
async function register(
  email: string,
  password: string,
  type?: "family" | "patient"
) {
  await setDoc(doc(db, "users", email), {
    email: email,
    createdAt: new Date(),
    password: password,
    type: type ? type : "family",
  });
  console.log(`Registered with email: ${email}`);
  return true;
}
export { login, register };
