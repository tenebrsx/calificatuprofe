import { ImprovedPUCMMScraper } from './improvedPucmmScraper'
import { INTECScraper } from './intecScraper'
import { db } from '@/lib/firebase'
import { collection, writeBatch, doc, getDocs, query, where, setDoc } from 'firebase/firestore'

export interface University {
  id: string
  name: string
  shortName: string
  website: string
  location: string
  scraperClass?: string
}

export interface ScrapingJob {
  id: string
  universityId: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  startedAt?: Date
  completedAt?: Date
  professorsFound: number
  errors: string[]
  lastRun?: Date
}

/**
 * Dominican Republic Universities - Major institutions
 */
export const DR_UNIVERSITIES: University[] = [
  {
    id: 'pucmm',
    name: 'Pontificia Universidad Católica Madre y Maestra',
    shortName: 'PUCMM',
    website: 'https://www.pucmm.edu.do',
    location: 'Santiago, Santo Domingo'
  },
  {
    id: 'uasd',
    name: 'Universidad Autónoma de Santo Domingo',
    shortName: 'UASD',
    website: 'https://www.uasd.edu.do',
    location: 'Santo Domingo'
  },
  {
    id: 'intec',
    name: 'Instituto Tecnológico de Santo Domingo',
    shortName: 'INTEC',
    website: 'https://www.intec.edu.do',
    location: 'Santo Domingo'
  },
  {
    id: 'unibe',
    name: 'Universidad Iberoamericana',
    shortName: 'UNIBE',
    website: 'https://www.unibe.edu.do',
    location: 'Santo Domingo'
  },
  {
    id: 'pucamaima',
    name: 'Pontificia Universidad Católica Santo Tomás de Aquino',
    shortName: 'PUCSTA',
    website: 'https://www.pucamaima.edu.do',
    location: 'Santo Domingo'
  },
  {
    id: 'utesa',
    name: 'Universidad Tecnológica de Santiago',
    shortName: 'UTESA',
    website: 'https://www.utesa.edu.do',
    location: 'Santiago'
  },
  {
    id: 'ucne',
    name: 'Universidad Católica Nordestana',
    shortName: 'UCNE',
    website: 'https://www.ucne.edu.do',
    location: 'San Francisco de Macorís'
  },
  {
    id: 'uapm',
    name: 'Universidad Agroforestal Fernando Arturo de Meriño',
    shortName: 'UAPM',
    website: 'https://www.uapm.edu.do',
    location: 'Jarabacoa'
  }
]

export class ScraperManager {
  private scrapers: Map<string, any> = new Map()

  constructor() {
    // Register available scrapers
    this.scrapers.set('pucmm', ImprovedPUCMMScraper)
    this.scrapers.set('intec', INTECScraper)
  }

  /**
   * Run scraping for a specific university
   */
  async scrapeUniversity(universityId: string): Promise<ScrapingJob> {
    const job: ScrapingJob = {
      id: `${universityId}_${Date.now()}`,
      universityId,
      status: 'pending',
      professorsFound: 0,
      errors: []
    }

    try {
      job.status = 'running'
      job.startedAt = new Date()

      console.log(`🎓 Starting scraping for ${universityId.toUpperCase()}...`)

      const ScraperClass = this.scrapers.get(universityId)
      if (!ScraperClass) {
        throw new Error(`No scraper available for university: ${universityId}`)
      }

      const scraper = new ScraperClass()
      const result = await scraper.scrapeProfessors()

      // Save professors to database
      if (result.professors.length > 0) {
        await this.saveProfessorsToDatabase(result.professors, universityId)
      }

      job.status = 'completed'
      job.professorsFound = result.professors.length
      job.errors = result.errors
      job.completedAt = new Date()

      console.log(`✅ Scraping completed for ${universityId.toUpperCase()}: ${result.professors.length} professors`)

    } catch (error: unknown) {
      job.status = 'failed'
      job.errors.push(error instanceof Error ? error.message : "Unknown error")
      job.completedAt = new Date()
      console.error(`❌ Scraping failed for ${universityId}:`, error instanceof Error ? error.message : "Unknown error")
    }

    // Save job record
    await this.saveScrapingJob(job)
    return job
  }

