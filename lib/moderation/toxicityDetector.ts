import { NextRequest } from 'next/server'

// Types for moderation responses
interface OpenAIModerationResponse {
  id: string
  model: string
  results: Array<{
    flagged: boolean
    categories: {
      sexual: boolean
      hate: boolean
      harassment: boolean
      'self-harm': boolean
      'sexual/minors': boolean
      'hate/threatening': boolean
      'violence/graphic': boolean
      'self-harm/intent': boolean
      'self-harm/instructions': boolean
      'harassment/threatening': boolean
      violence: boolean
    }
    category_scores: {
      sexual: number
      hate: number
      harassment: number
      'self-harm': number
      'sexual/minors': number
      'hate/threatening': number
      'violence/graphic': number
      'self-harm/intent': number
      'self-harm/instructions': number
      'harassment/threatening': number
      violence: number
    }
  }>
}

interface PerspectiveResponse {
  attributeScores: {
    TOXICITY: {
      summaryScore: {
        value: number
      }
    }
    SEVERE_TOXICITY?: {
      summaryScore: {
        value: number
      }
    }
    IDENTITY_ATTACK?: {
      summaryScore: {
        value: number
      }
    }
    INSULT?: {
      summaryScore: {
        value: number
      }
    }
    PROFANITY?: {
      summaryScore: {
        value: number
      }
    }
    THREAT?: {
      summaryScore: {
        value: number
      }
    }
  }
}

interface ModerationResult {
  allowed: boolean
  reasons: string[]
  scores: {
    openai?: any
    perspective?: any
    local?: any
  }
  confidence: number
  flaggedContent?: string[]
}

interface ModerationConfig {
  openaiApiKey?: string
  perspectiveApiKey?: string
  thresholds: {
    toxicity: number
    harassment: number
    hate: number
    violence: number
    sexual: number
  }
  enableOpenAI: boolean
  enablePerspective: boolean
  enableLocalFilter: boolean
  logRejections: boolean
}

// Dominican Spanish slurs and toxic keywords
const TOXIC_KEYWORDS = [
  // Slurs and offensive terms
  'mamagallismo', 'mamaguevo', 'cabron', 'hijo de puta', 'hijueputa',
  'pendejo', 'estupido', 'idiota', 'imbecil', 'retrasado', 'mongolico',
  'maricon', 'pato', 'loca', 'tortillera', 'bollera',
  
  // Defamatory terms
  'corrupto', 'ladron', 'sinverguenza', 'descarado', 'mentiroso',
  'estafador', 'timador', 'vividor', 'aprovechado',
  
  // Threats and violence
  'matar', 'golpear', 'romper', 'destruir', 'venganza', 'pagar',
  'consecuencias', 'amenaza', 'cuidado', 'te voy a',
  
  // Personal attacks
  'feo', 'gordo', 'flaco', 'negro', 'blanco', 'indio', 'chino',
  'viejo', 'joven', 'calvo', 'peludo', 'sucio', 'cochino',
  
  // Academic harassment
  'fracasado', 'inutil', 'incompetente', 'ignorante', 'bruto',
  'animal', 'bestia', 'salvaje', 'primitivo',
  
  // Sexual harassment
  'sexy', 'buena', 'rica', 'sabrosa', 'tetona', 'culona',
  'perra', 'zorra', 'puta', 'prostituta', 'ramera',
  
  // Spam indicators
  'click aqui', 'gana dinero', 'oferta especial', 'gratis',
  'promocion', 'descuento', 'llamar ahora', 'urgente'
]

// Personal information patterns
const PERSONAL_INFO_PATTERNS = [
  /\b\d{3}-\d{3}-\d{4}\b/, // Phone numbers
  /\b\d{3}\.\d{3}\.\d{4}\b/,
  /\b\(\d{3}\)\s*\d{3}-\d{4}\b/,
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Emails
  /\bcalle\s+[a-zA-Z0-9\s]+\d+/i, // Addresses
  /\bavenida\s+[a-zA-Z0-9\s]+\d+/i,
  /\bvive\s+en\s+[a-zA-Z\s]+/i,
  /\bdireccion\s*:?\s*[a-zA-Z0-9\s,]+/i
]

export class ToxicityDetector {
  private config: ModerationConfig

