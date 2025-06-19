import { initializeApp, getApps } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Validate Firebase config
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
]

const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
if (missingVars.length > 0) {
  console.warn('Missing Firebase environment variables:', missingVars)
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

// Initialize Firebase services with settings to reduce noise
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)

// Suppress Firebase warnings in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Override console.warn to filter out Firebase warnings
  const originalWarn = console.warn
  console.warn = (...args) => {
    const message = args.join(' ')
    // Filter out specific Firebase warnings that are not critical
    if (
      message.includes('@firebase/firestore: Firestore') ||
      message.includes('Could not reach Cloud Firestore backend') ||
      message.includes('GrpcConnection RPC') ||
      message.includes('NOT_FOUND')
    ) {
      // Only show these warnings once every 30 seconds to avoid spam
      const now = Date.now()
      const lastWarning = (window as any).__lastFirebaseWarning || 0
      if (now - lastWarning > 30000) {
        originalWarn('🔥 Firebase connection issues detected (warnings suppressed for 30s)')
        ;(window as any).__lastFirebaseWarning = now
      }
      return
    }
    originalWarn(...args)
  }
}

// Add connection test function
export const testFirebaseConnection = async () => {
  try {
    // Simple test to see if we can connect to Firestore
    const { doc, getDoc } = await import('firebase/firestore')
    const testDoc = doc(db, 'test', 'connection')
    await getDoc(testDoc)
    return true
  } catch (error) {
    console.warn('⚠️ Firebase connection test failed:', error)
    return false
  }
}

export default app
