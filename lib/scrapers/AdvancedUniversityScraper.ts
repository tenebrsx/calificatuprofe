import * as cheerio from 'cheerio'
import * as fs from 'fs'
import * as path from 'path'

interface UniversityConfig {
  id: string
  name: string
  shortName: string
  baseUrl: string
  location: string
  type: 'public' | 'private'
  priority: number
  sources: ScrapingSource[]
  emailPatterns: string[]
  delays: {
    min: number
    max: number
  }
}

interface ScrapingSource {
  type: 'faculty_directory' | 'department_pages' | 'school_pages' | 'faculty_search'
  url?: string
  urls?: string[]
  method: 'static' | 'dynamic'
  selectors: {
    facultyLinks?: string
    professorCards: string
    name: string
    department: string
    email: string
    title?: string
    profileLink?: string
  }
}

interface ScrapedProfessor {
  id: string
  name: string
  email: string
  department: string
  university: string
  title?: string
  profileUrl?: string
  campus?: string
  source: string
  scrapedAt: string
  verified: boolean
  confidence: number
}

interface ScrapingResult {
  university: string
  professors: ScrapedProfessor[]
  errors: string[]
  stats: {
    pagesScraped: number
    professorsFound: number
    emailsGenerated: number
    duplicatesRemoved: number
    processingTime: number
  }
}

export class AdvancedUniversityScraper {
  private config: UniversityConfig[]
  private userAgent: string
  private cache: Map<string, any>
  private results: Map<string, ScrapingResult>

  constructor() {
    this.config = this.loadConfiguration()
    this.userAgent = 'CalificaTuProfe-Bot/2.0 (+https://calificatuprofe.com/contact)'
    this.cache = new Map()
    this.results = new Map()
  }

  private loadConfiguration(): UniversityConfig[] {
    try {
      const configPath = path.join(process.cwd(), 'lib/scrapers/config/universities.json')
      const configData = fs.readFileSync(configPath, 'utf8')
      return JSON.parse(configData)
    } catch (error) {
      console.error('❌ Failed to load university configuration:', error)
      return []
    }
  }

  async scrapeAllUniversities(options: {
    priorities?: number[]
    universities?: string[]
    maxConcurrent?: number
    respectRobots?: boolean
  } = {}): Promise<Map<string, ScrapingResult>> {
    console.log('🚀 STARTING ADVANCED UNIVERSITY SCRAPER')
    console.log(`📊 Loaded ${this.config.length} university configurations`)

    const startTime = Date.now()
    
    // Filter universities based on options
    let universitiesToScrape = this.config

    if (options.priorities) {
      universitiesToScrape = universitiesToScrape.filter(u => 
        options.priorities!.includes(u.priority)
      )
    }

    if (options.universities) {
      universitiesToScrape = universitiesToScrape.filter(u => 
        options.universities!.includes(u.id)
      )
    }

    // Sort by priority (1 = highest priority)
    universitiesToScrape.sort((a, b) => a.priority - b.priority)

    console.log(`🎯 Scraping ${universitiesToScrape.length} universities`)

    // Process universities sequentially to be respectful
    for (const university of universitiesToScrape) {
      try {
        console.log(`\n🏫 Processing ${university.name} (${university.shortName})`)
        
        if (options.respectRobots) {
          const robotsAllowed = await this.checkRobotsTxt(university.baseUrl)
          if (!robotsAllowed) {
            console.log(`🚫 Robots.txt disallows scraping for ${university.shortName}`)
            continue
          }
        }

        const result = await this.scrapeUniversity(university)
        this.results.set(university.id, result)

        console.log(`✅ ${university.shortName}: ${result.professors.length} professors found`)

        // Respectful delay between universities
        await this.delay(university.delays.min, university.delays.max)

      } catch (error) {
        console.error(`❌ Error scraping ${university.shortName}:`, error)
        this.results.set(university.id, {
          university: university.name,
          professors: [],
          errors: [error instanceof Error ? error.message : String(error)],
          stats: {
            pagesScraped: 0,
            professorsFound: 0,
            emailsGenerated: 0,
            duplicatesRemoved: 0,
            processingTime: 0
          }
        })
      }
    }

    const totalTime = Date.now() - startTime
    console.log(`\n🎉 SCRAPING COMPLETE!`)
    console.log(`⏱️  Total time: ${(totalTime / 1000).toFixed(2)} seconds`)
    
    this.printSummary()
    await this.saveResults()

    return this.results
  }

