'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { institutions } from '@/data/institutions'

interface SearchResult {
  id: string
  name: string
  type: 'institution' | 'professor'
  shortName?: string
  department?: string
}

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    // Filter institutions
    const filteredInstitutions = institutions
      .filter(inst => 
        inst.name.toLowerCase().includes(query.toLowerCase()) ||
        (inst.shortName && inst.shortName.toLowerCase().includes(query.toLowerCase()))
      )
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(inst => ({
        id: inst.id,
        name: inst.name,
        shortName: inst.shortName,
        type: 'institution' as const
      }))

    // TODO: Add professor filtering when the backend is ready
    setResults(filteredInstitutions)
  }, [query])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(query)}`)
      setShowResults(false)
    }
  }

  return (
    <div ref={searchRef} className="relative max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setShowResults(true)
            }}
            onFocus={() => setShowResults(true)}
            placeholder="Buscar profesor o institución..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Buscar
          </button>
        </div>
      </form>

      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-96 overflow-auto">
          {results.map((result) => (
            <Link
              key={`${result.type}-${result.id}`}
              href={result.type === 'institution' ? `/institucion/${result.id}` : `/profesor/${result.id}`}
              onClick={() => setShowResults(false)}
              className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{result.name}</h3>
                  {result.shortName && (
                    <p className="text-sm text-gray-500">{result.shortName}</p>
                  )}
                  {result.department && (
                    <p className="text-sm text-gray-500">{result.department}</p>
                  )}
                </div>
                <span className="text-xs text-gray-500 capitalize">
                  {result.type === 'institution' ? 'Institución' : 'Profesor'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
} 