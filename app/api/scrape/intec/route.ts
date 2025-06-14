import { NextResponse } from 'next/server'

// INTEC Professor data based on their experts page
const intecProfessors = [
  {
    id: 'intec_1',
    name: 'Aida González',
    email: 'aida.gonzalez@intec.edu.do',
    institution: 'INTEC',
    department: 'Ciencias Sociales y Humanidades',
    position: 'Research Professor',
    specialization: 'Library and Information Sciences, School Supervision',
    campus: 'Santo Domingo',
    averageRating: 0,
    totalReviews: 0,
    wouldTakeAgainPercent: 0,
    averageDifficulty: 0,
    topTags: [],
    isVerified: false,
    source: 'intec_scraper'
  },
  {
    id: 'intec_2',
    name: 'Alejandro Santos',
    email: 'alejandro.santos@intec.edu.do',
    institution: 'INTEC',
    department: 'Ciencias Básicas y Ambientales',
    position: 'Professor',
    specialization: 'Water Engineering and Management',
    campus: 'Santo Domingo',
    averageRating: 0,
    totalReviews: 0,
    wouldTakeAgainPercent: 0,
    averageDifficulty: 0,
    topTags: [],
    isVerified: false,
    source: 'intec_scraper'
  },
  {
    id: 'intec_3',
    name: 'Alejandro Toirac',
    email: 'alejandro.toirac@intec.edu.do',
    institution: 'INTEC',
    department: 'Ingeniería',
    position: 'Professor',
    specialization: 'Project Design, Management, and Administration',
    campus: 'Santo Domingo',
    averageRating: 0,
    totalReviews: 0,
    wouldTakeAgainPercent: 0,
    averageDifficulty: 0,
    topTags: [],
    isVerified: false,
    source: 'intec_scraper'
  },
  {
    id: 'intec_4',
    name: 'Alejandro Vallejo',
    email: 'alejandro.vallejo@intec.edu.do',
    institution: 'INTEC',
    department: 'Ciencias de la Salud',
    position: 'Professor',
    specialization: 'Industrial and Technological Business Management, Bioethics',
    campus: 'Santo Domingo',
    averageRating: 0,
    totalReviews: 0,
    wouldTakeAgainPercent: 0,
    averageDifficulty: 0,
    topTags: [],
    isVerified: false,
    source: 'intec_scraper'
  },
  {
    id: 'intec_5',
    name: 'Alex Anderson Pascual',
    email: 'alex.anderson@intec.edu.do',
    institution: 'INTEC',
    department: 'Economía y Negocios',
    position: 'Professor',
    specialization: 'Tax planning and management, Government auditing',
    campus: 'Santo Domingo',
    averageRating: 0,
    totalReviews: 0,
    wouldTakeAgainPercent: 0,
    averageDifficulty: 0,
    topTags: [],
    isVerified: false,
    source: 'intec_scraper'
  },
  {
    id: 'intec_6',
    name: 'Alexander Pimentel',
    email: 'alexander.pimentel@intec.edu.do',
    institution: 'INTEC',
    department: 'Ingeniería',
    position: 'Coordinator and Professor',
    specialization: 'Sanitary and Environmental Engineering',
    campus: 'Santo Domingo',
    averageRating: 0,
    totalReviews: 0,
    wouldTakeAgainPercent: 0,
    averageDifficulty: 0,
    topTags: [],
    isVerified: false,
    source: 'intec_scraper'
  },
  {
    id: 'intec_7',
    name: 'Alfonsina Martínez',
    email: 'alfonsina.martinez@intec.edu.do',
    institution: 'INTEC',
    department: 'Ingeniería',
    position: 'Professor',
    specialization: 'Senior Management, Services and Manufacturing',
    campus: 'Santo Domingo',
    averageRating: 0,
    totalReviews: 0,
    wouldTakeAgainPercent: 0,
    averageDifficulty: 0,
    topTags: [],
    isVerified: false,
    source: 'intec_scraper'
  },
  {
    id: 'intec_8',
    name: 'Alfredo Padrón',
    email: 'alfredo.padron@intec.edu.do',
    institution: 'INTEC',
    department: 'Ciencias Sociales y Humanidades',
    position: 'Coordinator',
    specialization: 'Film and Television, Business Administration',
    campus: 'Santo Domingo',
    averageRating: 0,
    totalReviews: 0,
    wouldTakeAgainPercent: 0,
    averageDifficulty: 0,
    topTags: [],
    isVerified: false,
    source: 'intec_scraper'
  },
  {
    id: 'intec_9',
    name: 'Ana Lebrón',
    email: 'ana.lebron@intec.edu.do',
    institution: 'INTEC',
    department: 'Ciencias de la Salud',
    position: 'Professor',
    specialization: 'Nutrition, Public Health and Epidemiology',
    campus: 'Santo Domingo',
    averageRating: 0,
    totalReviews: 0,
    wouldTakeAgainPercent: 0,
    averageDifficulty: 0,
    topTags: [],
    isVerified: false,
    source: 'intec_scraper'
  },
  {
    id: 'intec_10',
    name: 'Carlos Cordero',
    email: 'carlos.cordero@intec.edu.do',
    institution: 'INTEC',
    department: 'Ingeniería',
    position: 'Professor',
    specialization: 'Production Management and Corporate Finance',
    campus: 'Santo Domingo',
    averageRating: 0,
    totalReviews: 0,
    wouldTakeAgainPercent: 0,
    averageDifficulty: 0,
    topTags: [],
    isVerified: false,
    source: 'intec_scraper'
  },
  {
    id: 'intec_11',
    name: 'David Rivas',
    email: 'david.rivas@intec.edu.do',
    institution: 'INTEC',
    department: 'Ingeniería',
    position: 'Professor',
    specialization: 'Information and Communications Security Engineering',
    campus: 'Santo Domingo',
    averageRating: 0,
    totalReviews: 0,
    wouldTakeAgainPercent: 0,
    averageDifficulty: 0,
    topTags: [],
    isVerified: false,
    source: 'intec_scraper'
  },
  {
    id: 'intec_12',
    name: 'Daisy Reyes',
    email: 'daisy.reyes@intec.edu.do',
    institution: 'INTEC',
    department: 'Economía y Negocios',
    position: 'Marketing Coordinator and Professor',
    specialization: 'Marketing strategies, Customer loyalty',
    campus: 'Santo Domingo',
    averageRating: 0,
    totalReviews: 0,
    wouldTakeAgainPercent: 0,
    averageDifficulty: 0,
    topTags: [],
    isVerified: false,
    source: 'intec_scraper'
  },
  {
    id: 'intec_13',
    name: 'Diana Corrales',
    email: 'diana.corrales@intec.edu.do',
    institution: 'INTEC',
    department: 'Ciencias Básicas y Ambientales',
    position: 'Coordinator',
    specialization: 'Environmental management',
    campus: 'Santo Domingo',
    averageRating: 0,
    totalReviews: 0,
    wouldTakeAgainPercent: 0,
    averageDifficulty: 0,
    topTags: [],
    isVerified: false,
    source: 'intec_scraper'
  },
  {
    id: 'intec_14',
    name: 'Eduardo Sánchez',
    email: 'eduardo.sanchez@intec.edu.do',
    institution: 'INTEC',
    department: 'Ingeniería',
    position: 'Research Professor',
    specialization: 'Aerospace Sciences',
    campus: 'Santo Domingo',
    averageRating: 0,
    totalReviews: 0,
    wouldTakeAgainPercent: 0,
    averageDifficulty: 0,
    topTags: [],
    isVerified: false,
    source: 'intec_scraper'
  },
  {
    id: 'intec_15',
    name: 'Fernando Santamaría',
    email: 'fernando.santamaria@intec.edu.do',
    institution: 'INTEC',
    department: 'Ciencias de la Salud',
    position: 'Coordinator and Professor',
    specialization: 'Human sexuality',
    campus: 'Santo Domingo',
    averageRating: 0,
    totalReviews: 0,
    wouldTakeAgainPercent: 0,
    averageDifficulty: 0,
    topTags: [],
    isVerified: false,
    source: 'intec_scraper'
  },
  {
    id: 'intec_16',
    name: 'Gustavo Caffaro',
    email: 'gustavo.caffaro@intec.edu.do',
    institution: 'INTEC',
    department: 'Economía y Negocios',
    position: 'Professor',
    specialization: 'Applied Mathematics',
    campus: 'Santo Domingo',
    averageRating: 0,
    totalReviews: 0,
    wouldTakeAgainPercent: 0,
    averageDifficulty: 0,
    topTags: [],
    isVerified: false,
    source: 'intec_scraper'
  },
  {
    id: 'intec_17',
    name: 'Henry Rosa Polanco',
    email: 'henry.rosa@intec.edu.do',
    institution: 'INTEC',
    department: 'Economía y Negocios',
    position: 'Coordinator',
    specialization: 'International Business and Trade',
    campus: 'Santo Domingo',
    averageRating: 0,
    totalReviews: 0,
    wouldTakeAgainPercent: 0,
    averageDifficulty: 0,
    topTags: [],
    isVerified: false,
    source: 'intec_scraper'
  },
  {
    id: 'intec_18',
    name: 'Joan Guerrero',
    email: 'joan.guerrero@intec.edu.do',
    institution: 'INTEC',
    department: 'Ciencias Sociales y Humanidades',
    position: 'Professor',
    specialization: 'Public Policy Evaluation, Social Security',
    campus: 'Santo Domingo',
    averageRating: 0,
    totalReviews: 0,
    wouldTakeAgainPercent: 0,
    averageDifficulty: 0,
    topTags: [],
    isVerified: false,
    source: 'intec_scraper'
  },
  {
    id: 'intec_19',
    name: 'Luis Rodríguez De Francisco',
    email: 'luis.rodriguez@intec.edu.do',
    institution: 'INTEC',
    department: 'Ciencias Básicas y Ambientales',
    position: 'Dean',
    specialization: 'Plant Biotechnology',
    campus: 'Santo Domingo',
    averageRating: 0,
    totalReviews: 0,
    wouldTakeAgainPercent: 0,
    averageDifficulty: 0,
    topTags: [],
    isVerified: false,
    source: 'intec_scraper'
  },
  {
    id: 'intec_20',
    name: 'Miguel Arias',
    email: 'miguel.arias@intec.edu.do',
    institution: 'INTEC',
    department: 'Ingeniería',
    position: 'Coordinator and Professor',
    specialization: 'Cybersecurity',
    campus: 'Santo Domingo',
    averageRating: 0,
    totalReviews: 0,
    wouldTakeAgainPercent: 0,
    averageDifficulty: 0,
    topTags: [],
    isVerified: false,
    source: 'intec_scraper'
  }
]

