'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs, doc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore'

interface Professor {
  id: string
  name: string
  email: string
  university: string
  school: string
  department: string
  campus: string
  averageRating: number
  totalReviews: number
  isVerified: boolean
  source: string
  lastScraped?: any
  createdAt?: any
}

export default function AdminProfessorsPage() {
  const [professors, setProfessors] = useState<Professor[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({
    university: '',
    department: '',
    verified: 'all'
  })

  useEffect(() => {
    fetchProfessors()
  }, [])

  const fetchProfessors = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'professors'))
      const professorData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Professor[]
      
      setProfessors(professorData)
    } catch (error: unknown) {
      console.error('Error fetching professors:', error)
    } finally {
      setLoading(false)
    }
  }

  const verifyProfessor = async (professorId: string) => {
    try {
      await updateDoc(doc(db, 'professors', professorId), {
        isVerified: true,
        updatedAt: new Date()
      })
      
      setProfessors(prev => 
        prev.map(prof => 
          prof.id === professorId ? { ...prof, isVerified: true } : prof
        )
      )
    } catch (error: unknown) {
      console.error('Error verifying professor:', error)
    }
  }

  const deleteProfessor = async (professorId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este profesor?')) return
    
    try {
      await deleteDoc(doc(db, 'professors', professorId))
      setProfessors(prev => prev.filter(prof => prof.id !== professorId))
    } catch (error: unknown) {
      console.error('Error deleting professor:', error)
    }
  }

  const runScraper = async (university: string) => {
    try {
      const response = await fetch('/api/admin/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'scrape-single', university })
      })
      
      const result = await response.json()
      if (result.success) {
        alert(`✅ Scraping completado para ${university.toUpperCase()}: ${result.data.professorsFound} profesores`)
        fetchProfessors() // Refresh the list
      } else {
        alert(`❌ Error: ${result.error}`)
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(`❌ Error: ${error.message}`)
      } else {
        alert(`❌ Error desconocido: ${String(error)}`)
      }
    }
  }

  const filteredProfessors = professors.filter(prof => {
    if (filter.university && prof.university !== filter.university) return false
    if (filter.department && prof.department !== filter.department) return false
    if (filter.verified === 'verified' && !prof.isVerified) return false
    if (filter.verified === 'unverified' && prof.isVerified) return false
    return true
  })

  const universities = Array.from(new Set(professors.map(p => p.university)))
  const departments = Array.from(new Set(professors.map(p => p.department)))

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando profesores...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              📚 Administrar Profesores
            </h1>
            <p className="mt-1 text-gray-600">
              Total: {professors.length} profesores | Filtrados: {filteredProfessors.length}
            </p>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 bg-blue-50 border-b border-gray-200">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => runScraper('pucmm')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                🔄 Scrape PUCMM
              </button>
              
              <button
                onClick={fetchProfessors}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                🔄 Actualizar Lista
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={filter.university}
                onChange={(e) => setFilter(prev => ({ ...prev, university: e.target.value }))}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Todas las universidades</option>
                {universities.map(uni => (
                  <option key={uni} value={uni}>{uni}</option>
                ))}
              </select>

              <select
                value={filter.department}
                onChange={(e) => setFilter(prev => ({ ...prev, department: e.target.value }))}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Todos los departamentos</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>

              <select
                value={filter.verified}
                onChange={(e) => setFilter(prev => ({ ...prev, verified: e.target.value }))}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">Todos</option>
                <option value="verified">Verificados</option>
                <option value="unverified">No verificados</option>
              </select>
            </div>
          </div>

          {/* Professors List */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profesor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Universidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Departamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campus
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProfessors.map((professor) => (
                  <tr key={professor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {professor.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {professor.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {professor.university}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {professor.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {professor.campus}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        professor.isVerified 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {professor.isVerified ? '✅ Verificado' : '⏳ Pendiente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {!professor.isVerified && (
                        <button
                          onClick={() => verifyProfessor(professor.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          ✅ Verificar
                        </button>
                      )}
                      <button
                        onClick={() => deleteProfessor(professor.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProfessors.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron profesores con los filtros seleccionados.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 