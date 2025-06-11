'use client'

import Link from 'next/link'
import { Star } from 'lucide-react'

interface Professor {
  id: string
  name: string
  institution: string
  department: string
  rating: number
  totalRatings: number
  imageUrl: string
}

const featuredProfessors: Professor[] = [
  {
    id: '1',
    name: 'Dr. Juan Pérez',
    department: 'Ingeniería',
    institution: 'INTEC',
    rating: 4.5,
    totalRatings: 25,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: '2',
    name: 'Prof. María García',
    department: 'Medicina',
    institution: 'UNPHU',
    rating: 4.2,
    totalRatings: 18,
    imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: '3',
    name: 'Dr. Carlos Rodríguez',
    department: 'Derecho',
    institution: 'UASD',
    rating: 4.8,
    totalRatings: 32,
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  },
]

export default function FeaturedProfessors() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {featuredProfessors.map((professor) => (
        <Link
          key={professor.id}
          href={`/profesores/${professor.id}`}
          className="group hover-lift"
        >
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-shadow hover:shadow-md">
            <div className="aspect-[3/2] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold text-2xl">
                    {professor.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {professor.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {professor.institution} • {professor.department}
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
                  {professor.totalRatings} calificaciones
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
} 