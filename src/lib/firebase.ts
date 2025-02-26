import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc,
  enableIndexedDbPersistence,
  getDoc
} from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { Service } from "@/types";
import { deleteImage } from './cloudinary';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Firestore
const db = getFirestore(app);

// Habilita persistência offline
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.log('Múltiplas abas abertas');
    } else if (err.code === 'unimplemented') {
      console.log('Browser não suporta persistência');
    }
  });

// Inicializa o Storage
const storage = getStorage(app);

// Funções do Firebase
export async function getFromFirebase<T>(collectionName: string): Promise<T[]> {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as T[];
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    return [];
  }
}

export async function saveToFirebase(collectionName: string, data: any) {
  if (data.id) {
    // Se tem ID, atualiza
    const docRef = doc(db, collectionName, data.id);
    await setDoc(docRef, data, { merge: true });
    return data.id;
  } else {
    // Se não tem ID, cria novo
    const docRef = doc(collection(db, collectionName));
    const id = docRef.id;
    await setDoc(docRef, { ...data, id });
    return id;
  }
}

// Função para deletar imagem do Storage
async function deleteImage(imageUrl: string) {
  try {
    // Extrai o caminho da imagem da URL
    const imagePath = decodeURIComponent(imageUrl.split('/o/')[1].split('?')[0]);
    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Erro ao deletar imagem:', error);
  }
}

// Função atualizada para deletar serviço e suas imagens
export async function deleteFromFirebase(collectionName: string, id: string) {
  try {
    // Se for um serviço, primeiro busca e deleta as imagens
    if (collectionName === 'services') {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const service = docSnap.data() as Service;
        
        if (service?.images?.length) {
          // Deleta cada imagem usando a função do Cloudinary
          for (const imageUrl of service.images) {
            try {
              if (imageUrl) {
                await deleteImage(imageUrl);
              }
            } catch (error) {
              console.error('Erro ao deletar imagem:', error);
              // Continua deletando outras imagens mesmo se uma falhar
            }
          }
        }
      }
    }

    // Depois deleta o documento
    await deleteDoc(doc(db, collectionName, id));
  } catch (error) {
    console.error('Erro ao deletar:', error);
    throw error;
  }
}

// Função atualizada para atualizar serviço e suas imagens
export async function updateInFirebase(collectionName: string, id: string, data: any) {
  try {
    if (collectionName === 'services') {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const oldService = docSnap.data() as Service;

        if (oldService?.images?.length) {
          const imagesToDelete = oldService.images.filter(
            oldUrl => oldUrl && !data.images?.includes(oldUrl)
          );
          
          // Deleta cada imagem sequencialmente
          for (const imageUrl of imagesToDelete) {
            try {
              if (imageUrl) {
                await deleteImage(imageUrl);
              }
            } catch (error) {
              console.error('Erro ao deletar imagem:', error);
              // Continua deletando outras imagens mesmo se uma falhar
            }
          }
        }
      }
    }

    await updateDoc(doc(db, collectionName, id), data);
  } catch (error) {
    console.error('Erro ao atualizar:', error);
    throw error;
  }
}

// Adicione esta função para upload de imagens
export async function uploadImage(file: File): Promise<string> {
  try {
    // Cria um nome único para o arquivo
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileName = `${timestamp}_${randomString}_${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
    
    // Cria a referência no storage
    const storageRef = ref(storage, `images/${fileName}`);
    
    // Configurações do upload
    const metadata = {
      contentType: file.type,
      cacheControl: 'public,max-age=7200'
    };

    // Faz o upload
    const snapshot = await uploadBytes(storageRef, file, metadata);
    
    // Obtém a URL de download
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error: any) {
    console.error('Erro no upload:', error);
    if (error.code === 'storage/unauthorized') {
      throw new Error('Sem permissão para upload');
    }
    throw new Error('Falha ao fazer upload da imagem');
  }
}
