'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { MagnifyingGlassIcon, AcademicCapIcon, BuildingOfficeIcon, ClockIcon, FireIcon } from '@heroicons/react/24/outline'

interface Professor {
  id: number
  name: string
  department: string
  institution: string
  rating: number
  totalRatings: number
}

interface Institution {
  id: number
  name: string
  location: string
  acronym: string
  professorCount?: number
}

interface SearchDropdownProps {
  placeholder?: string
  initialValue?: string
}

// Enhanced mock data with more realistic information
const mockProfessors: Professor[] = [
  { id: 1, name: 'Dr. Juan Pérez', department: 'Ingeniería de Software', institution: 'INTEC', rating: 4.8, totalRatings: 156 },
  { id: 2, name: 'Dra. María Rodríguez', department: 'Medicina', institution: 'UNPHU', rating: 4.6, totalRatings: 89 },
  { id: 3, name: 'Dr. Carlos Santos', department: 'Matemáticas', institution: 'UASD', rating: 4.5, totalRatings: 234 },
  { id: 4, name: 'Prof. Ana García', department: 'Física', institution: 'INTEC', rating: 4.2, totalRatings: 67 },
  { id: 5, name: 'Dr. Luis Martínez', department: 'Administración', institution: 'PUCMM', rating: 4.7, totalRatings: 123 },
  { id: 6, name: 'Dra. Carmen Jiménez', department: 'Derecho', institution: 'UASD', rating: 4.4, totalRatings: 98 },
  { id: 7, name: 'Prof. Roberto Silva', department: 'Arquitectura', institution: 'UNPHU', rating: 4.3, totalRatings: 76 },
  { id: 8, name: 'Dr. Fernando López', department: 'Psicología', institution: 'PUCMM', rating: 4.6, totalRatings: 145 }
]

const mockInstitutions: Institution[] = [
  { id: 1, name: 'Instituto Tecnológico de Santo Domingo', location: 'Santo Domingo', acronym: 'INTEC', professorCount: 342 },
  { id: 2, name: 'Pontificia Universidad Católica Madre y Maestra', location: 'Santiago', acronym: 'PUCMM', professorCount: 567 },
  { id: 3, name: 'Universidad Autónoma de Santo Domingo', location: 'Santo Domingo', acronym: 'UASD', professorCount: 891 },
  { id: 4, name: 'Universidad Nacional Pedro Henríquez Ureña', location: 'Santo Domingo', acronym: 'UNPHU', professorCount: 298 }
]