  constructor() {
    this.config = {
      openaiApiKey: process.env.OPENAI_API_KEY,
      perspectiveApiKey: process.env.PERSPECTIVE_API_KEY,
      thresholds: {
        toxicity: parseFloat(process.env.TOXICITY_THRESHOLD || '0.7'),
        harassment: parseFloat(process.env.HARASSMENT_THRESHOLD || '0.8'),
        hate: parseFloat(process.env.HATE_THRESHOLD || '0.8'),
        violence: parseFloat(process.env.VIOLENCE_THRESHOLD || '0.8'),
        sexual: parseFloat(process.env.SEXUAL_THRESHOLD || '0.8')
      },
      enableOpenAI: process.env.ENABLE_OPENAI_MODERATION === 'true',
      enablePerspective: process.env.ENABLE_PERSPECTIVE_API === 'true',
      enableLocalFilter: process.env.ENABLE_LOCAL_FILTER !== 'false', // Default true
      logRejections: process.env.LOG_REJECTIONS !== 'false' // Default true
    }
  }

  async moderateContent(text: string, userId?: string): Promise<ModerationResult> {
    const result: ModerationResult = {
      allowed: true,
      reasons: [],
      scores: {},
      confidence: 0,
      flaggedContent: []
    }

    try {
      // 1. Local keyword filter (always runs first for speed)
      if (this.config.enableLocalFilter) {
        const localResult = this.checkLocalFilter(text)
        result.scores.local = localResult
        
        if (!localResult.passed) {
          result.allowed = false
          result.reasons.push(...localResult.reasons)
          result.flaggedContent?.push(...localResult.flaggedWords)
          result.confidence = 0.9 // High confidence for explicit matches
        }
      }

      // 2. OpenAI Moderation API
      if (this.config.enableOpenAI && this.config.openaiApiKey) {
        try {
          const openaiResult = await this.checkOpenAIModeration(text)
          result.scores.openai = openaiResult
          
          if (!openaiResult.passed) {
            result.allowed = false
            result.reasons.push(...openaiResult.reasons)
            result.confidence = Math.max(result.confidence, 0.85)
          }
        } catch (error) {
          console.warn('OpenAI Moderation API failed:', error)
        }
      }

      // 3. Google Perspective API
      if (this.config.enablePerspective && this.config.perspectiveApiKey) {
        try {
          const perspectiveResult = await this.checkPerspectiveAPI(text)
          result.scores.perspective = perspectiveResult
          
          if (!perspectiveResult.passed) {
            result.allowed = false
            result.reasons.push(...perspectiveResult.reasons)
            result.confidence = Math.max(result.confidence, 0.8)
          }
        } catch (error) {
          console.warn('Perspective API failed:', error)
        }
      }

      // 4. Additional checks
      const additionalChecks = this.performAdditionalChecks(text)
      if (!additionalChecks.passed) {
        result.allowed = false
        result.reasons.push(...additionalChecks.reasons)
        result.confidence = Math.max(result.confidence, 0.7)
      }

      // 5. Log if rejected
      if (!result.allowed && this.config.logRejections) {
        await this.logRejection(text, result, userId)
      }

      return result

    } catch (error) {
      console.error('Toxicity detection error:', error)
      
      // Fail-safe: if all APIs fail, use local filter only
      const localResult = this.checkLocalFilter(text)
      return {
        allowed: localResult.passed,
        reasons: localResult.passed ? [] : localResult.reasons,
        scores: { local: localResult },
        confidence: 0.5,
        flaggedContent: localResult.flaggedWords
      }
    }
  }

  private checkLocalFilter(text: string) {
    const normalizedText = text.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
    
    const flaggedWords: string[] = []
    const reasons: string[] = []

    // Check toxic keywords
    for (const keyword of TOXIC_KEYWORDS) {
      if (normalizedText.includes(keyword.toLowerCase())) {
        flaggedWords.push(keyword)
      }
    }

    // Check personal information
    for (const pattern of PERSONAL_INFO_PATTERNS) {
      if (pattern.test(text)) {
        reasons.push('Contiene información personal')
        break
      }
    }

    // Check for excessive caps (shouting)
    const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length
    if (capsRatio > 0.7 && text.length > 20) {
      reasons.push('Texto excesivamente en mayúsculas')
    }

    // Check for spam patterns
    if (text.length < 10) {
      reasons.push('Contenido demasiado corto')
    }

    if (flaggedWords.length > 0) {
      reasons.push(`Contiene lenguaje ofensivo: ${flaggedWords.slice(0, 3).join(', ')}`)
    }

    return {
      passed: flaggedWords.length === 0 && reasons.length === 0,
      reasons,
      flaggedWords,
      score: flaggedWords.length / 10 // Simple scoring
    }
  }

