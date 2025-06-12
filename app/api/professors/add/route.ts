import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

interface ProfessorSubmission {
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

// In-memory storage for demo purposes
// In production, this would be saved to a database
const pendingProfessors: (ProfessorSubmission & { id: string; status: 'pending' | 'approved' | 'rejected' })[] = []

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

    // Create professor submission
    const submission: ProfessorSubmission & { id: string; status: 'pending' } = {
      id: `submission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      email: body.email?.trim() || '',
      institution: institution.trim(),
      department: department.trim(),
      position: body.position?.trim() || '',
      campus: body.campus?.trim() || '',
      additionalInfo: body.additionalInfo?.trim() || '',
      submittedBy: session.user.email,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    }

    // Store submission (in production, save to database)
    pendingProfessors.push(submission)

    console.log('📝 New professor submission received:', {
      id: submission.id,
      name: submission.name,
      institution: submission.institution,
      department: submission.department,
      submittedBy: submission.submittedBy
    })

    // In production, you might want to:
    // 1. Save to database with status 'pending'
    // 2. Send notification to admin team
    // 3. Send confirmation email to user
    // 4. Add to moderation queue

    return NextResponse.json({
      success: true,
      message: 'Professor submission received successfully',
      submissionId: submission.id,
      status: 'pending'
    })

  } catch (error) {
    console.error('Error processing professor submission:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve pending submissions (for admin use)
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const url = new URL(request.url)
    const status = url.searchParams.get('status') || 'pending'
    
    const filteredSubmissions = pendingProfessors.filter(sub => sub.status === status)

    return NextResponse.json({
      success: true,
      submissions: filteredSubmissions,
      total: filteredSubmissions.length
    })

  } catch (error) {
    console.error('Error retrieving professor submissions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 