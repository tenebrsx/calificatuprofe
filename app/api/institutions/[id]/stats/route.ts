import { NextRequest, NextResponse } from 'next/server'
import { collection, query, where, getDocs, getCountFromServer } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const universityId = params.id.toUpperCase()
    
    // Get total professor count for this university
    const professorsRef = collection(db, 'professors')
    const universityQuery = query(professorsRef, where('university', '==', universityId))
    const snapshot = await getCountFromServer(universityQuery)
    const totalProfessors = snapshot.data().count
    
    // Get department breakdown
    const fullSnapshot = await getDocs(universityQuery)
    const departmentStats: Record<string, { count: number, ratings: number[] }> = {}
    
    fullSnapshot.docs.forEach(doc => {
      const data = doc.data()
      const department = data.department || 'Sin departamento'
      
      if (!departmentStats[department]) {
        departmentStats[department] = { count: 0, ratings: [] }
      }
      
      departmentStats[department].count++
      if (data.averageRating) {
        departmentStats[department].ratings.push(data.averageRating)
      }
    })
    
    // Calculate department averages
    const departments = Object.entries(departmentStats).map(([name, stats]) => ({
      name,
      professorCount: stats.count,
      averageRating: stats.ratings.length > 0 
        ? stats.ratings.reduce((sum, rating) => sum + rating, 0) / stats.ratings.length 
        : 0
    }))
    
    // Calculate overall average rating
    const allRatings = Object.values(departmentStats).flatMap(dept => dept.ratings)
    const averageRating = allRatings.length > 0 
      ? allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length 
      : 0
    
    return NextResponse.json({
      success: true,
      data: {
        totalProfessors,
        averageRating: Math.round(averageRating * 10) / 10,
        departmentCount: departments.length,
        departments: departments.sort((a, b) => b.professorCount - a.professorCount)
      }
    })
  } catch (error) {
    console.error('Error fetching university stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch university statistics' },
      { status: 500 }
    )
  }
} 