import { NextResponse } from 'next/server'
import { collection, addDoc, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'

export async function GET() {
  try {
    console.log('🔍 Testing database read...')
    
    // Try to read from professors collection
    const professorsSnapshot = await getDocs(collection(db, 'professors'))
    console.log(`📊 Found ${professorsSnapshot.size} professors in database`)
    
    const professors = professorsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json({
      success: true,
      message: 'Database read successful',
      data: {
        totalProfessors: professorsSnapshot.size,
        sampleProfessors: professors.slice(0, 3)
      }
    })
  } catch (error) {
    console.error('❌ Database read failed:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}

export async function POST() {
  try {
    console.log('🧪 Testing database write...')
    
    // Try to write a test professor
    const testProfessor = {
      name: 'Test Professor',
      email: 'test@test.com',
      university: 'TEST',
      department: 'Test Department',
      campus: 'Test Campus',
      averageRating: 0,
      totalReviews: 0,
      isVerified: false,
      source: 'database_test',
      createdAt: new Date(),
      lastScraped: new Date()
    }

    const docRef = await addDoc(collection(db, 'professors'), testProfessor)
    console.log('✅ Test professor saved with ID:', docRef.id)

    return NextResponse.json({
      success: true,
      message: 'Database write successful',
      data: {
        testProfessorId: docRef.id,
        testData: testProfessor
      }
    })
  } catch (error) {
    console.error('❌ Database write failed:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
} 