'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { CheckIcon, XMarkIcon, ClockIcon } from '@heroicons/react/24/outline'

interface SubjectSuggestion {
  id: string
  professorId: string
  professorName?: string
  subject: string
  suggestedBy: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: Date
  reviewedAt?: Date
  reviewedBy?: string
  reviewNotes?: string
}

export default function SubjectSuggestionsAdmin() {
  const { data: session } = useSession()
  const [suggestions, setSuggestions] = useState<SubjectSuggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')

  useEffect(() => {
    fetchSuggestions()
  }, [])

  const fetchSuggestions = async () => {
    try {
      const response = await fetch('/api/admin/subject-suggestions')
      if (response.ok) {
        const data = await response.json()
        setSuggestions(data.suggestions || [])
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReview = async (suggestionId: string, action: 'approve' | 'reject', notes?: string) => {
    try {
      const response = await fetch('/api/admin/subject-suggestions', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          suggestionId,
          action,
          reviewNotes: notes,
          reviewedBy: session?.user?.email,
        }),
      })

      if (response.ok) {
        fetchSuggestions() // Refresh the list
      } else {
        alert('Error al procesar la sugerencia')
      }
    } catch (error) {
      console.error('Error reviewing suggestion:', error)
      alert('Error al procesar la sugerencia')
    }
  }

  const filteredSuggestions = suggestions.filter(suggestion => {
    if (filter === 'all') return true
    return suggestion.status === filter
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
      case 'approved':
        return <CheckIcon className="h-5 w-5 text-green-500" />
      case 'rejected':
        return <XMarkIcon className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso restringido</h1>
          <p className="text-gray-600">Debes iniciar sesión para acceder a esta página.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Gestión de Sugerencias de Materias
          </h1>
          <p className="text-gray-600">
            Revisa y aprueba las sugerencias de materias enviadas por los usuarios.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'pending', label: 'Pendientes', count: suggestions.filter(s => s.status === 'pending').length },
                { key: 'approved', label: 'Aprobadas', count: suggestions.filter(s => s.status === 'approved').length },
                { key: 'rejected', label: 'Rechazadas', count: suggestions.filter(s => s.status === 'rejected').length },
                { key: 'all', label: 'Todas', count: suggestions.length },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    filter === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Suggestions List */}
        <div className="space-y-4">
          {filteredSuggestions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <ClockIcon className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay sugerencias {filter !== 'all' ? filter : ''}
              </h3>
              <p className="text-gray-500">
                {filter === 'pending' 
                  ? 'No hay sugerencias pendientes de revisión.'
                  : 'No se encontraron sugerencias con este filtro.'
                }
              </p>
            </div>
          ) : (
            filteredSuggestions.map((suggestion) => (
              <div key={suggestion.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(suggestion.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(suggestion.status)}`}>
                        {suggestion.status === 'pending' ? 'Pendiente' :
                         suggestion.status === 'approved' ? 'Aprobada' : 'Rechazada'}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Materia: <span className="text-blue-600">{suggestion.subject}</span>
                    </h3>
                    
                    <p className="text-gray-600 mb-2">
                      Profesor: {suggestion.professorName || `ID: ${suggestion.professorId}`}
                    </p>
                    
                    <div className="text-sm text-gray-500 space-y-1">
                      <p>Sugerido por: {suggestion.suggestedBy}</p>
                      <p>Fecha: {new Date(suggestion.createdAt).toLocaleDateString('es-DO')}</p>
                      {suggestion.reviewedAt && (
                        <p>Revisado: {new Date(suggestion.reviewedAt).toLocaleDateString('es-DO')} por {suggestion.reviewedBy}</p>
                      )}
                      {suggestion.reviewNotes && (
                        <p className="text-gray-700 mt-2">
                          <strong>Notas:</strong> {suggestion.reviewNotes}
                        </p>
                      )}
                    </div>
                  </div>

                  {suggestion.status === 'pending' && (
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleReview(suggestion.id, 'approve')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2"
                      >
                        <CheckIcon className="h-4 w-4" />
                        Aprobar
                      </button>
                      <button
                        onClick={() => {
                          const notes = prompt('Razón del rechazo (opcional):')
                          handleReview(suggestion.id, 'reject', notes || undefined)
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center gap-2"
                      >
                        <XMarkIcon className="h-4 w-4" />
                        Rechazar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Statistics */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {suggestions.length}
            </div>
            <p className="text-gray-600">Total de sugerencias</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {suggestions.filter(s => s.status === 'pending').length}
            </div>
            <p className="text-gray-600">Pendientes</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {suggestions.filter(s => s.status === 'approved').length}
            </div>
            <p className="text-gray-600">Aprobadas</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {suggestions.filter(s => s.status === 'rejected').length}
            </div>
            <p className="text-gray-600">Rechazadas</p>
          </div>
        </div>
      </div>
    </div>
  )
} 