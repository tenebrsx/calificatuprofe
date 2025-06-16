import { NextRequest, NextResponse } from 'next/server'
import { normalizeText } from '@/lib/utils/textNormalization'

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
  sortBy?: 'name' | 'rating' | 'reviews' | 'relevance'
  sortOrder?: 'asc' | 'desc'
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Main search endpoint called')
    
    const body = await request.json()
    console.log('📝 Request body:', body)
    
    const { query: searchQuery, filters, limit: searchLimit = 50 } = body

    // Test fetching mock data
    const baseUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}`
    console.log('🌐 Base URL:', baseUrl)
    
    const mockResponse = await fetch(`${baseUrl}/api/professors/mock`)
    console.log('📡 Mock response status:', mockResponse.status)
    
    if (!mockResponse.ok) {
      throw new Error(`Mock API returned ${mockResponse.status}`)
    }
    
    const mockData = await mockResponse.json()
    console.log('📊 Mock data loaded:', mockData.results?.length || 0, 'professors')
    
    // Normalize search query
    const normalizedQuery = normalizeText(searchQuery)
    console.log('🔍 Search query:', normalizedQuery)
    
    let results = mockData.results || []
    
    if (normalizedQuery) {
      results = results.filter((prof: any) => {
        // Normalize all fields before comparison
        const normalizedName = normalizeText(prof.name)
        const normalizedUniversity = normalizeText(prof.university)
        const normalizedDepartment = normalizeText(prof.department)
        
        const matches = normalizedUniversity.includes(normalizedQuery) ||
                       normalizedName.includes(normalizedQuery) ||
                       normalizedDepartment.includes(normalizedQuery)
        
        if (matches) {
          console.log('✅ Match found:', prof.name, prof.university)
        }
        
        return matches
      })
    }
    
    console.log('🎯 Total matches:', results.length)
    
    // Apply additional filters with normalized text
    if (filters?.university) {
      const normalizedFilterUniversity = normalizeText(filters.university)
      results = results.filter((prof: any) => 
        normalizeText(prof.university).includes(normalizedFilterUniversity)
      )
    }

    if (filters?.department) {
      const normalizedFilterDepartment = normalizeText(filters.department)
      results = results.filter((prof: any) => 
        normalizeText(prof.department).includes(normalizedFilterDepartment)
      )
    }

    if (filters?.minRating && filters.minRating > 0) {
      results = results.filter((prof: any) => 
        (prof.averageRating || 0) >= filters.minRating!
      )
    }

    if (filters?.maxRating && filters.maxRating < 5) {
      results = results.filter((prof: any) => 
        (prof.averageRating || 0) <= filters.maxRating!
      )
    }

    // Sort results
    results.sort((a: any, b: any) => {
      const nameA = normalizeText(a.name || '')
      const nameB = normalizeText(b.name || '')
      return nameA.localeCompare(nameB)
    })

    // Limit results
    results = results.slice(0, searchLimit)
    
    return NextResponse.json({
      success: true,
      query: searchQuery,
      results,
      total: results.length,
      filters,
      source: 'mock'
    })
    
  } catch (error) {
    console.error('❌ Main search error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      results: [],
      total: 0
    }, { status: 500 })
  }
}

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

  // Create a mock request for the POST method
  const mockRequest = {
    json: async () => body,
    nextUrl: request.nextUrl
  } as NextRequest

  return POST(mockRequest)
} 