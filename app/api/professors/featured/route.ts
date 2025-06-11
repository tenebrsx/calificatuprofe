import { NextResponse } from 'next/server'

// Real PUCMM professors (first few from our mock data)
const REAL_FEATURED_PROFESSORS = [
  {
    id: '1',
    name: 'Dr. José Cruz',
    university: 'PUCMM',
    department: 'Arquitectura',
    rating: 4.8,
    totalReviews: 23,
    tags: ['CLARO AL EXPLICAR', 'DISPONIBLE']
  },
  {
    id: '2', 
    name: 'Dr. Pedro García',
    university: 'PUCMM',
    department: 'Arquitectura',
    rating: 4.7,
    totalReviews: 18,
    tags: ['INSPIRADOR', 'EXÁMENES JUSTOS']
  },
  {
    id: '3',
    name: 'Dra. Diana Nicodemo',
    university: 'PUCMM', 
    department: 'Arquitectura',
    rating: 4.6,
    totalReviews: 15,
    tags: ['ORGANIZADA', 'FEEDBACK ÚTIL']
  }
]

export async function GET() {
  try {
    // For now, return our real PUCMM professors
    // Later this can be enhanced to fetch actual rated professors from the database
    
    return NextResponse.json(REAL_FEATURED_PROFESSORS)
    
  } catch (error) {
    console.error('Error fetching featured professors:', error)
    
    // Return real professors as fallback
    return NextResponse.json(REAL_FEATURED_PROFESSORS)
  }
} 