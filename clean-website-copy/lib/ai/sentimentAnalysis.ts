interface SentimentResult {
  score: number; // -1 to 1 (negative to positive)
  magnitude: number; // 0 to 1 (intensity)
  label: 'positive' | 'negative' | 'neutral';
  confidence: number; // 0 to 1
  emotions: {
    joy: number;
    anger: number;
    fear: number;
    sadness: number;
    surprise: number;
  };
  topics: string[];
}

interface ReviewAnalysis {
  sentiment: SentimentResult;
  keywords: string[];
  categories: string[];
  teachingAspects: {
    clarity: number;
    engagement: number;
    fairness: number;
    helpfulness: number;
    difficulty: number;
  };
  flags: {
    inappropriate: boolean;
    spam: boolean;
    fake: boolean;
  };
}

class SentimentAnalyzer {
  private positiveWords = [
    'excelente', 'bueno', 'genial', 'increíble', 'fantástico', 'perfecto',
    'claro', 'útil', 'paciente', 'justo', 'organizado', 'motivador',
    'inspirador', 'conocedor', 'accesible', 'comprensivo', 'dedicado'
  ];

  private negativeWords = [
    'malo', 'terrible', 'horrible', 'pésimo', 'confuso', 'injusto',
    'desorganizado', 'aburrido', 'difícil', 'estricto', 'antipático',
    'poco claro', 'inaccesible', 'impaciente', 'parcial'
  ];

  private teachingKeywords = {
    clarity: ['claro', 'explica bien', 'fácil de entender', 'confuso', 'poco claro'],
    engagement: ['interesante', 'aburrido', 'motivador', 'dinámico', 'monótono'],
    fairness: ['justo', 'injusto', 'parcial', 'equitativo', 'favoritismo'],
    helpfulness: ['útil', 'ayuda', 'disponible', 'accesible', 'inaccesible'],
    difficulty: ['fácil', 'difícil', 'exigente', 'relajado', 'estricto']
  };

  async analyzeReview(reviewText: string): Promise<ReviewAnalysis> {
    const text = reviewText.toLowerCase();
    
    // Basic sentiment analysis
    const sentiment = this.calculateSentiment(text);
    
    // Extract keywords and topics
    const keywords = this.extractKeywords(text);
    const categories = this.categorizeReview(text);
    
    // Analyze teaching aspects
    const teachingAspects = this.analyzeTeachingAspects(text);
    
    // Content moderation flags
    const flags = this.moderateContent(text);

    return {
      sentiment,
      keywords,
      categories,
      teachingAspects,
      flags
    };
  }

  private calculateSentiment(text: string): SentimentResult {
    let positiveScore = 0;
    let negativeScore = 0;
    let totalWords = 0;

    const words = text.split(/\s+/);
    totalWords = words.length;

    // Count positive and negative words
    words.forEach(word => {
      if (this.positiveWords.some(pw => word.includes(pw))) {
        positiveScore++;
      }
      if (this.negativeWords.some(nw => word.includes(nw))) {
        negativeScore++;
      }
    });

    // Calculate normalized score
    const score = totalWords > 0 ? 
      (positiveScore - negativeScore) / totalWords : 0;
    
    const magnitude = Math.abs(score);
    const confidence = Math.min(magnitude * 2, 1);

    let label: 'positive' | 'negative' | 'neutral';
    if (score > 0.1) label = 'positive';
    else if (score < -0.1) label = 'negative';
    else label = 'neutral';

    // Basic emotion detection
    const emotions = this.detectEmotions(text);
    const topics = this.extractTopics(text);

    return {
      score: Math.max(-1, Math.min(1, score * 5)), // Scale to -1 to 1
      magnitude,
      label,
      confidence,
      emotions,
      topics
    };
  }

  private detectEmotions(text: string) {
    const joyWords = ['feliz', 'contento', 'genial', 'excelente', 'increíble'];
    const angerWords = ['molesto', 'enojado', 'furioso', 'irritante', 'terrible'];
    const fearWords = ['miedo', 'nervioso', 'preocupado', 'ansioso'];
    const sadnessWords = ['triste', 'decepcionado', 'malo', 'pésimo'];
    const surpriseWords = ['sorprendente', 'inesperado', 'wow', 'increíble'];

    return {
      joy: this.countMatches(text, joyWords) / 10,
      anger: this.countMatches(text, angerWords) / 10,
      fear: this.countMatches(text, fearWords) / 10,
      sadness: this.countMatches(text, sadnessWords) / 10,
      surprise: this.countMatches(text, surpriseWords) / 10
    };
  }

