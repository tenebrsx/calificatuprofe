import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'

export async function GET() {
  try {
    // Fetch recent reviews from Firebase
    const reviewsRef = collection(db, 'reviews')
    const q = query(reviewsRef, orderBy('createdAt', 'desc'), limit(3))
    const querySnapshot = await getDocs(q)
    
    const recentReviews = querySnapshot.docs.map(doc => {
      const data = doc.data()
      const createdAt = data.createdAt?.toDate() || new Date()
      const now = new Date()
      const diffInHours = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60))
      
      let timeAgo = ''
      if (diffInHours < 1) {
        timeAgo = 'hace unos minutos'
      } else if (diffInHours < 24) {
        timeAgo = `hace ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`
      } else {
        const diffInDays = Math.floor(diffInHours / 24)
        timeAgo = `hace ${diffInDays} ${diffInDays === 1 ? 'día' : 'días'}`
      }
      
      return {
        id: doc.id,
        professorName: data.professorName || 'Profesor Anónimo',
        university: data.university || 'Universidad',
        subject: data.subject || 'Materia',
        rating: data.overallRating || 0,
        comment: data.comment || 'Sin comentario',
        timeAgo
      }
    })

    // If no reviews found, return mock data
    if (recentReviews.length === 0) {
      return NextResponse.json([
        {
          id: 1,
          professorName: "Dr. Ana García",
          university: "INTEC",
          subject: "Cálculo I",
          rating: 4.8,
          comment: "Excelente profesora, muy clara en sus explicaciones y siempre dispuesta a ayudar.",
          timeAgo: "2 horas"
        },
        {
          id: 2,
          professorName: "Prof. Carlos Mendez",
          university: "PUCMM",
          subject: "Programación",
          rating: 4.6,
          comment: "Sus clases son muy dinámicas y aprendo mucho con los proyectos prácticos.",
          timeAgo: "5 horas"
        },
        {
          id: 3,
          professorName: "Dra. María Santos",
          university: "UASD",
          subject: "Anatomía",
          rating: 4.9,
          comment: "La mejor profesora de medicina, hace que temas complejos sean fáciles de entender.",
          timeAgo: "1 día"
        }
      ])
    }

    return NextResponse.json(recentReviews)
  } catch (error) {
    console.error('Error fetching recent reviews:', error)
    
    // Return mock data on error
    return NextResponse.json([
      {
        id: 1,
        professorName: "Dr. Ana García",
        university: "INTEC",
        subject: "Cálculo I",
        rating: 4.8,
        comment: "Excelente profesora, muy clara en sus explicaciones y siempre dispuesta a ayudar.",
        timeAgo: "2 horas"
      },
      {
        id: 2,
        professorName: "Prof. Carlos Mendez",
        university: "PUCMM",
        subject: "Programación",
        rating: 4.6,
        comment: "Sus clases son muy dinámicas y aprendo mucho con los proyectos prácticos.",
        timeAgo: "5 horas"
      },
      {
        id: 3,
        professorName: "Dra. María Santos",
        university: "UASD",
        subject: "Anatomía",
        rating: 4.9,
        comment: "La mejor profesora de medicina, hace que temas complejos sean fáciles de entender.",
        timeAgo: "1 día"
      }
    ])
  }
} 