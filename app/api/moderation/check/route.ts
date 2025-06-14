import { NextRequest, NextResponse } from 'next/server'
import { toxicityDetector } from '@/lib/moderation/toxicityDetector'
import { getServerSession } from 'next-auth'

export async function POST(request: NextRequest) {
  try {
    const { text, context } = await request.json()
    
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text content is required' },
        { status: 400 }
      )
    }

    // Get user session for logging
    const session = await getServerSession()
    const userId = session?.user?.email || 'anonymous'

    // Run toxicity detection
    const result = await toxicityDetector.moderateContent(text, userId)

    // Return detailed response
    return NextResponse.json({
      allowed: result.allowed,
      reasons: result.reasons,
      confidence: result.confidence,
      flaggedContent: result.flaggedContent,
      scores: {
        // Only return summary scores for privacy
        toxicity: result.scores.perspective?.toxicityScore || null,
        openai_flagged: result.scores.openai?.flagged || null,
        local_score: result.scores.local?.score || null
      },
      context: context || 'review'
    })

  } catch (error) {
    console.error('Moderation API error:', error)
    
    return NextResponse.json(
      { 
        error: 'Moderation service temporarily unavailable',
        allowed: false, // Fail-safe: reject when service fails
        reasons: ['Sistema de moderación temporalmente no disponible']
      },
      { status: 500 }
    )
  }
}

// Test endpoint for development
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const testText = searchParams.get('text') || 'Este profesor es excelente'
  
  try {
    const result = await toxicityDetector.moderateContent(testText)
    
    return NextResponse.json({
      testText,
      result,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Test failed', details: error },
      { status: 500 }
    )
  }
} 