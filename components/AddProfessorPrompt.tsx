'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { PlusIcon, UserPlusIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface AddProfessorPromptProps {
  institution?: string
  department?: string
  context?: 'search' | 'institution' | 'department' | 'general' | 'search-no-results' | 'search-with-results' | 'institution-empty' | 'institution-with-professors'
  className?: string
}

export default function AddProfessorPrompt({ 
  institution, 
  department, 
  context = 'general',
  className = '' 
}: AddProfessorPromptProps) {
  const { data: session } = useSession()
  const [isExpanded, setIsExpanded] = useState(false)

  const getContextualMessage = () => {
    if (context === 'search-no-results') {
      return {
        title: '¿No encontraste a tu profesor?',
        description: 'Ayúdanos a completar nuestra base de datos agregando profesores que faltan.',
        cta: '¡Agrégalo ahora!',
        icon: '🔍'
      }
    }
    
    if (context === 'search-with-results') {
      return {
        title: '¿Falta algún profesor?',
        description: 'Si conoces otros profesores que no aparecen en los resultados, agrégalos.',
        cta: 'Agregar profesor',
        icon: '➕'
      }
    }
    
    if (context === 'institution-empty') {
      return {
        title: `¡Sé el primero en agregar profesores de ${institution}!`,
        description: 'Esta universidad aún no tiene profesores en nuestra base de datos. Tu contribución será muy valiosa.',
        cta: 'Agregar primer profesor',
        icon: '🎯'
      }
    }
    
    if (context === 'institution-with-professors') {
      return {
        title: 'Ayuda a completar la lista',
        description: `${institution} tiene algunos profesores, pero seguramente faltan más. ¡Agrégalos!`,
        cta: 'Agregar más profesores',
        icon: '📚'
      }
    }
    
    if (context === 'department') {
      return {
        title: `¿Conoces profesores de ${department}?`,
        description: 'Agrega profesores específicos de este departamento.',
        cta: 'Agregar profesor del departamento',
        icon: '🏛️'
      }
    }
    
    // Default general context
    return {
      title: '¿No encuentras a tu profesor?',
      description: 'Contribuye a nuestra comunidad agregando profesores que faltan en el sistema.',
      cta: '¡Agrégalo!',
      icon: '👨‍🏫'
    }
  }

  const message = getContextualMessage()

  const getAddUrl = () => {
    const params = new URLSearchParams()
    if (institution) params.set('institution', institution)
    if (department) params.set('department', department)
    return `/agregar-profesor?${params.toString()}`
  }

  if (!isExpanded) {
    return (
      <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 ${className}`}>
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center justify-between w-full text-left group hover:bg-blue-100 rounded-lg p-2 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full group-hover:bg-blue-200 transition-colors">
              <UserPlusIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">
                {message.title}
              </p>
              <p className="text-xs text-blue-600">
                {message.description}
              </p>
            </div>
          </div>
          <PlusIcon className="h-5 w-5 text-blue-500 group-hover:text-blue-700 transition-colors" />
        </button>
      </div>
    )
  }

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 ${className}`}>
      <div className="flex items-start space-x-4">
        <div className="bg-blue-100 p-3 rounded-full">
          <UserPlusIcon className="h-6 w-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            {message.title}
          </h3>
          <p className="text-sm text-blue-700 mb-4">
            {message.description}
          </p>
          
          {session ? (
            <div className="space-y-3">
              <Link
                href={getAddUrl()}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                {message.cta}
              </Link>
              <p className="text-xs text-blue-600">
                ✓ Sesión iniciada como {session.user?.name || session.user?.email}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Agregar Tu Profesor
                </Link>
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center justify-center px-4 py-2 border border-blue-300 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Crear Cuenta
                </Link>
              </div>
              <p className="text-xs text-blue-600">
                🔒 Necesitas una cuenta para agregar profesores y mantener la calidad de la información
              </p>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-blue-400 hover:text-blue-600 transition-colors"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
} 