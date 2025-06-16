import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'

export async function GET() {
  try {
    // Fetch recent reviews from Firebase
    const reviewsRef = collection(db, 'reviews')
    const q = query(reviewsRef, orderBy('createdAt', 'desc'), limit(6))
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

    // Only return real reviews - no mock data fallback
    return NextResponse.json(recentReviews)
    
  } catch (error) {
    console.error('Error fetching recent reviews:', error)
    
    // Return empty array on error - no mock data
    return NextResponse.json([])
  }
} 