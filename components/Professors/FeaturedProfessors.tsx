'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Star } from 'lucide-react'

interface Professor {
  id: string
  name: string
  department: string
  university: string
  rating: number
  totalReviews: number
  tags: string[]
}

export default function FeaturedProfessors() {
  const [professors, setProfessors] = useState<Professor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedProfessors = async () => {
      try {
        const response = await fetch('/api/professors/featured')
        if (response.ok) {
          const data = await response.json()
          setProfessors(data)
        }
      } catch (error) {
        console.error('Error fetching featured professors:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProfessors()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="flex gap-2">
              <div className="h-6 bg-gray-200 rounded w-20"></div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {professors.map((professor) => (
        <Link key={professor.id} href={`/profesor/${professor.id}`} className="group">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-6">
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {professor.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {professor.university} • {professor.department}
              </p>
              <div className="flex items-center mt-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(professor.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm font-medium text-gray-600">
                  {professor.rating.toFixed(1)}
                </span>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-sm text-gray-600">
                  {professor.totalReviews} calificaciones
                </span>
              </div>
              {professor.tags && professor.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {professor.tags.slice(0, 2).map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}