import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD4Y5M7J3AoXrImnbhKFTuO_gHIZttG4ZE",
  authDomain: "pantrypal-18703.firebaseapp.com",
  projectId: "pantrypal-18703",
  storageBucket: "pantrypal-18703.firebasestorage.app",
  messagingSenderId: "602669064583",
  appId: "1:602669064583:web:5ad8b368c6a8153c29f322"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);