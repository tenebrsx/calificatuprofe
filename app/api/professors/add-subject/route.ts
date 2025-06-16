import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { professorId, subject, userId } = body

    if (!professorId || !subject || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: professorId, subject, userId' },
        { status: 400 }
      )
    }

    // Add the subject suggestion to a collection for admin review
    const subjectSuggestion = {
      professorId,
      subject: subject.trim(),
      suggestedBy: userId,
      status: 'pending', // pending, approved, rejected
      createdAt: serverTimestamp(),
      reviewedAt: null,
      reviewedBy: null,
      reviewNotes: null
    }

    const docRef = await addDoc(collection(db, 'subject-suggestions'), subjectSuggestion)

    return NextResponse.json({
      success: true,
      message: 'Subject suggestion submitted successfully',
      suggestionId: docRef.id
    })

  } catch (error) {
    console.error('Error adding subject suggestion:', error)
    return NextResponse.json(
      { error: 'Failed to submit subject suggestion' },
      { status: 500 }
    )
  }
} 