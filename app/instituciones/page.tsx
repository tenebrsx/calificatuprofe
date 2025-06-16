'use client'

import { institutions } from '@/data/institutions'
import Link from 'next/link'

export default function InstitutionsPage() {
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">Instituciones Educativas</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {institutions.map((institution) => (
          <Link
            key={institution.id}
            href={`/institucion/${institution.id}`}
            className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
          >
            <h2 className="text-xl font-semibold mb-2">{institution.name}</h2>
            <div className="text-gray-600 mb-4">
              <p>{institution.location}</p>
              {institution.shortName && (
                <p className="text-sm text-gray-500">{institution.shortName}</p>
              )}
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>{institution.type === 'universidad' ? 'Universidad' : 
                    institution.type === 'instituto' ? 'Instituto' : 'Escuela'}</span>
              {institution.totalProfessors && (
                <span>{institution.totalProfessors} Profesores</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
} 