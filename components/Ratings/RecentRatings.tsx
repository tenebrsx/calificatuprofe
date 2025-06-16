'use client'

import Link from 'next/link'
import { ThumbsUp, ThumbsDown } from 'lucide-react'

interface Rating {
  id: string
  professorId: string
  professorName: string
  institution: string
  course: string
  rating: number
  comment: string
  likes: number
  dislikes: number
  date: string
}

const mockRatings: Rating[] = [
  {
    id: '1',
    professorId: '1',
    professorName: 'Dr. Juan Pérez',
    institution: 'INTEC',
    course: 'Programación Avanzada',
    rating: 5,
    comment: 'Excelente profesor, explica muy bien y siempre está dispuesto a ayudar. Sus clases son muy dinámicas y se aprende mucho.',
    likes: 24,
    dislikes: 2,
    date: '2024-03-01',
  },
  {
    id: '2',
    professorId: '2',
    professorName: 'Dra. María Rodríguez',
    institution: 'PUCMM',
    course: 'Estructuras de Datos',
    rating: 4,
    comment: 'Buena profesora, aunque a veces va un poco rápido con los temas. Los proyectos son desafiantes pero se aprende mucho.',
    likes: 18,
    dislikes: 3,
    date: '2024-02-28',
  },
  {
    id: '3',
    professorId: '3',
    professorName: 'Dr. Carlos Santos',
    institution: 'UASD',
    course: 'Cálculo Diferencial',
    rating: 4,
    comment: 'Muy buen profesor, explica con paciencia y da buenos ejemplos. Las evaluaciones son justas.',
    likes: 32,
    dislikes: 4,
    date: '2024-02-27',
  },
]

export default function RecentRatings() {
  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'bg-green-500'
    if (rating >= 3.5) return 'bg-emerald-500'
    if (rating >= 2.5) return 'bg-amber-500'
    return 'bg-red-500'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('es-DO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  }

  return (
    <div className="space-y-6">
      {mockRatings.map((rating) => (
        <div
          key={rating.id}
          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div>
              <Link
                href={`/profesores/${rating.professorId}`}
                className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
              >
                {rating.professorName}
              </Link>
              <p className="text-sm text-gray-600 mt-1">
                {rating.institution} • {rating.course}
              </p>
            </div>
            <span
              className={`${getRatingColor(
                rating.rating
              )} text-white font-bold px-3 py-1 rounded-md`}
            >
              {rating.rating.toFixed(1)}
            </span>
          </div>
          <p className="text-gray-700 mt-3">{rating.comment}</p>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
                <ThumbsUp className="w-4 h-4" />
                <span className="text-sm">{rating.likes}</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
                <ThumbsDown className="w-4 h-4" />
                <span className="text-sm">{rating.dislikes}</span>
              </button>
            </div>
            <span className="text-sm text-gray-500">
              {formatDate(rating.date)}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
} 