'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { PlusIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface AddSubjectPromptProps {
  professorId: string
  professorName: string
  onSubjectAdded?: (subject: string) => void
}

export default function AddSubjectPrompt({ professorId, professorName, onSubjectAdded }: AddSubjectPromptProps) {
  const { data: session } = useSession()
  const [showForm, setShowForm] = useState(false)
  const [subject, setSubject] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!session) {
    return null // Only show to logged-in users
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/professors/add-subject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          professorId,
          subject: subject.trim(),
          userId: session.user?.email,
        }),
      })

      if (response.ok) {
        onSubjectAdded?.(subject.trim())
        setSubject('')
        setShowForm(false)
        // Show success message
        alert('¡Gracias! Tu sugerencia de materia ha sido enviada para revisión.')
      } else {
        alert('Error al enviar la sugerencia. Inténtalo de nuevo.')
      }
    } catch (error) {
      console.error('Error adding subject:', error)
      alert('Error al enviar la sugerencia. Inténtalo de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showForm) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-blue-900 mb-1">
              ¿Qué materia enseña {professorName}?
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ej: Cálculo I, Programación, Historia Dominicana..."
              className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
              autoFocus
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isSubmitting || !subject.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              {isSubmitting ? 'Enviando...' : 'Agregar materia'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setSubject('')
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <PlusIcon className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-blue-900 font-medium">
              Parece que este profesor no tiene materias específicas
            </p>
            <p className="text-blue-700 text-sm">
              ¡Ayuda a otros estudiantes agregando las materias que enseña!
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Agregar materia
        </button>
      </div>
    </div>
  )
} 