'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createPortal } from 'react-dom'
import { MagnifyingGlassIcon, XMarkIcon, ClockIcon, StarIcon } from '@heroicons/react/24/outline'
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/solid'

interface SearchResult {
  id: string
  type: 'professor' | 'university' | 'department'
  name: string
  subtitle: string
  rating?: number
  tags?: string[]
}

interface SearchFilters {
  universities: string[]
  departments: string[]
  minRating: number
  maxDifficulty: number
  tags: string[]
}

const UNIVERSITIES = ['UASD', 'INTEC', 'PUCMM', 'UNPHU', 'UTESA', 'O&M', 'APEC', 'UNICARIBE']
const DEPARTMENTS = ['Ingeniería', 'Medicina', 'Derecho', 'Administración', 'Psicología', 'Arquitectura', 'Contabilidad']
const POPULAR_TAGS = ['Excelente', 'Difícil', 'Fácil', 'Puntual', 'Exigente', 'Flexible', 'Claro', 'Justo']

const MOCK_SUGGESTIONS: SearchResult[] = [
  { id: 'juan-perez', type: 'professor', name: 'Dr. Roberto Jiménez', subtitle: 'Ingeniería • INTEC', rating: 4.9, tags: ['Excelente', 'Claro'] },
  { id: 'carmen-valdez', type: 'professor', name: 'Dra. Carmen Valdez', subtitle: 'Medicina • PUCMM', rating: 4.8, tags: ['Inspirador', 'Disponible'] },
  { id: 'luis-herrera', type: 'professor', name: 'Prof. Luis Herrera', subtitle: 'Derecho • UASD', rating: 4.7, tags: ['Organizado', 'Justo'] },
  { id: 'intec', type: 'university', name: 'INTEC', subtitle: 'Instituto Tecnológico de Santo Domingo' },
  { id: 'pucmm', type: 'university', name: 'PUCMM', subtitle: 'Pontificia Universidad Católica Madre y Maestra' },
  { id: 'ingenieria', type: 'department', name: 'Ingeniería', subtitle: 'INTEC • 150+ profesores' },
  { id: 'medicina', type: 'department', name: 'Medicina', subtitle: 'PUCMM • 95+ profesores' }
]

