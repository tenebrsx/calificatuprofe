'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

interface ProfessorSubmission {
  id: string
  name: string
  institution: string
  department: string
  email?: string
  position?: string
  campus?: string
  additionalInfo?: string
  submittedBy: string
  submittedAt: string
  status: 'pending' | 'approved' | 'rejected'
  reviewedBy?: string
  reviewedAt?: string
  reviewNotes?: string
}

export default function ProfessorSubmissionsAdmin() {
  const { data: session, status } = useSession()
  const [submissions, setSubmissions] = useState<ProfessorSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')

  // Check if user is admin (you'll need to implement this logic)
  const isAdmin = session?.user?.email === 'admin@calificatuprofe.com' // Replace with your admin logic

  useEffect(() => {
    if (status === 'loading') return
    if (!session || !isAdmin) {
      redirect('/')
    }
    fetchSubmissions()
  }, [session, status, isAdmin])

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/admin/professor-submissions')
      if (response.ok) {
        const data = await response.json()
        setSubmissions(data.submissions)
      }
    } catch (error) {
      console.error('Error fetching submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReview = async (submissionId: string, action: 'approve' | 'reject', notes?: string) => {
    try {
      const response = await fetch('/api/admin/professor-submissions', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          submissionId,
          action,
          notes
        })
      })

      if (response.ok) {
        fetchSubmissions() // Refresh the list
      }
    } catch (error) {
      console.error('Error reviewing submission:', error)
    }
  }

  const filteredSubmissions = submissions.filter(submission => {
    if (filter === 'all') return true
    return submission.status === filter
  })

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full"
    switch (status) {
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800`
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando envíos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Administrar Envíos de Profesores</h1>
          <p className="mt-2 text-gray-600">
            Revisa y aprueba los profesores enviados por los estudiantes
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'pending', label: 'Pendientes', count: submissions.filter(s => s.status === 'pending').length },
                { key: 'approved', label: 'Aprobados', count: submissions.filter(s => s.status === 'approved').length },
                { key: 'rejected', label: 'Rechazados', count: submissions.filter(s => s.status === 'rejected').length },
                { key: 'all', label: 'Todos', count: submissions.length }
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

        {/* Submissions List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredSubmissions.map((submission) => (
              <li key={submission.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">
                        {submission.name}
                      </h3>
                      <span className={getStatusBadge(submission.status)}>
                        {submission.status === 'pending' ? 'Pendiente' : 
                         submission.status === 'approved' ? 'Aprobado' : 'Rechazado'}
                      </span>
                    </div>
                    
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Universidad:</span> {submission.institution}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Departamento:</span> {submission.department}
                        </p>
                        {submission.email && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Email:</span> {submission.email}
                          </p>
                        )}
                        {submission.position && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Posición:</span> {submission.position}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Enviado por:</span> {submission.submittedBy}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Fecha:</span> {new Date(submission.submittedAt).toLocaleDateString('es-DO')}
                        </p>
                        {submission.campus && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Campus:</span> {submission.campus}
                          </p>
                        )}
                      </div>
                    </div>

                    {submission.additionalInfo && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Información adicional:</span>
                        </p>
                        <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded mt-1">
                          {submission.additionalInfo}
                        </p>
                      </div>
                    )}

                    {submission.reviewNotes && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Notas de revisión:</span>
                        </p>
                        <p className="text-sm text-gray-700 bg-blue-50 p-2 rounded mt-1">
                          {submission.reviewNotes}
                        </p>
                      </div>
                    )}
                  </div>

                  {submission.status === 'pending' && (
                    <div className="ml-6 flex space-x-3">
                      <button
                        onClick={() => handleReview(submission.id, 'approve')}
                        className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                      >
                        Aprobar
                      </button>
                      <button
                        onClick={() => {
                          const notes = prompt('Notas de rechazo (opcional):')
                          handleReview(submission.id, 'reject', notes || undefined)
                        }}
                        className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                      >
                        Rechazar
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {filteredSubmissions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No hay envíos {filter !== 'all' ? filter : ''} en este momento.
              </p>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Total Envíos</h3>
            <p className="text-3xl font-bold text-blue-600">{submissions.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Pendientes</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {submissions.filter(s => s.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Aprobados</h3>
            <p className="text-3xl font-bold text-green-600">
              {submissions.filter(s => s.status === 'approved').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Rechazados</h3>
            <p className="text-3xl font-bold text-red-600">
              {submissions.filter(s => s.status === 'rejected').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 