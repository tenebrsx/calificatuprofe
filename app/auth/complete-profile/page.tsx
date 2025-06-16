'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface Institution {
  id: string
  name: string
}

export default function CompleteProfilePage() {
  const router = useRouter()
  const { data: session, update } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    isStudent: true,
    institution: '',
  })

  // Mock institutions data - replace with API call
  const institutions: Institution[] = [
    { id: '1', name: 'INTEC' },
    { id: '2', name: 'PUCMM' },
    { id: '3', name: 'UASD' },
    { id: '4', name: 'UNPHU' },
    { id: '5', name: 'UNIBE' },
    { id: '6', name: 'UTESA' },
    { id: '7', name: 'UCNE' },
    { id: '8', name: 'O&M' },
    { id: '9', name: 'APEC' },
    { id: '10', name: 'UNICARIBE' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/user/complete-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar perfil')
      }

      // Update the session with new user data
      await update({
        ...session,
        user: {
          ...session?.user,
          name: formData.name,
          institution: formData.institution,
          isStudent: formData.isStudent,
        },
      })

      router.push('/')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al actualizar perfil')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Completa tu perfil (Opcional)
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            CalificaTuProfe es completamente anónimo. Esta información es opcional y privada.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre completo
              </label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Tu nombre completo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Eres estudiante?
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, isStudent: true }))}
                  className={`flex-1 py-2 px-4 border rounded-md ${
                    formData.isStudent
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Sí, soy estudiante
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, isStudent: false }))}
                  className={`flex-1 py-2 px-4 border rounded-md ${
                    !formData.isStudent
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  No soy estudiante
                </button>
              </div>
            </div>

            {formData.isStudent && (
              <div>
                <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-2">
                  Institución
                </label>
                <select
                  id="institution"
                  required
                  value={formData.institution}
                  onChange={(e) => setFormData(prev => ({ ...prev, institution: e.target.value }))}
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Selecciona tu universidad</option>
                  {institutions.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Omitir (mantener anónimo)
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
            >
              {loading ? 'Guardando...' : 'Guardar perfil'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 