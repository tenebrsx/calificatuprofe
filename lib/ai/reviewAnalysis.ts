// Simple AI review analysis without external dependencies
// This is a foundation that can be enhanced with actual AI APIs later

interface ReviewData {
  id: string
  text: string
  rating: number
  tags: string[]
  semester: string
  course: string
}

interface AnalysisResult {
  sentiment: 'positive' | 'negative' | 'neutral'
  score: number
  themes: string[]
  teachingStyle: string[]
  recommendations: string[]
  summary: string
}

interface ProfessorInsights {
  overallSentiment: 'positive' | 'negative' | 'neutral'
  averageSentimentScore: number
  topThemes: Array<{ theme: string; frequency: number }>
  teachingStyleProfile: {
    style: string
    confidence: number
    characteristics: string[]
  }
  studentRecommendations: string[]
  aiGeneratedSummary: string
  learningStyleCompatibility: {
    visual: number
    auditory: number
    kinesthetic: number
    reading: number
  }
}

export class ReviewAnalysisEngine {
  
  /**
   * Analyze a single review for sentiment and themes
   */
  analyzeReview(review: ReviewData): AnalysisResult {
    const sentiment = this.determineSentiment(review.text, review.rating)
    const themes = this.extractThemes(review.text)
    const teachingStyle = this.identifyTeachingStyle(review.text)
    
    return {
      sentiment: sentiment.label,
      score: sentiment.score,
      themes,
      teachingStyle,
      recommendations: this.generateRecommendations(review.text, sentiment.label),
      summary: this.generateReviewSummary(review.text, themes)
    }
  }

  /**
   * Generate comprehensive insights for a professor based on all their reviews
   */
  generateProfessorInsights(reviews: ReviewData[]): ProfessorInsights {
    if (reviews.length === 0) {
      return this.getDefaultInsights()
    }

    const analyses = reviews.map(review => this.analyzeReview(review))
    
    // Calculate overall sentiment
    const sentimentScores = analyses.map(a => a.score)
    const averageSentiment = sentimentScores.reduce((a, b) => a + b, 0) / sentimentScores.length
    
    // Extract and count themes
    const allThemes = analyses.flatMap(a => a.themes)
    const themeFrequency = this.countFrequency(allThemes)
    
    // Determine teaching style
    const teachingStyles = analyses.flatMap(a => a.teachingStyle)
    const styleProfile = this.determineTeachingStyleProfile(teachingStyles, reviews)
    
    // Generate AI summary
    const summary = this.generateAISummary(reviews, analyses)
    
    return {
      overallSentiment: this.scoresToSentiment(averageSentiment),
      averageSentimentScore: averageSentiment,
      topThemes: themeFrequency.slice(0, 10),
      teachingStyleProfile: styleProfile,
      studentRecommendations: this.extractRecommendations(analyses),
      aiGeneratedSummary: summary,
      learningStyleCompatibility: this.assessLearningStyleCompatibility(reviews)
    }
  }

  private determineSentiment(text: string, rating: number): { label: 'positive' | 'negative' | 'neutral', score: number } {
    // Keywords-based sentiment analysis
    const positiveWords = [
      'excelente', 'bueno', 'genial', 'increíble', 'fantástico', 'claro', 'útil', 'aprendo',
      'recomiendo', 'fácil', 'explica bien', 'paciente', 'disponible', 'ayuda', 'motivador'
    ]
    
    const negativeWords = [
      'malo', 'terrible', 'difícil', 'confuso', 'aburrido', 'no explica', 'injusto',
      'no recomiendo', 'perdida de tiempo', 'no aprendes', 'complicado', 'desorganizado'
    ]

    const lowerText = text.toLowerCase()
    
    let sentimentScore = 0
    positiveWords.forEach(word => {
      if (lowerText.includes(word)) sentimentScore += 1
    })
    
    negativeWords.forEach(word => {
      if (lowerText.includes(word)) sentimentScore -= 1
    })

    // Weight by rating (1-5 scale)
    const ratingWeight = (rating - 3) * 2 // Convert to -4 to +4 scale
    sentimentScore += ratingWeight

    // Normalize to -1 to +1 scale
    const normalizedScore = Math.max(-1, Math.min(1, sentimentScore / 5))

    let label: 'positive' | 'negative' | 'neutral'
    if (normalizedScore > 0.2) label = 'positive'
    else if (normalizedScore < -0.2) label = 'negative'
    else label = 'neutral'

    return { label, score: normalizedScore }
  }

