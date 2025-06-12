import Link from 'next/link'

export default function ModeracionPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Políticas de Moderación</h1>
          
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Última actualización:</strong> Diciembre 2024
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Contenido Prohibido</h2>
              <p className="text-gray-700 mb-4">
                Las siguientes acciones están estrictamente prohibidas:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Información personal de profesores (teléfono, dirección, etc.)</li>
                <li>Contenido difamatorio o calumnioso</li>
                <li>Lenguaje ofensivo, discriminatorio o de odio</li>
                <li>Amenazas o intimidación</li>
                <li>Spam o contenido comercial no autorizado</li>
                <li>Información falsa o engañosa</li>
                <li>Contenido sexual explícito</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Sistema de Reportes</h2>
              <p className="text-gray-700 mb-4">
                Cualquier usuario puede reportar contenido inapropiado:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Los reportes se revisan en 24-48 horas</li>
                <li>El contenido reportado se oculta automáticamente</li>
                <li>Se notifica al usuario sobre la decisión</li>
                <li>Las apelaciones se procesan en 72 horas</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Consecuencias</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-800 font-medium">Sistema de Penalizaciones Progresivas:</p>
              </div>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Primera violación:</strong> Advertencia + eliminación de contenido</li>
                <li><strong>Segunda violación:</strong> Suspensión temporal (7 días)</li>
                <li><strong>Tercera violación:</strong> Suspensión extendida (30 días)</li>
                <li><strong>Violaciones graves/repetidas:</strong> Prohibición permanente</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Proceso de Apelación</h2>
              <p className="text-gray-700 mb-4">
                Si consideras que una decisión fue injusta:
              </p>
              <ol className="list-decimal pl-6 text-gray-700 space-y-2">
                <li>Envía un email a: <strong>apelaciones@calificatuprofe.com</strong></li>
                <li>Incluye el ID de la reseña y tu justificación</li>
                <li>Nuestro equipo revisará en máximo 72 horas</li>
                <li>Recibirás una respuesta con la decisión final</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Moderación Automatizada</h2>
              <p className="text-gray-700 mb-4">
                Utilizamos herramientas automáticas para:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Detectar lenguaje ofensivo</li>
                <li>Identificar información personal</li>
                <li>Prevenir spam y contenido duplicado</li>
                <li>Filtrar contenido potencialmente problemático</li>
              </ul>
            </section>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">¿Necesitas Ayuda?</h3>
              <p className="text-blue-800">
                Para reportar contenido o hacer preguntas sobre moderación:
                <br />
                <strong>Email:</strong> soporte@calificatuprofe.com
              </p>
            </div>
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