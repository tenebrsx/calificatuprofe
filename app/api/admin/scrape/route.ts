import { NextRequest, NextResponse } from 'next/server'
import { scraperManager } from '@/lib/scrapers/scraperManager'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  const university = searchParams.get('university')

  try {
    switch (action) {
      case 'stats':
        const stats = await scraperManager.getScrapingStats()
        return NextResponse.json({
          success: true,
          data: stats
        })

      case 'universities':
        const { DR_UNIVERSITIES } = await import('@/lib/scrapers/scraperManager')
        return NextResponse.json({
          success: true,
          data: DR_UNIVERSITIES
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Use: stats, universities'
        }, { status: 400 })
    }
  } catch (error: unknown) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, university } = body

    switch (action) {
      case 'scrape-single':
        if (!university) {
          return NextResponse.json({
            success: false,
            error: 'University ID is required'
          }, { status: 400 })
        }

        console.log(`🎓 Starting scraping for ${university}...`)
        const job = await scraperManager.scrapeUniversity(university)
        
        return NextResponse.json({
          success: true,
          message: `Scraping ${job.status} for ${university}`,
          data: job
        })

      case 'scrape-all':
        console.log('🔄 Starting scraping for all universities...')
        
        // Run in background for all universities
        scraperManager.scrapeAllUniversities().then(jobs => {
          console.log(`✅ All scraping jobs completed: ${jobs.length} universities`)
        }).catch(error => {
          console.error('❌ Scraping failed:', error)
        })
        
        return NextResponse.json({
          success: true,
          message: 'Scraping started for all universities (running in background)',
          data: { jobsStarted: true }
        })

      case 'test-scraper':
        if (!university) {
          return NextResponse.json({
            success: false,
            error: 'University ID is required for testing'
          }, { status: 400 })
        }

        // Test the scraper without saving to database
        const { ImprovedPUCMMScraper } = await import('@/lib/scrapers/improvedPucmmScraper')
        
        if (university === 'pucmm') {
          const scraper = new ImprovedPUCMMScraper()
          const result = await scraper.scrapeProfessors()
          
          return NextResponse.json({
            success: true,
            message: 'Scraper test completed',
            data: {
              university: university.toUpperCase(),
              professorsFound: result.totalFound,
              errors: result.errors,
              sampleProfessors: result.professors.slice(0, 5),
              scrapedAt: result.scrapedAt
            }
          })
        } else {
          return NextResponse.json({
            success: false,
            error: `No scraper available for ${university.toUpperCase()}`
          }, { status: 400 })
        }

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Use: scrape-single, scrape-all, test-scraper'
        }, { status: 400 })
    }
  } catch (error: unknown) {
    console.error('API Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
} 