'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Link from 'next/link'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface Professor {
  id: string
  name: string
  department: string
  institution: string
  averageRating: number
}

function SearchPageContent() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams?.get('q') ?? ''
  const [professors, setProfessors] = useState<Professor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const searchProfessors = async () => {
      if (!searchQuery) return

      setLoading(true)
      try {
        // This is a simple search. In a production app, you'd want to use
        // a more sophisticated search solution like Algolia or Elasticsearch
        const q = query(
          collection(db, 'professors'),
          where('name', '>=', searchQuery),
          where('name', '<=', searchQuery + '\uf8ff')
        )
        const querySnapshot = await getDocs(q)
        const professorsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Professor))
        setProfessors(professorsData)
      } catch (error) {
        console.error('Error searching professors:', error)
      } finally {
        setLoading(false)
      }
    }

    searchProfessors()
  }, [searchQuery])

  if (!searchQuery) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <h1 className="text-2xl font-semibold mb-4">No search query provided</h1>
        <p>Please enter a search term to find professors.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <h1 className="text-2xl font-semibold mb-4">
          Searching for "{searchQuery}"...
        </h1>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-24 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-semibold mb-4">
        Search Results for "{searchQuery}"
      </h1>
      {professors.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-6">
            <MagnifyingGlassIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron profesores</h3>
            <p className="text-gray-500 mb-6">No encontramos profesores que coincidan con "{searchQuery}"</p>
          </div>
          <div className="space-y-4">
            <Link
              href="/agregar-profesor"
              className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Agregar Profesor
            </Link>
            <p className="text-sm text-gray-500">
              ¿Conoces a este profesor? ¡Ayuda a otros estudiantes agregándolo!
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {professors.map((professor) => (
            <Link
              key={professor.id}
              href={`/profesor/${professor.id}`}
              className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{professor.name}</h2>
                  <p className="text-gray-600">{professor.department}</p>
                  <p className="text-gray-500">{professor.institution}</p>
                </div>
                <div className="flex items-center">
                  <span className="text-yellow-400 text-2xl">★</span>
                  <span className="ml-1 text-xl">
                    {professor.averageRating.toFixed(1)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      {professors.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-gray-500 mb-6">¿No encuentras al profesor que buscas?</p>
          <Link
            href="/agregar-profesor"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Agregar Profesor
          </Link>
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  )
} 