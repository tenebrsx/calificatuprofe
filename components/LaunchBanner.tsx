'use client'

import { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function LaunchBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">🚀</span>
              </div>
            </div>
            <div className="text-sm font-medium">
              <span className="hidden sm:inline">
                ¡Plataforma recién lanzada! Es posible que tu profesor aún no esté registrado.
              </span>
              <span className="sm:hidden">
                ¡Recién lanzamos! Tu profesor podría no estar aún.
              </span>
              <Link 
                href="/agregar-profesor"
                className="ml-2 text-blue-100 hover:text-white underline underline-offset-2 transition-colors"
              >
                ¡Ayúdanos agregándolo!
              </Link>
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 p-1 rounded-md hover:bg-white/10 transition-colors"
            aria-label="Cerrar banner"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
} 