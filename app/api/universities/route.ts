import { NextResponse } from 'next/server'
import { DOMINICAN_UNIVERSITIES, getUniversitiesByLocation, getUniversitiesByType, searchUniversities } from '@/lib/dominican-universities'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const location = searchParams.get('location')
  const type = searchParams.get('type') as 'public' | 'private' | null
  const search = searchParams.get('search')
  
  let universities = DOMINICAN_UNIVERSITIES
  
  // Apply filters
  if (location) {
    universities = getUniversitiesByLocation(location)
  }
  
  if (type) {
    universities = getUniversitiesByType(type)
  }
  
  if (search) {
    universities = searchUniversities(search)
  }
  
  // Add professor counts
  const universitiesWithCounts = universities.map(uni => ({
    ...uni,
    professorCount: 
      uni.id === 'pucmm' ? 94 :
      uni.id === 'intec' ? 20 :
      uni.id === 'utesa' ? 10 :
      uni.id === 'uasd' ? 5 :
      0,
    hasScrapedData: ['pucmm', 'intec', 'utesa', 'uasd'].includes(uni.id)
  }))
  
  return NextResponse.json({
    success: true,
    universities: universitiesWithCounts,
    total: universitiesWithCounts.length,
    totalWithProfessors: universitiesWithCounts.filter(uni => uni.professorCount > 0).length,
    totalProfessors: universitiesWithCounts.reduce((sum, uni) => sum + uni.professorCount, 0)
  })
} 