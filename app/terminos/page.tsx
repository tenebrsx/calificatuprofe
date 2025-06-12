'use client'

import { useState } from 'react'

export default function TermsOfService() {
  const [activeSection, setActiveSection] = useState('general')

  const sections = [
    { id: 'general', title: 'Términos Generales', icon: '📋' },
    { id: 'responsibility', title: 'Responsabilidad del Usuario', icon: '⚖️' },
    { id: 'content', title: 'Contenido y Opiniones', icon: '💬' },
    { id: 'moderation', title: 'Moderación', icon: '🛡️' },
    { id: 'privacy', title: 'Privacidad', icon: '🔒' },
    { id: 'legal', title: 'Aspectos Legales', icon: '⚖️' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Términos de Servicio
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Al usar CalificaTuProfe, aceptas estos términos y te comprometes a usarlo responsablemente
          </p>
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg max-w-4xl mx-auto">
            <p className="text-red-800 font-medium">
              ⚠️ <strong>IMPORTANTE:</strong> Estas son opiniones estudiantiles, no hechos verificados. 
              Los usuarios son completamente responsables de sus comentarios.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation */}
          <div className="lg:col-span-1">
            <nav className="sticky top-8">
              <ul className="space-y-2">
                {sections.map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                        activeSection === section.id
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-2">{section.icon}</span>
                      {section.title}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-8">
              
              {activeSection === 'general' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">📋 Términos Generales</h2>
                  
                  <div className="space-y-6">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-2">🎯 Propósito del Sitio</h3>
                      <p className="text-blue-800">
                        CalificaTuProfe es una plataforma para que estudiantes dominicanos compartan 
                        <strong> opiniones académicas</strong> sobre profesores universitarios. 
                        NO es una fuente de información verificada.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">✅ Al usar este sitio, aceptas:</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Ser mayor de 18 años o tener permiso parental</li>
                        <li>Ser estudiante universitario en República Dominicana</li>
                        <li>Proporcionar información veraz en tu registro</li>
                        <li>Usar el sitio solo para fines académicos legítimos</li>
                        <li>Respetar a todos los usuarios y profesores</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Advertencia Legal</h3>
                      <p className="text-yellow-800">
                        <strong>TODAS las reseñas son opiniones personales de estudiantes.</strong> 
                        CalificaTuProfe no verifica, respalda ni se hace responsable del contenido 
                        publicado por usuarios.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'responsibility' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">⚖️ Responsabilidad del Usuario</h2>
                  
                  <div className="space-y-6">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h3 className="font-semibold text-red-900 mb-2">🚨 TÚ ERES COMPLETAMENTE RESPONSABLE</h3>
                      <p className="text-red-800 mb-3">
                        Al publicar contenido, aceptas <strong>responsabilidad legal total</strong> por:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-red-700">
                        <li>Toda información que publiques</li>
                        <li>Cualquier daño causado por tus comentarios</li>
                        <li>Consecuencias legales de difamación o calumnia</li>
                        <li>Violaciones de privacidad o derechos de terceros</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">❌ ESTÁ PROHIBIDO:</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li><strong>Difamación:</strong> Acusaciones falsas que dañen la reputación</li>
                        <li><strong>Información personal:</strong> Números de teléfono, direcciones, etc.</li>
                        <li><strong>Contenido sexual o inapropiado</strong></li>
                        <li><strong>Amenazas o acoso</strong></li>
                        <li><strong>Discriminación</strong> por raza, género, religión, etc.</li>
                        <li><strong>Información falsa deliberada</strong></li>
                        <li><strong>Spam o contenido comercial</strong></li>
                      </ul>
                    </div>

                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <h3 className="font-semibold text-orange-900 mb-2">🛡️ Protégete</h3>
                      <p className="text-orange-800">
                        <strong>No publiques información que pueda identificarte.</strong> 
                        Los profesores pueden tomar represalias. Mantén tu anonimato para tu seguridad.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'content' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">💬 Contenido y Opiniones</h2>
                  
                  <div className="space-y-6">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-2">📝 Naturaleza de las Reseñas</h3>
                      <p className="text-blue-800">
                        Todas las calificaciones y comentarios son <strong>opiniones subjetivas</strong> 
                        basadas en experiencias personales. No son evaluaciones oficiales ni hechos verificados.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">✅ Contenido Permitido:</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Opiniones honestas sobre métodos de enseñanza</li>
                        <li>Comentarios sobre claridad de explicaciones</li>
                        <li>Evaluación de la dificultad del curso</li>
                        <li>Experiencias con exámenes y tareas</li>
                        <li>Recomendaciones académicas constructivas</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">❌ Contenido Prohibido:</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Ataques personales o insultos</li>
                        <li>Comentarios sobre apariencia física</li>
                        <li>Acusaciones de conducta criminal sin pruebas</li>
                        <li>Información sobre vida privada del profesor</li>
                        <li>Contenido que incite al odio</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h3 className="font-semibold text-green-900 mb-2">💡 Consejos para Reseñas Útiles</h3>
                      <ul className="list-disc list-inside space-y-1 text-green-800">
                        <li>Sé específico sobre el curso y semestre</li>
                        <li>Enfócate en aspectos académicos</li>
                        <li>Sé constructivo, no destructivo</li>
                        <li>Ayuda a otros estudiantes a tomar decisiones informadas</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'moderation' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">🛡️ Moderación y Reportes</h2>
                  
                  <div className="space-y-6">
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <h3 className="font-semibold text-purple-900 mb-2">👮‍♂️ Sistema de Moderación</h3>
                      <p className="text-purple-800">
                        Revisamos todo el contenido reportado. El contenido problemático se oculta 
                        inmediatamente hasta ser revisado por nuestro equipo.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">🚨 Proceso de Reportes:</h3>
                      <ol className="list-decimal list-inside space-y-2 text-gray-700">
                        <li>Usuario reporta contenido inapropiado</li>
                        <li>Contenido se oculta automáticamente</li>
                        <li>Equipo de moderación revisa en 24-48 horas</li>
                        <li>Decisión: mantener, editar o eliminar</li>
                        <li>Usuario infractor puede recibir advertencia o suspensión</li>
                      </ol>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">⚡ Acciones Disciplinarias:</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li><strong>Primera ofensa:</strong> Advertencia y eliminación de contenido</li>
                        <li><strong>Segunda ofensa:</strong> Suspensión temporal (7-30 días)</li>
                        <li><strong>Ofensas graves:</strong> Suspensión permanente</li>
                        <li><strong>Actividad ilegal:</strong> Reporte a autoridades</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h3 className="font-semibold text-yellow-900 mb-2">⚖️ Apelaciones</h3>
                      <p className="text-yellow-800">
                        Si crees que tu contenido fue eliminado injustamente, puedes apelar 
                        contactando a <strong>apelaciones@calificatuprofe.com</strong> dentro de 7 días.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'privacy' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">🔒 Privacidad y Datos</h2>
                  
                  <div className="space-y-6">
                    <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                      <h3 className="font-semibold text-indigo-900 mb-2">📊 Información que Recopilamos</h3>
                      <ul className="list-disc list-inside space-y-1 text-indigo-800">
                        <li>Email verificado (requerido para registro)</li>
                        <li>Universidad y carrera (para verificación)</li>
                        <li>Contenido que publicas</li>
                        <li>Datos de uso del sitio (analytics)</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">🔐 Cómo Protegemos tu Información:</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Encriptación de datos sensibles</li>
                        <li>Acceso limitado solo a administradores</li>
                        <li>No vendemos información a terceros</li>
                        <li>Cumplimiento con leyes de privacidad dominicanas</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">👁️ Anonimato Público:</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Tus reseñas aparecen como "Estudiante Anónimo"</li>
                        <li>No mostramos tu nombre real públicamente</li>
                        <li>Mantenemos registro interno para moderación</li>
                        <li>Solo revelamos identidad por orden judicial</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h3 className="font-semibold text-red-900 mb-2">⚠️ Excepciones Legales</h3>
                      <p className="text-red-800">
                        Podemos revelar tu identidad si es requerido por ley dominicana, 
                        orden judicial, o para prevenir daño inminente.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'legal' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">⚖️ Aspectos Legales</h2>
                  
                  <div className="space-y-6">
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">🏛️ Jurisdicción</h3>
                      <p className="text-gray-800">
                        Este sitio opera bajo las leyes de la <strong>República Dominicana</strong>. 
                        Cualquier disputa legal será resuelta en tribunales dominicanos.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">🛡️ Limitación de Responsabilidad:</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>CalificaTuProfe es solo una plataforma</li>
                        <li>No verificamos la veracidad de las reseñas</li>
                        <li>No somos responsables por contenido de usuarios</li>
                        <li>No garantizamos exactitud de la información</li>
                        <li>Los usuarios asumen riesgo total por su contenido</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">📞 Contacto Legal:</h3>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-blue-800">
                          <strong>Para asuntos legales:</strong><br/>
                          Email: legal@calificatuprofe.com<br/>
                          Respuesta en 48-72 horas hábiles
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h3 className="font-semibold text-yellow-900 mb-2">📝 Cambios a los Términos</h3>
                      <p className="text-yellow-800">
                        Podemos actualizar estos términos. Los cambios importantes se notificarán 
                        por email con 30 días de anticipación.
                      </p>
                    </div>

                    <div className="text-center mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
                      <h3 className="font-semibold text-green-900 mb-2">✅ Aceptación</h3>
                      <p className="text-green-800">
                        Al usar CalificaTuProfe, confirmas que has leído, entendido y aceptado 
                        estos términos en su totalidad.
                      </p>
                      <p className="text-sm text-green-700 mt-2">
                        Última actualización: {new Date().toLocaleDateString('es-DO')}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 