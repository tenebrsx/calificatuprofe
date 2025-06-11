'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Link from 'next/link'

interface Institution {
  id: string
  name: string
  location: string
  totalProfessors: number
  totalRatings: number
}

interface Professor {
  id: string
  name: string
  department: string
  averageRating: number
  totalRatings: number
}

export default function InstitutionPage() {
  const params = useParams()
  const institutionId = params?.id as string
  const [institution, setInstitution] = useState<Institution | null>(null)
  const [professors, setProfessors] = useState<Professor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInstitutionAndProfessors = async () => {
      if (!institutionId) return

      try {
        // Fetch institution details
        const institutionDoc = await getDoc(doc(db, 'institutions', institutionId))
        if (!institutionDoc.exists()) {
          console.error('Institution not found')
          return
        }

        setInstitution({
          id: institutionDoc.id,
          ...institutionDoc.data()
        } as Institution)

        // Fetch institution's professors
        const professorsQuery = query(
          collection(db, 'professors'),
          where('institutionId', '==', institutionId)
        )
        const professorsSnapshot = await getDocs(professorsQuery)
        const professorsData = professorsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Professor))
        setProfessors(professorsData)
      } catch (error) {
        console.error('Error fetching institution data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInstitutionAndProfessors()
  }, [institutionId])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!institution) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <h1 className="text-2xl font-semibold mb-4">Institution not found</h1>
        <p>The institution you're looking for doesn't exist.</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold mb-2">{institution.name}</h1>
        <p className="text-xl text-gray-600 mb-4">{institution.location}</p>
        <div className="flex gap-4 text-gray-500">
          <span>{institution.totalProfessors} Professors</span>
          <span>•</span>
          <span>{institution.totalRatings} Total Ratings</span>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Professors</h2>
      {professors.length === 0 ? (
        <p>No professors found for this institution.</p>
      ) : (
        <div className="space-y-4">
          {professors.map((professor) => (
            <Link
              key={professor.id}
              href={`/professor/${professor.id}`}
              className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold mb-1">{professor.name}</h3>
                  <p className="text-gray-600">{professor.department}</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {professor.averageRating.toFixed(1)}
                  </div>
                  <p className="text-sm text-gray-500">
                    {professor.totalRatings} {professor.totalRatings === 1 ? 'rating' : 'ratings'}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
} 