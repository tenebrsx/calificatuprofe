import { NextResponse } from 'next/server'

// In a real app, this would be stored in a database
// For now, we'll use a global variable that resets on server restart
let searchTracker: Record<string, { count: number; lastSearched: Date }> = {}

// Initialize with some base popular searches to avoid empty state
const initializePopularSearches = () => {
  if (Object.keys(searchTracker).length === 0) {
    searchTracker = {
      'INTEC profesores': { count: 45, lastSearched: new Date() },
      'Dr. García': { count: 38, lastSearched: new Date() },
      'PUCMM medicina': { count: 32, lastSearched: new Date() },
      'Matemáticas': { count: 29, lastSearched: new Date() },
      'UASD ingeniería': { count: 26, lastSearched: new Date() },
      'Física I': { count: 23, lastSearched: new Date() },
      'Cálculo': { count: 21, lastSearched: new Date() },
      'Derecho constitucional': { count: 18, lastSearched: new Date() }
    }
  }
}

export async function GET() {
  try {
    initializePopularSearches()
    
    // Get popular searches sorted by frequency and recency
    const popularSearches = Object.entries(searchTracker)
      .map(([query, data]) => ({
        query,
        count: data.count,
        lastSearched: data.lastSearched
      }))
      .sort((a, b) => {
        // Sort by count first, then by recency
        if (b.count !== a.count) {
          return b.count - a.count
        }
        return new Date(b.lastSearched).getTime() - new Date(a.lastSearched).getTime()
      })
      .slice(0, 8) // Return top 8 popular searches
      .map(item => item.query)

    return NextResponse.json({ popularSearches })
  } catch (error) {
    console.error('Error fetching popular searches:', error)
    return NextResponse.json({ error: 'Failed to fetch popular searches' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { query } = await request.json()
    
    if (!query || typeof query !== 'string' || query.trim().length < 2) {
      return NextResponse.json({ error: 'Invalid search query' }, { status: 400 })
    }

    const normalizedQuery = query.trim()
    
    initializePopularSearches()
    
    // Update search count
    if (searchTracker[normalizedQuery]) {
      searchTracker[normalizedQuery].count += 1
      searchTracker[normalizedQuery].lastSearched = new Date()
    } else {
      searchTracker[normalizedQuery] = {
        count: 1,
        lastSearched: new Date()
      }
    }

    // Optional: Clean up old searches to prevent memory issues
    // Remove searches with very low counts that are older than 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    Object.keys(searchTracker).forEach(key => {
      const data = searchTracker[key]
      if (data.count <= 2 && data.lastSearched < thirtyDaysAgo) {
        delete searchTracker[key]
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking search:', error)
    return NextResponse.json({ error: 'Failed to track search' }, { status: 500 })
  }
} 