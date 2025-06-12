import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

interface ProfileUpdateRequest {
  name?: string
  email?: string
  institution?: string
  userType?: string
  bio?: string
  socialLinks?: {
    twitter?: string
    linkedin?: string
    github?: string
  }
}

export async function PUT(request: NextRequest) {
  try {
    // For now, we'll simulate a successful update since auth isn't fully implemented
    const body: ProfileUpdateRequest = await request.json()
    
    // Validate required fields
    if (!body.name || body.name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      )
    }

    if (!body.email || !body.email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Valid email is required' },
        { status: 400 }
      )
    }

    // Simulate successful update
    const updatedProfile = {
      id: 'temp_user_id',
      name: body.name,
      email: body.email,
      institution: body.institution || null,
      userType: body.userType || 'Estudiante',
      bio: body.bio || '',
      socialLinks: body.socialLinks || {},
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
        error: 'Failed to update profile',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // For now, return a mock profile since auth isn't fully implemented
    const mockProfile = {
      id: 'temp_user_id',
      name: 'Angel Contreras',
      email: 'tenebrsx@gmail.com',
      institution: null,
      userType: 'Estudiante',
      bio: '',
      socialLinks: {
        twitter: '',
        linkedin: '',
        github: ''
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      profile: mockProfile
    })

  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch profile',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 