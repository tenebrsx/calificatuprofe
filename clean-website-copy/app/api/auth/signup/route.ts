import { NextRequest, NextResponse } from 'next/server'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email y contraseña son requeridos' },
        { status: 400 }
      )
    }

    // Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Create user profile in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      displayName: user.email?.split('@')[0],
      createdAt: new Date().toISOString(),
      profileComplete: false,
    })

    return NextResponse.json(
      { 
        message: 'Usuario creado exitosamente',
        userId: user.uid 
      },
      { status: 201 }
    )

  } catch (error: any) {
    console.error('Signup error:', error)
    
    if (error.code === 'auth/email-already-in-use') {
      return NextResponse.json(
        { message: 'Este correo ya está registrado' },
        { status: 400 }
      )
    } else if (error.code === 'auth/weak-password') {
      return NextResponse.json(
        { message: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      )
    } else if (error.code === 'auth/invalid-email') {
      return NextResponse.json(
        { message: 'Correo electrónico inválido' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 