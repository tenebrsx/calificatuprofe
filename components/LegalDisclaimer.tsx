'use client'

import { useState } from 'react'
import Link from 'next/link'

interface LegalDisclaimerProps {
  variant?: 'banner' | 'card' | 'inline'
  className?: string
}

export default function LegalDisclaimer({ variant = 'banner', className = '' }: LegalDisclaimerProps) {
  const [isDismissed, setIsDismissed] = useState(false)

  if (variant === 'banner' && isDismissed) {
    return null
  }

  const bannerContent = (
    <div className={`bg-yellow-50 border border-yellow-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-yellow-600">⚠️</div>
            <div className="text-sm text-yellow-800">
              <strong>Aviso Legal:</strong> Las reseñas son opiniones estudiantiles, no hechos verificados. 
              Los usuarios son responsables de su contenido.{' '}
              <Link href="/terminos" className="underline hover:text-yellow-900">
                Ver términos completos
              </Link>
            </div>
          </div>
          <button
            onClick={() => setIsDismissed(true)}
            className="text-yellow-600 hover:text-yellow-800 ml-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )

  const cardContent = (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        <div className="text-blue-600 text-xl">ℹ️</div>
        <div className="flex-1">
          <h3 className="font-semibold text-blue-900 mb-2">
            Importante: Sobre las Reseñas
          </h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>
              • <strong>Opiniones personales:</strong> Todas las calificaciones son experiencias subjetivas de estudiantes
            </p>
            <p>
              • <strong>No verificadas:</strong> CalificaTuProfe no confirma la veracidad de los comentarios
            </p>
            <p>
              • <strong>Responsabilidad del usuario:</strong> Cada persona es responsable de lo que publica
            </p>
            <p>
              • <strong>Uso académico:</strong> Esta información debe usarse solo como referencia educativa
            </p>
          </div>
          <div className="mt-3">
            <Link 
              href="/terminos" 
              className="text-blue-700 hover:text-blue-900 underline text-sm font-medium"
            >
              Leer términos completos →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )

  const inlineContent = (
    <div className={`text-xs text-gray-600 ${className}`}>
      <span className="inline-flex items-center space-x-1">
        <span>⚠️</span>
        <span>
          Opiniones estudiantiles no verificadas. 
          <Link href="/terminos" className="underline hover:text-gray-800 ml-1">
            Ver términos
          </Link>
        </span>
      </span>
    </div>
  )

  switch (variant) {
    case 'banner':
      return bannerContent
    case 'card':
      return cardContent
    case 'inline':
      return inlineContent
    default:
      return bannerContent
  }
} 