  private extractThemes(text: string): string[] {
    const themes: { [key: string]: string[] } = {
      'CLARO AL EXPLICAR': ['explica bien', 'claro', 'entiende', 'comprensible', 'fácil de entender'],
      'EXÁMENES JUSTOS': ['examen justo', 'evaluación', 'fair', 'equilibrado', 'razonable'],
      'DISPONIBLE PARA AYUDAR': ['disponible', 'ayuda', 'office hours', 'consultas', 'apoyo'],
      'TAREAS ÚTILES': ['tareas útiles', 'ejercicios', 'práctica', 'aplicable', 'relevante'],
      'INSPIRADOR': ['inspirador', 'motivador', 'pasión', 'entusiasmo', 'energético'],
      'ORGANIZADO': ['organizado', 'estructura', 'planificado', 'orden', 'sistemático'],
      'TRABAJO EN EQUIPO': ['grupo', 'equipo', 'colaboración', 'proyecto', 'teamwork'],
      'INVESTIGACIÓN': ['investigación', 'research', 'papers', 'actualizado', 'conocimiento'],
      'TECNOLOGÍA': ['tecnología', 'tech', 'digital', 'online', 'plataforma'],
      'CARGA DE TRABAJO': ['mucho trabajo', 'carga', 'intensivo', 'demanding', 'workload']
    }

    const foundThemes: string[] = []
    const lowerText = text.toLowerCase()

    Object.entries(themes).forEach(([theme, keywords]) => {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        foundThemes.push(theme)
      }
    })

