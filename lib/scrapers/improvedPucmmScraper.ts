import * as cheerio from 'cheerio'

interface ProfessorData {
  name: string
  email: string
  school: string
  department: string
  campus: string
  university: 'PUCMM'
  phone?: string
  position?: string
}

interface ScrapingResult {
  professors: ProfessorData[]
  totalFound: number
  errors: string[]
  scrapedAt: Date
}

/**
 * Improved PUCMM faculty scraper that dynamically parses the website
 */
export class ImprovedPUCMMScraper {
  private readonly baseUrl = 'https://www.pucmm.edu.do/cdp/contacto'
  private readonly userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  
  async scrapeProfessors(): Promise<ScrapingResult> {
    const result: ScrapingResult = {
      professors: [],
      totalFound: 0,
      errors: [],
      scrapedAt: new Date()
    }

    try {
      console.log('🔍 Fetching PUCMM faculty page...')
      const response = await fetch(this.baseUrl, {
        headers: { 'User-Agent': this.userAgent }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const html = await response.text()
      const $ = cheerio.load(html)
      
      console.log(`📄 Parsing HTML content (${html.length} characters)...`)

      // Strategy 1: Look for email patterns in the HTML
      this.extractEmailPatterns($, html, result)
      
      // Strategy 2: Parse structured content sections
      this.parseStructuredSections($, result)
      
      // Strategy 3: Parse tables if they exist
      this.parseTables($, result)
      
      // Remove duplicates
      result.professors = this.removeDuplicates(result.professors)
      result.totalFound = result.professors.length
      
      console.log(`✅ Scraping completed. Found ${result.totalFound} professors.`)
      
    } catch (error: unknown) {
      const errorMsg = `Scraping error: ${error instanceof Error ? error.message : "Unknown error"}`
      result.errors.push(errorMsg)
      console.error('❌', errorMsg)
    }

    return result
  }

  private extractEmailPatterns($: cheerio.CheerioAPI, html: string, result: ScrapingResult) {
    // Find all email addresses in the HTML
    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]*pucmm\.edu\.do)/gi
    const emails = html.match(emailRegex) || []
    
    console.log(`📧 Found ${emails.length} PUCMM email addresses`)
    
    // For each email, try to find associated name and department
    emails.forEach(email => {
      try {
        const professor = this.findProfessorByEmail($, html, email)
        if (professor && !result.professors.some(p => p.email === email)) {
          result.professors.push(professor)
        }
      } catch (error: unknown) {
        result.errors.push(`Error processing email ${email}: ${error instanceof Error ? error.message : "Unknown error"}`)
      }
    })
  }

  private findProfessorByEmail($: cheerio.CheerioAPI, html: string, email: string): ProfessorData | null {
    // Look for the name associated with this email
    const emailIndex = html.indexOf(email)
    if (emailIndex === -1) return null

    // Search backwards and forwards from email position to find name
    const contextBefore = html.substring(Math.max(0, emailIndex - 200), emailIndex)
    const contextAfter = html.substring(emailIndex, Math.min(html.length, emailIndex + 200))
    
    // Look for name patterns
    const namePatterns = [
      /(?:Prof\.?\s*|Dr\.?\s*|Dra\.?\s*|Ing\.?\s*|Lic\.?\s*)?([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*)/g,
      /([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/g
    ]

    let name = ''
    for (const pattern of namePatterns) {
      const matches = contextBefore.match(pattern)
      if (matches && matches.length > 0) {
        name = matches[matches.length - 1].trim()
        break
      }
    }

    if (!name) {
      // Try extracting from structured elements around the email
      const emailElement = $(`*:contains("${email}")`).first()
      if (emailElement.length) {
        const parentText = emailElement.parent().text()
        const nameMatch = parentText.match(/([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+){1,3})/g)
        if (nameMatch) {
          name = nameMatch[0]
        }
      }
    }

    if (!name) return null

    // Determine campus from email domain
    const campus = email.includes('ce.pucmm.edu.do') ? 'Santiago' : 'Santo Domingo'
    
    // Try to determine school/department from context
    const school = this.extractSchoolFromContext(contextBefore + contextAfter)
    
    return {
      name: this.cleanName(name),
      email: email.toLowerCase(),
      school: school || 'No especificado',
      department: this.extractDepartmentFromSchool(school || ''),
      campus,
      university: 'PUCMM'
    }
  }

  private parseStructuredSections($: cheerio.CheerioAPI, result: ScrapingResult) {
    // Look for structured sections like divs, paragraphs containing faculty info
    $('div, p, section, article').each((_, element) => {
      const text = $(element).text()
      
      // Skip if no email
      if (!text.includes('@pucmm.edu.do')) return
      
      // Skip if too short or too long (probably not faculty info)
      if (text.length < 20 || text.length > 500) return
      
      try {
        const professors = this.parseFacultyText(text)
        professors.forEach(prof => {
          if (!result.professors.some(p => p.email === prof.email)) {
            result.professors.push(prof)
          }
        })
      } catch (error: unknown) {
        result.errors.push(`Error parsing section: ${error instanceof Error ? error.message : "Unknown error"}`)
      }
    })
  }

  private parseTables($: cheerio.CheerioAPI, result: ScrapingResult) {
    // Look for faculty information in tables
    $('table').each((_, table) => {
      const tableText = $(table).text()
      if (!tableText.includes('@pucmm.edu.do')) return
      
      $(table).find('tr').each((_, row) => {
        const rowText = $(row).text()
        if (rowText.includes('@pucmm.edu.do')) {
          try {
            const professors = this.parseFacultyText(rowText)
            professors.forEach(prof => {
              if (!result.professors.some(p => p.email === prof.email)) {
                result.professors.push(prof)
              }
            })
          } catch (error: unknown) {
            result.errors.push(`Error parsing table row: ${error instanceof Error ? error.message : "Unknown error"}`)
          }
        }
      })
    })
  }

  private parseFacultyText(text: string): ProfessorData[] {
    const professors: ProfessorData[] = []
    const emailMatches = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]*pucmm\.edu\.do)/gi)
    
    if (!emailMatches) return professors
    
    emailMatches.forEach(email => {
      // Find name before email
      const emailIndex = text.indexOf(email)
      const beforeEmail = text.substring(0, emailIndex)
      
      // Extract potential names
      const nameMatches = beforeEmail.match(/([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+){1,3})/g)
      
      if (nameMatches && nameMatches.length > 0) {
        const name = nameMatches[nameMatches.length - 1]
        const campus = email.includes('ce.pucmm.edu.do') ? 'Santiago' : 'Santo Domingo'
        const school = this.extractSchoolFromContext(text)
        
        professors.push({
          name: this.cleanName(name),
          email: email.toLowerCase(),
          school: school || 'No especificado',
          department: this.extractDepartmentFromSchool(school || ''),
          campus,
          university: 'PUCMM'
        })
      }
    })
    
    return professors
  }

