import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyByecSfkeFwFB-Fg5dVXVg9KWOtdYNpgt4",
  authDomain: "cadastro-820e4.firebaseapp.com",
  projectId: "cadastro-820e4",
  storageBucket: "cadastro-820e4.firebasestorage.app",
  messagingSenderId: "409054993061",
  appId: "1:409054993061:web:3acff993082942d3a90b4c"
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

export const getFromFirebase = async (collectionName: string) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};