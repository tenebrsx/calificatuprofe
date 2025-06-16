import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

async function setupCollections() {
  try {
    // Sample institution
    const institutionsRef = collection(db, 'institutions');
    await addDoc(institutionsRef, {
      name: 'Universidad Autónoma de Santo Domingo',
      shortName: 'UASD',
      location: 'Santo Domingo',
      type: 'public'
    });

    console.log('✅ Basic collections and sample data created');
  } catch (error) {
    console.error('Error setting up collections:', error);
  }
}

// Only run this script directly
if (require.main === module) {
  setupCollections();
} 