  /**
   * Run scraping for all available universities
   */
  async scrapeAllUniversities(): Promise<ScrapingJob[]> {
    const jobs: ScrapingJob[] = []
    
    console.log('🔄 Starting scraping for all universities...')
    
    for (const university of DR_UNIVERSITIES) {
      if (this.scrapers.has(university.id)) {
        try {
          const job = await this.scrapeUniversity(university.id)
          jobs.push(job)
          
          // Wait between scrapers to be respectful
          await new Promise(resolve => setTimeout(resolve, 2000))
        } catch (error: unknown) {
          console.error(`Failed to scrape ${university.shortName}:`, error)
        }
      } else {
        console.log(`⚠️ No scraper available for ${university.shortName}`)
      }
    }

    console.log(`🎯 Scraping summary: ${jobs.length} universities processed`)
    return jobs
  }

  /**
   * Save professors to Firebase database
   */
  private async saveProfessorsToDatabase(professors: any[], universityId: string): Promise<void> {
    try {
      const batch = writeBatch(db)
      const professorsRef = collection(db, 'professors')

      // Check for existing professors to avoid duplicates
      const existingProfessorsQuery = query(
        professorsRef, 
        where('university', '==', universityId.toUpperCase())
      )
      const existingSnapshot = await getDocs(existingProfessorsQuery)
      const existingEmails = new Set(existingSnapshot.docs.map(doc => doc.data().email))

      let newProfessorsCount = 0

      for (const prof of professors) {
        if (!existingEmails.has(prof.email)) {
          const docRef = doc(professorsRef)
          batch.set(docRef, {
            ...prof,
            university: prof.university || universityId.toUpperCase(),
            averageRating: 0,
            totalReviews: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            isVerified: false,
            source: `${universityId}_scraper`,
            lastScraped: new Date()
          })
          newProfessorsCount++
        }
      }

      if (newProfessorsCount > 0) {
        await batch.commit()
        console.log(`💾 Saved ${newProfessorsCount} new professors to database`)
      } else {
        console.log('📋 No new professors to save (all already exist)')
      }

    } catch (error: unknown) {
      console.error('❌ Error saving professors to database:', error)
      throw error
    }
  }

  /**
   * Save scraping job record
   */
  private async saveScrapingJob(job: ScrapingJob): Promise<void> {
    try {
      const jobsRef = collection(db, 'scraping_jobs')
      const docRef = doc(jobsRef, job.id)
      await setDoc(docRef, job)
    } catch (error: unknown) {
      console.error('Error saving scraping job:', error)
    }
  }

  /**
   * Get scraping statistics
   */
  async getScrapingStats(): Promise<any> {
    try {
      const professorsSnapshot = await getDocs(collection(db, 'professors'))
      const jobsSnapshot = await getDocs(collection(db, 'scraping_jobs'))

      const statsByUniversity: any = {}
      
      professorsSnapshot.docs.forEach(doc => {
        const data = doc.data()
        const university = data.university || 'Unknown'
        
        if (!statsByUniversity[university]) {
          statsByUniversity[university] = {
            totalProfessors: 0,
            lastScraped: null,
            sources: new Set()
          }
        }
        
        statsByUniversity[university].totalProfessors++
        statsByUniversity[university].sources.add(data.source)
        
        if (data.lastScraped && (!statsByUniversity[university].lastScraped || 
            data.lastScraped > statsByUniversity[university].lastScraped)) {
          statsByUniversity[university].lastScraped = data.lastScraped
        }
      })

      // Convert Set to Array for JSON serialization
      Object.keys(statsByUniversity).forEach(key => {
        statsByUniversity[key].sources = Array.from(statsByUniversity[key].sources)
      })

      return {
        totalProfessors: professorsSnapshot.size,
        totalJobs: jobsSnapshot.size,
        universitiesStats: statsByUniversity,
        availableScrapers: Array.from(this.scrapers.keys()),
        supportedUniversities: DR_UNIVERSITIES.map(u => u.shortName)
      }
    } catch (error: unknown) {
      console.error('Error getting scraping stats:', error)
      return { error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  /**
   * Schedule regular scraping jobs
   */
  scheduleRegularScraping(intervalHours: number = 24): void {
    console.log(`📅 Scheduling scraping every ${intervalHours} hours`)
    
    setInterval(async () => {
      try {
        console.log('🔄 Starting scheduled scraping...')
        await this.scrapeAllUniversities()
      } catch (error: unknown) {
        console.error('❌ Scheduled scraping failed:', error)
      }
    }, intervalHours * 60 * 60 * 1000)
  }
}

// Export singleton instance
export const scraperManager = new ScraperManager() 