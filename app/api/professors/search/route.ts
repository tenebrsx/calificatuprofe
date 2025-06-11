import { NextRequest, NextResponse } from 'next/server'
import { collection, query, where, orderBy, limit, getDocs, Query, DocumentData } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'

interface SearchFilters {
  university?: string
  department?: string
  minRating?: number
  maxRating?: number
}

interface SearchRequest {
  query: string
  filters: SearchFilters
  limit?: number
  sortBy?: 'name' | 'rating' | 'reviews'
  sortOrder?: 'asc' | 'desc'
}

export async function POST(request: NextRequest) {
  try {
    const body: SearchRequest = await request.json()
    const { query: searchQuery, filters, limit: searchLimit = 50, sortBy = 'name', sortOrder = 'asc' } = body

    // Start with base collection reference
    const professorsRef = collection(db, 'professors')
    let firestoreQuery: Query<DocumentData> = professorsRef

    // Apply filters
    if (filters.university) {
      firestoreQuery = query(firestoreQuery, where('university', '==', filters.university))
    }

    if (filters.department) {
      firestoreQuery = query(firestoreQuery, where('department', '==', filters.department))
    }

    if (filters.minRating && filters.minRating > 0) {
      firestoreQuery = query(firestoreQuery, where('averageRating', '>=', filters.minRating))
    }

    if (filters.maxRating && filters.maxRating < 5) {
      firestoreQuery = query(firestoreQuery, where('averageRating', '<=', filters.maxRating))
    }

    // Apply sorting
    let orderByField = 'name'
    if (sortBy === 'rating') orderByField = 'averageRating'
    if (sortBy === 'reviews') orderByField = 'totalReviews'

    firestoreQuery = query(
      firestoreQuery,
      orderBy(orderByField, sortOrder === 'desc' ? 'desc' : 'asc'),
      limit(searchLimit)
    )

    // Execute query
    const querySnapshot = await getDocs(firestoreQuery)
    
    // Transform data
    let results = querySnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        name: data.name || 'Nombre no disponible',
        email: data.email || '',
        university: data.university || 'Universidad no especificada',
        school: data.school || '',
        department: data.department || 'Departamento no especificado',
        campus: data.campus || 'Campus no especificado',
        averageRating: data.averageRating || 0,
        totalReviews: data.totalReviews || 0,
        wouldTakeAgainPercent: data.wouldTakeAgainPercent || 0,
        averageDifficulty: data.averageDifficulty || 0,
        topTags: data.topTags || [],
        isVerified: data.isVerified || false,
        source: data.source || 'unknown',
        createdAt: data.createdAt,
        lastScraped: data.lastScraped
      }
    })

    // Apply text search filter (client-side for now)
    if (searchQuery && searchQuery.trim()) {
      const searchTerm = searchQuery.toLowerCase().trim()
      results = results.filter(prof => 
        prof.name.toLowerCase().includes(searchTerm) ||
        prof.department.toLowerCase().includes(searchTerm) ||
        prof.university.toLowerCase().includes(searchTerm) ||
        prof.email.toLowerCase().includes(searchTerm)
      )
    }

    return NextResponse.json({
      success: true,
      results,
      total: results.length,
      query: searchQuery,
      filters
    })

  } catch (error) {
    console.error('Error searching professors:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to search professors',
        results: [],
        total: 0
      },
      { status: 500 }
    )
  }
}

// Also support GET for simple queries
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const searchQuery = searchParams.get('q') || ''
  const university = searchParams.get('university') || ''
  const department = searchParams.get('department') || ''
  const limitParam = searchParams.get('limit') || '50'

  const body = {
    query: searchQuery,
    filters: {
      university: university || undefined,
      department: department || undefined
    },
    limit: parseInt(limitParam)
  }

  const mockRequest = {
    json: async () => body
  } as NextRequest

  return POST(mockRequest)
} 