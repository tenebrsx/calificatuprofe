interface Topic {
  id: string;
  name: string;
  keywords: string[];
  weight: number;
  sentiment: number;
}

interface TopicAnalysis {
  primaryTopic: Topic;
  allTopics: Topic[];
  confidence: number;
  categories: string[];
}

class TopicModeler {
  private topics = {
    teaching_quality: {
      id: 'teaching_quality',
      name: 'Calidad de Enseñanza',
      keywords: ['explica', 'enseña', 'claro', 'metodología', 'didáctica', 'pedagógico'],
      weight: 0,
      sentiment: 0
    },
    personality: {
      id: 'personality',
      name: 'Personalidad',
      keywords: ['amable', 'simpático', 'paciente', 'comprensivo', 'estricto', 'serio'],
      weight: 0,
      sentiment: 0
    },
    evaluation: {
      id: 'evaluation',
      name: 'Evaluación',
      keywords: ['examen', 'prueba', 'calificación', 'nota', 'justo', 'difícil'],
      weight: 0,
      sentiment: 0
    },
    availability: {
      id: 'availability',
      name: 'Disponibilidad',
      keywords: ['disponible', 'ayuda', 'consulta', 'accesible', 'tiempo', 'apoyo'],
      weight: 0,
      sentiment: 0
    },
    course_content: {
      id: 'course_content',
      name: 'Contenido del Curso',
      keywords: ['material', 'contenido', 'actualizado', 'relevante', 'útil', 'práctico'],
      weight: 0,
      sentiment: 0
    }
  };

  analyzeTopics(reviewText: string): TopicAnalysis {
    const text = reviewText.toLowerCase();
    const analyzedTopics: Topic[] = [];

    // Analyze each topic
    Object.values(this.topics).forEach(topic => {
      const weight = this.calculateTopicWeight(text, topic.keywords);
      const sentiment = this.calculateTopicSentiment(text, topic.keywords);
      
      if (weight > 0) {
        analyzedTopics.push({
          ...topic,
          weight,
          sentiment
        });
      }
    });

    // Sort by weight
    analyzedTopics.sort((a, b) => b.weight - a.weight);

    const primaryTopic = analyzedTopics[0] || this.topics.teaching_quality;
    const confidence = primaryTopic.weight;
    const categories = this.extractCategories(text);

    return {
      primaryTopic,
      allTopics: analyzedTopics,
      confidence,
      categories
    };
  }

  private calculateTopicWeight(text: string, keywords: string[]): number {
    let matches = 0;
    keywords.forEach(keyword => {
      const regex = new RegExp(keyword, 'gi');
      const keywordMatches = (text.match(regex) || []).length;
      matches += keywordMatches;
    });
    
    return Math.min(matches / keywords.length, 1);
  }

  private calculateTopicSentiment(text: string, keywords: string[]): number {
    // Simple sentiment calculation for topic context
    const positiveWords = ['bueno', 'excelente', 'genial', 'perfecto'];
    const negativeWords = ['malo', 'terrible', 'pésimo', 'horrible'];
    
    let sentiment = 0;
    keywords.forEach(keyword => {
      const keywordIndex = text.indexOf(keyword);
      if (keywordIndex !== -1) {
        // Check surrounding words for sentiment
        const surrounding = text.substring(
          Math.max(0, keywordIndex - 50),
          Math.min(text.length, keywordIndex + 50)
        );
        
        positiveWords.forEach(pos => {
          if (surrounding.includes(pos)) sentiment += 0.2;
        });
        
        negativeWords.forEach(neg => {
          if (surrounding.includes(neg)) sentiment -= 0.2;
        });
      }
    });
    
    return Math.max(-1, Math.min(1, sentiment));
  }

  private extractCategories(text: string): string[] {
    const categories = [];
    
    if (text.includes('recomiendo') || text.includes('recomendable')) {
      categories.push('recomendado');
    }
    if (text.includes('evitar') || text.includes('no recomiendo')) {
      categories.push('no_recomendado');
    }
    if (text.includes('fácil') || text.includes('sencillo')) {
      categories.push('fácil');
    }
    if (text.includes('difícil') || text.includes('complicado')) {
      categories.push('difícil');
    }
    
    return categories;
  }

  // Get trending topics for a professor
  getTrendingTopics(professorId: string) {
    return {
      professorId,
      trending: [
        { topic: 'teaching_quality', mentions: 45, sentiment: 0.8 },
        { topic: 'evaluation', mentions: 32, sentiment: 0.3 },
        { topic: 'personality', mentions: 28, sentiment: 0.9 }
      ],
      emerging: ['course_content'],
      declining: ['availability']
    };
  }
}

export const topicModeler = new TopicModeler();
export type { Topic, TopicAnalysis }; 