'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface Professor {
  id: string
  name: string
  department: string
  institution: string
  averageRating: number
  totalRatings: number
}

interface Rating {
  id: string
  userId: string
  courseName: string
  rating: number
  difficulty: number
  comment: string
  createdAt: Date
  wouldTakeAgain: boolean
}

export default function ProfessorPage() {
  const params = useParams()
  const professorId = params?.id as string
  const [professor, setProfessor] = useState<Professor | null>(null)
  const [ratings, setRatings] = useState<Rating[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfessorAndRatings = async () => {
      if (!professorId) return

      try {
        // Fetch professor details
        const professorDoc = await getDoc(doc(db, 'professors', professorId))
        if (!professorDoc.exists()) {
          console.error('Professor not found')
          return
        }

        setProfessor({
          id: professorDoc.id,
          ...professorDoc.data()
        } as Professor)

        // Fetch professor's ratings
        const ratingsQuery = query(
          collection(db, 'ratings'),
          where('professorId', '==', professorId)
        )
        const ratingsSnapshot = await getDocs(ratingsQuery)
        const ratingsData = ratingsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate()
        } as Rating))
        setRatings(ratingsData)
      } catch (error) {
        console.error('Error fetching professor data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfessorAndRatings()
  }, [professorId])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!professor) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <h1 className="text-2xl font-semibold mb-4">Professor not found</h1>
        <p>The professor you're looking for doesn't exist.</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{professor.name}</h1>
            <p className="text-xl text-gray-600">{professor.department}</p>
            <p className="text-lg text-gray-500">{professor.institution}</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-400">
              {professor.averageRating.toFixed(1)}
            </div>
            <p className="text-gray-500">
              {professor.totalRatings} {professor.totalRatings === 1 ? 'rating' : 'ratings'}
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Student Ratings</h2>
      {ratings.length === 0 ? (
        <p>No ratings yet. Be the first to rate this professor!</p>
      ) : (
        <div className="space-y-4">
          {ratings.map((rating) => (
            <div
              key={rating.id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-lg font-semibold mb-1">{rating.courseName}</p>
                  <p className="text-gray-500">
                    {rating.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center mb-1">
                    <span className="text-yellow-400 text-2xl mr-1">★</span>
                    <span className="text-xl">{rating.rating.toFixed(1)}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Difficulty: {rating.difficulty}/5
                  </p>
                </div>
              </div>
              <p className="text-gray-700">{rating.comment}</p>
              <p className="mt-4 text-sm text-gray-500">
                Would take again: {rating.wouldTakeAgain ? 'Yes' : 'No'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 