import { NextResponse } from 'next/server'

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

export async function GET() {
  try {
    // Popular searches for Dominican universities and subjects
    const popularSearches = {
      universities: [
        { name: 'INTEC', count: 29, description: 'Instituto Tecnológico de Santo Domingo' },
        { name: 'PUCMM', count: 32, description: 'Pontificia Universidad Católica Madre y Maestra' },
        { name: 'UASD', count: 22, description: 'Universidad Autónoma de Santo Domingo' },
        { name: 'UNPHU', count: 27, description: 'Universidad Nacional Pedro Henríquez Ureña' },
        { name: 'UNIBE', count: 20, description: 'Universidad Iberoamericana' },
        { name: 'UNICARIBE', count: 13, description: 'Universidad del Caribe' },
        { name: 'UTESA', count: 10, description: 'Universidad Tecnológica de Santiago' },
        { name: 'UNAPEC', count: 8, description: 'Universidad APEC' }
      ],
      subjects: [
        { name: 'Ingeniería', count: 85, icon: '⚙️' },
        { name: 'Medicina', count: 72, icon: '🏥' },
        { name: 'Derecho', count: 68, icon: '⚖️' },
        { name: 'Administración', count: 64, icon: '💼' },
        { name: 'Contabilidad', count: 58, icon: '📊' },
        { name: 'Psicología', count: 45, icon: '🧠' },
        { name: 'Educación', count: 42, icon: '📚' },
        { name: 'Arquitectura', count: 38, icon: '🏗️' },
        { name: 'Comunicación', count: 35, icon: '📢' },
        { name: 'Informática', count: 33, icon: '💻' }
      ],
      trending: [
        'Dr. Víctor Gómez-Valenzuela',
        'Dra. Solhanlle Bonilla Duarte', 
        'Dr. Luis Álvarez López',
        'Dr. Fernando Santamaría',
        'Ing. Carlos Cordero'
      ]
    }

    return NextResponse.json({
      success: true,
      data: popularSearches,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error fetching popular searches:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch popular searches',
        data: {
          universities: [],
          subjects: [],
          trending: []
        }
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { query } = await request.json()
    
    // In a real app, you'd track search queries in a database
    // For now, just return success
    console.log('Search tracked:', query)
    
    return NextResponse.json({
      success: true,
      message: 'Search tracked successfully'
    })
  } catch (error) {
    console.error('Error tracking search:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to track search'
    }, { status: 500 })
  }
} 