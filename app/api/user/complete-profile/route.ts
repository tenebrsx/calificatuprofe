import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, isStudent, institution } = body

    // Validate required fields
    if (!name?.trim()) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    if (isStudent === null || isStudent === undefined) {
      return NextResponse.json(
        { error: 'Student status is required' },
        { status: 400 }
      )
    }

    if (isStudent && !institution?.trim()) {
      return NextResponse.json(
        { error: 'Institution is required for students' },
        { status: 400 }
      )
    }

    // Update user profile in Firestore
    const userId = (session.user as any).id
    const userDocRef = doc(db, 'users', userId)
    
    await updateDoc(userDocRef, {
      name: name.trim(),
      isStudent: isStudent,
      institution: isStudent ? institution.trim() : null,
      profileComplete: true,
      updatedAt: new Date().toISOString(),
    })

    console.log('Profile completed for user:', userId)

    return NextResponse.json({
      success: true,
      message: 'Profile completed successfully',
    })

  } catch (error) {
    console.error('Error completing profile:', error)
    return NextResponse.json(
      { error: 'Failed to complete profile' },
      { status: 500 }
    )
  }
} 