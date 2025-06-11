'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

interface UserProfile {
  name: string
  email: string
  image: string | null
  isStudent: boolean
  institution: string
  bio: string
  socialLinks: {
    twitter?: string
    linkedin?: string
    github?: string
  }
}

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    image: null,
    isStudent: true,
    institution: '',
    bio: '',
    socialLinks: {}
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // For anonymous reviews, only show minimal profile data
        setProfile({
          name: session?.user?.name || 'Usuario Anónimo',
          email: session?.user?.email || '',
          image: session?.user?.image || null,
          isStudent: true,
          institution: '', // Don't assume institution
          bio: '', // Empty bio by default
          socialLinks: {
            twitter: '',
            linkedin: '',
            github: ''
          }
        })
      } catch (error) {
        setError('Error al cargar el perfil')
      } finally {
        setLoading(false)
      }
    }

    if (session?.user) {
      fetchProfile()
    } else {
      setLoading(false)
    }
  }, [session])

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar perfil')
      }

      await update({
        ...session,
        user: {
          ...session?.user,
          name: profile.name,
          image: profile.image,
        },
      })

      setSuccess('Perfil actualizado exitosamente')
      setIsEditing(false)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al actualizar perfil')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          {/* Header */}
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tu Perfil</h1>
              <p className="text-sm text-gray-600 mt-1">
                CalificaTuProfe utiliza un sistema de reseñas anónimo. Tu información personal no se mostrará públicamente.
              </p>
            </div>
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              disabled={saving}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                isEditing
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Editar perfil'}
            </button>
          </div>

          {/* Messages */}
          {error && (
            <div className="mx-4 my-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="mx-4 my-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          {/* Profile Content */}
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="space-y-6">
              {/* Profile Image */}
              <div className="flex items-center space-x-4">
                <div className="relative w-20 h-20">
                  <Image
                    src={profile.image || '/default-avatar.png'}
                    alt={profile.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                {isEditing && (
                  <button className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                    Cambiar foto
                  </button>
                )}
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{profile.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{profile.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Institución</label>
                  {isEditing ? (
                    <select
                      value={profile.institution}
                      onChange={(e) => setProfile(prev => ({ ...prev, institution: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="">Preferir no especificar (recomendado para anonimato)</option>
                      <option value="INTEC">INTEC</option>
                      <option value="PUCMM">PUCMM</option>
                      <option value="UASD">UASD</option>
                      <option value="UNPHU">UNPHU</option>
                      <option value="UNIBE">UNIBE</option>
                      <option value="UTESA">UTESA</option>
                      <option value="UCNE">UCNE</option>
                      <option value="O&M">O&M</option>
                      <option value="APEC">APEC</option>
                      <option value="UNICARIBE">UNICARIBE</option>
                      <option value="OTRA">Otra universidad</option>
                    </select>
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">
                      {profile.institution || 'No especificado (anónimo)'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Tipo de usuario</label>
                  {isEditing ? (
                    <select
                      value={profile.isStudent ? 'student' : 'other'}
                      onChange={(e) => setProfile(prev => ({ ...prev, isStudent: e.target.value === 'student' }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="student">Estudiante</option>
                      <option value="other">No estudiante</option>
                    </select>
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">
                      {profile.isStudent ? 'Estudiante' : 'No estudiante'}
                    </p>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Biografía</label>
                {isEditing ? (
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{profile.bio}</p>
                )}
              </div>

              {/* Social Links */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Redes sociales</label>
                <div className="space-y-3">
                  {Object.entries(profile.socialLinks).map(([platform, url]) => (
                    <div key={platform} className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500 capitalize w-20">{platform}</span>
                      {isEditing ? (
                        <input
                          type="url"
                          value={url}
                          onChange={(e) => setProfile(prev => ({
                            ...prev,
                            socialLinks: {
                              ...prev.socialLinks,
                              [platform]: e.target.value
                            }
                          }))}
                          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          placeholder={`URL de ${platform}`}
                        />
                      ) : (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {url}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 