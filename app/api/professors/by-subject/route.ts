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
        'Ingeniería Química', 'Ingeniería Biomédica'
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
        'Álgebra', 'Geometría', 'Matemática Financiera'
      ],
      'literatura': [
        'Literatura', 'Literatura Española', 'Literatura Dominicana',
        'Lengua Española', 'Comunicación', 'Periodismo'
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