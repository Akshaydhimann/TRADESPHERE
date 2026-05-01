import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCWvqnfsTduVz68eDmmyYngRna9zvlyfD8",
  authDomain: "tradesphere-7626a.firebaseapp.com",
  projectId: "tradesphere-7626a",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// 🔥 ADD THIS LINE
setPersistence(auth, browserLocalPersistence);