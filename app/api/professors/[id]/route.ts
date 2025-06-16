import { NextRequest, NextResponse } from 'next/server'

// Import the professor data from the mock route
import { POST as getMockProfessors } from '../mock/route'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const professorId = params.id
    
    // Create a mock request to get all professors
    const mockRequest = new Request('http://localhost/api/professors/mock', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: '',
        filters: {
          university: '',
          department: '',
          minRating: 0,
          maxRating: 5
        },
        limit: 10000
      })
    })
    
    const mockResponse = await getMockProfessors(mockRequest)
    const data = await mockResponse.json()
    
    // Find the specific professor by ID
    const professor = data.professors.find((prof: any) => prof.id === professorId)
    
    if (!professor) {
      return NextResponse.json(
        { error: 'Professor not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(professor)
  } catch (error) {
    console.error('Error fetching professor:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 