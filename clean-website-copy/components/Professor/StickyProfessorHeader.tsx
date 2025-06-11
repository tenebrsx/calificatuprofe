'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BookmarkIcon, ShareIcon } from '@heroicons/react/24/outline'
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid'

interface StickyProfessorHeaderProps {
  professor: {
    id: string
    name: string
    department: string
    institution: string
    averageRating: number
  }
  isVisible: boolean
}

export default function StickyProfessorHeader({ professor, isVisible }: StickyProfessorHeaderProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)

  const getRatingColor = (rating: number) => {
    if (rating >= 4.0) return 'bg-rating-excellent'
    if (rating >= 3.0) return 'bg-rating-average'
    return 'bg-rating-poor'
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${professor.name} - CalificaTuProfe`,
        text: `Calificaciones de ${professor.name} en ${professor.institution}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      // You could add a toast notification here
    }
  }

  return (
    <div 
      className={`fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-50 transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Professor Info */}
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg ${getRatingColor(professor.averageRating)} flex items-center justify-center`}>
              <span className="text-lg font-bold text-white metric-number">
                {professor.averageRating.toFixed(1)}
              </span>
            </div>
            <div>
              <h2 className="font-heading font-semibold text-gray-900 text-lg">
                {professor.name}
              </h2>
              <p className="text-sm text-gray-600">
                {professor.department} • {professor.institution}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Bookmark Button */}
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              {isBookmarked ? (
                <BookmarkSolidIcon className="h-4 w-4 text-primary" />
              ) : (
                <BookmarkIcon className="h-4 w-4 text-gray-500" />
              )}
              <span className="text-sm font-medium text-gray-700">
                {isBookmarked ? 'Guardado' : 'Guardar'}
              </span>
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <ShareIcon className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Compartir</span>
            </button>

            {/* Compare Button */}
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Comparar
            </button>

            {/* Rate Button */}
            <Link
              href={`/profesor/${professor.id}/calificar`}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Calificar
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 