export default function EnhancedSearch() {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [popularSearches, setPopularSearches] = useState<string[]>([])
  const [loadingPopular, setLoadingPopular] = useState(true)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 })
  const [filters, setFilters] = useState<SearchFilters>({
    universities: [],
    departments: [],
    minRating: 0,
    maxDifficulty: 5,
    tags: []
  })

  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Update dropdown position dynamically - centered
  const updateDropdownPosition = () => {
    if (searchRef.current) {
      const rect = searchRef.current.getBoundingClientRect()
      const dropdownWidth = Math.max(rect.width, 320) // Minimum 320px width
      const leftPosition = rect.left + window.scrollX + (rect.width - dropdownWidth) / 2
      
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: Math.max(16, leftPosition), // Ensure 16px margin from viewport edge
        width: dropdownWidth
      })
    }
  }

  // Load recent searches from localStorage and fetch popular searches
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('recentSearches')
      if (saved) {
        setRecentSearches(JSON.parse(saved))
      }
    }
    
    // Fetch popular searches from API
    fetchPopularSearches()
  }, [])

  const fetchPopularSearches = async () => {
    try {
      const response = await fetch('/api/search/popular')
      if (response.ok) {
        const data = await response.json()
        setPopularSearches(data.popularSearches || [])
      }
    } catch (error) {
      console.error('Error fetching popular searches:', error)
      // Fallback to some default popular searches if API fails
      setPopularSearches(['INTEC profesores', 'Dr. García', 'PUCMM medicina', 'Matemáticas', 'UASD ingeniería', 'Física I'])
    } finally {
      setLoadingPopular(false)
    }
  }

  const trackSearch = async (searchQuery: string) => {
    try {
      await fetch('/api/search/popular', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      })
      // Refresh popular searches after tracking
      fetchPopularSearches()
    } catch (error) {
      console.error('Error tracking search:', error)
    }
  }

  // Handle clicks outside, scroll, and resize events
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      
      // Check if click is inside search component
      if (searchRef.current && searchRef.current.contains(target)) {
        return
      }
      
      // Check if click is inside the portal dropdown
      const portalDropdown = document.querySelector('.search-dropdown-portal')
      if (portalDropdown && portalDropdown.contains(target)) {
        return
      }
      
      // If click is outside both search component and dropdown, close it
      setIsOpen(false)
      setShowFilters(false)
    }

    const handleScroll = () => {
      if (isOpen) {
        updateDropdownPosition()
      }
    }

    const handleResize = () => {
      if (isOpen) {
        updateDropdownPosition()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize, { passive: true })
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [isOpen])

  // Search functionality
  useEffect(() => {
    if (query.length > 0) {
      const filtered = MOCK_SUGGESTIONS.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase())
      )
      setResults(filtered)
      setIsOpen(true)
      updateDropdownPosition()
    } else {
      setResults([])
      if (!showFilters) {
        setIsOpen(true)
        updateDropdownPosition()
      }
    }
  }, [query, showFilters])

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return

    // Track this search in popular searches
    trackSearch(searchQuery.trim())

    const newRecent = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5)
    setRecentSearches(newRecent)
    if (typeof window !== 'undefined') {
      localStorage.setItem('recentSearches', JSON.stringify(newRecent))
    }

    router.push(`/buscar?q=${encodeURIComponent(searchQuery)}`)
    setIsOpen(false)
    setQuery('')
  }

  const handleResultClick = (result: SearchResult) => {
    console.log('🔍 Search result clicked:', result.name, result.type)
    const searchQuery = result.name
    
    // Navigate based on result type
    if (result.type === 'professor') {
      // Use the mock professor ID to navigate to the professor page
      console.log('➡️ Navigating to professor:', `/profesor/${result.id}`)
      router.push(`/profesor/${result.id}`)
    } else if (result.type === 'university') {
      // For universities, navigate to institution page
      console.log('➡️ Navigating to university:', `/institucion/${result.name.toLowerCase()}`)
      router.push(`/institucion/${result.name.toLowerCase()}`)
    } else if (result.type === 'department') {
      // For departments/subjects, navigate to the new materia page
      const subjectSlug = result.name.toLowerCase()
        .replace(/\s+/g, '')
        .replace(/ía/g, 'ia') // Convert ñ and accents
        .replace(/ó/g, 'o')
      console.log('➡️ Navigating to materia:', `/materia/${subjectSlug}`)
      router.push(`/materia/${subjectSlug}`)
    }

    // Track this search and add to recent searches
    trackSearch(searchQuery)
    const newRecent = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5)
    setRecentSearches(newRecent)
    if (typeof window !== 'undefined') {
      localStorage.setItem('recentSearches', JSON.stringify(newRecent))
    }

    // Close dropdown after a small delay to ensure navigation completes
    setTimeout(() => {
      setIsOpen(false)
      setQuery('')
    }, 100)
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    if (typeof window !== 'undefined') {
      localStorage.removeItem('recentSearches')
    }
  }

  const toggleFilter = (type: keyof SearchFilters, value: string) => {
    setFilters(prev => {
      if (type === 'universities' || type === 'departments' || type === 'tags') {
        const currentArray = prev[type] as string[]
        return {
          ...prev,
          [type]: currentArray.includes(value)
            ? currentArray.filter(item => item !== value)
            : [...currentArray, value]
        }
      }
      return prev
    })
  }

  const resetFilters = () => {
    setFilters({
      universities: [],
      departments: [],
      minRating: 0,
      maxDifficulty: 5,
      tags: []
    })
  }

  const getResultIcon = (type: string) => {
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

  // Portal dropdown with maximum z-index positioning
  const DropdownPortal = ({ children }: { children: React.ReactNode }) => {
    if (typeof window === 'undefined') return null
    return createPortal(
      <div
        className="search-dropdown-portal"
        style={{
          position: 'fixed',
          top: dropdownPosition.top,
          left: dropdownPosition.left,
          width: dropdownPosition.width,
          zIndex: 999999,
          maxWidth: '32rem',
          minWidth: '20rem',
          pointerEvents: 'auto'
        }}

      >
        {children}
      </div>,
      document.body
    )
  }

  return (
    <>
      <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setIsOpen(true)
              updateDropdownPosition()
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch(query)
              }
              if (e.key === 'Escape') {
                setIsOpen(false)
                setShowFilters(false)
              }
            }}
            placeholder="Buscar profesores, universidades o departamentos..."
            className="w-full pl-12 pr-20 py-4 text-lg border-2 border-gray-300 rounded-2xl focus:border-gray-900 focus:outline-none transition-colors bg-white shadow-sm"
            style={{ fontSize: '16px' }}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            {query && (
              <button
                onClick={() => {
                  setQuery('')
                  setIsOpen(true)
                  updateDropdownPosition()
                }}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XMarkIcon className="h-4 w-4 text-gray-400" />
              </button>
            )}
            <button
              onClick={() => {
                setShowFilters(!showFilters)
                setIsOpen(true)
                updateDropdownPosition()
              }}
              className={`p-2 rounded-lg transition-colors ${
                showFilters ? 'bg-gray-900 text-white' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Portal dropdown renders outside DOM tree with maximum z-index */}
      {(isOpen || showFilters) && (
        <DropdownPortal>
          <div className="bg-white border border-gray-200 rounded-xl shadow-2xl max-h-96 overflow-y-auto">
            {/* Advanced Filters */}
            {showFilters && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-heading font-semibold text-gray-900">Filtros avanzados</h3>
                  <button
                    onClick={resetFilters}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Limpiar filtros
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Universidades</label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {UNIVERSITIES.map(uni => (
                        <label key={uni} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.universities.includes(uni)}
                            onChange={() => toggleFilter('universities', uni)}
                            className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                          />
                          <span className="ml-2 text-sm text-gray-700">{uni}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Departamentos</label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {DEPARTMENTS.map(dept => (
                        <label key={dept} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.departments.includes(dept)}
                            onChange={() => toggleFilter('departments', dept)}
                            className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                          />
                          <span className="ml-2 text-sm text-gray-700">{dept}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Calificación mínima: {filters.minRating.toFixed(1)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.1"
                      value={filters.minRating}
                      onChange={(e) => setFilters(prev => ({ ...prev, minRating: parseFloat(e.target.value) }))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dificultad máxima: {filters.maxDifficulty.toFixed(1)}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="0.1"
                      value={filters.maxDifficulty}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxDifficulty: parseFloat(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Etiquetas</label>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_TAGS.map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleFilter('tags', tag)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          filters.tags.includes(tag)
                            ? 'bg-rating-average text-gray-900'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Search Results */}
            {!showFilters && (
              <>
                {query && results.length > 0 && (
                  <div className="p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Resultados</h4>
                    <div className="space-y-2">
                      {results.map((result) => (
                        <div
                          key={result.id}
                          onClick={() => handleResultClick(result)}
                          className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left cursor-pointer"
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              handleResultClick(result)
                            }
                          }}
                        >
                          <span className="text-2xl">{getResultIcon(result.type)}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">{result.name}</span>
                              {result.rating && (
                                <div className="flex items-center gap-1">
                                  <StarIcon className="h-4 w-4 text-rating-average" />
                                  <span className="text-sm font-medium metric-number">{result.rating}</span>
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{result.subtitle}</p>
                            {result.tags && (
                              <div className="flex gap-1 mt-1">
                                {result.tags.slice(0, 2).map(tag => (
                                  <span key={tag} className="px-2 py-0.5 bg-rating-average/30 text-xs rounded-full">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!query && recentSearches.length > 0 && (
                  <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-700">Búsquedas recientes</h4>
                      <button
                        onClick={clearRecentSearches}
                        className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        Limpiar
                      </button>
                    </div>
                    <div className="space-y-1">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => handleSearch(search)}
                          className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                        >
                          <ClockIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-700">{search}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {!query && (
                  <div className={`p-4 ${recentSearches.length > 0 ? 'border-t border-gray-100' : ''}`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-700">Búsquedas populares</h4>
                      {!loadingPopular && (
                        <button
                          onClick={fetchPopularSearches}
                          className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                          title="Actualizar búsquedas populares"
                        >
                          🔄
                        </button>
                      )}
                    </div>
                    {loadingPopular ? (
                      <div className="flex flex-wrap gap-2">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                          <div key={i} className="h-8 bg-gray-200 rounded-full animate-pulse" style={{width: `${60 + i * 10}px`}}></div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {popularSearches.slice(0, 6).map((term, index) => (
                          <button
                            key={`${term}-${index}`}
                            onClick={() => handleSearch(term)}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors flex items-center gap-1"
                          >
                            <span className="text-xs text-red-500">•</span>
                            {term}
                          </button>
                        ))}
                        {popularSearches.length === 0 && (
                          <p className="text-sm text-gray-500 italic">No hay búsquedas populares disponibles</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {query && results.length === 0 && (
                  <div className="p-8 text-center">
                    <MagnifyingGlassIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600 mb-2">No se encontraron resultados para "{query}"</p>
                    <p className="text-sm text-gray-500">
                      Intenta con términos diferentes o usa filtros para refinar tu búsqueda
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </DropdownPortal>
      )}
    </>
  )
}