import { 
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from './config';

// Institution functions
export const getInstitutions = async () => {
  const institutionsRef = collection(db, 'institutions');
  const snapshot = await getDocs(institutionsRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Professor functions
export const getProfessors = async (institutionId?: string) => {
  const professorsRef = collection(db, 'professors');
  const q = institutionId 
    ? query(professorsRef, where('institutionId', '==', institutionId))
    : professorsRef;
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getProfessorById = async (id: string) => {
  const docRef = doc(db, 'professors', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
};

// Review functions
export const addReview = async (professorId: string, review: any) => {
  const reviewsRef = collection(db, 'reviews');
  return await addDoc(reviewsRef, {
    ...review,
    professorId,
    createdAt: new Date().toISOString()
  });
};

export const getReviewsByProfessor = async (professorId: string) => {
  const reviewsRef = collection(db, 'reviews');
  const q = query(reviewsRef, where('professorId', '==', professorId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}; 