export default function SearchDropdown({ placeholder = "Buscar profesor o universidad...", initialValue = "" }: SearchDropdownProps) {
  const [searchTerm, setSearchTerm] = useState(initialValue)
  const [isOpen, setIsOpen] = useState(false)
  const [filteredProfessors, setFilteredProfessors] = useState<Professor[]>([])
  const [filteredInstitutions, setFilteredInstitutions] = useState<Institution[]>([])
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [popularSearches, setPopularSearches] = useState<string[]>([])
  const [loadingPopular, setLoadingPopular] = useState(true)
  
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('calificatuprofe-recent-searches')
      if (stored) {
        try {
          setRecentSearches(JSON.parse(stored))
        } catch (e) {
          console.error('Error parsing recent searches:', e)
        }
      }
    }
    
    // Fetch popular searches
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
      setPopularSearches(['Cálculo', 'Medicina', 'Ingeniería', 'Derecho', 'Administración'])
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
      // Optionally refresh popular searches after tracking
      fetchPopularSearches()
    } catch (error) {
      console.error('Error tracking search:', error)
    }
  }

  useEffect(() => {
    if (searchTerm.length >= 2) {
      const searchLower = searchTerm.toLowerCase()
      
      const professors = mockProfessors.filter(professor =>
        professor.name.toLowerCase().includes(searchLower) ||
        professor.department.toLowerCase().includes(searchLower) ||
        professor.institution.toLowerCase().includes(searchLower)
      ).sort((a, b) => b.totalRatings - a.totalRatings).slice(0, 6)
      
      const institutions = mockInstitutions.filter(institution =>
        institution.name.toLowerCase().includes(searchLower) ||
        institution.acronym.toLowerCase().includes(searchLower) ||
        institution.location.toLowerCase().includes(searchLower)
      ).slice(0, 4)
      
      setFilteredProfessors(professors)
      setFilteredInstitutions(institutions)
      setIsOpen(true)
    } else if (searchTerm.length === 0) {
      setFilteredProfessors([])
      setFilteredInstitutions([])
      setIsOpen(true) // Show suggestions when empty
    } else {
      setFilteredProfessors([])
      setFilteredInstitutions([])
      setIsOpen(false)
    }
  }, [searchTerm])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const addToRecentSearches = (query: string) => {
    if (!query.trim()) return
    
    // Track the search
    trackSearch(query.trim())
    
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('calificatuprofe-recent-searches', JSON.stringify(updated))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      addToRecentSearches(searchTerm.trim())
      router.push(`/profesores?search=${encodeURIComponent(searchTerm.trim())}`)
    } else {
      router.push('/profesores')
    }
    setIsOpen(false)
  }

  const handleProfessorClick = (professor: Professor) => {
    addToRecentSearches(professor.name)
    router.push(`/profesor/${professor.id}`)
    setIsOpen(false)
  }

  const handleInstitutionClick = (institution: Institution) => {
    addToRecentSearches(institution.acronym)
    router.push(`/institucion/${institution.id}`)
    setIsOpen(false)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion)
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const totalResults = filteredProfessors.length + filteredInstitutions.length

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || totalResults === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev < totalResults - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : totalResults - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0) {
          if (highlightedIndex < filteredProfessors.length) {
            handleProfessorClick(filteredProfessors[highlightedIndex])
          } else {
            const institutionIndex = highlightedIndex - filteredProfessors.length
            handleInstitutionClick(filteredInstitutions[institutionIndex])
          }
        } else {
          handleSubmit(e)
        }
        break
      case 'Escape':
        setIsOpen(false)
        inputRef.current?.blur()
        break
    }
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600'
    if (rating >= 3.5) return 'text-emerald-600'
    if (rating >= 2.5) return 'text-amber-600'
    return 'text-red-600'
  }

  const highlightMatch = (text: string, searchTerm: string) => {
    if (!searchTerm) return text
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'))
    return parts.map((part, index) => 
      part.toLowerCase() === searchTerm.toLowerCase() ? 
        <mark key={index} className="bg-blue-100 text-blue-900">{part}</mark> : part
    )
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={dropdownRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="w-full pl-12 pr-12 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Buscar
          </button>
        </div>
      </form>

      {/* Enhanced Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
          {searchTerm.length >= 2 && (filteredProfessors.length > 0 || filteredInstitutions.length > 0) ? (
            <div className="p-2">
              {/* Professors Section */}
              {filteredProfessors.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center px-3 py-2 text-sm font-semibold text-gray-700">
                    <AcademicCapIcon className="h-4 w-4 mr-2" />
                    Profesores
                  </div>
                  {filteredProfessors.map((professor, index) => (
                    <button
                      key={professor.id}
                      onClick={() => handleProfessorClick(professor)}
                      className={`w-full text-left px-3 py-3 rounded-md hover:bg-gray-50 transition-colors ${
                        index === highlightedIndex ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">
                            {highlightMatch(professor.name, searchTerm)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {highlightMatch(professor.department, searchTerm)} • {professor.institution}
                          </div>
                          <div className="text-xs text-gray-500">
                            {professor.totalRatings} calificaciones
                          </div>
                        </div>
                        <div className={`text-sm font-bold ${getRatingColor(professor.rating)}`}>
                          {professor.rating.toFixed(1)}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Institutions Section */}
              {filteredInstitutions.length > 0 && (
                <div>
                  <div className="flex items-center px-3 py-2 text-sm font-semibold text-gray-700">
                    <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                    Universidades
                  </div>
                  {filteredInstitutions.map((institution, index) => (
                    <button
                      key={institution.id}
                      onClick={() => handleInstitutionClick(institution)}
                      className={`w-full text-left px-3 py-3 rounded-md hover:bg-gray-50 transition-colors ${
                        index + filteredProfessors.length === highlightedIndex ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                    >
                      <div className="font-semibold text-gray-900">
                        {highlightMatch(institution.acronym, searchTerm)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {highlightMatch(institution.name, searchTerm)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {institution.location} • {institution.professorCount} profesores
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : searchTerm.length < 2 ? (
            <div className="p-4">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center px-2 py-2 text-sm font-semibold text-gray-700">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    Búsquedas recientes
                  </div>
                  {recentSearches.slice(0, 3).map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(search)}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <div className="text-sm text-gray-700">{search}</div>
                    </button>
                  ))}
                </div>
              )}

              {/* Popular Searches */}
              <div>
                <div className="flex items-center justify-between px-2 py-2 text-sm font-semibold text-gray-700">
                  <div className="flex items-center">
                    <FireIcon className="h-4 w-4 mr-2" />
                    Búsquedas populares
                  </div>
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
                  <div className="space-y-2 px-3">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                ) : popularSearches.length > 0 ? (
                  popularSearches.slice(0, 5).map((search, index) => (
                    <button
                      key={`${search}-${index}`}
                      onClick={() => handleSuggestionClick(search)}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <span className="text-xs">🔥</span>
                      <div className="text-sm text-gray-700">{search}</div>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500 italic">
                    No hay búsquedas populares disponibles
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              <p>No se encontraron resultados para "{searchTerm}"</p>
              <p className="text-sm mt-1">Intenta con términos diferentes</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 