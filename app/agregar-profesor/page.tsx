'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { UserPlusIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

const DOMINICAN_UNIVERSITIES = [
  'PUCMM', 'INTEC', 'UNPHU', 'UNAPEC', 'UTESA', 'UNIBE', 'UASD', 'UNICARIBE',
  'UCSD', 'APEC', 'UFHEC', 'UNEV', 'UNAD', 'UNNATEC', 'UNIREMINGTON'
]

const COMMON_DEPARTMENTS = [
  'Ingeniería de Sistemas', 'Ingeniería Civil', 'Ingeniería Industrial', 'Ingeniería Eléctrica',
  'Medicina', 'Odontología', 'Enfermería', 'Psicología', 'Derecho', 'Administración de Empresas',
  'Contabilidad', 'Marketing', 'Economía', 'Arquitectura', 'Comunicación Social', 'Educación',
  'Ciencias Sociales', 'Matemáticas', 'Física', 'Química', 'Biología', 'Historia', 'Filosofía',
  'Lenguas Modernas', 'Arte', 'Música', 'Diseño Gráfico', 'Turismo', 'Gastronomía'
]

interface ProfessorFormData {
  name: string
  email: string
  institution: string
  department: string
  position: string
  campus: string
  additionalInfo: string
}

export default function AddProfessorPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [formData, setFormData] = useState<ProfessorFormData>({
    name: '',
    email: '',
    institution: searchParams.get('institution') || '',
    department: searchParams.get('department') || '',
    position: '',
    campus: '',
    additionalInfo: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/agregar-profesor')
    }
  }, [status, router])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del profesor es requerido'
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres'
    }

    if (!formData.institution) {
      newErrors.institution = 'La institución es requerida'
    }

    if (!formData.department.trim()) {
      newErrors.department = 'El departamento es requerido'
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El formato del email no es válido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/professors/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          submittedBy: session?.user?.email,
          submittedAt: new Date().toISOString()
        }),
      })

      if (response.ok) {
        setSubmitStatus('success')
        // Reset form
        setFormData({
          name: '',
          email: '',
          institution: searchParams.get('institution') || '',
          department: searchParams.get('department') || '',
          position: '',
          campus: '',
          additionalInfo: ''
        })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Error submitting professor:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof ProfessorFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Sesión Requerida</h2>
          <p className="text-gray-600 mb-4">Necesitas iniciar sesión para agregar profesores</p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
            <div className="flex items-center space-x-3">
              <UserPlusIcon className="h-8 w-8 text-white" />
              <div>
                <h1 className="text-2xl font-bold text-white">Agregar Profesor</h1>
                <p className="text-blue-100 mt-1">
                  Ayuda a otros estudiantes agregando información de profesores
                </p>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {submitStatus === 'success' && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 m-6">
              <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2" />
                <p className="text-green-700">
                  ¡Profesor agregado exitosamente! Será revisado por nuestro equipo antes de publicarse.
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {submitStatus === 'error' && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 m-6">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
                <p className="text-red-700">
                  Hubo un error al agregar el profesor. Por favor intenta de nuevo.
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Professor Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Profesor *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ej: Dr. María González, Prof. Juan Pérez"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Institution */}
            <div>
              <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-2">
                Universidad *
              </label>
              <select
                id="institution"
                value={formData.institution}
                onChange={(e) => handleInputChange('institution', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.institution ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Selecciona una universidad</option>
                {DOMINICAN_UNIVERSITIES.map(uni => (
                  <option key={uni} value={uni}>{uni}</option>
                ))}
              </select>
              {errors.institution && <p className="text-red-500 text-sm mt-1">{errors.institution}</p>}
            </div>

            {/* Department */}
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                Departamento/Carrera *
              </label>
              <input
                type="text"
                id="department"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                list="departments"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.department ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ej: Ingeniería de Sistemas, Medicina, Derecho"
              />
              <datalist id="departments">
                {COMMON_DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept} />
                ))}
              </datalist>
              {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
            </div>

            {/* Email (Optional) */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email (Opcional)
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="profesor@universidad.edu.do"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Position */}
            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                Cargo/Posición (Opcional)
              </label>
              <input
                type="text"
                id="position"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Profesor Titular, Coordinador, Decano"
              />
            </div>

            {/* Campus */}
            <div>
              <label htmlFor="campus" className="block text-sm font-medium text-gray-700 mb-2">
                Campus (Opcional)
              </label>
              <input
                type="text"
                id="campus"
                value={formData.campus}
                onChange={(e) => handleInputChange('campus', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Santo Domingo, Santiago, La Vega"
              />
            </div>

            {/* Additional Info */}
            <div>
              <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-2">
                Información Adicional (Opcional)
              </label>
              <textarea
                id="additionalInfo"
                value={formData.additionalInfo}
                onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Materias que enseña, especialización, etc."
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-gray-500">
                * Campos requeridos
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Agregando...
                  </>
                ) : (
                  <>
                    <UserPlusIcon className="h-4 w-4 mr-2" />
                    Agregar Profesor
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Info Footer */}
          <div className="bg-gray-50 px-6 py-4">
            <p className="text-sm text-gray-600">
              <strong>Nota:</strong> Todos los profesores agregados son revisados por nuestro equipo 
              antes de ser publicados para mantener la calidad y veracidad de la información.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 