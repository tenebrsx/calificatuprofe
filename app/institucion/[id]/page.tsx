'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { StarIcon, AdjustmentsHorizontalIcon, FunnelIcon } from '@heroicons/react/24/solid'
import { MapPinIcon, CalendarIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import AddProfessorPrompt from '@/components/AddProfessorPrompt'

interface Professor {
  id: string
  name: string
  department: string
  rating: number
  totalRatings: number
  tags: string[]
}

interface Department {
  id: string
  name: string
  professorCount: number
  averageRating: number
}

interface Institution {
  id: string
  name: string
  fullName: string
  location: string
  founded: string
  type: string
  description: string
  website: string
  totalProfessors: number
  averageRating: number
  departmentCount: number
}

export default function InstitutionPage() {
  const params = useParams()
  const router = useRouter()
  const institutionId = params?.id as string
  
  const [institution, setInstitution] = useState<Institution | null>(null)
  const [departments, setDepartments] = useState<Department[]>([])
  const [professors, setProfessors] = useState<Professor[]>([])
  const [filteredProfessors, setFilteredProfessors] = useState<Professor[]>([])
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'rating' | 'name' | 'reviews'>('rating')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadInstitutionData = async () => {
      setLoading(true)
      
      // Fetch professors from mock API (which has all the data)
      try {
        const response = await fetch('/api/professors/mock')
        if (response.ok) {
          const data = await response.json()
          
          // Filter professors by institution - match university field
          const institutionProfessors = data.results.filter((prof: any) => {
            const profUniversity = prof.university?.toLowerCase().trim()
            const targetId = institutionId?.toLowerCase().trim()
            
            // Handle different university name variations
            if (targetId === 'intec') {
              return profUniversity?.includes('intec') || profUniversity?.includes('instituto tecnológico')
            } else if (targetId === 'pucmm') {
              return profUniversity?.includes('pucmm') || profUniversity?.includes('católica madre')
            } else if (targetId === 'uasd') {
              return profUniversity?.includes('uasd') || profUniversity?.includes('autónoma')
            } else if (targetId === 'unphu') {
              return profUniversity?.includes('unphu') || profUniversity?.includes('pedro henríquez')
            } else if (targetId === 'utesa') {
              return profUniversity?.includes('utesa') || profUniversity?.includes('tecnológica santiago')
            } else if (targetId === 'unicaribe') {
              return profUniversity?.includes('unicaribe') || profUniversity?.includes('caribe')
            } else if (targetId === 'oym' || targetId === 'o&m') {
              return profUniversity?.includes('o&m') || profUniversity?.includes('organización')
            } else if (targetId === 'apec') {
              return profUniversity?.includes('apec')
            }
            
            return profUniversity === targetId
          })
          
          // Transform professor data
          const transformedProfessors = institutionProfessors.map((prof: any) => ({
            id: prof.id,
            name: prof.name,
            department: prof.department || 'Sin departamento',
            rating: prof.averageRating || 0,
            totalRatings: prof.totalReviews || 0,
            tags: prof.tags && prof.tags.length > 0 ? prof.tags : ['SIN RESEÑAS']
          }))
          
          setProfessors(transformedProfessors)
          setFilteredProfessors(transformedProfessors)
          
          // Calculate real department data from professors
          const departmentCounts: Record<string, {count: number, ratings: number[]}> = {}
          
          transformedProfessors.forEach((prof: Professor) => {
            if (!departmentCounts[prof.department]) {
              departmentCounts[prof.department] = { count: 0, ratings: [] }
            }
            departmentCounts[prof.department].count++
            if (prof.rating > 0) departmentCounts[prof.department].ratings.push(prof.rating)
          })
          
          const realDepartments: Department[] = Object.keys(departmentCounts).map(name => ({
            id: name.toLowerCase().replace(/\s+/g, ''),
            name: name,
            professorCount: departmentCounts[name].count,
            averageRating: departmentCounts[name].ratings.length > 0 
              ? departmentCounts[name].ratings.reduce((sum, rating) => sum + rating, 0) / departmentCounts[name].ratings.length 
              : 0
          }))
          
          setDepartments(realDepartments)
          
          // Mock institution data based on ID
          const institutionData: Record<string, Institution> = {
            intec: {
              id: 'intec',
              name: 'INTEC',
              fullName: 'Instituto Tecnológico de Santo Domingo',
              location: 'Santo Domingo, República Dominicana',
              founded: '1972',
              type: 'Privada',
              description: 'Universidad privada de excelencia académica con enfoque en ciencias, tecnología e innovación.',
              website: 'https://www.intec.edu.do',
              totalProfessors: transformedProfessors.length,
              averageRating: 0,
              departmentCount: realDepartments.length
            },
            uasd: {
              id: 'uasd',
              name: 'UASD',
              fullName: 'Universidad Autónoma de Santo Domingo',
              location: 'Santo Domingo, República Dominicana',
              founded: '1538',
              type: 'Pública',
              description: 'La primera universidad de América, con una rica tradición académica y amplia oferta educativa.',
              website: 'https://www.uasd.edu.do',
              totalProfessors: transformedProfessors.length,
              averageRating: 0,
              departmentCount: realDepartments.length
            },
            pucmm: {
              id: 'pucmm',
              name: 'PUCMM',
              fullName: 'Pontificia Universidad Católica Madre y Maestra',
              location: 'Santo Domingo, República Dominicana',
              founded: '1962',
              type: 'Privada',
              description: 'Universidad católica comprometida con la excelencia académica y la formación integral.',
              website: 'https://www.pucmm.edu.do',
              totalProfessors: transformedProfessors.length,
              averageRating: 0,
              departmentCount: realDepartments.length
            },
            unphu: {
              id: 'unphu',
              name: 'UNPHU',
              fullName: 'Universidad Nacional Pedro Henríquez Ureña',
              location: 'Santo Domingo, República Dominicana',
              founded: '1966',
              type: 'Privada',
              description: 'Universidad privada con enfoque en ciencias de la salud y formación humanística integral.',
              website: 'https://www.unphu.edu.do',
              totalProfessors: transformedProfessors.length,
              averageRating: 0,
              departmentCount: realDepartments.length
            },
            utesa: {
              id: 'utesa',
              name: 'UTESA',
              fullName: 'Universidad Tecnológica de Santiago',
              location: 'Santiago, República Dominicana',
              founded: '1974',
              type: 'Privada',
              description: 'Universidad tecnológica con programas innovadores y formación práctica.',
              website: 'https://www.utesa.edu',
              totalProfessors: transformedProfessors.length,
              averageRating: 0,
              departmentCount: realDepartments.length
            },
            unicaribe: {
              id: 'unicaribe',
              name: 'UNICARIBE',
              fullName: 'Universidad del Caribe',
              location: 'Santo Domingo, República Dominicana',
              founded: '1995',
              type: 'Privada',
              description: 'Universidad moderna con enfoque en la innovación educativa y tecnológica.',
              website: 'https://www.unicaribe.edu.do',
              totalProfessors: transformedProfessors.length,
              averageRating: 0,
              departmentCount: realDepartments.length
            },
            'oym': {
              id: 'oym',
              name: 'O&M',
              fullName: 'Universidad Organización & Método',
              location: 'Santo Domingo, República Dominicana',
              founded: '1966',
              type: 'Privada',
              description: 'Universidad pionera en administración de empresas y ciencias económicas.',
              website: 'https://www.oym.edu.do',
              totalProfessors: transformedProfessors.length,
              averageRating: 0,
              departmentCount: realDepartments.length
            },
            apec: {
              id: 'apec',
              name: 'APEC',
              fullName: 'Universidad APEC',
              location: 'Santo Domingo, República Dominicana',
              founded: '1965',
              type: 'Privada',
              description: 'Universidad líder en educación superior con programas de alta calidad académica.',
              website: 'https://www.unapec.edu.do',
              totalProfessors: transformedProfessors.length,
              averageRating: 0,
              departmentCount: realDepartments.length
            }
          }
          
          const currentInstitution = institutionData[institutionId] || institutionData['intec']
          
          // Calculate average rating from real professors
          const ratingsWithValues = transformedProfessors.filter((p: Professor) => p.rating > 0)
          if (ratingsWithValues.length > 0) {
            currentInstitution.averageRating = ratingsWithValues.reduce((sum: number, p: Professor) => sum + p.rating, 0) / ratingsWithValues.length
          }
          
          setInstitution(currentInstitution)
        }
      } catch (error) {
        console.error('Error fetching professors:', error)
      }
      
      setLoading(false)
    }

    if (institutionId) {
      loadInstitutionData()
    }
  }, [institutionId])

  // Filter and sort professors
  useEffect(() => {
    let filtered = professors

    if (selectedDepartment !== 'all') {
      const selectedDept = departments.find(d => d.id === selectedDepartment)
      if (selectedDept) {
        filtered = professors.filter(p => p.department === selectedDept.name)
      }
    }

    // Sort professors
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'name':
          return a.name.localeCompare(b.name)
        case 'reviews':
          return b.totalRatings - a.totalRatings
        default:
          return 0
      }
    })

    setFilteredProfessors(filtered)
  }, [professors, selectedDepartment, sortBy, departments])

  const handleDepartmentClick = (deptId: string) => {
    setSelectedDepartment(deptId)
  }

  const handleProfessorClick = (professorId: string) => {
    router.push(`/profesor/${professorId}`)
  }

  const getRatingColor = (rating: number) => {
    if (rating === 0) return 'text-gray-500'
    if (rating >= 4.5) return 'text-green-600'
    if (rating >= 4.0) return 'text-blue-600'
    if (rating >= 3.5) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getRatingBg = (rating: number) => {
    if (rating === 0) return 'bg-gray-500'
    if (rating >= 4.5) return 'bg-green-500'
    if (rating >= 4.0) return 'bg-blue-500'
    if (rating >= 3.5) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información de la universidad...</p>
        </div>
      </div>
    )
  }

  if (!institution) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Universidad no encontrada</h1>
          <p className="text-gray-600 mb-4">La universidad que buscas no está disponible.</p>
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-start gap-6">
            {/* Institution Logo/Icon */}
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
              {institution.name}
            </div>
            
            {/* Institution Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 font-heading">
                {institution.fullName}
              </h1>
              
              <div className="flex items-center gap-6 text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4" />
                  <span className="text-sm">{institution.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span className="text-sm">Fundada en {institution.founded}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{institution.type}</span>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4 max-w-3xl">
                {institution.description}
              </p>
              
              <Link 
                href={institution.website}
                target="_blank"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                <GlobeAltIcon className="h-4 w-4" />
                Visitar sitio web →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2 metric-number">
                {institution.totalProfessors}
              </div>
              <div className="text-gray-600">Profesores</div>
            </div>
            <div>
              <div className={`text-3xl font-bold mb-2 metric-number ${getRatingColor(institution.averageRating)}`}>
                {institution.averageRating > 0 ? institution.averageRating.toFixed(1) : '0'}
              </div>
              <div className="text-gray-600">Calificación promedio</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2 metric-number">
                {institution.departmentCount}
              </div>
              <div className="text-gray-600">Departamentos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Departments Section - Only show if there are departments */}
        {departments.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-heading">Departamentos</h2>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departments.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => handleDepartmentClick(dept.id)}
                  className={`p-6 rounded-xl border-2 transition-colors text-left ${
                    selectedDepartment === dept.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 font-heading">
                      {dept.name}
                    </h3>
                    {dept.averageRating > 0 && (
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRatingBg(dept.averageRating)} text-white`}>
                        {dept.averageRating.toFixed(1)}
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600">
                    {dept.professorCount} profesores
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Professors Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 font-heading">
              Profesores destacados
            </h2>
            {departments.length > 0 && (
              <div className="flex items-center gap-4">
                {/* Department Filter */}
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Todos los departamentos</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>

                {/* Sort Options */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="rating">Mejor calificación</option>
                  <option value="name">Nombre</option>
                  <option value="reviews">Más reseñas</option>
                </select>
              </div>
            )}
          </div>

          {/* Professors Grid */}
          {filteredProfessors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProfessors.map((professor) => (
                <button
                  key={professor.id}
                  onClick={() => handleProfessorClick(professor.id)}
                  className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow text-left"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 font-heading">
                        {professor.name}
                      </h3>
                      <p className="text-gray-600">{professor.department}</p>
                      <p className="text-sm text-gray-500">{professor.totalRatings} {professor.totalRatings === 1 ? 'calificación' : 'calificaciones'}</p>
                    </div>
                    {professor.rating > 0 && (
                      <div className={`w-12 h-12 rounded-full ${getRatingBg(professor.rating)} flex items-center justify-center text-white font-bold`}>
                        {professor.rating.toFixed(1)}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {professor.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                    {professor.tags.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                        +{professor.tags.length - 3} más
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay profesores disponibles</h3>
                <p className="text-gray-600 mb-4">
                  Aún no hemos agregado profesores de esta institución a nuestra base de datos.
                </p>
                <p className="text-sm text-gray-500">
                  Próximamente agregaremos más universidades dominicanas.
                </p>
              </div>
              
              {/* Add Professor Prompt for empty institution */}
              <AddProfessorPrompt 
                context="institution"
                institution={institution.name}
                className="max-w-2xl mx-auto"
              />
            </div>
          )}

          {/* Add Professor Prompt and View All Button */}
          <div className="space-y-8 mt-8">
            {filteredProfessors.length > 0 && (
              <AddProfessorPrompt 
                context="institution"
                institution={institution.name}
                className="max-w-2xl mx-auto"
              />
            )}
            
            {institution.totalProfessors > 0 && (
              <div className="text-center">
                <Link
                  href={`/profesores?institucion=${institutionId}`}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ver todos los profesores ({institution.totalProfessors})
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 