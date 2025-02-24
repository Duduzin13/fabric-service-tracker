import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Funções do Firebase
export const saveToFirebase = async (collectionName: string, data: any) => {
  return await addDoc(collection(db, collectionName), data);
};

export const updateInFirebase = async (collectionName: string, id: string, data: any) => {
  return await updateDoc(doc(db, collectionName, id), data);
};

export const deleteFromFirebase = async (collectionName: string, id: string) => {
  return await deleteDoc(doc(db, collectionName, id));
};

export const getFromFirebase = async <T>(collectionName: string): Promise<T[]> => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as T[];
};