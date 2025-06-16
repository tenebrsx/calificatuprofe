'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createPortal } from 'react-dom'
import { 
  MagnifyingGlassIcon, 
  XMarkIcon,
  UserIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  ClockIcon,
  StarIcon,
  FireIcon
} from '@heroicons/react/24/outline'
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/solid'
import AddProfessorButton from '@/components/AddProfessorButton'

interface SearchResult {
  id: string
  type: 'professor' | 'university'
  name: string
  subtitle: string
  rating?: number
  tags?: string[]
  relevanceScore?: number
}

interface SearchFilters {
  universities: string[]
  departments: string[]
  minRating: number
  maxDifficulty: number
  tags: string[]
}

interface University {
  id: string
  name: string
  shortName: string
}

interface SubjectCounts {
  ingenieria: number
  medicina: number
  derecho: number
  administracion: number
  matematicas: number
  literatura: number
}

const DEPARTMENTS = ['Ingeniería', 'Medicina', 'Derecho', 'Administración', 'Psicología', 'Arquitectura', 'Contabilidad']
const POPULAR_TAGS = ['Excelente', 'Difícil', 'Fácil', 'Puntual', 'Exigente', 'Flexible', 'Claro', 'Justo']

export default function EnhancedSearch() {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [popularSearches, setPopularSearches] = useState<string[]>([])
  const [loadingPopular, setLoadingPopular] = useState(true)
  const [loadingResults, setLoadingResults] = useState(false)
  const [universities, setUniversities] = useState<University[]>([])
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

  // Update dropdown position dynamically
  const updateDropdownPosition = () => {
    if (searchRef.current) {
      const rect = searchRef.current.getBoundingClientRect()
      const dropdownWidth = Math.max(rect.width, 400) // Minimum 400px width
      const leftPosition = rect.left + window.scrollX
      
      // Ensure dropdown doesn't go off screen
      const maxLeft = window.innerWidth - dropdownWidth - 16
      const finalLeft = Math.max(16, Math.min(leftPosition, maxLeft))
      
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: finalLeft,
        width: dropdownWidth
      })
    }
  }

  // Load universities and initial data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('recentSearches')
      if (saved) {
        setRecentSearches(JSON.parse(saved))
      }
    }
    
    // Fetch universities and popular searches
    fetchUniversities()
    fetchPopularSearches()
  }, [])

  const fetchUniversities = async () => {
    try {
      const response = await fetch('/api/universities')
      if (response.ok) {
        const data = await response.json()
        setUniversities(data.universities || [])
      }
    } catch (error) {
      console.error('Error fetching universities:', error)
    }
  }

  const fetchPopularSearches = async () => {
    try {
      setLoadingPopular(true)
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

  // Normalize text for better Spanish search (remove accents, etc.)
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics/accents
      .trim()
  }

  // Calculate relevance score for non-professor results
  const calculateUniversityRelevance = (university: University, query: string): number => {
    const searchTerm = normalizeText(query)
    const name = normalizeText(university.name)
    const shortName = normalizeText(university.shortName)
    
    let score = 0
    
    // Exact matches get highest priority
    if (shortName === searchTerm || name === searchTerm) {
      score += 100
    }
    // Short name starts with query (very high priority for university codes)
    else if (shortName.startsWith(searchTerm)) {
      score += 90
    }
    // Name starts with query
    else if (name.startsWith(searchTerm)) {
      score += 80
    }
    // Short name contains query
    else if (shortName.includes(searchTerm)) {
      score += 70
    }
    // Name contains query
    else if (name.includes(searchTerm)) {
      score += 60
    }
    
    // Boost shorter names (more likely to be relevant)
    if (shortName.length <= 6) {
      score += 10
    }
    
    return score
  }

  const calculateDepartmentRelevance = (department: string, query: string): number => {
    const searchTerm = normalizeText(query)
    const deptName = normalizeText(department)
    
    let score = 0
    
    // Exact match gets highest priority
    if (deptName === searchTerm) {
      score += 100
    }
    // Starts with query
    else if (deptName.startsWith(searchTerm)) {
      score += 80
    }
    // Contains query
    else if (deptName.includes(searchTerm)) {
      score += 60
    }
    
    // Boost common/popular departments (normalized names)
    const popularDepts = ['ingenieria', 'medicina', 'derecho', 'administracion', 'matematicas', 'arquitectura']
    if (popularDepts.includes(deptName)) {
      score += 15
    }
    
    return score
  }

  // Filter function to remove irrelevant results
  const isUniversityRelevant = (university: University, query: string): boolean => {
    const score = calculateUniversityRelevance(university, query)
    return score >= 40 // Lowered threshold for better results
  }

  const isDepartmentRelevant = (department: string, query: string): boolean => {
    const score = calculateDepartmentRelevance(department, query)
    return score >= 40 // Lowered threshold for better results
  }

  // Search for real professors and universities
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      setResults([])
      setLoadingResults(false)
      return
    }

    setLoadingResults(true)
    
    try {
      // Search for professors
      const professorResponse = await fetch('/api/professors/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          filters: {},
          limit: 20
        })
      })

      let professorResults: SearchResult[] = []
      if (professorResponse.ok) {
        const professorData = await professorResponse.json()
        professorResults = (professorData.results || []).map((prof: any) => ({
          id: prof.id,
          type: 'professor' as const,
          name: prof.name,
          subtitle: `${prof.department} • ${prof.university}`,
          rating: prof.averageRating,
          tags: prof.topTags,
          relevanceScore: prof.relevanceScore
        }))
      }

      // Search for universities
      const universityResults: SearchResult[] = universities
        .filter(uni => isUniversityRelevant(uni, searchQuery))
        .map(uni => ({
          id: uni.id,
          type: 'university' as const,
          name: uni.shortName,
          subtitle: uni.name,
          relevanceScore: calculateUniversityRelevance(uni, searchQuery)
        }))
        .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
        .slice(0, 10)

      // Combine and sort all results by relevance
      const allResults = [...professorResults, ...universityResults]
        .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
        .slice(0, 30) // Limit total results

      setResults(allResults)
      
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setLoadingResults(false)
    }
  }

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.length >= 2) {
        performSearch(query)
      } else {
        setResults([])
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, universities])

  // Update dropdown position when opened
  useEffect(() => {
    if (isOpen) {
      updateDropdownPosition()
    }
  }, [isOpen])

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

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setIsOpen(true)
    updateDropdownPosition()
  }

  // Handle search submission
  const handleSearch = (searchQuery?: string) => {
    const finalQuery = searchQuery || query
    if (!finalQuery.trim()) return

    // Track the search
    trackSearch(finalQuery)
    
    // Save to recent searches
    const newRecentSearches = [finalQuery, ...recentSearches.filter(s => s !== finalQuery)].slice(0, 5)
    setRecentSearches(newRecentSearches)
    if (typeof window !== 'undefined') {
      localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches))
    }

    // Navigate to search results
    router.push(`/buscar?q=${encodeURIComponent(finalQuery)}`)
    setIsOpen(false)
    setQuery('')
  }

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'professor') {
      router.push(`/profesor/${result.id}`)
    } else if (result.type === 'university') {
      router.push(`/institucion/${result.id}`)
    }
    setIsOpen(false)
    setQuery('')
  }

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    handleSearch(suggestion)
  }

  // Handle focus
  const handleFocus = () => {
    setIsOpen(true)
    updateDropdownPosition()
  }

  // Handle key navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
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
            onChange={handleInputChange}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            placeholder="Buscar profesores, universidades o materias..."
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
      {isOpen && (
        <DropdownPortal>
          <div className="bg-white border border-gray-200 rounded-xl shadow-2xl max-h-96 overflow-y-auto">
            {query.length >= 2 ? (
              // Search Results
              <>
                {loadingResults ? (
                  <div className="p-4 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-sm">Buscando...</p>
                  </div>
                ) : results.length > 0 ? (
                  <div className="p-2">
                    <div className="space-y-1">
                      {results.map((result) => (
                        <button
                          key={`${result.type}-${result.id}`}
                          onClick={() => handleResultClick(result)}
                          className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              {result.type === 'professor' && (
                                <UserIcon className="h-5 w-5 text-green-500" />
                              )}
                              {result.type === 'university' && (
                                <BuildingOfficeIcon className="h-5 w-5 text-blue-500" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-gray-900 truncate">{result.name}</div>
                                  <div className="text-sm text-gray-600 truncate">{result.subtitle}</div>
                                  {result.tags && result.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {result.tags.slice(0, 3).map((tag, index) => (
                                        <span
                                          key={index}
                                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center space-x-2 ml-3">
                                  {result.rating && result.rating > 0 && (
                                    <div className="flex items-center">
                                      <span className="text-xs font-medium text-yellow-600">
                                        {result.rating.toFixed(1)}
                                      </span>
                                      <StarIcon className="h-3 w-3 text-yellow-400 ml-1" />
                                    </div>
                                  )}
                                  <div className="text-xs text-gray-400 capitalize">
                                    {result.type === 'professor' ? 'Profesor' : 'Universidad'}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    <MagnifyingGlassIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-lg font-medium text-gray-700 mb-1">No se encontraron resultados para "{query}"</p>
                    <p className="text-sm text-gray-500 mb-4">¿No encuentras al profesor que buscas?</p>
                    <AddProfessorButton 
                      searchQuery={query}
                      size="md"
                      variant="primary"
                      className="mb-2"
                    />
                    <p className="text-xs text-gray-400 mt-3">También puedes intentar con términos diferentes</p>
                  </div>
                )}
              </>
            ) : (
              // Suggestions when no query
              <>
                {recentSearches.length > 0 && (
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-2 text-gray-500" />
                        <h4 className="text-sm font-medium text-gray-700">Búsquedas recientes</h4>
                      </div>
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
                          key={`recent-${index}`}
                          onClick={() => handleSuggestionClick(search)}
                          className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                          <span className="text-xs text-gray-400">•</span>
                          <div className="text-sm text-gray-700">{search}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Filters Section */}
            {showFilters && (
              <div className="border-t border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Filtros</h3>
                  <button
                    onClick={resetFilters}
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Limpiar filtros
                  </button>
                </div>
                
                {/* Universities Filter */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Universidades</label>
                  <div className="flex flex-wrap gap-2">
                    {universities.slice(0, 6).map((uni) => (
                      <button
                        key={uni.id}
                        onClick={() => toggleFilter('universities', uni.shortName)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          filters.universities.includes(uni.shortName)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {uni.shortName}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Departments Filter */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Departamentos</label>
                  <div className="flex flex-wrap gap-2">
                    {DEPARTMENTS.slice(0, 6).map((dept) => (
                      <button
                        key={dept}
                        onClick={() => toggleFilter('departments', dept)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          filters.departments.includes(dept)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {dept}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </DropdownPortal>
      )}
    </>
  )
}