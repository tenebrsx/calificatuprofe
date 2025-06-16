'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { HandThumbUpIcon, HandThumbDownIcon, FlagIcon } from '@heroicons/react/24/outline'
import StickyProfessorHeader from '@/components/Professor/StickyProfessorHeader'
import RatingForm from '@/components/Rating/RatingForm'
import AddSubjectPrompt from '@/components/AddSubjectPrompt'

interface Professor {
  id: string
  name: string
  department: string
  institution: string
  averageRating: number
  totalRatings: number
  difficultyRating: number
  wouldTakeAgainPercent: number
  tags: string[]
  subjects?: string[] // Specific subjects/courses the professor teaches
}

interface Rating {
  id: string
  userId: string
  userName: string
  courseName: string
  semester: string
  rating: number
  difficulty: number
  wouldTakeAgain: boolean
  comment: string
  createdAt: Date
  likes: number
  dislikes: number
  grade: string
  attendance: string
  textbook: string
  tags: string[]
}

const getRatingColor = (rating: number, totalReviews: number = 0) => {
  if (totalReviews === 0) return 'bg-gray-500 text-white'  // Grey for no reviews
  if (rating >= 0 && rating <= 2.9) return 'bg-red-500 text-white'  // Red for 0-2.9
  if (rating >= 3.0 && rating <= 4.0) return 'bg-yellow-500 text-gray-900'  // Yellow for 3.0-4.0
  if (rating >= 4.1) return 'bg-green-500 text-white'  // Green for 4.1+
  return 'bg-yellow-500 text-gray-900'  // Default fallback
}

const getRatingBgColor = (rating: number, totalReviews: number = 0) => {
  if (totalReviews === 0) return 'bg-gray-500 text-white'  // Grey for no reviews
  if (rating >= 0 && rating <= 2.9) return 'bg-red-500 text-white'  // Red for 0-2.9
  if (rating >= 3.0 && rating <= 4.0) return 'bg-yellow-500 text-gray-900'  // Yellow for 3.0-4.0
  if (rating >= 4.1) return 'bg-green-500 text-white'  // Green for 4.1+
  return 'bg-yellow-500 text-gray-900'  // Default fallback
}

