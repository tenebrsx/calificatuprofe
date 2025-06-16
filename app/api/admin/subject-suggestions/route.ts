import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs, doc, updateDoc, serverTimestamp, query, orderBy } from 'firebase/firestore'

export async function GET(request: NextRequest) {
  try {
    // Get all subject suggestions
    const suggestionsRef = collection(db, 'subject-suggestions')
    const suggestionsQuery = query(suggestionsRef, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(suggestionsQuery)
    
    const suggestions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      reviewedAt: doc.data().reviewedAt?.toDate() || null,
    }))

    return NextResponse.json({
      success: true,
      suggestions
    })

  } catch (error) {
    console.error('Error fetching subject suggestions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subject suggestions' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { suggestionId, action, reviewNotes, reviewedBy } = body

    if (!suggestionId || !action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      )
    }

    // Update the suggestion status
    const suggestionRef = doc(db, 'subject-suggestions', suggestionId)
    await updateDoc(suggestionRef, {
      status: action === 'approve' ? 'approved' : 'rejected',
      reviewedAt: serverTimestamp(),
      reviewedBy: reviewedBy || 'admin',
      reviewNotes: reviewNotes || null
    })

    // If approved, you could also update the professor's subjects here
    // This would require additional logic to fetch the professor and update their subjects array

    return NextResponse.json({
      success: true,
      message: `Suggestion ${action}d successfully`
    })

  } catch (error) {
    console.error('Error updating subject suggestion:', error)
    return NextResponse.json(
      { error: 'Failed to update subject suggestion' },
      { status: 500 }
    )
  }
} 