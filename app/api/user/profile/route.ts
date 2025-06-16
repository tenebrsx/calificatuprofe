import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

interface ProfileUpdateRequest {
  name?: string
  email?: string
  institution?: string
  isStudent?: boolean
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body: ProfileUpdateRequest = await request.json()
    
    // Validate required fields
    if (!body.name || body.name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      )
    }

    // For now, simulate successful update
    const updatedProfile = {
      id: session.user?.email || 'temp_user_id',
      name: body.name,
      email: session.user?.email || body.email,
      institution: body.institution || null,
      isStudent: body.isStudent !== undefined ? body.isStudent : true,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      profile: updatedProfile
    })

  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update profile'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Return user profile from session
    const profile = {
      id: session.user?.email || 'temp_user_id',
      name: session.user?.name || 'Usuario Anónimo',
      email: session.user?.email || '',
      institution: null,
      isStudent: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      profile: profile
    })

  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch profile'
      },
      { status: 500 }
    )
  }
} 