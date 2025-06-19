'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { StarIcon, AcademicCapIcon } from '@heroicons/react/24/solid'

interface Professor {
  id: string
  name: string
  university: string
  department: string
  rating: number
  totalReviews: number
  tags: string[]
}

const MOCK_PROFESSORS_BY_SUBJECT: Record<string, Professor[]> = {
  'ingenieria': [
    {
      id: '1',
      name: "Dr. Roberto Jiménez",
      university: "INTEC",
      department: "Ingeniería de Sistemas",
      rating: 4.9,
      totalReviews: 127,
      tags: ["CLARO AL EXPLICAR", "EXÁMENES JUSTOS"]
    },
    {
      id: '2',
      name: "Ing. Carlos Pérez",
      university: "PUCMM",
      department: "Ingeniería Civil",
      rating: 4.6,
      totalReviews: 89,
      tags: ["PRÁCTICO", "EXIGENTE"]
    },
    {
      id: '3',
      name: "Dr. Ana Martínez",
      university: "UASD",
      department: "Ingeniería Industrial",
      rating: 4.7,
      totalReviews: 156,
      tags: ["ORGANIZADA", "MOTIVADORA"]
    }
  ],
  'medicina': [
    {
      id: '4',
      name: "Dra. Carmen Valdez",
      university: "PUCMM",
      department: "Medicina Interna",
      rating: 4.8,
      totalReviews: 95,
      tags: ["INSPIRADOR", "DISPONIBLE"]
    },
    {
      id: '5',
      name: "Dr. Luis Rodríguez",
      university: "UASD",
      department: "Cardiología",
      rating: 4.5,
      totalReviews: 67,
      tags: ["EXPERTO", "PACIENTE"]
    }
  ],
  'derecho': [
    {
      id: '6',
      name: "Prof. Luis Herrera",
      university: "UASD",
      department: "Derecho Constitucional",
      rating: 4.7,
      totalReviews: 203,
      tags: ["ORGANIZADO", "FEEDBACK ÚTIL"]
    }
  ],
  'administracion': [
    {
      id: '7',
      name: "Lic. María González",
      university: "INTEC",
      department: "Administración de Empresas",
      rating: 4.4,
      totalReviews: 78,
      tags: ["PRÁCTICA", "ACTUALIZADA"]
    }
  ],
  'matematicas': [
    {
      id: '8',
      name: "Prof. Juan Carlos Díaz",
      university: "PUCMM",
      department: "Matemáticas",
      rating: 4.6,
      totalReviews: 112,
      tags: ["CLARO", "PACIENTE"]
    }
  ],
  'literatura': [
    {
      id: '9',
      name: "Dra. Isabel Fernández",
      university: "UASD",
      department: "Literatura Española",
      rating: 4.3,
      totalReviews: 45,
      tags: ["CREATIVA", "APASIONADA"]
    }
  ]
}

const SUBJECT_NAMES: Record<string, string> = {
  'ingenieria': 'Ingeniería',
  'medicina': 'Medicina',
  'derecho': 'Derecho',
  'administracion': 'Administración',
  'matematicas': 'Matemáticas',
  'fisica': 'Física',
  'quimica': 'Química',
  'biologia': 'Biología',
  'ciencias-ambientales': 'Ciencias Ambientales',
  'ciencias-marinas': 'Ciencias Marinas',
  'educacion': 'Educación',
  'nutricion': 'Nutrición',
  'salud-publica': 'Salud Pública',
  'literatura': 'Literatura',
  'psicologia': 'Psicología',
  'sociologia': 'Sociología',
  'historia': 'Historia',
  'linguistica': 'Lingüística',
  'filosofia': 'Filosofía',
  'comunicacion': 'Comunicación',
  'economia': 'Economía',
  'finanzas': 'Finanzas',
  'gerencia': 'Gerencia',
  'mercadeo': 'Mercadeo',
  'ciencia-politica': 'Ciencia Política',
  'recursos-humanos': 'Recursos Humanos',
  'odontologia': 'Odontología',
  'arquitectura': 'Arquitectura',
  'artes': 'Artes',
  'negocios-internacionales': 'Negocios Internacionales',
  'comunicacion-publicitaria': 'Comunicación Publicitaria'
}

export default function SubjectPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [professors, setProfessors] = useState<Professor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        setLoading(true)
        // Fetch real professors from API
        const response = await fetch(`/api/professors/by-subject?subject=${slug}`)
        if (response.ok) {
          const data = await response.json()
          // Only show professors with actual reviews
          const professorsWithReviews = (data.professors || []).filter((prof: Professor) => 
            prof.totalReviews > 0 && prof.rating > 0
          )
          setProfessors(professorsWithReviews)
        } else {
          setProfessors([])
        }
      } catch (error) {
        console.error('Error fetching professors:', error)
        // No fallback to mock data - just show empty state
        setProfessors([])
      } finally {
        setLoading(false)
      }
    }

    fetchProfessors()
  }, [slug])

  const subjectName = SUBJECT_NAMES[slug] || slug

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <AcademicCapIcon className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900 capitalize">
              Profesores de {subjectName}
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            Encuentra los mejores profesores de {subjectName.toLowerCase()} en República Dominicana
          </p>
          <div className="mt-4 text-gray-500">
            {professors.length} profesor{professors.length !== 1 ? 'es' : ''} encontrado{professors.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Professors Grid */}
        {professors.length === 0 ? (
          <div className="text-center py-12">
            <AcademicCapIcon className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay profesores disponibles
            </h3>
            <p className="text-gray-500">
              Aún no tenemos profesores registrados para {subjectName.toLowerCase()}.
            </p>
            <Link
              href="/"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Volver al inicio
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {professors.map((professor) => (
              <Link
                key={professor.id}
                href={`/profesor/${professor.id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {professor.name}
                    </h3>
                    <p className="text-sm text-gray-600">{professor.department}</p>
                    <p className="text-sm text-gray-500">{professor.university}</p>
                  </div>
                  <div className="flex items-center ml-4">
                    <StarIcon className="h-5 w-5 text-yellow-400 mr-1" />
                    <span className="text-lg font-bold text-gray-900">
                      {professor.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    {professor.totalReviews} reseña{professor.totalReviews !== 1 ? 's' : ''}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {professor.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                    </span>
                  ))}
                  {professor.tags.length > 2 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      +{professor.tags.length - 2} más
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Back to home */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Explorar más materias
          </Link>
        </div>
      </div>
    </div>
  )
} 