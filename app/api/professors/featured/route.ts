import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore'

export async function GET() {
  try {
    // Fetch professors with actual reviews and ratings from Firebase
    const professorsRef = collection(db, 'professors')
    const q = query(
      professorsRef, 
      where('totalReviews', '>', 0),
      where('averageRating', '>', 0),
      orderBy('averageRating', 'desc'),
      orderBy('totalReviews', 'desc'),
      limit(6)
    )
    
    const querySnapshot = await getDocs(q)
    
    const featuredProfessors = querySnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        name: data.name || 'Unknown Professor',
        university: data.university || 'Unknown University',
        department: data.department || 'Unknown Department',
        rating: data.averageRating || 0,
        totalReviews: data.totalReviews || 0,
        tags: data.topTags || data.tags || []
      }
    })

    // Only return professors with actual reviews
    return NextResponse.json(featuredProfessors)
    
  } catch (error) {
    console.error('Error fetching featured professors:', error)
    
    // Return empty array on error - no mock data
    return NextResponse.json([])
  }
} 