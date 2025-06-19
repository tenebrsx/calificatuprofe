import { NextRequest, NextResponse } from 'next/server'

// Popular search terms based on Dominican universities and common searches
const POPULAR_SEARCHES = [
  'INTEC',
  'PUCMM', 
  'UASD',
  'UNPHU',
  'UTESA',
  'Ingeniería',
  'Medicina',
  'Derecho',
  'Administración',
  'Matemáticas',
  'Cálculo',
  'Física',
  'Química',
  'Literatura'
]

const MOCK_POPULAR_SEARCHES = [
  { query: 'Ingeniería', count: 156 },
  { query: 'Medicina', count: 142 },
  { query: 'Administración', count: 98 },
  { query: 'Derecho', count: 87 },
  { query: 'Psicología', count: 76 },
  { query: 'Matemáticas', count: 65 },
  { query: 'Historia', count: 54 },
  { query: 'Química', count: 43 },
  { query: 'Física', count: 38 },
  { query: 'Filosofía', count: 32 }
]

// Track searches (in a real app, this would go to a database)
const searchTracker = new Map<string, number>()

export async function GET() {
  try {
    // In a real implementation, you'd fetch from your database
    // For now, return mock data with some tracked searches mixed in
    const trackedSearches = Array.from(searchTracker.entries())
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    const allSearches = [...trackedSearches, ...MOCK_POPULAR_SEARCHES]
      .reduce((acc, curr) => {
        const existing = acc.find(item => item.query.toLowerCase() === curr.query.toLowerCase())
        if (existing) {
          existing.count += curr.count
        } else {
          acc.push(curr)
        }
        return acc
      }, [] as { query: string; count: number }[])
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    return NextResponse.json({
      success: true,
      searches: allSearches
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch popular searches' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()
    
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid query' },
        { status: 400 }
      )
    }

    // Track the search
    const normalizedQuery = query.trim().toLowerCase()
    const currentCount = searchTracker.get(normalizedQuery) || 0
    searchTracker.set(normalizedQuery, currentCount + 1)

    return NextResponse.json({
      success: true,
      message: 'Search tracked'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to track search' },
      { status: 500 }
    )
  }
} 