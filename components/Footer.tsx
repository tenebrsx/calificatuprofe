import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#1C4ED8] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <div className="text-xl font-bold">CalificaTuProfe</div>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              La plataforma líder para que estudiantes dominicanos compartan opiniones 
              académicas sobre profesores universitarios.
            </p>
            <div className="p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
              <p className="text-yellow-800 text-sm">
                ⚠️ <strong>Aviso:</strong> Las reseñas son opiniones estudiantiles, no hechos verificados. 
                Los usuarios son responsables de su contenido. 
                <Link href="/terminos" className="underline hover:no-underline">
                  Ver términos completos
                </Link>
              </p>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terminos" className="text-gray-300 hover:text-white transition-colors">
                  Términos de Servicio
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="text-gray-300 hover:text-white transition-colors">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/moderacion" className="text-gray-300 hover:text-white transition-colors">
                  Políticas de Moderación
                </Link>
              </li>
              <li>
                <Link href="/reportar" className="text-gray-300 hover:text-white transition-colors">
                  Reportar Contenido
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2 text-white/80">
              <li>
                <strong>Legal:</strong><br/>
                <a href="mailto:legal@calificatuprofe.com" className="hover:text-white transition-colors">
                  legal@calificatuprofe.com
                </a>
              </li>
              <li>
                <strong>Apelaciones:</strong><br/>
                <a href="mailto:apelaciones@calificatuprofe.com" className="hover:text-white transition-colors">
                  apelaciones@calificatuprofe.com
                </a>
              </li>
              <li>
                <strong>Soporte:</strong><br/>
                <a href="mailto:soporte@calificatuprofe.com" className="hover:text-white transition-colors">
                  soporte@calificatuprofe.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-white/80 text-sm mb-4 md:mb-0">
              © 2024 CalificaTuProfe. Todos los derechos reservados.
            </div>
            <div className="text-white/80 text-sm">
              Hecho con ❤️ para estudiantes dominicanos
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-blue-800 rounded-lg">
            <p className="text-white/90 text-xs text-center">
              <strong>Descargo de Responsabilidad:</strong> CalificaTuProfe es una plataforma de opiniones estudiantiles. 
              No verificamos la veracidad de las reseñas. Los usuarios son completamente responsables de su contenido. 
              Este sitio opera bajo las leyes de República Dominicana.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
} 