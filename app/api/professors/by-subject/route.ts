import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const subject = searchParams.get('subject')

    if (!subject) {
      return NextResponse.json({ error: 'Subject parameter is required' }, { status: 400 })
    }

    // Map subject slugs to department names
    const subjectMapping: Record<string, string[]> = {
      'ingenieria': [
        'Ingeniería de Sistemas', 'Ingeniería Civil', 'Ingeniería Industrial', 
        'Ingeniería Eléctrica', 'Ingeniería Mecánica', 'Ingeniería de Software',
        'Ingeniería Química', 'Ingeniería Biomédica', 'Ingeniería', 'Ingenierías',
        'Ingeniería Ambiental', 'Ingeniería Sanitaria', 'Diseño Mecánico',
        'Diseño Industrial', 'Energías Renovables', 'Gestión de Proyectos',
        'Ingeniería de Estructuras', 'Administración de la Construcción',
        'Ciencia y Tecnología', 'Arquitectura'
      ],
      'medicina': [
        'Medicina', 'Medicina Interna', 'Cardiología', 'Pediatría', 
        'Ginecología', 'Cirugía', 'Neurología', 'Psiquiatría'
      ],
      'derecho': [
        'Derecho', 'Derecho Constitucional', 'Derecho Civil', 'Derecho Penal',
        'Derecho Comercial', 'Derecho Internacional', 'Derecho Laboral'
      ],
      'administracion': [
        'Administración de Empresas', 'Administración', 'Gestión Empresarial',
        'Administración Pública', 'Recursos Humanos', 'Marketing'
      ],
      'matematicas': [
        'Matemáticas', 'Matemática Aplicada', 'Estadística', 'Cálculo',
        'Álgebra', 'Geometría', 'Matemática Financiera', 'Bioestadística',
        'Análisis Matemático', 'Matemática Pura', 'Física Matemática',
        'Ciencias Físico-Matemáticas'
      ],
      'fisica': [
        'Física', 'Física General', 'Física Teórica', 'Física Aplicada',
        'Física Médica', 'Biofísica', 'Mecánica', 'Termodinámica',
        'Ingeniería Física', 'Ingeniería Termo Física'
      ],
      'quimica': [
        'Química', 'Química General', 'Química Orgánica', 'Química Inorgánica',
        'Química Analítica', 'Análisis Químico', 'Ingeniería Química'
      ],
      'biologia': [
        'Biología', 'Biología de la Conservación', 'Ecología', 'Conservación',
        'Biotecnología', 'Biociencias', 'Bioinformática'
      ],
      'ciencias-ambientales': [
        'Ciencias Ambientales', 'Gestión Ambiental', 'Ecología',
        'Educación Ambiental', 'Pedagogía Ambiental', 'Ciencias Básicas y Ambientales'
      ],
      'ciencias-marinas': [
        'Ciencias Marinas', 'Oceanografía', 'Ecología Marina',
        'Oceanografía Química'
      ],
      'educacion': [
        'Educación', 'Pedagogía', 'Metodología de la Enseñanza',
        'Educación Superior', 'Docencia Universitaria', 'Gestión Universitaria',
        'Ciencias de la Educación', 'Ciencias Pedagógicas', 'Educación Médica'
      ],
      'medicina': [
        'Medicina', 'Medicina Interna', 'Cardiología', 'Pediatría', 
        'Ginecología', 'Cirugía', 'Neurología', 'Psiquiatría',
        'Cirugía General', 'Obstetricia', 'Dermatología', 'Oftalmología',
        'Reumatología', 'Gastroenterología', 'Endocrinología', 'Ortopedia',
        'Traumatología', 'Medicina de Emergencias', 'Nefrología',
        'Anatomía Patológica', 'Ciencias de la Salud'
      ],
      'nutricion': [
        'Nutrición', 'Nutrición Clínica', 'Dietética', 'Obesología',
        'Alimentación'
      ],
      'salud-publica': [
        'Salud Pública', 'Epidemiología', 'Salud Ocupacional',
        'Prevención de Riesgos Laborales', 'Bioética', 'Salud Mental',
        'Administración en Salud', 'Gestión Sanitaria'
      ],
      'literatura': [
        'Literatura', 'Literatura Española', 'Literatura Dominicana',
        'Lengua Española', 'Comunicación', 'Periodismo'
      ],
      'psicologia': [
        'Psicología', 'Psicología Clínica', 'Psicología Organizacional',
        'Neurociencia Cognitiva', 'Neurociencias', 'Psiquiatría',
        'Intervención en Crisis', 'Salud Mental'
      ],
      'sociologia': [
        'Sociología', 'Ciencias Sociales', 'Estudios de Género',
        'Desarrollo Social', 'Integración Social', 'Antropología',
        'Antropología Física'
      ],
      'historia': [
        'Historia', 'Historia Contemporánea', 'Historia de Venezuela',
        'Historia Latinoamericana'
      ],
      'linguistica': [
        'Lingüística', 'Lingüística Aplicada', 'Francés',
        'Lenguas Extranjeras'
      ],
      'filosofia': [
        'Filosofía', 'Lógica', 'Filosofía de la Ciencia', 'Bioética',
        'Filosofía Empresarial'
      ],
      'comunicacion': [
        'Comunicación', 'Comunicación Social', 'Medios de Comunicación',
        'Audiovisuales', 'Cine', 'Documental', 'Periodismo'
      ],
      'economia': [
        'Economía', 'Economía Internacional', 'Política Económica',
        'Economía Aplicada', 'Economía Cuantitativa', 'Ciencias Económicas',
        'Análisis Financiero'
      ],
      'finanzas': [
        'Finanzas', 'Finanzas Corporativas', 'Administración Financiera',
        'Análisis Financiero', 'Educación Financiera'
      ],
      'gerencia': [
        'Gerencia', 'Alta Gerencia', 'Liderazgo', 'Liderazgo Empresarial',
        'Gerencia de Mercadeo', 'Productividad', 'Gestión Empresarial'
      ],
      'mercadeo': [
        'Mercadeo', 'Marketing', 'Gerencia de Mercadeo'
      ],
      'ciencia-politica': [
        'Ciencia Política', 'Ciencias Políticas', 'Políticas Públicas',
        'Política Internacional', 'Desarrollo Democrático',
        'Gobernabilidad', 'Gestión Pública'
      ],
      'recursos-humanos': [
        'Recursos Humanos', 'Gestión de Recursos Humanos',
        'Administración de Recursos Humanos'
      ],
      'odontologia': [
        'Odontología', 'Periodoncia', 'Ortodoncia', 'Cirugía Maxilofacial',
        'Rehabilitación Bucal', 'Endodoncia', 'Implantología',
        'Especialidad en Ortopedia Maxilar y Orto'
      ],
      'arquitectura': [
        'Arquitectura', 'Diseño de Interiores', 'Decoración Arquitectónica',
        'Urbanismo', 'Diseño Arquitectónico'
      ],
      'artes': [
        'Artes Plásticas', 'Escultura', 'Teatro', 'Artes Escénicas',
        'Decoración Arquitectónica', 'Diseño de Interiores'
      ],
      'negocios-internacionales': [
        'Negocios Internacionales', 'Comercio Internacional',
        'Administración de Empresas, Mención Negocios Internacionales',
        'Relaciones Internacionales'
      ],
      'comunicacion-publicitaria': [
        'Comunicación Publicitaria', 'Publicidad', 'Marketing Digital',
        'Medios Interactivos', 'Comunicación'
      ]
    }

    const departments = subjectMapping[subject] || [subject]

    // Query professors from the database
    const professorsRef = collection(db, 'professors')
    const professorsQuery = query(
      professorsRef,
      where('department', 'in', departments),
      orderBy('averageRating', 'desc'),
      limit(50)
    )

    const querySnapshot = await getDocs(professorsQuery)
    const professors = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    // If no professors found, return empty array
    if (professors.length === 0) {
      return NextResponse.json({ 
        professors: [],
        count: 0,
        message: `No professors found for ${subject}`
      })
    }

    // Format the response to match the expected interface
    const formattedProfessors = professors.map((prof: any) => ({
      id: prof.id,
      name: prof.name || 'Unknown Professor',
      university: prof.university || 'Unknown University',
      department: prof.department || 'Unknown Department',
      rating: prof.averageRating || 0,
      totalReviews: prof.totalReviews || 0,
      tags: prof.tags || []
    }))

    return NextResponse.json({
      professors: formattedProfessors,
      count: formattedProfessors.length,
      subject: subject
    })

  } catch (error) {
    console.error('Error fetching professors by subject:', error)
    return NextResponse.json(
      { error: 'Failed to fetch professors' },
      { status: 500 }
    )
  }
} 