    return foundThemes
  }

  private identifyTeachingStyle(text: string): string[] {
    const styles: { [key: string]: string[] } = {
      'Visual': ['visual', 'diagrama', 'gráfico', 'powerpoint', 'pizarra', 'slides'],
      'Práctico': ['práctica', 'hands-on', 'laboratorio', 'ejercicios', 'aplicado'],
      'Teórico': ['teoría', 'conceptos', 'fundamentos', 'principios', 'marco teórico'],
      'Interactivo': ['participación', 'preguntas', 'discusión', 'interactivo', 'debate'],
      'Investigativo': ['investigación', 'papers', 'estudios', 'análisis', 'research'],
      'Tradicional': ['clásico', 'tradicional', 'magistral', 'conferencia', 'lecture']
    }

    const foundStyles: string[] = []
    const lowerText = text.toLowerCase()

    Object.entries(styles).forEach(([style, keywords]) => {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        foundStyles.push(style)
      }
    })

    return foundStyles
  }

  private generateRecommendations(text: string, sentiment: string): string[] {
    const recommendations: string[] = []

    if (sentiment === 'positive') {
      recommendations.push('Estudiantes reportan experiencias positivas')
      if (text.toLowerCase().includes('explica')) {
        recommendations.push('Buenas habilidades de explicación')
      }
    } else if (sentiment === 'negative') {
      recommendations.push('Puede requerir preparación adicional')
      if (text.toLowerCase().includes('difícil')) {
        recommendations.push('Curso considerado desafiante')
      }
    }

    return recommendations
  }

  private generateReviewSummary(text: string, themes: string[]): string {
    if (themes.length === 0) {
      return 'Comentario general del estudiante.'
    }

    const themeText = themes.slice(0, 2).join(' y ')
    return `Estudiante destaca: ${themeText.toLowerCase()}`
  }

  private countFrequency(items: string[]): Array<{ theme: string; frequency: number }> {
    const counts: { [key: string]: number } = {}
    
    items.forEach(item => {
      counts[item] = (counts[item] || 0) + 1
    })

    return Object.entries(counts)
      .map(([theme, frequency]) => ({ theme, frequency }))
      .sort((a, b) => b.frequency - a.frequency)
  }

  private determineTeachingStyleProfile(styles: string[], reviews: ReviewData[]): { style: string; confidence: number; characteristics: string[] } {
    const styleCounts = this.countFrequency(styles)
    
    if (styleCounts.length === 0) {
      return {
        style: 'Estilo Mixto',
        confidence: 0.5,
        characteristics: ['Enfoque balanceado', 'Métodos variados']
      }
    }

    const topStyle = styleCounts[0]
    const confidence = topStyle.frequency / reviews.length

    const characteristics = this.getStyleCharacteristics(topStyle.theme)

    return {
      style: topStyle.theme,
      confidence,
      characteristics
    }
  }

  private getStyleCharacteristics(style: string): string[] {
    const characteristicsMap: { [key: string]: string[] } = {
      'Visual': ['Uso de diagramas y gráficos', 'Presentaciones claras', 'Material visual efectivo'],
      'Práctico': ['Enfoque hands-on', 'Ejercicios aplicados', 'Experiencia práctica'],
      'Teórico': ['Base conceptual sólida', 'Fundamentos profundos', 'Análisis teórico'],
      'Interactivo': ['Fomenta participación', 'Discusiones en clase', 'Engagement estudiantil'],
      'Investigativo': ['Orientado a research', 'Análisis crítico', 'Metodología científica'],
      'Tradicional': ['Metodología clásica', 'Estructura formal', 'Conferencias magistrales']
    }

    return characteristicsMap[style] || ['Estilo único', 'Enfoque personalizado']
  }

  private extractRecommendations(analyses: AnalysisResult[]): string[] {
    const allRecommendations = analyses.flatMap(a => a.recommendations)
    const uniqueRecommendations = Array.from(new Set(allRecommendations))
    return uniqueRecommendations.slice(0, 5)
  }

  private generateAISummary(reviews: ReviewData[], analyses: AnalysisResult[]): string {
    const positiveCount = analyses.filter(a => a.sentiment === 'positive').length
    const totalCount = analyses.length
    const positivePercentage = Math.round((positiveCount / totalCount) * 100)

    const topThemes = this.countFrequency(analyses.flatMap(a => a.themes))
      .slice(0, 3)
      .map(t => t.theme.toLowerCase())

    if (positivePercentage >= 70) {
      return `Los estudiantes reportan experiencias muy positivas (${positivePercentage}% positivas). Se destaca por ${topThemes.join(', ')}. Recomendado para estudiantes que buscan un profesor comprometido con la enseñanza.`
    } else if (positivePercentage >= 50) {
      return `Experiencias mixtas reportadas por estudiantes (${positivePercentage}% positivas). Los estudiantes mencionan ${topThemes.join(' y ')}. Puede ser una buena opción dependiendo de tu estilo de aprendizaje.`
    } else {
      return `Los estudiantes reportan desafíos significativos (${positivePercentage}% positivas). Es importante estar preparado para ${topThemes.join(' y ')}. Considera si este enfoque se alinea con tus preferencias de aprendizaje.`
    }
  }

  private assessLearningStyleCompatibility(reviews: ReviewData[]): { visual: number; auditory: number; kinesthetic: number; reading: number } {
    const allText = reviews.map(r => r.text).join(' ').toLowerCase()

    const visualKeywords = ['visual', 'diagrama', 'gráfico', 'powerpoint', 'slides', 'pizarra']
    const auditoryKeywords = ['explica', 'audio', 'conferencia', 'discusión', 'verbal', 'oral']
    const kinestheticKeywords = ['práctica', 'hands-on', 'laboratorio', 'ejercicios', 'experimento']
    const readingKeywords = ['lectura', 'textos', 'papers', 'libros', 'artículos', 'documentos']

    const countKeywords = (keywords: string[]) => 
      keywords.reduce((count, keyword) => count + (allText.includes(keyword) ? 1 : 0), 0)

    const visual = Math.min(1, countKeywords(visualKeywords) / 5)
    const auditory = Math.min(1, countKeywords(auditoryKeywords) / 5)
    const kinesthetic = Math.min(1, countKeywords(kinestheticKeywords) / 5)
    const reading = Math.min(1, countKeywords(readingKeywords) / 5)

    return { visual, auditory, kinesthetic, reading }
  }

  private scoresToSentiment(score: number): 'positive' | 'negative' | 'neutral' {
    if (score > 0.2) return 'positive'
    if (score < -0.2) return 'negative'
    return 'neutral'
  }

  private getDefaultInsights(): ProfessorInsights {
    return {
      overallSentiment: 'neutral',
      averageSentimentScore: 0,
      topThemes: [],
      teachingStyleProfile: {
        style: 'Sin información suficiente',
        confidence: 0,
        characteristics: ['Profesor nuevo en la plataforma']
      },
      studentRecommendations: ['¡Sé el primero en calificar a este profesor!'],
      aiGeneratedSummary: 'Este profesor aún no tiene suficientes reseñas para generar insights automáticos. ¡Ayuda a otros estudiantes compartiendo tu experiencia!',
      learningStyleCompatibility: {
        visual: 0.5,
        auditory: 0.5,
        kinesthetic: 0.5,
        reading: 0.5
      }
    }
  }
}

// Export singleton instance
export const reviewAnalysisEngine = new ReviewAnalysisEngine()

// Helper functions for easy usage
export function analyzeReview(review: ReviewData): AnalysisResult {
  return reviewAnalysisEngine.analyzeReview(review)
}

export function generateProfessorInsights(reviews: ReviewData[]): ProfessorInsights {
  return reviewAnalysisEngine.generateProfessorInsights(reviews)
} 