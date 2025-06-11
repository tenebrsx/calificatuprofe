'use client'

import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import RatingForm from '@/components/Rating/RatingForm'

interface Professor {
  id: string
  name: string
  department: string
  institution: string
}

export default function RateProfessorPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const professorId = params?.id as string
  
  const [professor, setProfessor] = useState<Professor | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Redirect if not authenticated
    if (status === 'unauthenticated') {
      router.push(`/auth/signin?callbackUrl=/profesor/${professorId}/calificar`)
      return
    }

    // Mock professor data
    const mockProfessor = {
      id: professorId,
      name: 'Dr. Juan Pérez',
      department: 'Ingeniería',
      institution: 'INTEC'
    }

    setProfessor(mockProfessor)
  }, [professorId, status, router])

  const handleSubmitRating = async (ratingData: any) => {
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      console.log('Submitting rating:', ratingData)
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Success - redirect back to professor page
      router.push(`/profesor/${professorId}?success=rating-submitted`)
    } catch (error) {
      console.error('Error submitting rating:', error)
      // Handle error (show toast, etc.)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push(`/profesor/${professorId}`)
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  if (!professor) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información del profesor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Link 
            href={`/profesor/${professorId}`}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Volver al perfil
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-600">
                {professor.name.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-gray-900">
                {professor.name}
              </h1>
              <p className="text-gray-600">
                {professor.department} • {professor.institution}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Form */}
      <div className="max-w-4xl mx-auto px-4">
        {isSubmitting ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-6"></div>
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">
              Enviando tu calificación...
            </h2>
            <p className="text-gray-600">
              Esto puede tomar unos segundos. Por favor, no cierres esta página.
            </p>
          </div>
        ) : (
          <RatingForm
            professorId={professorId}
            professorName={professor.name}
            onSubmit={handleSubmitRating}
            onCancel={handleCancel}
          />
        )}
      </div>

      {/* Guidelines */}
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-heading font-semibold text-blue-900 mb-3">
            Pautas para una calificación útil
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Sé específico sobre tu experiencia en la clase</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Menciona métodos de enseñanza, estilo de exámenes, y carga de trabajo</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Mantén un tono constructivo y respetuoso</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Evita información personal o comentarios inapropiados</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Incluye consejos que puedan ayudar a futuros estudiantes</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
} 