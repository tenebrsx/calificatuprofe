import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBxABlwJHKhU7oFPnmwJCDpAL4zY8W6WzE",
  authDomain: "calificaprofe-4cf9c.firebaseapp.com",
  projectId: "calificaprofe-4cf9c",
  storageBucket: "calificaprofe-4cf9c.firebasestorage.app",
  messagingSenderId: "559754673852",
  appId: "1:559754673852:web:9dcfc83cad536370cb5ab9",
  measurementId: "G-SVLXEX5PR5"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);

// Initialize Analytics conditionally (only in browser)
let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then(yes => yes && (analytics = getAnalytics(app)));
}

export { app, db, auth, analytics }; 