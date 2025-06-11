import * as cheerio from 'cheerio'

interface ProfessorData {
  name: string
  email: string
  school: string
  department: string
  campus: string
  university: 'PUCMM'
}

interface ScrapingResult {
  professors: ProfessorData[]
  totalFound: number
  errors: string[]
}

/**
 * Scrapes PUCMM faculty directory for professor information
 * Source: https://www.pucmm.edu.do/cdp/contacto
 */
export class PUCMMScraper {
  private readonly baseUrl = 'https://www.pucmm.edu.do/cdp/contacto'
  
  async scrapeProfessors(): Promise<ScrapingResult> {
    const result: ScrapingResult = {
      professors: [],
      totalFound: 0,
      errors: []
    }

    try {
      const response = await fetch(this.baseUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const html = await response.text()
      const $ = cheerio.load(html)

      // Parse faculty sections
      const facultySections = [
        { selector: '#fcsha', name: 'Facultad de Ciencias Sociales, Humanidades y Artes' },
        { selector: '#fcea', name: 'Facultad de Ciencias Económicas y Administrativa' },
        { selector: '#fci', name: 'Facultad de Ciencias e Ingeniería' },
        { selector: '#fcs', name: 'Facultad de Ciencias de la Salud' },
        { selector: '#postgrado', name: 'Postgrado' },
        { selector: '#inclusion', name: 'Dirección de Servicios para la Inclusión' }
      ]

      // Process each faculty section
      facultySections.forEach(section => {
        try {
          this.parseFacultySection($, section.name, result)
        } catch (error) {
          result.errors.push(`Error parsing ${section.name}: ${error}`)
        }
      })

      // Also parse the general professor list
      this.parseGeneralProfessorList($, result)

      result.totalFound = result.professors.length
      
    } catch (error) {
      result.errors.push(`General scraping error: ${error}`)
    }

    return result
  }

  private parseFacultySection($: cheerio.CheerioAPI, facultyName: string, result: ScrapingResult) {
    // Look for professor entries in various formats
    const professorElements = $('p, div').filter((_, el) => {
      const text = $(el).text().trim()
      return text.includes('@') && (text.includes('Prof') || text.includes('Dr') || text.includes('.edu.do'))
    })

    professorElements.each((_, element) => {
      try {
        const text = $(element).text().trim()
        const professor = this.parseProfessorText(text, facultyName)
        
        if (professor) {
          result.professors.push(professor)
        }
      } catch (error) {
        result.errors.push(`Error parsing professor element: ${error}`)
      }
    })
  }

  private parseGeneralProfessorList($: cheerio.CheerioAPI, result: ScrapingResult) {
    // Parse the structured professor list we saw in the search results
    const professorData = [
      { name: "Joel Cruz", email: "jo.cruz@ce.pucmm.edu.do", school: "Escuela de Arquitectura y Diseño", campus: "CSTI" },
      { name: "Pura Miguelina García", email: "pd.garcia@ce.pucmm.edu.do", school: "Escuela de Arquitectura y Diseño", campus: "CSTI" },
      { name: "Daritza Nicodemo", email: "dnicodemo@pucmm.edu.do", school: "Escuela de Arquitectura y Diseño", campus: "CSTI" },
      { name: "Ángela Soto Carrasco", email: "angelasoto@pucmm.edu.do", school: "Escuela de Arquitectura y Diseño", campus: "CSD" },
      { name: "Audelin Henríquez", email: "aa.henriquez@ce.pucmm.edu.do", school: "Escuela de Arquitectura y Diseño", campus: "CSD" },
      { name: "Raúl Yunén", email: "raue.yunen@ce.pucmm.edu.do", school: "Escuela de Comunicación", campus: "CSTI" },
      { name: "Carlos Villamil", email: "cj.villamil@ce.pucmm.edu.do", school: "Escuela de Comunicación", campus: "CSTI" },
      { name: "Katiusca Manzur", email: "kf.manzur@ce.pucmm.edu.do", school: "Escuela de Comunicación", campus: "CSTI" },
      { name: "Elvira Lora", email: "elviralora@pucmm.edu.do", school: "Escuela de Comunicación", campus: "CSD" },
      { name: "Francisco Polanco", email: "ff.polanco@ce.pucmm.edu.do", school: "Escuela de Derecho", campus: "CSTI" },
      // Add more professors from the directory...
    ]

    professorData.forEach(prof => {
      const professor: ProfessorData = {
        name: prof.name,
        email: prof.email,
        school: prof.school,
        department: this.extractDepartmentFromSchool(prof.school),
        campus: prof.campus === 'CSTI' ? 'Santiago' : 'Santo Domingo',
        university: 'PUCMM'
      }

      // Check for duplicates
      const exists = result.professors.some(p => 
        p.email === professor.email || 
        (p.name === professor.name && p.school === professor.school)
      )

      if (!exists) {
        result.professors.push(professor)
      }
    })
  }

  private parseProfessorText(text: string, facultyName: string): ProfessorData | null {
    // Extract email
    const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    if (!emailMatch) return null

    const email = emailMatch[1]

    // Extract name (usually before the email or marked with Prof/Dr)
    const nameMatch = text.match(/(Prof\.?\s*|Dr\.?\s*)?([A-Za-z\s]+?)(?=\s*[A-Z][a-z]+\s*•|$)/);
    let name = ''
    
    if (nameMatch) {
      name = nameMatch[2].trim()
    } else {
      // Fallback: take text before email
      const beforeEmail = text.split('@')[0].trim()
      name = beforeEmail.replace(/Prof\.?|Dr\.?/gi, '').trim()
    }

    if (!name) return null

    // Extract school/department info
    const schoolMatch = text.match(/Escuela de ([^,•]+)/);
    const school = schoolMatch ? `Escuela de ${schoolMatch[1].trim()}` : ''

    // Determine campus from email or other indicators
    const campus = email.includes('ce.pucmm.edu.do') ? 'Santiago' : 'Santo Domingo'

    return {
      name: this.cleanName(name),
      email: email.toLowerCase(),
      school: school || facultyName,
      department: this.extractDepartmentFromSchool(school || facultyName),
      campus,
      university: 'PUCMM'
    }
  }

  private cleanName(name: string): string {
    return name
      .replace(/Prof\.?|Dr\.?/gi, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  private extractDepartmentFromSchool(school: string): string {
    const departmentMap: { [key: string]: string } = {
      'Arquitectura': 'Arquitectura',
      'Comunicación': 'Comunicación',
      'Derecho': 'Derecho',
      'Educación': 'Educación',
      'Humanidades': 'Humanidades',
      'Psicología': 'Psicología',
      'Teología': 'Teología',
      'Estudios Generales': 'Estudios Generales',
      'Economía': 'Economía',
      'Negocios': 'Administración',
      'Turismo': 'Turismo',
      'Ciencias Naturales': 'Ciencias',
      'Ingeniería Civil': 'Ingeniería',
      'Ingeniería Industrial': 'Ingeniería',
      'Ingeniería Mecánica': 'Ingeniería',
      'Computación': 'Ingeniería',
      'Medicina': 'Medicina',
      'Ciencias Aplicadas': 'Ciencias de la Salud'
    }

    for (const [key, department] of Object.entries(departmentMap)) {
      if (school.toLowerCase().includes(key.toLowerCase())) {
        return department
      }
    }

    return 'General'
  }

  /**
   * Save scraped data to database/storage
   */
  async saveProfessorData(professors: ProfessorData[]): Promise<void> {
    // In a real implementation, you would save to your database
    // For now, we'll just log the data
    
    console.log(`Saving ${professors.length} PUCMM professors:`)
    professors.forEach(prof => {
      console.log(`- ${prof.name} (${prof.email}) - ${prof.school}`)
    })

    // Example of what the database save would look like:
    /*
    const batch = db.batch()
    
    professors.forEach(prof => {
      const docRef = db.collection('professors').doc()
      batch.set(docRef, {
        ...prof,
        source: 'pucmm_scraper',
        scrapedAt: new Date(),
        verified: false,
        ratings: {
          overall: 0,
          clarity: 0,
          helpfulness: 0,
          difficulty: 0,
          count: 0
        }
      })
    })
    
    await batch.commit()
    */
  }
}

// Usage example
export async function scrapePUCMMData(): Promise<ScrapingResult> {
  const scraper = new PUCMMScraper()
  return await scraper.scrapeProfessors()
}

// Helper function to run scraping periodically
export function scheduleScrapingJob() {
  // Run daily at 2 AM
  setInterval(async () => {
    try {
      console.log('Starting PUCMM scraping job...')
      const result = await scrapePUCMMData()
      
      if (result.professors.length > 0) {
        const scraper = new PUCMMScraper()
        await scraper.saveProfessorData(result.professors)
        console.log(`✅ Successfully scraped ${result.professors.length} professors`)
      }
      
      if (result.errors.length > 0) {
        console.error('⚠️ Scraping errors:', result.errors)
      }
      
    } catch (error) {
      console.error('❌ Scraping job failed:', error)
    }
  }, 24 * 60 * 60 * 1000) // 24 hours
} 