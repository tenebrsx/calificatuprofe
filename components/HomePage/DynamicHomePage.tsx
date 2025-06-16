'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { StarIcon, BookOpenIcon, UserGroupIcon, AcademicCapIcon, BeakerIcon, CalculatorIcon, ScaleIcon, HeartIcon } from '@heroicons/react/24/solid'
import EnhancedSearch from '@/components/Search/EnhancedSearch'

// Custom CSS for mobile grid layout - Maximum specificity
const mobileGridStyles = `
  /* Use maximum specificity to override any existing styles */
  body div.subject-categories-grid,
  html body div.subject-categories-grid {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 0.75rem !important;
    grid-auto-rows: auto !important;
  }
  
  body div.universities-grid,
  html body div.universities-grid {
    display: grid !important;
    grid-template-columns: repeat(4, 1fr) !important;
    gap: 0.5rem !important;
    grid-auto-rows: auto !important;
  }
  
  @media (min-width: 769px) {
    body div.subject-categories-grid,
    html body div.subject-categories-grid {
      grid-template-columns: repeat(6, 1fr) !important;
      gap: 1rem !important;
    }
  }
  
  /* Fix text sizing and prevent cutoff */
  .subject-categories-grid .group h3 {
    font-size: 0.7rem !important;
    line-height: 1.1 !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    margin-bottom: 0.25rem !important;
  }
  
  .subject-categories-grid .group {
    padding: 0.5rem !important;
  }
  
  .subject-categories-grid .group div {
    width: 2rem !important;
    height: 2rem !important;
    margin-bottom: 0.5rem !important;
  }
  
  .subject-categories-grid .group div svg {
    width: 1rem !important;
    height: 1rem !important;
  }
  
  .universities-grid a {
    font-size: 0.65rem !important;
    line-height: 1.1 !important;
    padding: 0.5rem 0.125rem !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }
`

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

interface SubjectCounts {
  ingenieria: number
  medicina: number
  derecho: number
  administracion: number
  matematicas: number
  literatura: number
}

// Removed scroll animations as requested

