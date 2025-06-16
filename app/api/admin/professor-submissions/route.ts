import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/firebase'
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore'

// GET - Fetch all professor submissions (admin only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    // Check if user is admin
    if (!session || session.user?.email !== 'admin@calificatuprofe.com') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      )
    }

    // Fetch all submissions from Firestore
    const submissionsRef = collection(db, 'professor-submissions')
    const q = query(submissionsRef, orderBy('submittedAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const submissions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json({
      success: true,
      submissions,
      total: submissions.length
    })

  } catch (error) {
    console.error('Error fetching submissions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    )
  }
}

// PATCH - Review a professor submission (approve/reject)
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check if user is admin
    if (!session || session.user?.email !== 'admin@calificatuprofe.com') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      )
    }

    const { submissionId, action, notes } = await request.json()

    if (!submissionId || !action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid submission ID or action' },
        { status: 400 }
      )
    }

    // Update the submission in Firestore
    const submissionRef = doc(db, 'professor-submissions', submissionId)
    const updateData = {
      status: action === 'approve' ? 'approved' : 'rejected',
      reviewedBy: session.user.email,
      reviewedAt: new Date().toISOString(),
      ...(notes && { reviewNotes: notes })
    }

    await updateDoc(submissionRef, updateData)

    // If approved, you might want to add the professor to your main professors collection
    if (action === 'approve') {
      // TODO: Add logic to create professor record in main collection
      // This would involve fetching the submission data and creating a new professor record
    }

    return NextResponse.json({
      success: true,
      message: `Submission ${action === 'approve' ? 'approved' : 'rejected'} successfully`
    })

  } catch (error) {
    console.error('Error reviewing submission:', error)
    return NextResponse.json(
      { error: 'Failed to review submission' },
      { status: 500 }
    )
  }
} 