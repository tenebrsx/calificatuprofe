'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  AcademicCapIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import AddProfessorPrompt from '@/components/AddProfessorPrompt'

interface Professor {
  id: string
  name: string
  department: string
  institution: string
  rating: number
  totalRatings: number
  difficulty: number
  wouldTakeAgainPercent: number
  topTags: string[]
}

interface FilterOptions {
  search: string
  department: string
  institution: string
  minRating: number
  sortBy: 'rating' | 'reviews' | 'name' | 'difficulty'
  sortOrder: 'asc' | 'desc'
}

const MOCK_PROFESSORS: Professor[] = [
  {
    id: '1',
    name: 'Dr. Juan Pérez',
    department: 'Ingeniería',
    institution: 'INTEC',
    rating: 4.8,
    totalRatings: 156,
    difficulty: 3.2,
    wouldTakeAgainPercent: 89,
    topTags: ['CLARO AL EXPLICAR', 'DISPONIBLE', 'EXÁMENES JUSTOS']
  },
  {
    id: '2',
    name: 'Dra. María Santos',
    department: 'Medicina',
    institution: 'UNPHU',
    rating: 4.7,
    totalRatings: 89,
    difficulty: 4.1,
    wouldTakeAgainPercent: 82,
    topTags: ['INSPIRADOR', 'TAREAS ÚTILES', 'SE PREOCUPA']
  },
  {
    id: '3',
    name: 'Prof. Carlos López',
    department: 'Administración',
    institution: 'PUCMM',
    rating: 4.6,
    totalRatings: 134,
    difficulty: 2.8,
    wouldTakeAgainPercent: 91,
    topTags: ['CLARO AL EXPLICAR', 'FLEXIBLE', 'TRABAJOS GRUPO']
  },
  {
    id: '4',
    name: 'Dr. Ana Méndez',
    department: 'Derecho',
    institution: 'UASD',
    rating: 4.5,
    totalRatings: 78,
    difficulty: 3.7,
    wouldTakeAgainPercent: 75,
    topTags: ['EXÁMENES JUSTOS', 'DISPONIBLE', 'RESPETADO']
  },
  {
    id: '5',
    name: 'Prof. Luis García',
    department: 'Psicología',
    institution: 'PUCMM',
    rating: 4.4,
    totalRatings: 92,
    difficulty: 3.0,
    wouldTakeAgainPercent: 88,
    topTags: ['CLASES TEÓRICAS', 'TAREA PESADA', 'INSPIRADOR']
  },
  {
    id: '6',
    name: 'Dra. Carmen Jiménez',
    department: 'Arquitectura',
    institution: 'UNPHU',
    rating: 4.3,
    totalRatings: 67,
    difficulty: 3.5,
    wouldTakeAgainPercent: 79,
    topTags: ['PARTICIPA CLASE', 'FLEXIBLE', 'PUNTAJE EXTRA']
  },
  {
    id: '7',
    name: 'Dr. Roberto Silva',
    department: 'Ingeniería',
    institution: 'INTEC',
    rating: 4.2,
    totalRatings: 143,
    difficulty: 4.2,
    wouldTakeAgainPercent: 68,
    topTags: ['CALIFICACIÓN ESTRICTA', 'MUCHA LECTURA', 'CLASES TEÓRICAS']
  },
  {
    id: '8',
    name: 'Prof. Elena Morales',
    department: 'Medicina',
    institution: 'UASD',
    rating: 4.1,
    totalRatings: 56,
    difficulty: 3.8,
    wouldTakeAgainPercent: 72,
    topTags: ['SE PREOCUPA', 'TAREAS ÚTILES', 'DISPONIBLE']
  }
]

const DEPARTMENTS = ['Arquitectura', 'Ingeniería', 'Medicina', 'Administración', 'Derecho', 'Psicología', 'Ciencias Sociales', 'Humanidades']
const INSTITUTIONS = ['PUCMM', 'UASD', 'INTEC', 'UNIBE', 'UTESA', 'UCNE', 'PUCSTA', 'UAPM']

