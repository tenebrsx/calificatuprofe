import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

interface ProfessorData {
  name: string
  email?: string
  institution: string
  department: string
  position?: string
  campus?: string
  additionalInfo?: string
  submittedBy: string
  submittedAt: string
}

export async function POST(request: Request) {
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
    
    // Validate required fields
    const { name, institution, department } = body
    if (!name?.trim() || !institution?.trim() || !department?.trim()) {
      return NextResponse.json(
        { error: 'Name, institution, and department are required' },
        { status: 400 }
      )
    }

    // Create professor record directly in the main professors collection
    const professorData = {
      name: name.trim(),
      email: body.email?.trim() || '',
      institution: institution.trim(),
      department: department.trim(),
      position: body.position?.trim() || '',
      campus: body.campus?.trim() || '',
      additionalInfo: body.additionalInfo?.trim() || '',
      
      // Initialize rating data
      averageRating: 0,
      totalRatings: 0,
      difficultyRating: 0,
      wouldTakeAgainPercent: 0,
      tags: [],
      subjects: [],
      
      // Metadata
      addedBy: session.user.email,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isVerified: false, // Can be verified later by admin if needed
      isActive: true
    }

    // Add to Firestore
    const docRef = await addDoc(collection(db, 'professors'), professorData)

    console.log('✅ New professor added instantly:', {
      id: docRef.id,
      name: professorData.name,
      institution: professorData.institution,
      department: professorData.department,
      addedBy: professorData.addedBy
    })

    return NextResponse.json({
      success: true,
      message: 'Professor added successfully and is now available on the site!',
      professorId: docRef.id,
      status: 'active'
    })

  } catch (error) {
    console.error('Error adding professor:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 