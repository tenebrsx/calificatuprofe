import { NextResponse } from 'next/server'
import { mockProfessors } from '@/lib/mockData'

export async function GET() {
  const transformedProfessors = mockProfessors.map(prof => ({
    id: prof.id,
    name: prof.name,
    email: prof.email,
    university: prof.university.includes('Instituto Tecnológico de Santo Domingo') ? 'INTEC' : 
                prof.university.includes('Pontificia Universidad Católica Madre y Maestra') ? 'PUCMM' :
                prof.university.includes('Universidad Autónoma de Santo Domingo') ? 'UASD' :
                prof.university.includes('Universidad Nacional Pedro Henríquez Ureña') ? 'UNPHU' : 
                prof.university.includes('Universidad Tecnológica de Santiago') ? 'UTESA' :
                prof.university.includes('Universidad Iberoamericana') ? 'UNIBE' :
                prof.university.includes('Universidad APEC') ? 'UNAPEC' :
                prof.university.includes('Universidad del Caribe') ? 'UNICARIBE' :
                prof.university.includes('Universidad Católica Santo Domingo') ? 'UCSD' :
                prof.university.includes('Universidad Católica Nordestana') ? 'UCNE' :
                prof.university,
    school: prof.department,
    department: prof.department,
    campus: 'Santo Domingo',
    averageRating: prof.rating,
    totalReviews: prof.totalRatings,
    wouldTakeAgainPercent: 75,
    averageDifficulty: 3,
    topTags: prof.subjects,
    isVerified: true,
    source: 'updated_mock_data'
  }))

  return NextResponse.json({
    success: true,
    results: transformedProfessors,
    total: transformedProfessors.length
  })
}

export async function POST(request: Request) {
  return GET()
} 