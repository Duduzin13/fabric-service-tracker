import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Funções do Firebase
export async function getFromFirebase<T>(collectionName: string): Promise<T[]> {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as T[];
}

export async function saveToFirebase(collectionName: string, data: any) {
  const docRef = doc(collection(db, collectionName));
  await setDoc(docRef, { ...data, id: docRef.id });
  return docRef.id;
}

export async function updateInFirebase(collectionName: string, id: string, data: any) {
  await updateDoc(doc(db, collectionName, id), data);
}

export async function deleteFromFirebase(collectionName: string, id: string) {
  await deleteDoc(doc(db, collectionName, id));
}