  private async scrapeUniversity(university: UniversityConfig): Promise<ScrapingResult> {
    const startTime = Date.now()
    const result: ScrapingResult = {
      university: university.name,
      professors: [],
      errors: [],
      stats: {
        pagesScraped: 0,
        professorsFound: 0,
        emailsGenerated: 0,
        duplicatesRemoved: 0,
        processingTime: 0
      }
    }

    for (const source of university.sources) {
      try {
        const professors = await this.scrapeSource(university, source)
        result.professors.push(...professors)
        result.stats.pagesScraped++
      } catch (error) {
        const errorMsg = `Source ${source.type}: ${error instanceof Error ? error.message : String(error)}`
        result.errors.push(errorMsg)
        console.log(`⚠️  ${errorMsg}`)
      }
    }

    // Remove duplicates
    const uniqueProfessors = this.removeDuplicates(result.professors)
    result.stats.duplicatesRemoved = result.professors.length - uniqueProfessors.length
    result.professors = uniqueProfessors

    // Generate missing emails
    const professorsWithEmails = await this.generateMissingEmails(university, result.professors)
    result.stats.emailsGenerated = professorsWithEmails.filter(p => p.email.includes('generated')).length
    result.professors = professorsWithEmails

    result.stats.professorsFound = result.professors.length
    result.stats.processingTime = Date.now() - startTime

    return result
  }

  private async scrapeSource(university: UniversityConfig, source: ScrapingSource): Promise<ScrapedProfessor[]> {
    const professors: ScrapedProfessor[] = []
    const urls = source.urls || (source.url ? [source.url] : [])

    for (const url of urls) {
      try {
        console.log(`  📄 Scraping: ${url}`)
        
        const html = await this.fetchPage(url)
        const $ = cheerio.load(html)
        
        // Handle different source types
        if (source.type === 'faculty_directory' && source.selectors.facultyLinks) {
          // First get faculty/department links, then scrape those
          const facultyLinks = $(source.selectors.facultyLinks)
            .map((_, el) => $(el).attr('href'))
            .get()
            .filter(href => href)
            .map(href => this.resolveUrl(university.baseUrl, href))

          for (const link of facultyLinks.slice(0, 10)) { // Limit to prevent overload
            try {
              const facultyHtml = await this.fetchPage(link)
              const faculty$ = cheerio.load(facultyHtml)
              const facultyProfs = this.extractProfessors(faculty$, university, source, link)
              professors.push(...facultyProfs)
              
              await this.delay(500, 1000) // Small delay between pages
            } catch (error) {
              console.log(`    ⚠️  Failed to scrape faculty page: ${link}`)
            }
          }
        } else {
          // Direct professor extraction
          const directProfs = this.extractProfessors($, university, source, url)
          professors.push(...directProfs)
        }

      } catch (error) {
        console.log(`    ❌ Failed to scrape: ${url}`)
        throw error
      }
    }

    return professors
  }

  private extractProfessors(
    $: cheerio.CheerioAPI, 
    university: UniversityConfig, 
    source: ScrapingSource, 
    sourceUrl: string
  ): ScrapedProfessor[] {
    const professors: ScrapedProfessor[] = []
    const cards = $(source.selectors.professorCards)

    console.log(`    👥 Found ${cards.length} potential professor cards`)

    cards.each((_, card) => {
      try {
        const $card = $(card)
        
        // Extract name with multiple selector fallbacks
        const name = this.extractTextWithFallbacks($card, source.selectors.name)
        if (!name || name.length < 3) return

        // Extract department
        const department = this.extractTextWithFallbacks($card, source.selectors.department) || 'No especificado'

        // Extract email
        let email = this.extractEmailWithFallbacks($card, source.selectors.email)

        // Extract title if available
        const title = source.selectors.title ? 
          this.extractTextWithFallbacks($card, source.selectors.title) : undefined

        // Extract profile link if available
        const profileLink = source.selectors.profileLink ?
          this.extractLinkWithFallbacks($card, source.selectors.profileLink, university.baseUrl) : undefined

        // Calculate confidence score
        const confidence = this.calculateConfidence(name, department, email, title)

        if (confidence < 0.3) return // Skip low-confidence entries

        const professor: ScrapedProfessor = {
          id: this.generateId(university.id, name),
          name: this.cleanName(name),
          email: email || '',
          department: this.cleanDepartment(department),
          university: university.shortName,
          title: title ? this.cleanTitle(title) : undefined,
          profileUrl: profileLink,
          campus: university.location,
          source: sourceUrl,
          scrapedAt: new Date().toISOString(),
          verified: !!email && email.includes('@'),
          confidence
        }

        professors.push(professor)

      } catch (error) {
        // Skip individual card errors
      }
    })

    console.log(`    ✅ Extracted ${professors.length} valid professors`)
    return professors
  }

