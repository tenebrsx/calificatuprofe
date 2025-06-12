'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

interface ReportButtonProps {
  contentType: 'review' | 'professor' | 'comment'
  contentId: string
  className?: string
}

export default function ReportButton({ contentType, contentId, className = '' }: ReportButtonProps) {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [selectedReason, setSelectedReason] = useState('')
  const [additionalInfo, setAdditionalInfo] = useState('')

  const reportReasons = [
    { id: 'inappropriate', label: 'Contenido inapropiado', description: 'Lenguaje ofensivo, sexual o vulgar' },
    { id: 'harassment', label: 'Acoso o amenazas', description: 'Intimidación o amenazas hacia personas' },
    { id: 'defamation', label: 'Difamación', description: 'Acusaciones falsas que dañan la reputación' },
    { id: 'personal-info', label: 'Información personal', description: 'Números de teléfono, direcciones, etc.' },
    { id: 'discrimination', label: 'Discriminación', description: 'Contenido discriminatorio por raza, género, religión' },
    { id: 'false-info', label: 'Información falsa', description: 'Información deliberadamente incorrecta' },
    { id: 'spam', label: 'Spam', description: 'Contenido repetitivo o comercial no deseado' },
    { id: 'other', label: 'Otro', description: 'Otra violación de términos de servicio' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedReason || !session) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentType,
          contentId,
          reason: selectedReason,
          additionalInfo,
          reportedBy: session.user?.email
        })
      })

      if (response.ok) {
        setSubmitted(true)
        setTimeout(() => {
          setIsOpen(false)
          setSubmitted(false)
          setSelectedReason('')
          setAdditionalInfo('')
        }, 2000)
      }
    } catch (error) {
      console.error('Error submitting report:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!session) {
    return null // Don't show report button to non-logged-in users
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`text-gray-400 hover:text-red-500 transition-colors ${className}`}
        title="Reportar contenido inapropiado"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  🚨 Reportar Contenido
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {submitted ? (
                <div className="text-center py-8">
                  <div className="text-green-600 text-4xl mb-4">✅</div>
                  <h4 className="text-lg font-semibold text-green-900 mb-2">
                    Reporte Enviado
                  </h4>
                  <p className="text-green-700">
                    Gracias por ayudarnos a mantener la comunidad segura. 
                    Revisaremos este contenido en 24-48 horas.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 text-sm">
                      <strong>⚠️ Importante:</strong> Los reportes falsos pueden resultar en suspensión de tu cuenta. 
                      Solo reporta contenido que genuinamente viole nuestros términos.
                    </p>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      ¿Por qué estás reportando este contenido?
                    </label>
                    <div className="space-y-2">
                      {reportReasons.map((reason) => (
                        <label key={reason.id} className="flex items-start space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="reason"
                            value={reason.id}
                            checked={selectedReason === reason.id}
                            onChange={(e) => setSelectedReason(e.target.value)}
                            className="mt-1 text-red-600 focus:ring-red-500"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{reason.label}</div>
                            <div className="text-sm text-gray-600">{reason.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Información adicional (opcional)
                    </label>
                    <textarea
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                      rows={3}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Proporciona más detalles si es necesario..."
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={!selectedReason || isSubmitting}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmitting ? 'Enviando...' : 'Enviar Reporte'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
} 