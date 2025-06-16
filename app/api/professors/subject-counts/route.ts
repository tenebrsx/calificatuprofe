import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs, query } from 'firebase/firestore'

export async function GET(request: NextRequest) {
  try {
    // Get all professors from Firebase
    const professorsRef = collection(db, 'professors')
    const professorsQuery = query(professorsRef)
    const professorsSnapshot = await getDocs(professorsQuery)
    
    // Count professors by subject/department
    const subjectCounts: Record<string, number> = {}
    
    professorsSnapshot.forEach((doc) => {
      const professor = doc.data()
      const department = professor.department?.toLowerCase() || 'otros'
      
      // Map departments to subjects
      let subject = 'otros'
      
      if (department.includes('ingenier') || department.includes('sistemas') || department.includes('computacion') || department.includes('software')) {
        subject = 'ingenieria'
      } else if (department.includes('medic') || department.includes('salud') || department.includes('enferm')) {
        subject = 'medicina'
      } else if (department.includes('derecho') || department.includes('legal') || department.includes('juridic')) {
        subject = 'derecho'
      } else if (department.includes('admin') || department.includes('negoc') || department.includes('empresa') || department.includes('mercad')) {
        subject = 'administracion'
      } else if (department.includes('matemat') || department.includes('estadist') || department.includes('fisica') || department.includes('quimica')) {
        subject = 'matematicas'
      } else if (department.includes('liter') || department.includes('idioma') || department.includes('lengua') || department.includes('human')) {
        subject = 'literatura'
      }
      
      subjectCounts[subject] = (subjectCounts[subject] || 0) + 1
    })
    
    return NextResponse.json({
      success: true,
      counts: {
        ingenieria: subjectCounts.ingenieria || 0,
        medicina: subjectCounts.medicina || 0,
        derecho: subjectCounts.derecho || 0,
        administracion: subjectCounts.administracion || 0,
        matematicas: subjectCounts.matematicas || 0,
        literatura: subjectCounts.literatura || 0
      }
    })
  } catch (error) {
    console.error('Error fetching subject counts:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch subject counts',
        counts: {
          ingenieria: 0,
          medicina: 0,
          derecho: 0,
          administracion: 0,
          matematicas: 0,
          literatura: 0
        }
      },
      { status: 500 }
    )
  }
} 