  private async checkOpenAIModeration(text: string) {
    const response = await fetch('https://api.openai.com/v1/moderations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ input: text })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data: OpenAIModerationResponse = await response.json()
    const result = data.results[0]
    
    const reasons: string[] = []
    
    if (result.flagged) {
      if (result.categories.hate) reasons.push('Discurso de odio detectado')
      if (result.categories.harassment) reasons.push('Acoso detectado')
      if (result.categories.violence) reasons.push('Contenido violento detectado')
      if (result.categories.sexual) reasons.push('Contenido sexual inapropiado')
      if (result.categories['harassment/threatening']) reasons.push('Amenazas detectadas')
    }

    return {
      passed: !result.flagged,
      reasons,
      scores: result.category_scores,
      flagged: result.flagged
    }
  }

  private async checkPerspectiveAPI(text: string) {
    const url = `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${this.config.perspectiveApiKey}`
    
    const requestData = {
      comment: { text },
      requestedAttributes: {
        TOXICITY: {},
        SEVERE_TOXICITY: {},
        IDENTITY_ATTACK: {},
        INSULT: {},
        PROFANITY: {},
        THREAT: {}
      }
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData)
    })

    if (!response.ok) {
      throw new Error(`Perspective API error: ${response.status}`)
    }

    const data: PerspectiveResponse = await response.json()
    const toxicityScore = data.attributeScores.TOXICITY.summaryScore.value
    
    const reasons: string[] = []
    
    if (toxicityScore > this.config.thresholds.toxicity) {
      reasons.push(`Toxicidad alta detectada (${(toxicityScore * 100).toFixed(1)}%)`)
    }

    if (data.attributeScores.SEVERE_TOXICITY?.summaryScore?.value && data.attributeScores.SEVERE_TOXICITY.summaryScore.value > 0.8) {
      reasons.push('Toxicidad severa detectada')
    }

    if (data.attributeScores.THREAT?.summaryScore?.value && data.attributeScores.THREAT.summaryScore.value > 0.7) {
      reasons.push('Amenazas detectadas')
    }

    return {
      passed: toxicityScore <= this.config.thresholds.toxicity,
      reasons,
      scores: data.attributeScores,
      toxicityScore
    }
  }

  private performAdditionalChecks(text: string) {
    const reasons: string[] = []

    // Check for repeated characters (spam)
    if (/(.)\1{4,}/.test(text)) {
      reasons.push('Contiene caracteres repetitivos (spam)')
    }

    // Check for excessive punctuation
    const punctuationRatio = (text.match(/[!?.,;:]/g) || []).length / text.length
    if (punctuationRatio > 0.3) {
      reasons.push('Puntuación excesiva')
    }

    // Check for professor name + negative words (potential defamation)
    const professorTitles = ['profesor', 'profesora', 'dr', 'dra', 'ing', 'lic']
    const negativeWords = ['malo', 'terrible', 'horrible', 'pesimo', 'incompetente']
    
    const hasTitle = professorTitles.some(title => 
      text.toLowerCase().includes(title)
    )
    const hasNegative = negativeWords.some(word => 
      text.toLowerCase().includes(word)
    )
    
    if (hasTitle && hasNegative && text.length < 50) {
      reasons.push('Posible difamación sin contexto académico')
    }

    return {
      passed: reasons.length === 0,
      reasons
    }
  }

  private async logRejection(text: string, result: ModerationResult, userId?: string) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      userId: userId || 'anonymous',
      text: text.substring(0, 200), // Truncate for privacy
      reasons: result.reasons,
      confidence: result.confidence,
      scores: result.scores
    }

    // In production, save to database
    console.log('🚫 CONTENT REJECTED:', logEntry)
    
    // You can implement database logging here
    // await db.collection('moderation_logs').add(logEntry)
  }

  // Middleware function for Express/Next.js
  static createMiddleware() {
    const detector = new ToxicityDetector()
    
    return async (req: NextRequest, text: string, userId?: string) => {
      return await detector.moderateContent(text, userId)
    }
  }
}

// Export singleton instance
export const toxicityDetector = new ToxicityDetector() 