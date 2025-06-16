'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { StarIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/solid'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import EnhancedSearch from '@/components/Search/EnhancedSearch'
import AddProfessorButton from '@/components/AddProfessorButton'

interface SearchResult {
  id: string
  type: 'professor' | 'university' | 'department'
  name: string
  subtitle: string
  rating?: number
  totalRatings?: number
  tags?: string[]
  description?: string
}

function SearchPageContent() {
  const searchParams = useSearchParams()
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'name'>('relevance')
  const [filterType, setFilterType] = useState<'all' | 'professor' | 'university' | 'department'>('all')

  const query = searchParams?.get('q') || ''

  useEffect(() => {
    const performRealSearch = async () => {
      if (!query.trim()) {
        setResults([])
        setLoading(false)
        return
      }

      setLoading(true)
      
      try {
        // Use the same API as the homepage search
        const response = await fetch('/api/professors/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: query,
            filters: {},
            limit: 50
          })
        })

        if (response.ok) {
          const data = await response.json()
          
          // Convert professor results to SearchResult format
          let searchResults: SearchResult[] = (data.results || []).map((prof: any) => ({
            id: prof.id,
            type: 'professor' as const,
            name: prof.name,
            subtitle: `${prof.department} • ${prof.university}`,
            rating: prof.averageRating,
            totalRatings: prof.totalReviews,
            tags: prof.topTags || [],
            description: `Profesor de ${prof.department} en ${prof.university}`
          }))

          // Filter by type
          if (filterType !== 'all') {
            searchResults = searchResults.filter(item => item.type === filterType)
          }

          // Sort results
          searchResults.sort((a, b) => {
            switch (sortBy) {
              case 'rating':
                return (b.rating || 0) - (a.rating || 0)
              case 'name':
                return a.name.localeCompare(b.name)
              default:
                return 0
            }
          })

          setResults(searchResults)
        } else {
          console.error('Search API failed:', response.status)
          setResults([])
        }
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    performRealSearch()
  }, [query, sortBy, filterType])

  const getRatingColor = (rating: number) => {
    if (rating >= 4.0) return 'text-rating-excellent'
    if (rating >= 3.0) return 'text-rating-average'
    return 'text-rating-poor'
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'professor':
        return '👨‍🏫'
      case 'university':
        return '🏛️'
      case 'department':
        return '📚'
      default:
        return '📄'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'professor':
        return 'Profesor'
      case 'university':
        return 'Universidad'
      case 'department':
        return 'Departamento'
      default:
        return 'Resultado'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Search */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <EnhancedSearch />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 sticky top-6">
              <h3 className="text-lg font-heading font-semibold text-gray-900 mb-4">
                Filtros
              </h3>

              {/* Type Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tipo de resultado
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'Todos' },
                    { value: 'professor', label: 'Profesores' },
                    { value: 'university', label: 'Universidades' },
                    { value: 'department', label: 'Departamentos' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="type"
                        value={option.value}
                        checked={filterType === option.value}
                        onChange={(e) => setFilterType(e.target.value as any)}
                        className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Ordenar por
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500"
                >
                  <option value="relevance">Relevancia</option>
                  <option value="rating">Calificación</option>
                  <option value="name">Nombre</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-heading font-bold text-gray-900">
                  {query ? `Resultados para "${query}"` : 'Todos los resultados'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {loading ? 'Buscando...' : `${results.length} resultados encontrados`}
                </p>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="animate-pulse">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Results */}
            {!loading && (
              <div className="space-y-4">
                {results.length > 0 ? (
                  results.map((result) => (
                    <Link
                      key={result.id}
                      href={`/profesor/${result.id}`}
                      className="block bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                          {getTypeIcon(result.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-heading font-semibold text-gray-900">
                                  {result.name}
                                </h3>
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                  {getTypeLabel(result.type)}
                                </span>
                              </div>
                              <p className="text-gray-600">{result.subtitle}</p>
                            </div>
                            {result.rating && result.rating > 0 && (
                              <div className="text-right">
                                <div className="flex items-center gap-1">
                                  <StarIcon className="h-5 w-5 text-rating-average" />
                                  <span className={`text-lg font-bold metric-number ${getRatingColor(result.rating)}`}>
                                    {result.rating.toFixed(1)}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                  {result.totalRatings} {result.totalRatings === 1 ? 'calificación' : 'calificaciones'}
                                </p>
                              </div>
                            )}
                          </div>
                          
                          {result.description && (
                            <p className="text-gray-700 mb-3">{result.description}</p>
                          )}

                          {result.tags && result.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {result.tags.slice(0, 3).map(tag => (
                                <span
                                  key={tag}
                                  className="px-3 py-1 bg-rating-average/30 text-gray-700 rounded-full text-xs font-medium"
                                >
                                  {tag}
                                </span>
                              ))}
                              {result.tags.length > 3 && (
                                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                  +{result.tags.length - 3} más
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <MagnifyingGlassIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-heading font-semibold text-gray-900 mb-2">
                      No se encontraron resultados
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {query 
                        ? `No hay resultados para "${query}". Intenta con términos diferentes.`
                        : 'Intenta realizar una búsqueda específica.'
                      }
                    </p>
                    <div className="flex gap-2 justify-center mb-6">
                      <button
                        onClick={() => setFilterType('all')}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Mostrar todos
                      </button>
                      <button
                        onClick={() => setSortBy('relevance')}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Resetear filtros
                      </button>
                    </div>
                    <div className="border-t border-gray-200 pt-6">
                      <p className="text-gray-500 mb-4">¿No encuentras al profesor que buscas?</p>
                      <AddProfessorButton 
                        searchQuery={query}
                        size="md"
                        variant="primary"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  )
} 