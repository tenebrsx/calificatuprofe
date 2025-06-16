'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface TermsAcceptanceModalProps {
  isOpen: boolean
  onAccept: () => void
  onDecline: () => void
}

export default function TermsAcceptanceModal({ isOpen, onAccept, onDecline }: TermsAcceptanceModalProps) {
  const [hasReadTerms, setHasReadTerms] = useState(false)
  const [acceptsResponsibility, setAcceptsResponsibility] = useState(false)
  const [understandsConsequences, setUnderstandsConsequences] = useState(false)
  const [scrolledToBottom, setScrolledToBottom] = useState(false)

  const canAccept = hasReadTerms && acceptsResponsibility && understandsConsequences && scrolledToBottom

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10
    if (isAtBottom) {
      setScrolledToBottom(true)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ⚖️ Términos de Uso - CalificaTuProfe
          </h2>
          <p className="text-gray-600">
            Debes leer y aceptar estos términos antes de continuar
          </p>
        </div>

        <div 
          className="p-6 max-h-96 overflow-y-auto"
          onScroll={handleScroll}
        >
          <div className="space-y-4 text-sm text-gray-700">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-semibold text-red-900 mb-2">🚨 RESPONSABILIDAD LEGAL TOTAL</h3>
              <p className="text-red-800">
                Al usar CalificaTuProfe, <strong>TÚ ERES COMPLETAMENTE RESPONSABLE</strong> de todo el contenido que publiques. 
                Esto incluye consecuencias legales por difamación, calumnia, o violación de derechos de terceros.
              </p>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-semibold text-yellow-900 mb-2">⚠️ NATURALEZA DE LAS RESEÑAS</h3>
              <p className="text-yellow-800">
                Todas las calificaciones y comentarios son <strong>opiniones personales</strong>, no hechos verificados. 
                CalificaTuProfe no verifica, respalda ni se hace responsable del contenido publicado.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">❌ CONTENIDO PROHIBIDO:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Difamación o acusaciones falsas</li>
                <li>Información personal (teléfonos, direcciones)</li>
                <li>Contenido sexual, amenazas o acoso</li>
                <li>Discriminación por raza, género, religión</li>
                <li>Información deliberadamente falsa</li>
                <li>Spam o contenido comercial</li>
              </ul>
            </div>

            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h3 className="font-semibold text-orange-900 mb-2">🛡️ PROTEGE TU IDENTIDAD</h3>
              <p className="text-orange-800">
                <strong>No publiques información que pueda identificarte.</strong> Los profesores pueden tomar represalias. 
                Mantén tu anonimato para tu seguridad.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">🚨 MODERACIÓN:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>El contenido reportado se oculta automáticamente</li>
                <li>Revisamos reportes en 24-48 horas</li>
                <li>Violaciones pueden resultar en suspensión permanente</li>
                <li>Actividad ilegal se reporta a autoridades</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">🏛️ JURISDICCIÓN DOMINICANA</h3>
              <p className="text-blue-800">
                Este sitio opera bajo las leyes de República Dominicana. Cualquier disputa legal será resuelta en tribunales dominicanos.
              </p>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">📞 CONTACTO LEGAL</h3>
              <p className="text-green-800">
                Para asuntos legales: <strong>legal@calificatuprofe.com</strong><br/>
                Para apelaciones: <strong>apelaciones@calificatuprofe.com</strong>
              </p>
            </div>

            {!scrolledToBottom && (
              <div className="text-center text-gray-500 text-xs">
                ↓ Desplázate hacia abajo para continuar ↓
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 space-y-4">
          <div className="space-y-3">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={hasReadTerms}
                onChange={(e) => setHasReadTerms(e.target.checked)}
                className="mt-1 text-blue-600 focus:ring-blue-500"
                disabled={!scrolledToBottom}
              />
              <span className="text-sm text-gray-700">
                He leído y entendido completamente los términos de servicio y las políticas de CalificaTuProfe
              </span>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptsResponsibility}
                onChange={(e) => setAcceptsResponsibility(e.target.checked)}
                className="mt-1 text-blue-600 focus:ring-blue-500"
                disabled={!scrolledToBottom}
              />
              <span className="text-sm text-gray-700">
                <strong>Acepto responsabilidad legal total</strong> por todo el contenido que publique en la plataforma
              </span>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={understandsConsequences}
                onChange={(e) => setUnderstandsConsequences(e.target.checked)}
                className="mt-1 text-blue-600 focus:ring-blue-500"
                disabled={!scrolledToBottom}
              />
              <span className="text-sm text-gray-700">
                Entiendo que las violaciones pueden resultar en suspensión permanente y consecuencias legales
              </span>
            </label>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onDecline}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              No Acepto
            </button>
            <button
              onClick={onAccept}
              disabled={!canAccept}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Acepto los Términos
            </button>
          </div>

          <div className="text-center">
            <Link 
              href="/terminos" 
              target="_blank"
              className="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              Ver términos completos en nueva ventana →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 