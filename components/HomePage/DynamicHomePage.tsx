'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { StarIcon, BookOpenIcon, UserGroupIcon, AcademicCapIcon, BeakerIcon, CalculatorIcon, ScaleIcon, HeartIcon } from '@heroicons/react/24/solid'
import EnhancedSearch from '@/components/Search/EnhancedSearch'


interface Review {
  id: string | number
  professorName: string
  university: string
  subject: string
  rating: number
  comment: string
  timeAgo: string
}

interface Professor {
  id: string | number
  name: string
  university: string
  department: string
  rating: number
  totalReviews: number
  tags: string[]
}

const subjectCategories = [
  { name: "Ingeniería", icon: BeakerIcon, count: "180+ profesores", color: "bg-blue-100 text-blue-700", description: "Donde las noches sin dormir son normales" },
  { name: "Medicina", icon: HeartIcon, count: "95+ profesores", color: "bg-red-100 text-red-700", description: "Memoriza o muere" },
  { name: "Derecho", icon: ScaleIcon, count: "120+ profesores", color: "bg-purple-100 text-purple-700", description: "Argumenta hasta ganar" },
  { name: "Administración", icon: UserGroupIcon, count: "85+ profesores", color: "bg-green-100 text-green-700", description: "El arte de liderar el caos" },
  { name: "Matemáticas", icon: CalculatorIcon, count: "65+ profesores", color: "bg-yellow-100 text-yellow-700", description: "Números que no mienten" },
  { name: "Literatura", icon: BookOpenIcon, count: "45+ profesores", color: "bg-pink-100 text-pink-700", description: "Donde las palabras cobran vida" }
]

// Removed scroll animations as requested