  private extractSchoolFromContext(text: string): string {
    const schoolPatterns = [
      /Escuela\s+de\s+([^,.•\n]+)/gi,
      /Facultad\s+de\s+([^,.•\n]+)/gi,
      /Departamento\s+de\s+([^,.•\n]+)/gi,
      /School\s+of\s+([^,.•\n]+)/gi
    ]

    for (const pattern of schoolPatterns) {
      const matches = text.match(pattern)
      if (matches && matches.length > 0) {
        return matches[0].trim()
      }
    }

    return ''
  }

  private cleanName(name: string): string {
    return name
      .replace(/Prof\.?|Dr\.?|Dra\.?|Ing\.?|Lic\.?/gi, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  private extractDepartmentFromSchool(school: string): string {
    const departmentMap: { [key: string]: string } = {
      'arquitectura': 'Arquitectura',
      'comunicación': 'Comunicación',
      'derecho': 'Derecho',
      'educación': 'Educación',
      'humanidades': 'Humanidades',
      'psicología': 'Psicología',
      'teología': 'Teología',
      'economía': 'Economía',
      'administración': 'Administración',
      'turismo': 'Turismo',
      'ingeniería': 'Ingeniería',
      'medicina': 'Medicina',
      'ciencias': 'Ciencias',
      'matemáticas': 'Matemáticas',
      'física': 'Física',
      'química': 'Química'
    }

    const schoolLower = school.toLowerCase()
    for (const [key, department] of Object.entries(departmentMap)) {
      if (schoolLower.includes(key)) {
        return department
      }
    }

    return 'General'
  }

  private removeDuplicates(professors: ProfessorData[]): ProfessorData[] {
    const seen = new Set<string>()
    return professors.filter(prof => {
      const key = `${prof.email}_${prof.name}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }

  /**
   * Save scraped professors to your database
   */
  async saveProfessorsToDatabase(professors: ProfessorData[]): Promise<void> {
    // TODO: Implement database saving logic
    console.log(`💾 Would save ${professors.length} professors to database:`)
    professors.forEach((prof, index) => {
      console.log(`${index + 1}. ${prof.name} - ${prof.email} (${prof.school})`)
    })
    
    // Example Firebase implementation:
    /*
    import { db } from '@/lib/firebase'
    import { collection, writeBatch, doc } from 'firebase/firestore'
    
    const batch = writeBatch(db)
    const professorsRef = collection(db, 'professors')
    
    professors.forEach(prof => {
      const docRef = doc(professorsRef)
      batch.set(docRef, {
        ...prof,
        averageRating: 0,
        totalReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        isVerified: false,
        source: 'pucmm_scraper'
      })
    })
    
    await batch.commit()
    console.log(`✅ Saved ${professors.length} professors to Firebase`)
    */
  }
}

// Usage function
export async function scrapeAndSavePUCMM(): Promise<ScrapingResult> {
  const scraper = new ImprovedPUCMMScraper()
  const result = await scraper.scrapeProfessors()
  
  if (result.professors.length > 0) {
    await scraper.saveProfessorsToDatabase(result.professors)
  }
  
  return result
} 