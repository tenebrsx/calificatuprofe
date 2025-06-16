import Link from 'next/link'

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Política de Privacidad</h1>
          
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Última actualización:</strong> Diciembre 2024
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Información que Recopilamos</h2>
              <p className="text-gray-700 mb-4">
                En CalificaTuProfe recopilamos la siguiente información:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Información de cuenta (nombre, email, universidad)</li>
                <li>Reseñas y calificaciones de profesores</li>
                <li>Datos de uso del sitio web</li>
                <li>Información técnica (IP, navegador, dispositivo)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Cómo Usamos tu Información</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Proporcionar y mejorar nuestros servicios</li>
                <li>Moderar contenido y prevenir abuso</li>
                <li>Comunicarnos contigo sobre tu cuenta</li>
                <li>Cumplir con obligaciones legales</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Compartir Información</h2>
              <p className="text-gray-700 mb-4">
                No vendemos tu información personal. Solo compartimos datos cuando:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Es requerido por ley</li>
                <li>Es necesario para proteger nuestros derechos</li>
                <li>Tienes tu consentimiento explícito</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Tus Derechos</h2>
              <p className="text-gray-700 mb-4">
                Bajo las leyes de República Dominicana, tienes derecho a:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Acceder a tu información personal</li>
                <li>Corregir datos inexactos</li>
                <li>Solicitar eliminación de tu cuenta</li>
                <li>Retirar consentimientos otorgados</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Contacto</h2>
              <p className="text-gray-700">
                Para ejercer tus derechos o hacer preguntas sobre privacidad, contacta:
                <br />
                <strong>Email:</strong> legal@calificatuprofe.com
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link 
              href="/" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 