'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { UserPlusIcon, CheckCircleIcon, ExclamationTriangleIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

const DOMINICAN_UNIVERSITIES = [
  'PUCMM', 'INTEC', 'UASD', 'UNPHU', 'UTESA', 'UNIBE', 'UNICARIBE', 'UNAPEC', 
  'UCSD', 'APEC', 'UFHEC', 'UNEV', 'UNAD', 'UNNATEC', 'UNIREMINGTON', 'UCE',
  'FLACSO', 'UAFAM', 'GIHESS', 'ISD', 'ICE', 'IPL', 'ISFODOSU', 'UAPA',
  'UNEFA', 'UNICA', 'UNIBE', 'UNNATEC', 'UNIREMINGTON', 'UNEV', 'UNAD',
  'BARNA', 'CHARLES BEKEEV', 'UOD', 'O&M'
]

const COMMON_DEPARTMENTS = [
  'Ingeniería de Sistemas', 'Ingeniería Civil', 'Ingeniería Industrial', 'Ingeniería Eléctrica',
  'Medicina', 'Odontología', 'Enfermería', 'Psicología', 'Derecho', 'Administración de Empresas',
  'Contabilidad', 'Marketing', 'Economía', 'Arquitectura y Urbanismo', 'Comunicación Social', 'Educación',
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

function AddProfessorPageContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [formData, setFormData] = useState<ProfessorFormData>({
    name: searchParams?.get('search') || '',
    email: '',
    institution: searchParams?.get('institution') || '',
    department: searchParams?.get('department') || '',
    position: '',
    campus: '',
    additionalInfo: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // Autocomplete state
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false)
  const [filteredDepartments, setFilteredDepartments] = useState<string[]>([])
  const departmentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/agregar-profesor')
    }
  }, [status, router])

  // Handle click outside for department dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (departmentRef.current && !departmentRef.current.contains(event.target as Node)) {
        setShowDepartmentDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filter departments based on input
  useEffect(() => {
    if (formData.department) {
      const filtered = COMMON_DEPARTMENTS.filter(dept =>
        dept.toLowerCase().includes(formData.department.toLowerCase())
      ).slice(0, 8) // Limit to 8 suggestions
      setFilteredDepartments(filtered)
    } else {
      setFilteredDepartments(COMMON_DEPARTMENTS.slice(0, 8))
    }
  }, [formData.department])

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
          name: searchParams?.get('search') || '',
          email: '',
          institution: searchParams?.get('institution') || '',
          department: searchParams?.get('department') || '',
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
                <p className="text-blue-100 mt-1">Ayuda a otros estudiantes compartiendo información</p>
              </div>
            </div>
          </div>

          {/* Search Query Info */}
          {searchParams?.get('search') && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 m-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-blue-700">
                    Hemos pre-llenado el nombre con tu búsqueda: <strong>"{searchParams?.get('search')}"</strong>
                  </p>
                  <p className="text-blue-600 text-sm mt-1">
                    Puedes modificarlo si es necesario y completar el resto de la información.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {submitStatus === 'success' && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 m-6">
              <div className="flex">
                <CheckCircleIcon className="h-5 w-5 text-green-400" />
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    ¡Profesor agregado exitosamente! Será revisado antes de publicarse.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {submitStatus === 'error' && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 m-6">
              <div className="flex">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    Hubo un error al agregar el profesor. Por favor intenta de nuevo.
                  </p>
                </div>
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
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ej: Dr. Juan Pérez"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email (Opcional)
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="profesor@universidad.edu.do"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Institution */}
            <div>
              <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-2">
                Institución *
              </label>
              <select
                id="institution"
                value={formData.institution}
                onChange={(e) => handleInputChange('institution', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                  errors.institution ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Selecciona una institución</option>
                {DOMINICAN_UNIVERSITIES.map(uni => (
                  <option key={uni} value={uni}>{uni}</option>
                ))}
              </select>
              {errors.institution && <p className="mt-1 text-sm text-red-600">{errors.institution}</p>}
            </div>

            {/* Department with Autocomplete */}
            <div ref={departmentRef} className="relative">
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                Departamento/Carrera *
              </label>
              <input
                type="text"
                id="department"
                value={formData.department}
                onChange={(e) => {
                  handleInputChange('department', e.target.value)
                  setShowDepartmentDropdown(true)
                }}
                onFocus={() => setShowDepartmentDropdown(true)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                  errors.department ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ej: Ingeniería de Sistemas"
                autoComplete="off"
              />
              {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>}
              
              {/* Dropdown */}
              {showDepartmentDropdown && filteredDepartments.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredDepartments.map((dept, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        handleInputChange('department', dept)
                        setShowDepartmentDropdown(false)
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Position */}
            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                Posición/Título (Opcional)
              </label>
              <input
                type="text"
                id="position"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="Ej: Profesor Titular, Catedrático, etc."
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="Ej: Campus Principal, Campus Santiago, etc."
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="Materias que enseña, especialidades, etc."
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
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Agregando...' : 'Agregar Profesor'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function AddProfessorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <AddProfessorPageContent />
    </Suspense>
  )
} 