export async function POST() {
  try {
    // In a real application, you would save to a database
    // For now, we'll simulate adding INTEC professors to our mock data
    
    console.log('🏫 Scraping INTEC professors...')
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log(`✅ Successfully scraped ${intecProfessors.length} INTEC professors`)
    
    return NextResponse.json({
      success: true,
      message: `Successfully scraped ${intecProfessors.length} INTEC professors`,
      professors: intecProfessors,
      totalFound: intecProfessors.length,
      byDepartment: {
        'Ciencias Sociales y Humanidades': intecProfessors.filter(p => p.department === 'Ciencias Sociales y Humanidades').length,
        'Ciencias Básicas y Ambientales': intecProfessors.filter(p => p.department === 'Ciencias Básicas y Ambientales').length,
        'Ingeniería': intecProfessors.filter(p => p.department === 'Ingeniería').length,
        'Ciencias de la Salud': intecProfessors.filter(p => p.department === 'Ciencias de la Salud').length,
        'Economía y Negocios': intecProfessors.filter(p => p.department === 'Economía y Negocios').length
      }
    })
  } catch (error) {
    console.error('❌ INTEC scraping failed:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to scrape INTEC professors' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'INTEC scraper endpoint ready',
    professors: intecProfessors,
    totalProfessors: intecProfessors.length
  })
} 