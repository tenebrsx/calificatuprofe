'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { StarIcon, AdjustmentsHorizontalIcon, FunnelIcon } from '@heroicons/react/24/solid'
import { MapPinIcon, CalendarIcon, GlobeAltIcon } from '@heroicons/react/24/outline'

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
      
      // Fetch real professors from our API
      try {
        const response = await fetch('/api/professors/mock')
        if (response.ok) {
          const data = await response.json()
          // Filter professors by institution
          const institutionProfessors = data.results.filter((prof: any) => {
            const profInstitution = prof.university?.toLowerCase()
            return profInstitution === institutionId
          })
          
          // Transform professor data
          const transformedProfessors = institutionProfessors.map((prof: any) => ({
            id: prof.id,
            name: prof.name,
            department: prof.department,
            rating: prof.averageRating,
            totalRatings: prof.totalReviews,
            tags: prof.topTags.length > 0 ? prof.topTags : ['SIN RESEÑAS']
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
        }
      } catch (error) {
        console.error('Error fetching professors:', error)
      }
      
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
          totalProfessors: 0, // Will be updated with real data
          averageRating: 0,
          departmentCount: 6
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
          totalProfessors: 0,
          averageRating: 4.1,
          departmentCount: 12
        },
        pucmm: {
          id: 'pucmm',
          name: 'PUCMM',
          fullName: 'Pontificia Universidad Católica Madre y Maestra',
          location: 'Santiago, República Dominicana',
          founded: '1962',
          type: 'Privada',
          description: 'Universidad católica comprometida con la excelencia académica y la formación integral.',
          website: 'https://www.pucmm.edu.do',
          totalProfessors: 94,
          averageRating: 4.4,
          departmentCount: 8
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
          totalProfessors: 456,
          averageRating: 4.2,
          departmentCount: 7
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
          totalProfessors: 298,
          averageRating: 4.0,
          departmentCount: 5
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
          totalProfessors: 187,
          averageRating: 3.9,
          departmentCount: 4
        },
        'o&m': {
          id: 'o&m',
          name: 'O&M',
          fullName: 'Universidad Organización & Método',
          location: 'Santo Domingo, República Dominicana',
          founded: '1966',
          type: 'Privada',
          description: 'Universidad pionera en administración de empresas y ciencias económicas.',
          website: 'https://www.oym.edu.do',
          totalProfessors: 234,
          averageRating: 4.0,
          departmentCount: 5
        },
        apec: {
          id: 'apec',
          name: 'APEC',
          fullName: 'Universidad APEC',
          location: 'Santo Domingo, República Dominicana',
          founded: '1965',
          type: 'Privada',
          description: 'Universidad de alta calidad académica con programas de pregrado y postgrado.',
          website: 'https://www.unapec.edu.do',
          totalProfessors: 321,
          averageRating: 4.1,
          departmentCount: 6
        }
      }

      // Institution-specific departments
      const departmentsByInstitution: Record<string, Department[]> = {
        intec: [
          { id: 'ingenieria', name: 'Ingeniería', professorCount: 89, averageRating: 4.4 },
          { id: 'ciencias', name: 'Ciencias Básicas', professorCount: 34, averageRating: 4.2 },
          { id: 'administracion', name: 'Administración', professorCount: 42, averageRating: 4.1 },
          { id: 'arquitectura', name: 'Arquitectura', professorCount: 28, averageRating: 4.3 },
          { id: 'medicina', name: 'Medicina', professorCount: 65, averageRating: 4.2 },
          { id: 'comunicacion', name: 'Comunicación', professorCount: 18, averageRating: 4.0 }
        ],
        uasd: [
          { id: 'medicina', name: 'Medicina', professorCount: 156, averageRating: 4.1 },
          { id: 'derecho', name: 'Derecho', professorCount: 134, averageRating: 4.0 },
          { id: 'ingenieria', name: 'Ingeniería', professorCount: 198, averageRating: 4.2 },
          { id: 'administracion', name: 'Administración', professorCount: 145, averageRating: 3.9 },
          { id: 'humanidades', name: 'Humanidades', professorCount: 98, averageRating: 4.1 },
          { id: 'ciencias', name: 'Ciencias', professorCount: 87, averageRating: 4.0 },
          { id: 'psicologia', name: 'Psicología', professorCount: 76, averageRating: 4.2 },
          { id: 'economia', name: 'Economía', professorCount: 54, averageRating: 3.8 },
          { id: 'educacion', name: 'Educación', professorCount: 89, averageRating: 4.0 },
          { id: 'agropecuaria', name: 'Agropecuaria', professorCount: 43, averageRating: 4.1 },
          { id: 'arte', name: 'Artes', professorCount: 32, averageRating: 4.3 },
          { id: 'farmacia', name: 'Farmacia', professorCount: 28, averageRating: 4.2 }
        ],
        pucmm: [
          { id: 'ingenieria', name: 'Ingeniería', professorCount: 125, averageRating: 4.5 },
          { id: 'medicina', name: 'Medicina', professorCount: 98, averageRating: 4.4 },
          { id: 'administracion', name: 'Administración', professorCount: 87, averageRating: 4.3 },
          { id: 'derecho', name: 'Derecho', professorCount: 76, averageRating: 4.2 },
          { id: 'arquitectura', name: 'Arquitectura', professorCount: 54, averageRating: 4.4 },
          { id: 'psicologia', name: 'Psicología', professorCount: 43, averageRating: 4.3 },
          { id: 'comunicacion', name: 'Comunicación', professorCount: 32, averageRating: 4.1 },
          { id: 'humanidades', name: 'Humanidades', professorCount: 28, averageRating: 4.2 }
        ],
        unphu: [
          { id: 'medicina', name: 'Medicina', professorCount: 156, averageRating: 4.3 },
          { id: 'odontologia', name: 'Odontología', professorCount: 87, averageRating: 4.2 },
          { id: 'farmacia', name: 'Farmacia', professorCount: 43, averageRating: 4.1 },
          { id: 'enfermeria', name: 'Enfermería', professorCount: 54, averageRating: 4.2 },
          { id: 'psicologia', name: 'Psicología', professorCount: 32, averageRating: 4.3 },
          { id: 'administracion', name: 'Administración', professorCount: 28, averageRating: 4.0 },
          { id: 'derecho', name: 'Derecho', professorCount: 56, averageRating: 4.1 }
        ],
        utesa: [
          { id: 'ingenieria', name: 'Ingeniería', professorCount: 98, averageRating: 4.1 },
          { id: 'administracion', name: 'Administración', professorCount: 76, averageRating: 4.0 },
          { id: 'derecho', name: 'Derecho', professorCount: 45, averageRating: 3.9 },
          { id: 'comunicacion', name: 'Comunicación', professorCount: 32, averageRating: 4.0 },
          { id: 'psicologia', name: 'Psicología', professorCount: 47, averageRating: 4.1 }
        ],
        unicaribe: [
          { id: 'administracion', name: 'Administración', professorCount: 54, averageRating: 3.9 },
          { id: 'ingenieria', name: 'Ingeniería', professorCount: 43, averageRating: 4.0 },
          { id: 'comunicacion', name: 'Comunicación', professorCount: 32, averageRating: 3.8 },
          { id: 'psicologia', name: 'Psicología', professorCount: 58, averageRating: 4.1 }
        ],
        'o&m': [
          { id: 'administracion', name: 'Administración', professorCount: 87, averageRating: 4.1 },
          { id: 'economia', name: 'Economía', professorCount: 54, averageRating: 4.0 },
          { id: 'derecho', name: 'Derecho', professorCount: 43, averageRating: 3.9 },
          { id: 'comunicacion', name: 'Comunicación', professorCount: 28, averageRating: 4.0 },
          { id: 'psicologia', name: 'Psicología', professorCount: 22, averageRating: 4.1 }
        ],
        apec: [
          { id: 'administracion', name: 'Administración', professorCount: 98, averageRating: 4.2 },
          { id: 'ingenieria', name: 'Ingeniería', professorCount: 76, averageRating: 4.1 },
          { id: 'derecho', name: 'Derecho', professorCount: 54, averageRating: 4.0 },
          { id: 'comunicacion', name: 'Comunicación', professorCount: 43, averageRating: 4.1 },
          { id: 'psicologia', name: 'Psicología', professorCount: 32, averageRating: 4.2 },
          { id: 'medicina', name: 'Medicina', professorCount: 18, averageRating: 4.3 }
        ]
      }

      // Institution-specific professors
      const professorsByInstitution: Record<string, Professor[]> = {
        intec: [
          { id: '1', name: 'Dr. Juan Pérez', department: 'Ingeniería', rating: 4.8, totalRatings: 156, tags: ['CLARO AL EXPLICAR', 'DISPONIBLE', 'EXÁMENES JUSTOS'] },
          { id: '2', name: 'Dra. Ana Méndez', department: 'Ingeniería', rating: 4.5, totalRatings: 78, tags: ['EXÁMENES JUSTOS', 'DISPONIBLE', 'RESPETADO'] },
          { id: '3', name: 'Prof. Carlos Rodríguez', department: 'Ciencias Básicas', rating: 4.4, totalRatings: 92, tags: ['CLASES TEÓRICAS', 'INSPIRADOR', 'TRABAJOS GRUPO'] },
          { id: '4', name: 'Dra. Elena Vargas', department: 'Arquitectura', rating: 4.6, totalRatings: 67, tags: ['CREATIVIDAD', 'PROYECTOS REALES', 'DISPONIBLE'] },
          { id: '5', name: 'Prof. Miguel Santos', department: 'Administración', rating: 4.3, totalRatings: 89, tags: ['CASOS PRÁCTICOS', 'FLEXIBLE', 'NETWORKING'] },
          { id: '6', name: 'Dr. Luis García', department: 'Medicina', rating: 4.7, totalRatings: 134, tags: ['EXPERIENCIA CLÍNICA', 'MOTIVADOR', 'CLARO AL EXPLICAR'] }
        ],
        pucmm: [
          { id: '7', name: 'Dr. Juan Pérez', department: 'Ingeniería', rating: 4.8, totalRatings: 156, tags: ['CLARO AL EXPLICAR', 'DISPONIBLE', 'EXÁMENES JUSTOS'] },
          { id: '8', name: 'Dra. María Santos', department: 'Medicina', rating: 4.7, totalRatings: 89, tags: ['INSPIRADOR', 'TAREAS ÚTILES', 'SE PREOCUPA'] },
          { id: '9', name: 'Prof. Carlos López', department: 'Administración', rating: 4.6, totalRatings: 134, tags: ['CLARO AL EXPLICAR', 'FLEXIBLE', 'TRABAJOS GRUPO'] },
          { id: '10', name: 'Dr. Ana Méndez', department: 'Ingeniería', rating: 4.5, totalRatings: 78, tags: ['EXÁMENES JUSTOS', 'DISPONIBLE', 'RESPETADO'] },
          { id: '11', name: 'Prof. Luis García', department: 'Medicina', rating: 4.4, totalRatings: 92, tags: ['CLASES TEÓRICAS', 'TAREA PESADA', 'INSPIRADOR'] },
          { id: '12', name: 'Dra. Carmen Jiménez', department: 'Administración', rating: 4.3, totalRatings: 67, tags: ['PARTICIPA CLASE', 'FLEXIBLE', 'PUNTAJE EXTRA'] },
          { id: '13', name: 'Dr. Roberto Silva', department: 'Derecho', rating: 4.2, totalRatings: 45, tags: ['EXÁMENES JUSTOS', 'CLARO AL EXPLICAR', 'RESPETADO'] },
          { id: '14', name: 'Prof. Elena Vargas', department: 'Arquitectura', rating: 4.1, totalRatings: 38, tags: ['INSPIRADOR', 'TRABAJOS GRUPO', 'DISPONIBLE'] }
        ],
        uasd: [
          { id: '15', name: 'Dr. Pedro Martínez', department: 'Medicina', rating: 4.6, totalRatings: 187, tags: ['EXPERIENCIA', 'CASOS REALES', 'DEDICADO'] },
          { id: '16', name: 'Dra. Isabel Fernández', department: 'Derecho', rating: 4.4, totalRatings: 156, tags: ['JURISPRUDENCIA', 'PRÁCTICA', 'RESPETADA'] },
          { id: '17', name: 'Prof. Antonio Ramírez', department: 'Ingeniería', rating: 4.3, totalRatings: 134, tags: ['PROYECTOS', 'INNOVADOR', 'EXIGENTE'] },
          { id: '18', name: 'Dra. Carmen Vega', department: 'Administración', rating: 4.2, totalRatings: 98, tags: ['CASOS EMPRESARIALES', 'MODERNA', 'PRÁCTICA'] },
          { id: '19', name: 'Prof. Rafael Torres', department: 'Humanidades', rating: 4.5, totalRatings: 76, tags: ['CULTURA', 'REFLEXIVO', 'INSPIRADOR'] },
          { id: '20', name: 'Dr. Lucía Morales', department: 'Psicología', rating: 4.4, totalRatings: 112, tags: ['EMPÁTICA', 'CASOS CLÍNICOS', 'COMPRENSIVA'] }
        ],
        unphu: [
          { id: '21', name: 'Dr. Eduardo Pérez', department: 'Medicina', rating: 4.8, totalRatings: 198, tags: ['CLÍNICA AVANZADA', 'INVESTIGADOR', 'MENTOR'] },
          { id: '22', name: 'Dra. Patricia González', department: 'Odontología', rating: 4.6, totalRatings: 143, tags: ['TÉCNICAS MODERNAS', 'PACIENTE', 'PRÁCTICA'] },
          { id: '23', name: 'Prof. Marcos Díaz', department: 'Farmacia', rating: 4.4, totalRatings: 87, tags: ['QUÍMICA APLICADA', 'LABORATORIO', 'DETALLISTA'] },
          { id: '24', name: 'Dra. Ana Herrera', department: 'Enfermería', rating: 4.5, totalRatings: 121, tags: ['CUIDADO HUMANIZADO', 'PRÁCTICA', 'DEDICADA'] },
          { id: '25', name: 'Prof. José Castillo', department: 'Psicología', rating: 4.3, totalRatings: 76, tags: ['TERAPIA COGNITIVA', 'COMPRENSIVO', 'ACTUAL'] }
        ],
        utesa: [
          { id: '26', name: 'Dr. Roberto Jiménez', department: 'Ingeniería', rating: 4.5, totalRatings: 134, tags: ['TECNOLOGÍA', 'INNOVACIÓN', 'PRÁCTICO'] },
          { id: '27', name: 'Prof. María Castillo', department: 'Administración', rating: 4.2, totalRatings: 98, tags: ['EMPRENDIMIENTO', 'CASOS LOCALES', 'MOTIVADORA'] },
          { id: '28', name: 'Dra. Sofía Mendoza', department: 'Derecho', rating: 4.1, totalRatings: 67, tags: ['DERECHO COMERCIAL', 'ACTUALIZADA', 'CLARA'] },
          { id: '29', name: 'Prof. Fernando Ruiz', department: 'Comunicación', rating: 4.3, totalRatings: 54, tags: ['MEDIOS DIGITALES', 'CREATIVO', 'MODERNO'] }
        ],
        unicaribe: [
          { id: '30', name: 'Prof. Diana López', department: 'Administración', rating: 4.1, totalRatings: 76, tags: ['GESTIÓN MODERNA', 'FLEXIBLE', 'CASOS ACTUALES'] },
          { id: '31', name: 'Dr. Carlos Méndez', department: 'Ingeniería', rating: 4.0, totalRatings: 54, tags: ['SISTEMAS', 'PROGRAMACIÓN', 'PACIENTE'] },
          { id: '32', name: 'Dra. Elena Pichardo', department: 'Psicología', rating: 4.2, totalRatings: 89, tags: ['TERAPIA FAMILIAR', 'EMPÁTICA', 'PRÁCTICA'] }
        ],
        'o&m': [
          { id: '33', name: 'Prof. Ricardo Vargas', department: 'Administración', rating: 4.3, totalRatings: 123, tags: ['GESTIÓN ESTRATÉGICA', 'LIDERAZGO', 'EXPERIENCIA'] },
          { id: '34', name: 'Dra. Mariana Santos', department: 'Economía', rating: 4.1, totalRatings: 87, tags: ['MACROECONOMÍA', 'ANALÍTICA', 'ACTUALIZADA'] },
          { id: '35', name: 'Prof. Javier Morales', department: 'Derecho', rating: 4.0, totalRatings: 65, tags: ['DERECHO EMPRESARIAL', 'PRÁCTICO', 'CLARO'] }
        ],
        apec: [
          { id: '36', name: 'Dr. Fernando Peña', department: 'Administración', rating: 4.4, totalRatings: 156, tags: ['MBA', 'CONSULTORÍA', 'CASOS INTERNACIONALES'] },
          { id: '37', name: 'Prof. Gabriela Núñez', department: 'Ingeniería', rating: 4.2, totalRatings: 98, tags: ['SISTEMAS DE INFORMACIÓN', 'INNOVADORA', 'PROYECTOS'] },
          { id: '38', name: 'Dra. Patricia Herrera', department: 'Medicina', rating: 4.6, totalRatings: 43, tags: ['ESPECIALISTA', 'INVESTIGACIÓN', 'CLÍNICA'] }
        ]
      }

      // Get institution data
      const currentInstitution = institutionData[institutionId.toLowerCase()]
      
      if (!currentInstitution) {
        // If institution not found, redirect to institutions page
        router.push('/instituciones')
        return
      }
      
      // Update institution professor count with real data if we have professors
      if (professors.length > 0) {
        currentInstitution.totalProfessors = professors.length
      }
      
      setInstitution(currentInstitution)
      
      // Only set fake departments if we didn't get real ones from professors
      if (departments.length === 0) {
        const institutionDepartments = departmentsByInstitution[institutionId.toLowerCase()] || []
        setDepartments(institutionDepartments)
      }
      
      // Only set fake professors if we didn't get real ones
      if (professors.length === 0) {
        const institutionProfessors = professorsByInstitution[institutionId.toLowerCase()] || []
        setProfessors(institutionProfessors)
        setFilteredProfessors(institutionProfessors)
      }
      setLoading(false)
    }

    loadInstitutionData()
  }, [institutionId])

  // Filter and sort professors
  useEffect(() => {
    let filtered = professors

    // Filter by department
    if (selectedDepartment !== 'all') {
      const deptName = departments.find(d => d.id === selectedDepartment)?.name
      filtered = filtered.filter(prof => prof.department === deptName)
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
    if (rating >= 4.1) return 'text-green-600'
    if (rating >= 3.0) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getRatingBg = (rating: number) => {
    if (rating >= 4.1) return 'bg-green-500 text-white'
    if (rating >= 3.0) return 'bg-yellow-500 text-gray-900'
    return 'bg-red-500 text-white'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información de la institución...</p>
        </div>
      </div>
    )
  }

  if (!institution) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Institución no encontrada</h2>
          <Link href="/" className="text-blue-600 hover:text-blue-700">
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
                {institution.averageRating}
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
        {/* Departments Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 font-heading">Departamentos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRatingBg(dept.averageRating)} text-white`}>
                    {dept.averageRating.toFixed(1)}
                  </div>
                </div>
                <p className="text-gray-600">
                  {dept.professorCount} profesores
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Professors Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 font-heading">
              Profesores destacados
            </h2>
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
          </div>

          {/* Professors Grid */}
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
                    <p className="text-sm text-gray-500">{professor.totalRatings} calificaciones</p>
                  </div>
                  <div className={`w-12 h-12 rounded-full ${getRatingBg(professor.rating)} flex items-center justify-center text-white font-bold`}>
                    {professor.rating.toFixed(1)}
                  </div>
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

          {/* View All Button */}
          <div className="text-center mt-8">
            <Link
              href={`/profesores?institucion=${institutionId}`}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ver todos los profesores ({institution.totalProfessors})
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 