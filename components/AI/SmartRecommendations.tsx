'use client'

import { useState, useEffect } from 'react'
import { StarIcon, AcademicCapIcon, ClockIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline'
import { SparklesIcon } from '@heroicons/react/24/solid'

interface Professor {
  id: string
  name: string
  department: string
  university: string
  rating: number
  difficulty: number
  tags: string[]
  totalReviews: number
}

interface SmartRecommendation {
  professor: Professor
  reason: string
  confidence: number
  matchingCriteria: string[]
}

interface SmartRecommendationsProps {
  userPreferences?: {
    preferredDifficulty?: number
    preferredRating?: number
    departments?: string[]
    universities?: string[]
    tags?: string[]
  }
  currentProfessor?: Professor
}

export default function SmartRecommendations({ 
  userPreferences = {},
  currentProfessor 
}: SmartRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showDetails, setShowDetails] = useState<string | null>(null)

  // Simulated AI recommendation algorithm
  const generateRecommendations = () => {
    const mockProfessors: Professor[] = [
      {
        id: '1',
        name: 'Dr. María García',
        department: 'Matemáticas',
        university: 'UASD',
        rating: 4.8,
        difficulty: 3.2,
        tags: ['Explicación Clara', 'Ayuda Extra', 'Exámenes Justos'],
        totalReviews: 127
      },
      {
        id: '2',
        name: 'Prof. Carlos Herrera',
        department: 'Ingeniería',
        university: 'INTEC',
        rating: 4.6,
        difficulty: 3.8,
        tags: ['Proyecto Prácticos', 'Exigente pero Justo', 'Industria'],
        totalReviews: 89
      },
      {
        id: '3',
        name: 'Dra. Ana Rodríguez',
        department: 'Medicina',
        university: 'PUCMM',
        rating: 4.9,
        difficulty: 4.1,
        tags: ['Muy Preparada', 'Retroalimentación', 'Clínica'],
        totalReviews: 156
      }
    ]

    // Simple AI-like scoring algorithm
    const scoredRecommendations: SmartRecommendation[] = mockProfessors.map(professor => {
      let score = 0
      let reasons: string[] = []
      let matchingCriteria: string[] = []

      // Rating preference matching
      if (userPreferences.preferredRating) {
        const ratingDiff = Math.abs(professor.rating - userPreferences.preferredRating)
        if (ratingDiff < 0.5) {
          score += 30
          reasons.push(`Calificación excelente (${professor.rating}/5)`)
          matchingCriteria.push('Alta calificación')
        }
      }

      // Difficulty preference matching
      if (userPreferences.preferredDifficulty) {
        const difficultyDiff = Math.abs(professor.difficulty - userPreferences.preferredDifficulty)
        if (difficultyDiff < 0.8) {
          score += 25
          reasons.push(`Nivel de dificultad ideal (${professor.difficulty}/5)`)
          matchingCriteria.push('Dificultad apropiada')
        }
      }

      // Department matching
      if (userPreferences.departments?.includes(professor.department)) {
        score += 20
        reasons.push(`Experto en ${professor.department}`)
        matchingCriteria.push('Departamento de interés')
      }

      // University matching
      if (userPreferences.universities?.includes(professor.university)) {
        score += 15
        reasons.push(`Profesor en ${professor.university}`)
        matchingCriteria.push('Universidad preferida')
      }

      // Tag matching
      const matchingTags = professor.tags.filter(tag => 
        userPreferences.tags?.includes(tag)
      )
      if (matchingTags.length > 0) {
        score += matchingTags.length * 10
        reasons.push(`Fortalezas: ${matchingTags.join(', ')}`)
        matchingCriteria.push(...matchingTags)
      }

      // Base quality score
      score += professor.rating * 5 + (professor.totalReviews > 50 ? 10 : 0)

      const confidence = Math.min(Math.max(score / 100, 0), 1)
      const primaryReason = reasons[0] || 'Profesor bien valorado por estudiantes'

      return {
        professor,
        reason: primaryReason,
        confidence,
        matchingCriteria
      }
    })

    // Sort by confidence and take top 3
    return scoredRecommendations
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3)
  }

  useEffect(() => {
    setIsLoading(true)
    // Simulate AI processing time
    const timer = setTimeout(() => {
      const recs = generateRecommendations()
      setRecommendations(recs)
      setIsLoading(false)
    }, 1200)

    return () => clearTimeout(timer)
  }, [userPreferences, currentProfessor])

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 0.8) return 'text-green-600 bg-green-50'
    if (confidence > 0.6) return 'text-yellow-600 bg-yellow-50'
    return 'text-gray-600 bg-gray-50'
  }

  const getConfidenceText = (confidence: number) => {
    if (confidence > 0.8) return 'Muy recomendado'
    if (confidence > 0.6) return 'Recomendado'
    return 'Buena opción'
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <SparklesIcon className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900">Recomendaciones Inteligentes</h3>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <SparklesIcon className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-900">Recomendaciones Inteligentes</h3>
        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
          IA
        </span>
      </div>

      {recommendations.length === 0 ? (
        <div className="text-center py-8">
          <AcademicCapIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No hay recomendaciones disponibles en este momento.</p>
          <p className="text-sm text-gray-500 mt-2">
            Interactúa más con la plataforma para obtener mejores recomendaciones.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div
              key={rec.professor.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
              onClick={() => setShowDetails(showDetails === rec.professor.id ? null : rec.professor.id)}
            >
              {/* Professor Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{rec.professor.name}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConfidenceColor(rec.confidence)}`}>
                      {getConfidenceText(rec.confidence)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {rec.professor.department} • {rec.professor.university}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{rec.professor.rating}</span>
                  </div>
                  <p className="text-xs text-gray-500">{rec.professor.totalReviews} reseñas</p>
                </div>
              </div>

              {/* AI Reason */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                <div className="flex items-start space-x-2">
                  <ArrowTrendingUpIcon className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-800">{rec.reason}</p>
                </div>
              </div>

              {/* Matching Criteria */}
              {rec.matchingCriteria.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {rec.matchingCriteria.map((criteria, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {criteria}
                    </span>
                  ))}
                </div>
              )}

              {/* Detailed View */}
              {showDetails === rec.professor.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Dificultad</p>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-orange-400 h-2 rounded-full"
                            style={{ width: `${(rec.professor.difficulty / 5) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{rec.professor.difficulty}/5</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Confianza IA</p>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${rec.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{Math.round(rec.confidence * 100)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {rec.professor.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* AI Disclaimer */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          <ClockIcon className="h-3 w-3 inline mr-1" />
          Recomendaciones generadas por IA basadas en tus preferencias y patrones de la comunidad.
          Los resultados mejoran con más interacciones.
        </p>
      </div>
    </div>
  )
} 