  private extractTopics(text: string): string[] {
    const topics = [];
    
    if (text.includes('examen') || text.includes('prueba')) topics.push('evaluación');
    if (text.includes('tarea') || text.includes('asignación')) topics.push('tareas');
    if (text.includes('clase') || text.includes('explicación')) topics.push('enseñanza');
    if (text.includes('nota') || text.includes('calificación')) topics.push('calificaciones');
    if (text.includes('ayuda') || text.includes('apoyo')) topics.push('apoyo');
    
    return topics;
  }

  private extractKeywords(text: string): string[] {
    const words = text.split(/\s+/)
      .filter(word => word.length > 3)
      .filter(word => !['para', 'pero', 'como', 'este', 'esta', 'muy', 'más'].includes(word));
    
    // Return most frequent words
    const wordCount = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
  }

  private categorizeReview(text: string): string[] {
    const categories = [];
    
    if (text.includes('metodología') || text.includes('enseña')) categories.push('metodología');
    if (text.includes('personalidad') || text.includes('trato')) categories.push('personalidad');
    if (text.includes('examen') || text.includes('evaluación')) categories.push('evaluación');
    if (text.includes('material') || text.includes('recursos')) categories.push('recursos');
    if (text.includes('horario') || text.includes('puntualidad')) categories.push('organización');
    
    return categories;
  }

  private analyzeTeachingAspects(text: string) {
    const aspects = {
      clarity: 0,
      engagement: 0,
      fairness: 0,
      helpfulness: 0,
      difficulty: 0
    };

    Object.entries(this.teachingKeywords).forEach(([aspect, keywords]) => {
      const score = keywords.reduce((sum, keyword) => {
        const matches = (text.match(new RegExp(keyword, 'gi')) || []).length;
        return sum + matches;
      }, 0);
      
      aspects[aspect as keyof typeof aspects] = Math.min(score / 2, 1);
    });

    return aspects;
  }

  private moderateContent(text: string) {
    const inappropriateWords = ['idiota', 'estúpido', 'basura', 'mierda'];
    const spamIndicators = ['www.', 'http', 'compra', 'vende', 'dinero'];
    
    return {
      inappropriate: inappropriateWords.some(word => text.includes(word)),
      spam: spamIndicators.some(indicator => text.includes(indicator)),
      fake: text.length < 10 || /(.)\1{4,}/.test(text) // Too short or repeated chars
    };
  }

  private countMatches(text: string, words: string[]): number {
    return words.reduce((count, word) => {
      return count + (text.match(new RegExp(word, 'gi')) || []).length;
    }, 0);
  }

  // Batch analysis for multiple reviews
  async analyzeBatch(reviews: string[]): Promise<ReviewAnalysis[]> {
    return Promise.all(reviews.map(review => this.analyzeReview(review)));
  }

  // Get sentiment trends over time
  async getSentimentTrends(professorId: string, timeframe: 'week' | 'month' | 'year') {
    // This would integrate with your database to get historical reviews
    // For now, returning mock data structure
    return {
      professorId,
      timeframe,
      trends: [
        { date: '2024-01', sentiment: 0.7, reviewCount: 15 },
        { date: '2024-02', sentiment: 0.8, reviewCount: 22 },
        { date: '2024-03', sentiment: 0.6, reviewCount: 18 }
      ],
      averageSentiment: 0.7,
      sentimentChange: 0.1,
      topPositiveTopics: ['clarity', 'helpfulness'],
      topNegativeTopics: ['difficulty', 'fairness']
    };
  }
}

// Export singleton instance
export const sentimentAnalyzer = new SentimentAnalyzer();

// Export types
export type { SentimentResult, ReviewAnalysis };

// Utility functions for frontend
export const getSentimentColor = (score: number): string => {
  if (score > 0.3) return 'text-green-600';
  if (score < -0.3) return 'text-red-600';
  return 'text-yellow-600';
};

export const getSentimentEmoji = (label: string): string => {
  switch (label) {
    case 'positive': return '😊';
    case 'negative': return '😞';
    default: return '😐';
  }
};

export const formatSentimentScore = (score: number): string => {
  const percentage = Math.round((score + 1) * 50);
  return `${percentage}%`;
}; 