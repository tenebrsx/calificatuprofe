import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/firebase'
import { collection, addDoc, doc, updateDoc, getDoc } from 'firebase/firestore'

// POST - Submit a content report
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { contentType, contentId, reason, additionalInfo } = await request.json()

    if (!contentType || !contentId || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create the report
    const reportData = {
      contentType,
      contentId,
      reason,
      additionalInfo: additionalInfo || '',
      reportedBy: session.user?.email,
      reportedAt: new Date().toISOString(),
      status: 'pending',
      reviewedBy: null,
      reviewedAt: null,
      moderatorNotes: ''
    }

    // Save report to Firestore
    const reportsRef = collection(db, 'content-reports')
    const reportDoc = await addDoc(reportsRef, reportData)

    // Auto-hide the reported content
    await autoHideContent(contentType, contentId)

    // Log the report for admin tracking
    console.log(`Content reported: ${contentType}:${contentId} by ${session.user?.email} for ${reason}`)

    return NextResponse.json({
      success: true,
      message: 'Report submitted successfully',
      reportId: reportDoc.id
    })

  } catch (error) {
    console.error('Error submitting report:', error)
    return NextResponse.json(
      { error: 'Failed to submit report' },
      { status: 500 }
    )
  }
}

// Function to auto-hide reported content
async function autoHideContent(contentType: string, contentId: string) {
  try {
    let collectionName = ''
    
    switch (contentType) {
      case 'review':
        collectionName = 'reviews'
        break
      case 'professor':
        collectionName = 'professors'
        break
      case 'comment':
        collectionName = 'comments'
        break
      default:
        console.error('Unknown content type:', contentType)
        return
    }

    // Update the content to mark it as hidden pending review
    const contentRef = doc(db, collectionName, contentId)
    const contentDoc = await getDoc(contentRef)
    
    if (contentDoc.exists()) {
      await updateDoc(contentRef, {
        isHidden: true,
        hiddenReason: 'reported',
        hiddenAt: new Date().toISOString(),
        moderationStatus: 'pending'
      })
      
      console.log(`Auto-hidden ${contentType} ${contentId} due to report`)
    }
  } catch (error) {
    console.error('Error auto-hiding content:', error)
  }
}

// GET - Fetch reports (admin only)
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

    // This would fetch reports from Firestore
    // For now, return empty array
    return NextResponse.json({
      success: true,
      reports: [],
      total: 0
    })

  } catch (error) {
    console.error('Error fetching reports:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    )
  }
} 