function ProfessorsPageContent() {
  const searchParams = useSearchParams()
  const [professors, setProfessors] = useState<Professor[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  
  const [filters, setFilters] = useState<FilterOptions>({
    search: searchParams?.get('search') || '',
    department: searchParams?.get('department') || '',
    institution: searchParams?.get('university') || searchParams?.get('institucion') || '',
    minRating: Number(searchParams?.get('minRating')) || 0,
    sortBy: (searchParams?.get('sortBy') as any) || 'rating',
    sortOrder: (searchParams?.get('sortOrder') as any) || 'desc'
  })

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const response = await fetch('/api/professors/mock', {
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
            limit: 100
          })
        })
        
        if (response.ok) {
          const data = await response.json()
          const formattedProfessors = data.results.map((prof: any) => ({
            id: prof.id,
            name: prof.name,
            department: prof.department || 'Sin departamento',
            institution: prof.university,
            rating: prof.averageRating || 0,
            totalRatings: prof.totalReviews || 0,
            difficulty: prof.averageDifficulty || 0,
            wouldTakeAgainPercent: prof.wouldTakeAgainPercent || 0,
            topTags: prof.topTags || []
          }))
          setProfessors(formattedProfessors)
        } else {
          // Fallback to mock data if API fails
          setProfessors(MOCK_PROFESSORS)
        }
      } catch (error) {
        console.error('Error fetching professors:', error)
        // Fallback to mock data on error  
        setProfessors(MOCK_PROFESSORS)
      } finally {
        setLoading(false)
      }
    }

    fetchProfessors()
  }, [])

  const filteredProfessors = useCallback(() => {
    let result = professors.filter(professor => {
      const matchesSearch = !filters.search || 
        professor.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        professor.department.toLowerCase().includes(filters.search.toLowerCase()) ||
        professor.institution.toLowerCase().includes(filters.search.toLowerCase())
      
      const matchesDepartment = !filters.department || professor.department === filters.department
      const matchesInstitution = !filters.institution || professor.institution === filters.institution
      const matchesRating = professor.rating >= filters.minRating
      
      return matchesSearch && matchesDepartment && matchesInstitution && matchesRating
    })

    // Sort results
    result.sort((a, b) => {
      const multiplier = filters.sortOrder === 'desc' ? -1 : 1
      switch (filters.sortBy) {
        case 'rating':
          return (a.rating - b.rating) * multiplier
        case 'reviews':
          return (a.totalRatings - b.totalRatings) * multiplier
        case 'name':
          return a.name.localeCompare(b.name) * multiplier
        case 'difficulty':
          return (a.difficulty - b.difficulty) * multiplier
        default:
          return 0
      }
    })

    return result
  }, [professors, filters])

  const filteredResults = filteredProfessors()
  const hasActiveFilters = filters.search || filters.department || filters.institution || filters.minRating > 0

  const getRatingColor = (rating: number, totalReviews: number) => {
    if (totalReviews < 5) return 'bg-gray-400'
    if (rating >= 4.0) return 'bg-green-500'
    if (rating >= 3.0) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty >= 4.0) return 'text-red-600'
    if (difficulty >= 3.0) return 'text-yellow-600'
    return 'text-green-600'
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      department: '',
      institution: '',
      minRating: 0,
      sortBy: 'rating',
      sortOrder: 'desc'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profesores</h1>
          <p className="text-gray-600">
            Encuentra y califica profesores de universidades dominicanas
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            {/* Search Input */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar profesores por nombre, departamento o universidad..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  showFilters 
                    ? 'bg-blue-50 border-blue-300 text-blue-700' 
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <AdjustmentsHorizontalIcon className="h-5 w-5" />
                Filtros
              </button>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <XMarkIcon className="h-4 w-4" />
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Department Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Departamento</label>
                <select
                  value={filters.department}
                  onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todos</option>
                  {DEPARTMENTS.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              {/* Institution Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Universidad</label>
                <select
                  value={filters.institution}
                  onChange={(e) => setFilters(prev => ({ ...prev, institution: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todas</option>
                  {INSTITUTIONS.map(inst => (
                    <option key={inst} value={inst}>{inst}</option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Calificación mínima</label>
                <select
                  value={filters.minRating}
                  onChange={(e) => setFilters(prev => ({ ...prev, minRating: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={0}>Cualquiera</option>
                  <option value={4.0}>4.0+ estrellas</option>
                  <option value={3.5}>3.5+ estrellas</option>
                  <option value={3.0}>3.0+ estrellas</option>
                </select>
              </div>

              {/* Sort Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
                <select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-')
                    setFilters(prev => ({ 
                      ...prev, 
                      sortBy: sortBy as any, 
                      sortOrder: sortOrder as any 
                    }))
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="rating-desc">Mayor calificación</option>
                  <option value="rating-asc">Menor calificación</option>
                  <option value="reviews-desc">Más reseñas</option>
                  <option value="reviews-asc">Menos reseñas</option>
                  <option value="name-asc">Nombre A-Z</option>
                  <option value="name-desc">Nombre Z-A</option>
                  <option value="difficulty-asc">Menos difícil</option>
                  <option value="difficulty-desc">Más difícil</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="space-y-8">
            <div className="text-center py-12">
              <AcademicCapIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron profesores</h3>
              <p className="text-gray-600 mb-4">
                {filters.search || hasActiveFilters 
                  ? 'Intenta ajustar tus filtros de búsqueda' 
                  : 'No hay profesores disponibles en este momento'
                }
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
            
            {/* Add Professor Prompt for empty search results */}
            <AddProfessorPrompt 
              context="search"
              institution={filters.institution}
              department={filters.department}
              className="max-w-2xl mx-auto"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredResults.map((professor) => (
              <Link
                key={professor.id}
                href={`/profesor/${professor.id}`}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{professor.name}</h3>
                    <p className="text-gray-600 mb-1">{professor.department}</p>
                    <p className="text-sm text-gray-500">{professor.institution}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                      <span>{professor.totalRatings} calificaciones</span>
                      <span className={`font-medium ${getDifficultyColor(professor.difficulty)}`}>
                        Dificultad: {professor.difficulty.toFixed(1)}
                      </span>
                      <span className="text-green-600">
                        {professor.wouldTakeAgainPercent}% lo recomendaría
                      </span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 rounded-full ${getRatingColor(professor.rating, professor.totalRatings)} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white font-bold">{professor.rating.toFixed(1)}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {professor.topTags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Add Professor Prompt and Pagination */}
        {filteredResults.length > 0 && (
          <div className="space-y-8 mt-12">
            <AddProfessorPrompt 
              context="search"
              institution={filters.institution}
              department={filters.department}
              className="max-w-2xl mx-auto"
            />
            
            <div className="text-center">
              <p className="text-gray-600">
                Mostrando {filteredResults.length} de {professors.length} profesores
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ProfessorsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <ProfessorsPageContent />
    </Suspense>
  )
} 