export default function DynamicHomePage() {
  const [recentReviews, setRecentReviews] = useState<Review[]>([])
  const [featuredProfessors, setFeaturedProfessors] = useState<Professor[]>([])
  const [loading, setLoading] = useState(true)
  
  // Removed animation hooks

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch recent reviews and featured professors in parallel with timeout
        const [reviewsRes, professorsRes] = await Promise.all([
          fetch('/api/reviews/recent', {
            signal: AbortSignal.timeout(5000) // 5 second timeout
          }),
          fetch('/api/professors/featured', {
            signal: AbortSignal.timeout(5000) // 5 second timeout
          })
        ])

        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json()
          setRecentReviews(reviewsData)
        }

        if (professorsRes.ok) {
          const professorsData = await professorsRes.json()
          setFeaturedProfessors(professorsData)
        }
      } catch (error) {
        console.error('Error fetching homepage data:', error)
        // Set loading to false even on error so page shows
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#1C4ED8" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 relative">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 no-underline">
              <span className="text-[#1C4ED8] no-underline">Piensa antes</span> de{' '}
              <span className="text-gray-900">inscribirte</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              <strong>El arrepentimiento es permanente.</strong> Lee reseñas reales de estudiantes dominicanos antes de elegir profesor.
            </p>
            
            {/* Enhanced Search Component */}
            <div className="max-w-2xl mx-auto relative z-[100]">
              <EnhancedSearch />
            </div>
          </div>
        </div>
      </div>

      {/* Subject Categories */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explora por materia</h2>
            <p className="text-lg text-gray-600">Encuentra profesores especializados en tu área de estudio</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {subjectCategories.map((category) => (
              <Link
                key={category.name}
                href={`/materia/${category.name.toLowerCase().replace(/ía/g, 'ia').replace(/ó/g, 'o')}`}
                className="group p-6 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-lg text-center relative overflow-hidden"
                title={category.description}
              >
                <div className={`w-12 h-12 mx-auto mb-3 rounded-lg ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <category.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">{category.name}</h3>
                <p className="text-xs text-gray-500 mb-1">{category.count}</p>
                <p className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 italic">
                  {category.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Reseñas recientes</h2>
            <p className="text-lg text-gray-600 mb-4">Lo que otros estudiantes están diciendo</p>
            
            {/* Legal Protection Notice */}
            <div className="max-w-3xl mx-auto p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                ⚠️ <strong>Aviso:</strong> Estas son opiniones estudiantiles, no hechos verificados. 
                Los usuarios son responsables de su contenido. 
                <Link href="/terminos" className="underline hover:text-yellow-900 ml-1">
                  Ver términos completos
                </Link>
              </p>
            </div>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4 w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2 w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentReviews.map((review) => (
                <div key={review.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{review.professorName}</h4>
                      <p className="text-sm text-gray-600">{review.subject} • {review.university}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                      <StarIcon className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium text-yellow-700">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm mb-3 line-clamp-3">{review.comment}</p>
                  <p className="text-xs text-gray-500">{review.timeAgo}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Featured Professors */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Profesores destacados</h2>
            <p className="text-lg text-gray-600">Los mejor calificados de la semana</p>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-200 animate-pulse">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-3/4 mx-auto"></div>
                    <div className="h-3 bg-gray-200 rounded mb-3 w-1/2 mx-auto"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3 mx-auto"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredProfessors.map((professor) => (
                <Link
                  key={professor.id}
                  href={`/profesor/${professor.id}`}
                  className="group bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-[#1C4ED8] rounded-full flex items-center justify-center">
                      <AcademicCapIcon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{professor.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{professor.department} • {professor.university}</p>
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <StarIcon className="h-4 w-4 text-yellow-400" />
                        <span className="font-medium">{professor.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">({professor.totalReviews} reseñas)</span>
                    </div>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {professor.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Universidades Destacadas */}
      <div className="bg-[#F9FAFB] py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Universidades destacadas</h2>
            <p className="text-lg text-gray-600">Explora las instituciones más populares</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'INTEC', slug: 'intec' },
              { name: 'PUCMM', slug: 'pucmm' },
              { name: 'UASD', slug: 'uasd' },
              { name: 'UNPHU', slug: 'unphu' },
              { name: 'UTESA', slug: 'utesa' },
              { name: 'UNICARIBE', slug: 'unicaribe' },
              { name: 'O&M', slug: 'oym' },
              { name: 'APEC', slug: 'apec' }
            ].map((university) => (
              <Link
                key={university.name}
                href={`/institucion/${university.slug}`}
                className="block py-4 px-6 text-center font-bold text-gray-900 hover:text-[#1C4ED8] transition-colors duration-200 rounded-lg hover:bg-white/50"
              >
                {university.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Animated Call to Action */}
      <div className="relative bg-[#1C4ED8] py-12 overflow-hidden wave-section">
        {/* Elegant Flowing Background Pattern */}
        <div className="absolute inset-0 opacity-6">
          <svg className="w-full h-full" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="flowingLines" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4"/>
                <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="#93C5FD" stopOpacity="0.2"/>
              </linearGradient>
            </defs>
            
            {/* Flowing organic curves - more irregular */}
            <path d="M0,120 Q80,40 180,90 Q280,140 400,85 Q450,70 500,90 L500,160 Q420,130 320,155 Q220,180 120,150 Q60,135 0,165 Z" fill="url(#flowingLines)" opacity="0.2"/>
            <path d="M0,220 Q90,180 200,210 Q320,240 420,195 Q480,175 500,200 L500,270 Q400,250 300,275 Q200,300 100,270 Q40,255 0,285 Z" fill="url(#flowingLines)" opacity="0.15"/>
            <path d="M0,330 Q120,290 240,320 Q360,350 480,310 L500,380 Q380,360 260,385 Q140,410 20,375 Q0,370 0,385 Z" fill="url(#flowingLines)" opacity="0.18"/>
            
            {/* Abstract organic shapes - more varied */}
            <ellipse cx="95" cy="70" rx="35" ry="55" fill="#60A5FA" opacity="0.06" transform="rotate(32 95 70)"/>
            <ellipse cx="340" cy="110" rx="60" ry="25" fill="#93C5FD" opacity="0.08" transform="rotate(-22 340 110)"/>
            <ellipse cx="170" cy="280" rx="28" ry="48" fill="#3B82F6" opacity="0.05" transform="rotate(58 170 280)"/>
            <ellipse cx="380" cy="320" rx="52" ry="20" fill="#60A5FA" opacity="0.07" transform="rotate(-45 380 320)"/>
            <ellipse cx="80" cy="380" rx="40" ry="30" fill="#93C5FD" opacity="0.06" transform="rotate(15 80 380)"/>
            
            {/* Subtle curved lines - varied thickness and flow */}
            <path d="M30,60 Q150,25 280,65 Q400,105 480,75" stroke="#93C5FD" strokeWidth="2.5" fill="none" opacity="0.09"/>
            <path d="M70,180 Q200,140 350,175 Q450,195 500,165" stroke="#60A5FA" strokeWidth="1.2" fill="none" opacity="0.08"/>
            <path d="M0,250 Q90,210 190,245 Q290,280 380,250 Q440,230 500,255" stroke="#3B82F6" strokeWidth="0.8" fill="none" opacity="0.06"/>
            <path d="M40,350 Q160,315 280,345 Q400,375 480,340" stroke="#93C5FD" strokeWidth="1.8" fill="none" opacity="0.07"/>
            <path d="M110,420 Q250,385 390,415 Q460,435 500,420" stroke="#60A5FA" strokeWidth="1" fill="none" opacity="0.05"/>
            
            {/* Additional organic elements for variation */}
            <path d="M0,40 Q40,20 80,45 Q120,70 160,50 Q200,30 240,55" stroke="#3B82F6" strokeWidth="0.6" fill="none" opacity="0.05"/>
            <circle cx="250" cy="150" r="15" fill="#60A5FA" opacity="0.04"/>
            <circle cx="420" cy="280" r="8" fill="#93C5FD" opacity="0.06"/>
            <circle cx="130" cy="350" r="12" fill="#3B82F6" opacity="0.03"/>
          </svg>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-20">
          <div className="pt-4">
            {/* Rebellious Title */}
            <div>
              <h2 className="text-4xl font-bold text-white mb-4">¿Sobreviviste este semestre?</h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
                <strong>Es hora de la venganza académica.</strong> Comparte tu experiencia y salva a futuros estudiantes del sufrimiento innecesario.
              </p>
            </div>
            
            {/* Static Button */}
            <div>
              <Link
                href="/calificar"
                className="inline-flex items-center px-10 py-4 bg-white text-[#1C4ED8] font-bold rounded-xl hover:bg-blue-50 hover:shadow-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                Calificar un profesor
              </Link>
              <p className="text-white/80 mt-4 text-lg">
                <strong>100% anónimo.</strong> Tu reseña puede salvar el semestre de otros estudiantes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#1C4ED8] text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-[#1C4ED8] font-bold text-lg">C</span>
                </div>
                <span className="text-xl font-bold">CalificaTuProfe</span>
              </div>
              <p className="text-white/80 text-sm mb-4">
                <strong>"Calificamos todo lo demás. Era hora de calificar a los profesores."</strong>
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-white/80 hover:text-white transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-white/80 hover:text-white transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 13.056 2 12.717 2 10c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 1.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 10 2zm0 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm0 4.95A1.95 1.95 0 1 1 10 8.05a1.95 1.95 0 0 1 0 3.9zm3.8-5.2a.7.7 0 1 1-1.4 0 .7.7 0 0 1 1.4 0z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-white/80 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Enlaces rápidos</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/buscar" className="text-white/80 hover:text-white transition-colors">Buscar profesores</Link></li>
                <li><Link href="/universidades" className="text-white/80 hover:text-white transition-colors">Universidades</Link></li>
                <li><Link href="/calificar" className="text-white/80 hover:text-white transition-colors">Calificar profesor</Link></li>
                <li><Link href="/top-profesores" className="text-white/80 hover:text-white transition-colors">Top profesores</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Soporte</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/ayuda" className="text-white/80 hover:text-white transition-colors">Centro de ayuda</Link></li>
                <li><Link href="/contacto" className="text-white/80 hover:text-white transition-colors">Contacto</Link></li>
                <li><Link href="/terminos" className="text-white/80 hover:text-white transition-colors">Términos de uso</Link></li>
                <li><Link href="/privacidad" className="text-white/80 hover:text-white transition-colors">Privacidad</Link></li>
              </ul>
            </div>

            {/* About */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Acerca de</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/nosotros" className="text-white/80 hover:text-white transition-colors">Quiénes somos</Link></li>
                <li><Link href="/mision" className="text-white/80 hover:text-white transition-colors">Nuestra misión</Link></li>
                <li><Link href="/carreras" className="text-white/80 hover:text-white transition-colors">Carreras</Link></li>
                <li><Link href="/prensa" className="text-white/80 hover:text-white transition-colors">Prensa</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-blue-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/80 text-sm">
              © 2024 CalificaTuProfe. Todos los derechos reservados.
            </p>
            <p className="text-white/80 text-sm mt-4 md:mt-0">
              Hecho con ❤️ en República Dominicana
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
} 