export default function ProfessorPage() {
  const params = useParams()
  const professorId = params?.id as string
  const { data: session } = useSession()
  const [professor, setProfessor] = useState<Professor | null>(null)
  const [ratings, setRatings] = useState<Rating[]>([])
  const [loading, setLoading] = useState(true)
  const [showStickyHeader, setShowStickyHeader] = useState(false)
  const [showRatingForm, setShowRatingForm] = useState(false)

  // Handle scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero-section')
      if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight
        setShowStickyHeader(window.scrollY > heroBottom - 100)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Mock data with updated color scheme
    const mockProfessor = {
      id: professorId,
      name: 'Dr. Juan Pérez',
      department: 'Ingeniería',
      institution: 'INTEC',
      averageRating: 4.5,
      totalRatings: 25,
      difficultyRating: 3.8,
      wouldTakeAgainPercent: 85,
      tags: [
        'CLARO AL EXPLICAR',
        'EXÁMENES JUSTOS',
        'INSPIRADOR',
        'DISPONIBLE PARA AYUDAR',
        'TAREAS ÚTILES',
        'PARTICIPA EN CLASE',
        'CALIFICACIÓN ESTRICTA'
      ]
    }

    const mockRatings = [
      {
        id: '1',
        userId: '123',
        userName: 'Estudiante Anónimo',
        courseName: 'Cálculo I',
        semester: 'Enero-Mayo 2024',
        rating: 5,
        difficulty: 4,
        wouldTakeAgain: true,
        comment: 'Excelente profesor que realmente se preocupa por el aprendizaje de sus estudiantes. Sus explicaciones son claras y detalladas, y siempre está disponible durante las horas de oficina para ayudar con dudas. Los exámenes son desafiantes pero justos, y reflejan bien el material cubierto en clase. Aunque el curso es exigente, el profesor hace que valga la pena el esfuerzo.',
        createdAt: new Date('2024-01-15'),
        likes: 12,
        dislikes: 1,
        grade: 'A',
        attendance: 'Obligatoria',
        textbook: 'Sí',
        tags: ['CLARO AL EXPLICAR', 'DISPONIBLE PARA AYUDAR', 'EXÁMENES JUSTOS']
      },
      {
        id: '2',
        userId: '456',
        userName: 'Estudiante Anónimo',
        courseName: 'Física I',
        semester: 'Mayo-Agosto 2023',
        rating: 4,
        difficulty: 3,
        wouldTakeAgain: true,
        comment: 'Un profesor muy competente que hace que temas complejos sean comprensibles. Sus clases son interactivas y usa muchos ejemplos prácticos. A veces va un poco rápido con el material, pero si le pides que explique algo de nuevo, siempre está dispuesto a hacerlo. Las tareas son relevantes y ayudan a reforzar los conceptos aprendidos en clase.',
        createdAt: new Date('2023-12-20'),
        likes: 8,
        dislikes: 2,
        grade: 'B',
        attendance: 'Opcional',
        textbook: 'Sí',
        tags: ['INSPIRADOR', 'TAREAS ÚTILES']
      },
      {
        id: '3',
        userId: '789',
        userName: 'Estudiante Anónimo',
        courseName: 'Cálculo II',
        semester: 'Agosto-Diciembre 2023',
        rating: 5,
        difficulty: 4,
        wouldTakeAgain: true,
        comment: 'Uno de los mejores profesores que he tenido. Su pasión por la materia es contagiosa y tiene una habilidad única para explicar conceptos complejos de manera que todos puedan entender. Las tareas son desafiantes pero muy útiles para el aprendizaje. Sus exámenes son justos y bien estructurados. Definitivamente recomiendo tomar clases con él.',
        createdAt: new Date('2023-11-15'),
        likes: 15,
        dislikes: 0,
        grade: 'A',
        attendance: 'Obligatoria',
        textbook: 'Sí',
        tags: ['CLARO AL EXPLICAR', 'INSPIRADOR', 'EXÁMENES JUSTOS']
      }
    ]

    const fetchProfessor = async () => {
      try {
        // Fetch professor from our mock API
        const response = await fetch('/api/professors/mock')
        if (response.ok) {
          const data = await response.json()
          const foundProfessor = data.results.find((prof: any) => prof.id === professorId)
          
          if (foundProfessor) {
            // Transform to match expected format
            const professorData = {
              id: foundProfessor.id,
              name: foundProfessor.name,
              department: foundProfessor.department,
              institution: foundProfessor.university,
              averageRating: foundProfessor.averageRating,
              totalRatings: foundProfessor.totalReviews,
              difficultyRating: foundProfessor.averageDifficulty,
              wouldTakeAgainPercent: foundProfessor.wouldTakeAgainPercent,
              tags: foundProfessor.topTags.length > 0 ? foundProfessor.topTags : [
                'CLARO AL EXPLICAR',
                'EXÁMENES JUSTOS',
                'INSPIRADOR',
                'DISPONIBLE PARA AYUDAR',
                'TAREAS ÚTILES',
                'PARTICIPA EN CLASE',
                'CALIFICACIÓN ESTRICTA'
              ]
            }
            setProfessor(professorData)
          } else {
            // Use mock professor for demo
            setProfessor(mockProfessor)
          }
        } else {
          // Use mock professor for demo
          setProfessor(mockProfessor)
        }
      } catch (error) {
        console.error('Error fetching professor:', error)
        // Use mock professor for demo
        setProfessor(mockProfessor)
      }
    }

    fetchProfessor()
    
    setTimeout(() => {
      // Only set mock ratings if professor has reviews (totalRatings > 0)
      // Otherwise show no reviews
      if (professor && professor.totalRatings > 0) {
        setRatings(mockRatings)
      } else {
        setRatings([])
      }
      setLoading(false)
    }, 1500)
  }, [professorId])

  const handleLike = async (ratingId: string) => {
    setRatings(prev => prev.map(rating => 
      rating.id === ratingId 
        ? { ...rating, likes: rating.likes + 1 }
        : rating
    ))
  }

  const handleDislike = async (ratingId: string) => {
    setRatings(prev => prev.map(rating => 
      rating.id === ratingId 
        ? { ...rating, dislikes: rating.dislikes + 1 }
        : rating
    ))
  }

  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0] // [1, 2, 3, 4, 5]
    ratings.forEach(rating => {
      distribution[Math.floor(rating.rating) - 1]++
    })
    // Return in reverse order to match display order (5 to 1)
    return distribution.reverse()
  }

  const getDistributionPercentage = (count: number) => {
    const total = ratings.length
    return total > 0 ? Math.round((count / total) * 100) : 0
  }

  const handleRatingSubmit = (ratingData: any) => {
    // Add the new rating to the list
    const newRating: Rating = {
      id: Date.now().toString(),
      userId: 'user123',
      userName: 'Usuario Actual',
      courseName: ratingData.course,
      semester: `${ratingData.semester} ${ratingData.year}`,
      rating: ratingData.overallRating,
      difficulty: ratingData.difficulty,
      wouldTakeAgain: ratingData.overallRating >= 3.5, // Auto-calculate based on rating
      comment: ratingData.review,
      createdAt: new Date(),
      likes: 0,
      dislikes: 0,
      grade: ratingData.grade || 'No especificado',
      attendance: ratingData.attendance ? 'Obligatoria' : 'No obligatoria',
      textbook: ratingData.textbook ? 'Sí' : 'No',
      tags: ratingData.tags
    }

    setRatings(prev => [newRating, ...prev])
    setShowRatingForm(false)

    // Update professor stats (simplified calculation)
    if (professor) {
      const newTotal = professor.totalRatings + 1
      const newAverage = ((professor.averageRating * professor.totalRatings) + ratingData.overallRating) / newTotal
      
      setProfessor(prev => prev ? {
        ...prev,
        averageRating: newAverage,
        totalRatings: newTotal
      } : null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-40 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!professor) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">Profesor no encontrado</h1>
          <Link href="/" className="text-blue-600 hover:underline">
          Volver al inicio
        </Link>
        </div>
      </div>
    )
  }

  const distribution = getRatingDistribution()
  const maxCount = Math.max(...distribution)

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Header */}
      <StickyProfessorHeader 
        professor={professor} 
        isVisible={showStickyHeader} 
      />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header with Rating */}
        <div id="hero-section" className="mb-12">
          <div className="flex items-start gap-12 mb-8">
            {/* Large Rating Display */}
            <div className="flex flex-col items-center">
              <div className={`w-36 h-36 rounded-2xl ${getRatingColor(professor.averageRating, professor.totalRatings)} flex flex-col items-center justify-center mb-3 shadow-lg`}>
                <span className="text-6xl font-bold text-white mb-1 font-heading metric-number">
                {professor.averageRating.toFixed(1)}
              </span>
                <span className="text-sm text-white/90">/ 5.0</span>
              </div>
              <p className="text-sm text-gray-500 text-center">
                Calificación general<br />
                basada en <span className="font-semibold text-gray-900 metric-number">{professor.totalRatings} calificaciones</span>
              </p>
            </div>

            {/* Professor Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-3 font-heading">{professor.name}</h1>
              <p className="text-xl text-gray-600 mb-2">
                Profesor en el departamento de <strong>{professor.department}</strong>
              </p>
              <Link href={`/institucion/${professor.institution.toLowerCase()}`} className="text-gray-700 hover:text-gray-900 underline font-semibold text-lg">
                {professor.institution}
              </Link>
            </div>
          </div>

          {/* Add Subject Prompt - Show only when professor has very general department but no specific subjects */}
          {(() => {
            // List of very general departments that need specific subjects
            const generalDepartments = [
              'Ingeniería', 
              'Medicina', 
              'Administración', 
              'Administración de Empresas',
              'Derecho', 
              'Educación', 
              'Psicología',
              'Economía',
              'Ciencias',
              'Humanidades',
              'Arte'
            ]
            
            // Only show if professor has a general department AND no specific subjects
            const hasGeneralDepartment = generalDepartments.includes(professor.department)
            const hasNoSpecificSubjects = !professor.subjects || professor.subjects.length === 0
            
            return hasGeneralDepartment && hasNoSpecificSubjects
          })() && (
            <AddSubjectPrompt 
              professorId={professor.id}
              professorName={professor.name}
              onSubjectAdded={(subject) => {
                // Optionally update the professor's subjects locally
                setProfessor(prev => prev ? {
                  ...prev,
                  subjects: [...(prev.subjects || []), subject]
                } : null)
              }}
            />
          )} 
          {/* Key Stats Grid - Mobile: horizontal and compact, Desktop: 3 columns */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 p-4 md:p-8 bg-gray-50 rounded-2xl mb-8 shadow-sm">
            <div className="text-center">
              <div className="text-2xl md:text-5xl font-bold text-gray-900 mb-1 md:mb-2 metric-number">{professor.wouldTakeAgainPercent}%</div>
              <p className="text-xs md:text-lg text-gray-600">Tomaría de nuevo</p>
            </div>
            <div className="text-center border-x border-gray-200">
              <div className="text-2xl md:text-5xl font-bold text-gray-900 mb-1 md:mb-2 metric-number">{professor.difficultyRating.toFixed(1)}</div>
              <p className="text-xs md:text-lg text-gray-600">Nivel de dificultad</p>
            </div>
            <div className="text-center">
              <div className={`text-2xl md:text-5xl font-bold mb-1 md:mb-2 font-heading ${
                professor.totalRatings === 0 ? 'text-gray-600' :
                professor.averageRating >= 4.1 ? 'text-green-600' :
                professor.averageRating >= 3.0 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {professor.totalRatings === 0 ? 'Sin reseñas' :
                 professor.averageRating >= 4.1 ? 'Excelente' :
                 professor.averageRating >= 3.0 ? 'Bueno' :
                 'Regular'}
              </div>
              <p className="text-xs md:text-lg text-gray-600">Recomendación general</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
        {session ? (
          <button
            onClick={() => setShowRatingForm(true)}
                className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex-1 text-center text-lg shadow-sm hover:shadow-md"
          >
                Calificar Profesor
          </button>
        ) : (
          <Link
            href="/auth/signin"
                className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex-1 text-center text-lg shadow-sm hover:shadow-md"
          >
                Iniciar sesión para calificar
          </Link>
        )}
            <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium min-w-[200px] text-lg">
              Comparar
            </button>
          </div>
        </div>

        {/* Mobile: Reviews first, then sidebar content. Desktop: Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Desktop Left Column - Rating Distribution and Tags (hidden on mobile) */}
          <div className="hidden lg:block lg:col-span-1 space-y-6">
            {/* Rating Distribution */}
            <div className="bg-gray-50 p-8 rounded-2xl shadow-sm mb-12">
              <h3 className="text-xl text-gray-700 mb-6">Distribución de calificaciones</h3>
              <div className="space-y-4">
                {['Excelente (5)', 'Muy bueno (4)', 'Bueno (3)', 'Regular (2)', 'Deficiente (1)'].map((label, index) => {
                  const count = distribution[index]
                  const percentage = getDistributionPercentage(count)
                  const barColor = index === 0 ? 'bg-green-500' :
                                  index === 1 ? 'bg-green-400' :
                                  index === 2 ? 'bg-yellow-500' :
                                  index === 3 ? 'bg-orange-500' :
                                  'bg-red-500'
                  return (
                    <div key={label} className="flex items-center gap-4">
                      <span className="text-sm font-medium text-gray-700 w-28">{label}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                        <div
                          className={`h-full ${barColor} transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700 w-16 text-right">{percentage}%</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Top Tags */}
            <div className="mb-12">
              <h3 className="text-xl text-gray-700 mb-6">Etiquetas más frecuentes</h3>
              <div className="flex flex-wrap gap-2">
                {professor.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium hover:bg-yellow-200 transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Similar Professors */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Profesores similares</h3>
              <div className="space-y-3">
                {professor && [
                  { name: `Dr. ${professor.department === 'Arquitectura' ? 'Pedro García' : 'María Santos'}`, rating: 4.8, department: professor.department, id: professor.id === '1' ? '2' : '1' },
                  { name: `Prof. ${professor.department === 'Arquitectura' ? 'Diana Nicodemo' : 'Carlos López'}`, rating: 4.6, department: professor.department, id: professor.id === '2' ? '3' : '2' },
                  { name: `Dra. ${professor.department === 'Arquitectura' ? 'Angela Soto' : 'Ana Méndez'}`, rating: 4.5, department: professor.department, id: professor.id === '3' ? '4' : '3' }
                ].map((similarProf) => (
                  <Link
                    key={similarProf.id}
                    href={`/profesor/${similarProf.id}`}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{similarProf.name}</p>
                      <p className="text-sm text-gray-600">{similarProf.department}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-lg text-white font-bold ${getRatingColor(similarProf.rating, 5)}`}>
                      {similarProf.rating.toFixed(1)}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Reviews */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">{professor.totalRatings} Calificaciones de estudiantes</h2>
              <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm">
                <option>Todas las materias</option>
                <option>Cálculo I</option>
                <option>Física I</option>
              </select>
            </div>

            {/* Reviews Section */}
            <div className="mb-12">
              <h3 className="text-xl text-gray-700 mb-6">Calificaciones recientes</h3>
          <div className="space-y-6">
            {ratings.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Sin reseñas aún</h4>
                <p className="text-gray-600 mb-4">
                  Este profesor aún no tiene calificaciones de estudiantes.
                </p>
                <button
                  onClick={() => setShowRatingForm(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sé el primero en calificar
                </button>
              </div>
            ) : (
              ratings.map((rating) => (
                  <div key={rating.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    {/* Review Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">{rating.courseName}</h4>
                        <p className="text-sm text-gray-500">
                          {rating.semester} • {rating.grade ? `Nota final: ${rating.grade}` : 'Nota no disponible'}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className={`text-2xl font-bold mb-1 metric-number ${
                            rating.rating >= 4.1 ? 'text-green-600' :
                            rating.rating >= 3.0 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {rating.rating.toFixed(1)}
                          </div>
                          <p className="text-xs text-gray-500">Calidad</p>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold mb-1 text-blue-600 metric-number">
                            {rating.difficulty.toFixed(1)}
                          </div>
                          <p className="text-xs text-gray-500">Dificultad</p>
                        </div>
                      </div>
                    </div>

                    {/* Review Content */}
                    <p className="text-gray-700 mb-4 leading-relaxed">{rating.comment}</p>

                    {/* Review Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {rating.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-sm font-medium ${rating.wouldTakeAgain ? 'text-rating-excellent' : 'text-rating-poor'}`}>
                          {rating.wouldTakeAgain ? '✓ Tomaría otra vez' : '✗ No tomaría otra vez'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(rating.createdAt).toLocaleDateString('es-DO', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
                  </div>
                </div>

            {/* Similar Professors */}
            <div className="mb-12">
              <h3 className="text-xl text-gray-700 mb-6">Profesores similares</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Similar professor cards would go here */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Form Modal */}
      {showRatingForm && professor && (
        <RatingForm
          professorId={professor.id}
          professorName={professor.name}
          onSubmit={handleRatingSubmit}
          onCancel={() => setShowRatingForm(false)}
        />
      )}
    </div>
  )
} 