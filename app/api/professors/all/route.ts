import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'

export async function GET() {
  try {
    // Fetch all professors from Firebase
    const professorsRef = collection(db, 'professors')
    const q = query(
      professorsRef,
      orderBy('averageRating', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    
    const professors = querySnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        name: data.name || 'Unknown Professor',
        university: data.university || 'Unknown University',
        department: data.department || 'Unknown Department',
        averageRating: data.averageRating || 0,
        totalReviews: data.totalReviews || 0,
        averageDifficulty: data.averageDifficulty || 0,
        wouldTakeAgainPercent: data.wouldTakeAgainPercent || 0,
        topTags: data.topTags || data.tags || [],
        isVerified: data.isVerified || false,
        source: data.source || 'unknown'
      }
    })

    return NextResponse.json(professors)
    
  } catch (error) {
    console.error('Error fetching all professors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch professors' },
      { status: 500 }
    )
  }
} 