  private extractTextWithFallbacks($element: cheerio.Cheerio<any>, selectors: string): string {
    const selectorList = selectors.split(',').map(s => s.trim())
    
    for (const selector of selectorList) {
      const text = $element.find(selector).first().text().trim()
      if (text && text.length > 0) {
        return text
      }
    }

    return ''
  }

  private extractEmailWithFallbacks($element: cheerio.Cheerio<any>, selectors: string): string {
    const selectorList = selectors.split(',').map(s => s.trim())
    
    for (const selector of selectorList) {
      const emailEl = $element.find(selector).first()
      if (emailEl.length) {
        const href = emailEl.attr('href')
        if (href && href.startsWith('mailto:')) {
          return href.replace('mailto:', '')
        }
        
        const text = emailEl.text().trim()
        if (text.includes('@')) {
          return text
        }
      }
    }

    // Look for email patterns in text content
    const allText = $element.text()
    const emailMatch = allText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)
    return emailMatch ? emailMatch[0] : ''
  }

  private extractLinkWithFallbacks($element: cheerio.Cheerio<any>, selectors: string, baseUrl: string): string {
    const selectorList = selectors.split(',').map(s => s.trim())
    
    for (const selector of selectorList) {
      const linkEl = $element.find(selector).first()
      if (linkEl.length) {
        const href = linkEl.attr('href')
        if (href) {
          return this.resolveUrl(baseUrl, href)
        }
      }
    }

    return ''
  }

  private async generateMissingEmails(university: UniversityConfig, professors: ScrapedProfessor[]): Promise<ScrapedProfessor[]> {
    return professors.map(prof => {
      if (!prof.email || prof.email.length === 0) {
        const generatedEmail = this.generateEmail(prof.name, university.emailPatterns)
        if (generatedEmail) {
          prof.email = generatedEmail + ' (generated)'
          prof.verified = false
        }
      }
      return prof
    })
  }

  private generateEmail(name: string, patterns: string[]): string {
    const cleanName = name.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z\s]/g, '') // Remove non-letters
      .trim()

    const parts = cleanName.split(/\s+/)
    if (parts.length < 2) return ''

    const first = parts[0]
    const last = parts[parts.length - 1]

    for (const pattern of patterns) {
      const email = pattern
        .replace('{first}', first)
        .replace('{last}', last)
      
      if (email.includes('@')) {
        return email
      }
    }

    return ''
  }

  private calculateConfidence(name: string, department: string, email: string, title?: string): number {
    let confidence = 0

    // Name quality (0.4 max)
    if (name && name.length >= 3) {
      confidence += 0.2
      if (name.includes(' ')) confidence += 0.1 // Has space (likely full name)
      if (/^[A-Z]/.test(name)) confidence += 0.1 // Starts with capital
    }

    // Department quality (0.2 max)
    if (department && department !== 'No especificado') {
      confidence += 0.2
    }

    // Email quality (0.3 max)
    if (email) {
      if (email.includes('@')) confidence += 0.2
      if (!email.includes('generated')) confidence += 0.1
    }

    // Title quality (0.1 max)
    if (title && (title.includes('Dr') || title.includes('Prof') || title.includes('Ing'))) {
      confidence += 0.1
    }

    return Math.min(confidence, 1.0)
  }

  private removeDuplicates(professors: ScrapedProfessor[]): ScrapedProfessor[] {
    const seen = new Set<string>()
    return professors.filter(prof => {
      const key = `${prof.name.toLowerCase()}-${prof.university}`
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
  }

  private async fetchPage(url: string): Promise<string> {
    // Check cache first
    if (this.cache.has(url)) {
      return this.cache.get(url)
    }

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        },
        signal: AbortSignal.timeout(15000) // 15 second timeout
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const html = await response.text()
      
      // Cache the result
      this.cache.set(url, html)
      
      return html
    } catch (error) {
      throw new Error(`Failed to fetch ${url}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  private async checkRobotsTxt(baseUrl: string): Promise<boolean> {
    try {
      const robotsUrl = new URL('/robots.txt', baseUrl).toString()
      const response = await fetch(robotsUrl, { 
        headers: { 'User-Agent': this.userAgent },
        signal: AbortSignal.timeout(5000)
      })
      
      if (!response.ok) return true // If no robots.txt, assume allowed
      
      const robotsText = await response.text()
      
      // Simple robots.txt parsing - look for disallow rules
      const lines = robotsText.split('\n')
      let userAgentMatch = false
      
      for (const line of lines) {
        const trimmed = line.trim().toLowerCase()
        
        if (trimmed.startsWith('user-agent:')) {
          const agent = trimmed.split(':')[1].trim()
          userAgentMatch = agent === '*' || agent.includes('bot')
        }
        
        if (userAgentMatch && trimmed.startsWith('disallow:')) {
          const path = trimmed.split(':')[1].trim()
          if (path === '/' || path === '') {
            return false // Disallowed
          }
        }
      }
      
      return true // Allowed
    } catch (error) {
      return true // If can't check, assume allowed
    }
  }

  private resolveUrl(baseUrl: string, href: string): string {
    try {
      return new URL(href, baseUrl).toString()
    } catch {
      return href
    }
  }

  private generateId(universityId: string, name: string): string {
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '')
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    return `${universityId}-${timestamp}-${random}`
  }

  private cleanName(name: string): string {
    return name
      .replace(/\s+/g, ' ')
      .replace(/^(Dr\.?|Dra\.?|Prof\.?|Ing\.?|Lic\.?)\s*/i, '')
      .trim()
  }

  private cleanDepartment(department: string): string {
    return department
      .replace(/\s+/g, ' ')
      .replace(/^(Departamento de|Escuela de|Facultad de)\s*/i, '')
      .trim()
  }

  private cleanTitle(title: string): string {
    return title
      .replace(/\s+/g, ' ')
      .trim()
  }

  private async delay(min: number, max: number): Promise<void> {
    const delay = Math.random() * (max - min) + min
    return new Promise(resolve => setTimeout(resolve, delay))
  }

  private printSummary(): void {
    console.log('\n📊 SCRAPING SUMMARY:')
    
    let totalProfessors = 0
    let totalErrors = 0
    let totalTime = 0

    for (const [universityId, result] of Array.from(this.results)) {
      totalProfessors += result.professors.length
      totalErrors += result.errors.length
      totalTime += result.stats.processingTime

      console.log(`  ${universityId.toUpperCase()}: ${result.professors.length} professors, ${result.errors.length} errors`)
    }

    console.log(`\n🎯 TOTALS:`)
    console.log(`  👥 Professors: ${totalProfessors}`)
    console.log(`  ❌ Errors: ${totalErrors}`)
    console.log(`  ⏱️  Time: ${(totalTime / 1000).toFixed(2)}s`)
  }

  private async saveResults(): Promise<void> {
    try {
      const timestamp = Date.now()
      const dataDir = path.join(process.cwd(), 'data')
      
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true })
      }

      // Save detailed results
      const detailedResults = Object.fromEntries(this.results)
      const detailedPath = path.join(dataDir, `advanced_scrape_results_${timestamp}.json`)
      fs.writeFileSync(detailedPath, JSON.stringify(detailedResults, null, 2))

      // Save professors for import
      const allProfessors = Array.from(this.results.values())
        .flatMap(result => result.professors)
        .filter(prof => prof.confidence >= 0.5) // Only high-confidence professors

      const importPath = path.join(dataDir, 'professors_for_import_advanced.json')
      fs.writeFileSync(importPath, JSON.stringify(allProfessors, null, 2))

      console.log(`\n💾 Results saved:`)
      console.log(`  📋 Detailed: ${detailedPath}`)
      console.log(`  📊 Import: ${importPath}`)
      console.log(`  👥 Ready for import: ${allProfessors.length} professors`)

    } catch (error) {
      console.error('❌ Failed to save results:', error)
    }
  }
}

export default AdvancedUniversityScraper 