export default function DynamicHomePage() {
  const [recentReviews, setRecentReviews] = useState<Review[]>([])
  const [featuredProfessors, setFeaturedProfessors] = useState<Professor[]>([])
  const [subjectCounts, setSubjectCounts] = useState<SubjectCounts>({
    ingenieria: 0,
    medicina: 0,
    derecho: 0,
    administracion: 0,
    matematicas: 0,
    literatura: 0
  })
  const [loading, setLoading] = useState(true)
  const [hasRealReviews, setHasRealReviews] = useState(false)
  const [hasRealProfessors, setHasRealProfessors] = useState(false)
  
  // Force grid layout after component mounts
  useEffect(() => {
    const applyGridStyles = () => {
      const subjectGrid = document.querySelector('.subject-categories-grid') as HTMLElement
      const universitiesGrid = document.querySelector('.universities-grid') as HTMLElement
      
      if (subjectGrid) {
        subjectGrid.style.display = 'grid'
        subjectGrid.style.gridTemplateColumns = 'repeat(3, 1fr)'
        subjectGrid.style.gap = '0.75rem'
        
        // Fix text sizing for subject categories
        const subjectItems = subjectGrid.querySelectorAll('.group h3')
        subjectItems.forEach((item: any) => {
          item.style.fontSize = '0.7rem'
          item.style.lineHeight = '1.1'
          item.style.whiteSpace = 'nowrap'
          item.style.overflow = 'hidden'
          item.style.textOverflow = 'ellipsis'
        })
        
        const subjectCards = subjectGrid.querySelectorAll('.group')
        subjectCards.forEach((card: any) => {
          card.style.padding = '0.5rem'
        })
      }
      
      if (universitiesGrid) {
        universitiesGrid.style.display = 'grid'
        universitiesGrid.style.gridTemplateColumns = 'repeat(4, 1fr)'
        universitiesGrid.style.gap = '0.5rem'
        
        // Fix text sizing for universities
        const universityLinks = universitiesGrid.querySelectorAll('a')
        universityLinks.forEach((link: any) => {
          link.style.fontSize = '0.65rem'
          link.style.lineHeight = '1.1'
          link.style.padding = '0.5rem 0.125rem'
          link.style.whiteSpace = 'nowrap'
          link.style.overflow = 'hidden'
          link.style.textOverflow = 'ellipsis'
        })
      }
    }
    
    // Apply styles after a short delay to ensure DOM is ready
    const timer = setTimeout(applyGridStyles, 100)
    
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch recent reviews, featured professors, and subject counts in parallel with timeout
        const [reviewsRes, professorsRes, countsRes] = await Promise.all([
          fetch('/api/reviews/recent', {
            signal: AbortSignal.timeout(5000) // 5 second timeout
          }),
          fetch('/api/professors/featured', {
            signal: AbortSignal.timeout(5000) // 5 second timeout
          }),
          fetch('/api/professors/subject-counts', {
            signal: AbortSignal.timeout(5000) // 5 second timeout
          })
        ])

        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json()
          // Only show reviews section if there are real reviews (not mock data)
          const realReviews = reviewsData.filter((review: Review) => 
            review.id !== 1 && review.id !== 2 && review.id !== 3 && 
            !review.professorName.includes('Dr. Ana García') &&
            !review.professorName.includes('Prof. Carlos Mendez') &&
            !review.professorName.includes('Dra. María Santos')
          )
          setRecentReviews(realReviews)
          setHasRealReviews(realReviews.length > 0)
        }

        if (professorsRes.ok) {
          const professorsData = await professorsRes.json()
          // Only show featured professors if they have actual reviews/ratings
          const professorsWithReviews = professorsData.filter((prof: Professor) => 
            prof.totalReviews > 0 && prof.rating > 0
          )
          setFeaturedProfessors(professorsWithReviews)
          setHasRealProfessors(professorsWithReviews.length > 0)
        }

        if (countsRes.ok) {
          const countsData = await countsRes.json()
          if (countsData.success) {
            setSubjectCounts(countsData.counts)
          }
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

  // Dynamic subject categories with real counts
  const subjectCategories = [
    { 
      name: "Ingeniería", 
      icon: BeakerIcon, 
      count: `${subjectCounts.ingenieria}+ profesores`, 
      color: "bg-blue-100 text-blue-700", 
      description: "Donde las noches sin dormir son normales" 
    },
    { 
      name: "Medicina", 
      icon: HeartIcon, 
      count: `${subjectCounts.medicina}+ profesores`, 
      color: "bg-red-100 text-red-700", 
      description: "Memoriza o muere" 
    },
    { 
      name: "Derecho", 
      icon: ScaleIcon, 
      count: `${subjectCounts.derecho}+ profesores`, 
      color: "bg-purple-100 text-purple-700", 
      description: "Argumenta hasta ganar" 
    },
    { 
      name: "Administración", 
      icon: UserGroupIcon, 
      count: `${subjectCounts.administracion}+ profesores`, 
      color: "bg-green-100 text-green-700", 
      description: "El arte de liderar el caos" 
    },
    { 
      name: "Matemáticas", 
      icon: CalculatorIcon, 
      count: `${subjectCounts.matematicas}+ profesores`, 
      color: "bg-yellow-100 text-yellow-700", 
      description: "Números que no mienten" 
    },
    { 
      name: "Literatura", 
      icon: BookOpenIcon, 
      count: `${subjectCounts.literatura}+ profesores`, 
      color: "bg-pink-100 text-pink-700", 
      description: "Donde las palabras cobran vida" 
    }
  ]

  return (
    <div className="min-h-screen bg-white w-full overflow-x-hidden">
      {/* Inject custom CSS for mobile grid layout */}
      <style dangerouslySetInnerHTML={{ __html: mobileGridStyles }} />
      
      {/* Enhanced Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 relative w-full">
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-12 sm:pb-20 relative w-full">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 no-underline">
              Encuentra el{' '}
              <span className="text-[#1C4ED8] no-underline">profesor perfecto</span>
            </h1>
                          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                Descubre profesores destacados, lee reseñas auténticas y toma las mejores decisiones académicas en República Dominicana
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
          <div 
            className="subject-categories-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.75rem'
            }}
          >
            {subjectCategories.map((category) => (
              <Link
                key={category.name}
                href={`/materia/${category.name.toLowerCase().replace(/ía/g, 'ia').replace(/ó/g, 'o')}`}
                className="group rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-lg text-center relative overflow-hidden"
                style={{
                  padding: '0.5rem',
                  minHeight: 'auto'
                }}
                title={category.description}
              >
                <div 
                  className={`mx-auto mb-2 rounded-lg ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                  style={{
                    width: '2rem',
                    height: '2rem'
                  }}
                >
                  <category.icon style={{ width: '1rem', height: '1rem' }} />
                </div>
                <h3 
                  className="font-semibold text-gray-900 mb-1"
                  style={{
                    fontSize: '0.7rem',
                    lineHeight: '1.1',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {category.name}
                </h3>
                <p 
                  className="text-gray-500 mb-1"
                  style={{
                    fontSize: '0.65rem',
                    lineHeight: '1.1'
                  }}
                >
                  {category.count}
                </p>
                <p className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 italic hidden sm:block">
                  {category.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Reviews - Only show if there are real reviews */}
      {hasRealReviews && (
        <div className="bg-gray-50 py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Reseñas recientes</h2>
              <p className="text-lg text-gray-600 mb-4">Lo que otros estudiantes están diciendo</p>
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
      )}

      {/* Featured Professors - Only show if there are professors with reviews */}
      {hasRealProfessors && (
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
      )}

      {/* Universidades Destacadas */}
      <div className="bg-[#F9FAFB] py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Universidades destacadas</h2>
            <p className="text-lg text-gray-600">Explora las instituciones más populares</p>
          </div>
          <div 
            className="universities-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.5rem'
            }}
          >
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
                className="block text-center font-bold text-gray-900 hover:text-[#1C4ED8] transition-colors duration-200 rounded-lg hover:bg-white/50"
                style={{
                  fontSize: '0.65rem',
                  lineHeight: '1.1',
                  padding: '0.5rem 0.125rem',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {university.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Animated Call to Action - REMOVED WHITE LINE BY ENSURING NO MARGIN/PADDING GAPS */}
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
                Comparte tu experiencia y salva a futuros estudiantes del sufrimiento innecesario.
              </p>
            </div>
            
            {/* Static Button */}
            <div>
              <Link
                href="/auth/signup"
                className="inline-flex items-center px-10 py-4 bg-white text-[#1C4ED8] font-bold rounded-xl hover:bg-blue-50 hover:shadow-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                Registrarse
              </Link>
              <p className="text-white/80 mt-4 text-lg">
                <strong>Únete gratis</strong> y comparte tu experiencia para ayudar a otros estudiantes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 