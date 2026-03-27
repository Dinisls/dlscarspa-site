import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDoRreZswayEck0Mee0bON0C39HUp__DqA",
  authDomain: "dls-car-spa-39524.firebaseapp.com",
  projectId: "dls-car-spa-39524",
  storageBucket: "dls-car-spa-39524.firebasestorage.app",
  messagingSenderId: "90863769772",
  appId: "1:90863769772:web:f6012ff25e8caa4f6b2709",
  measurementId: "G-8MHHVC7S5T"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
