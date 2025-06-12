import Link from 'next/link'

export default function ReportarPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Reportar Contenido</h1>
          
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6">
              Ayúdanos a mantener CalificaTuProfe como un espacio seguro y constructivo para todos los estudiantes.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">¿Cuándo Reportar?</h2>
              <p className="text-gray-700 mb-4">
                Reporta contenido que viole nuestras políticas:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Información personal de profesores</li>
                <li>Lenguaje ofensivo o discriminatorio</li>
                <li>Amenazas o intimidación</li>
                <li>Contenido falso o engañoso</li>
                <li>Spam o contenido comercial</li>
                <li>Violación de derechos de autor</li>
                <li>Contenido sexual inapropiado</li>
                <li>Incitación al odio</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cómo Reportar</h2>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Método 1: Botón de Reporte</h3>
                <p className="text-blue-800">
                  Cada reseña tiene un botón "Reportar" que permite reportar contenido directamente desde la página.
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-green-900 mb-3">Método 2: Email Directo</h3>
                <p className="text-green-800 mb-2">
                  Envía un email a: <strong>soporte@calificatuprofe.com</strong>
                </p>
                <p className="text-green-700 text-sm">
                  Incluye: URL de la reseña, motivo del reporte, y cualquier información adicional relevante.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Proceso de Revisión</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Reporte Recibido</h4>
                    <p className="text-gray-700 text-sm">El contenido se oculta automáticamente mientras se revisa</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Revisión Manual</h4>
                    <p className="text-gray-700 text-sm">Nuestro equipo revisa el contenido en 24-48 horas</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Decisión</h4>
                    <p className="text-gray-700 text-sm">Se toma acción apropiada y se notifica a los usuarios involucrados</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Reportes Falsos</h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">
                  <strong>Advertencia:</strong> Los reportes falsos o malintencionados pueden resultar en la suspensión de tu cuenta. 
                  Solo reporta contenido que genuinamente viole nuestras políticas.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contacto de Emergencia</h2>
              <p className="text-gray-700 mb-4">
                Para situaciones urgentes que requieren atención inmediata:
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">
                  <strong>Email de Emergencia:</strong> legal@calificatuprofe.com
                  <br />
                  <span className="text-sm">Para amenazas, contenido ilegal, o situaciones que requieren intervención legal</span>
                </p>
              </div>
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