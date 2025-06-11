'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Link from 'next/link'

interface Institution {
  id: string
  name: string
  location: string
  totalProfessors: number
  totalRatings: number
}

export default function InstitutionsPage() {
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'institutions'))
        const institutionsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Institution))
        setInstitutions(institutionsData)
      } catch (error) {
        console.error('Error fetching institutions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInstitutions()
  }, [])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-8">Institutions</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">Institutions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {institutions.map((institution) => (
          <Link
            key={institution.id}
            href={`/institution/${institution.id}`}
            className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
          >
            <h2 className="text-xl font-semibold mb-2">{institution.name}</h2>
            <p className="text-gray-600 mb-4">{institution.location}</p>
            <div className="flex justify-between text-sm text-gray-500">
              <span>{institution.totalProfessors} Professors</span>
              <span>{institution.totalRatings} Ratings</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
} 