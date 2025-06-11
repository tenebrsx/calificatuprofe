import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore'

export async function GET() {
  try {
    // Fetch top-rated professors from Firebase
    const professorsRef = collection(db, 'professors')
    const q = query(
      professorsRef, 
      where('averageRating', '>=', 4.5),
      orderBy('averageRating', 'desc'), 
      orderBy('totalReviews', 'desc'),
      limit(3)
    )
    const querySnapshot = await getDocs(q)
    
    const featuredProfessors = querySnapshot.docs.map(doc => {
      const data = doc.data()
      
      return {
        id: doc.id,
        name: data.name || 'Profesor',
        university: data.university || 'Universidad',
        department: data.department || 'Departamento',
        rating: data.averageRating || 0,
        totalReviews: data.totalReviews || 0,
        tags: data.topTags || ['PROFESOR DESTACADO']
      }
    })

    // If no professors found, return mock data
    if (featuredProfessors.length === 0) {
      return NextResponse.json([
        {
          id: 1,
          name: "Dr. Roberto Jiménez",
          university: "INTEC",
          department: "Ingeniería",
          rating: 4.9,
          totalReviews: 127,
          tags: ["CLARO AL EXPLICAR", "EXÁMENES JUSTOS"]
        },
        {
          id: 2,
          name: "Dra. Carmen Valdez",
          university: "PUCMM",
          department: "Medicina",
          rating: 4.8,
          totalReviews: 95,
          tags: ["INSPIRADOR", "DISPONIBLE"]
        },
        {
          id: 3,
          name: "Prof. Luis Herrera",
          university: "UASD",
          department: "Derecho",
          rating: 4.7,
          totalReviews: 203,
          tags: ["ORGANIZADO", "FEEDBACK ÚTIL"]
        }
      ])
    }

    return NextResponse.json(featuredProfessors)
  } catch (error) {
    console.error('Error fetching featured professors:', error)
    
    // Return mock data on error
    return NextResponse.json([
      {
        id: 1,
        name: "Dr. Roberto Jiménez",
        university: "INTEC",
        department: "Ingeniería",
        rating: 4.9,
        totalReviews: 127,
        tags: ["CLARO AL EXPLICAR", "EXÁMENES JUSTOS"]
      },
      {
        id: 2,
        name: "Dra. Carmen Valdez",
        university: "PUCMM",
        department: "Medicina",
        rating: 4.8,
        totalReviews: 95,
        tags: ["INSPIRADOR", "DISPONIBLE"]
      },
      {
        id: 3,
        name: "Prof. Luis Herrera",
        university: "UASD",
        department: "Derecho",
        rating: 4.7,
        totalReviews: 203,
        tags: ["ORGANIZADO", "FEEDBACK ÚTIL"]
      }
    ])
  }
} 