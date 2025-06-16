interface GradeData {
  professorId: string;
  courseId: string;
  semester: string;
  averageGrade: number;
  gradeDistribution: {
    A: number;
    B: number;
    C: number;
    D: number;
    F: number;
  };
  studentCount: number;
}

interface PredictionFactors {
  professorRating: number;
  difficultyRating: number;
  courseLoad: number;
  attendanceRequired: boolean;
  examWeight: number;
  projectWeight: number;
  participationWeight: number;
}

interface GradePrediction {
  predictedGrade: string;
  confidence: number;
  probability: {
    A: number;
    B: number;
    C: number;
    D: number;
    F: number;
  };
  factors: {
    positive: string[];
    negative: string[];
    neutral: string[];
  };
  recommendations: string[];
}

class GradeCorrelationEngine {
  private historicalData: GradeData[] = [
    {
      professorId: '1',
      courseId: 'CS101',
      semester: '2024-1',
      averageGrade: 3.2,
      gradeDistribution: { A: 25, B: 35, C: 25, D: 10, F: 5 },
      studentCount: 120
    },
    {
      professorId: '2', 
      courseId: 'MATH201',
      semester: '2024-1',
      averageGrade: 2.8,
      gradeDistribution: { A: 15, B: 30, C: 35, D: 15, F: 5 },
      studentCount: 85
    }
  ];

  predictGrade(
    professorId: string,
    courseId: string,
    studentProfile: {
      previousGPA: number;
      studyHours: number;
      attendanceRate: number;
      participationLevel: 'low' | 'medium' | 'high';
    },
    factors: PredictionFactors
  ): GradePrediction {
    
    // Get historical data for this professor/course
    const historicalGrades = this.getHistoricalGrades(professorId, courseId);
    
    // Calculate base probability from historical data
    const baseProbability = this.calculateBaseProbability(historicalGrades);
    
    // Apply student-specific adjustments
    const adjustedProbability = this.adjustForStudentProfile(
      baseProbability,
      studentProfile,
      factors
    );
    
    // Determine predicted grade
    const predictedGrade = this.determinePredictedGrade(adjustedProbability);
    
    // Calculate confidence
    const confidence = this.calculateConfidence(historicalGrades, studentProfile);
    
    // Generate factors and recommendations
    const analysisFactors = this.analyzeFactors(factors, studentProfile);
    const recommendations = this.generateRecommendations(factors, studentProfile, adjustedProbability);

    return {
      predictedGrade,
      confidence,
      probability: adjustedProbability,
      factors: analysisFactors,
      recommendations
    };
  }

  private getHistoricalGrades(professorId: string, courseId: string): GradeData[] {
    return this.historicalData.filter(
      data => data.professorId === professorId && data.courseId === courseId
    );
  }

  private calculateBaseProbability(historicalGrades: GradeData[]) {
    if (historicalGrades.length === 0) {
      // Default distribution if no historical data
      return { A: 20, B: 30, C: 30, D: 15, F: 5 };
    }

    // Average the grade distributions
    const totalStudents = historicalGrades.reduce((sum, data) => sum + data.studentCount, 0);
    
    const weightedDistribution = historicalGrades.reduce((acc, data) => {
      const weight = data.studentCount / totalStudents;
      acc.A += data.gradeDistribution.A * weight;
      acc.B += data.gradeDistribution.B * weight;
      acc.C += data.gradeDistribution.C * weight;
      acc.D += data.gradeDistribution.D * weight;
      acc.F += data.gradeDistribution.F * weight;
      return acc;
    }, { A: 0, B: 0, C: 0, D: 0, F: 0 });

    return weightedDistribution;
  }

  private adjustForStudentProfile(
    baseProbability: { A: number; B: number; C: number; D: number; F: number },
    studentProfile: any,
    factors: PredictionFactors
  ) {
    let adjusted = { ...baseProbability };

    // GPA adjustment
    const gpaMultiplier = this.getGPAMultiplier(studentProfile.previousGPA);
    
    // Study hours adjustment
    const studyMultiplier = this.getStudyHoursMultiplier(studentProfile.studyHours);
    
    // Attendance adjustment
    const attendanceMultiplier = this.getAttendanceMultiplier(studentProfile.attendanceRate);
    
    // Professor difficulty adjustment
    const difficultyMultiplier = this.getDifficultyMultiplier(factors.difficultyRating);

    // Apply multipliers
    const totalMultiplier = (gpaMultiplier + studyMultiplier + attendanceMultiplier + difficultyMultiplier) / 4;

    if (totalMultiplier > 1) {
      // Shift probability toward higher grades
      adjusted.A *= totalMultiplier;
      adjusted.B *= Math.sqrt(totalMultiplier);
      adjusted.C *= 1;
      adjusted.D *= (1 / Math.sqrt(totalMultiplier));
      adjusted.F *= (1 / totalMultiplier);
    } else {
      // Shift probability toward lower grades
      adjusted.A *= totalMultiplier;
      adjusted.B *= Math.sqrt(totalMultiplier);
      adjusted.C *= 1;
      adjusted.D *= (1 / Math.sqrt(totalMultiplier));
      adjusted.F *= (1 / totalMultiplier);
    }

    // Normalize to 100%
    const total = Object.values(adjusted).reduce((sum, val) => sum + val, 0);
    Object.keys(adjusted).forEach(key => {
      adjusted[key as keyof typeof adjusted] = (adjusted[key as keyof typeof adjusted] / total) * 100;
    });

    return adjusted;
  }

  private getGPAMultiplier(gpa: number): number {
    if (gpa >= 3.5) return 1.3;
    if (gpa >= 3.0) return 1.1;
    if (gpa >= 2.5) return 1.0;
    if (gpa >= 2.0) return 0.9;
    return 0.7;
  }

  private getStudyHoursMultiplier(hours: number): number {
    if (hours >= 15) return 1.2;
    if (hours >= 10) return 1.1;
    if (hours >= 5) return 1.0;
    return 0.8;
  }

  private getAttendanceMultiplier(rate: number): number {
    if (rate >= 0.9) return 1.2;
    if (rate >= 0.8) return 1.1;
    if (rate >= 0.7) return 1.0;
    return 0.8;
  }

  private getDifficultyMultiplier(difficulty: number): number {
    // Higher difficulty = lower grades
    if (difficulty >= 4.5) return 0.7;
    if (difficulty >= 4.0) return 0.8;
    if (difficulty >= 3.5) return 0.9;
    if (difficulty >= 3.0) return 1.0;
    return 1.1;
  }

  private determinePredictedGrade(probability: { A: number; B: number; C: number; D: number; F: number }): string {
    const grades = Object.entries(probability);
    grades.sort(([,a], [,b]) => b - a);
    return grades[0][0];
  }

  private calculateConfidence(historicalGrades: GradeData[], studentProfile: any): number {
    let confidence = 0.5; // Base confidence

    // More historical data = higher confidence
    confidence += Math.min(historicalGrades.length * 0.1, 0.3);

    // Complete student profile = higher confidence
    if (studentProfile.previousGPA > 0) confidence += 0.1;
    if (studentProfile.studyHours > 0) confidence += 0.1;
    if (studentProfile.attendanceRate > 0) confidence += 0.1;

    return Math.min(confidence, 1.0);
  }

  private analyzeFactors(factors: PredictionFactors, studentProfile: any) {
    const positive = [];
    const negative = [];
    const neutral = [];

    // Professor rating
    if (factors.professorRating >= 4.0) {
      positive.push('Profesor altamente calificado');
    } else if (factors.professorRating <= 2.5) {
      negative.push('Calificación baja del profesor');
    } else {
      neutral.push('Calificación promedio del profesor');
    }

    // Student GPA
    if (studentProfile.previousGPA >= 3.5) {
      positive.push('Excelente historial académico');
    } else if (studentProfile.previousGPA <= 2.5) {
      negative.push('Historial académico bajo');
    }

    // Study habits
    if (studentProfile.studyHours >= 10) {
      positive.push('Buenos hábitos de estudio');
    } else if (studentProfile.studyHours <= 5) {
      negative.push('Tiempo de estudio limitado');
    }

    // Course difficulty
    if (factors.difficultyRating >= 4.0) {
      negative.push('Curso muy exigente');
    } else if (factors.difficultyRating <= 2.5) {
      positive.push('Curso de dificultad moderada');
    }

    return { positive, negative, neutral };
  }

  private generateRecommendations(
    factors: PredictionFactors,
    studentProfile: any,
    probability: { A: number; B: number; C: number; D: number; F: number }
  ): string[] {
    const recommendations = [];

    // Study time recommendations
    if (studentProfile.studyHours < 10) {
      recommendations.push('Aumentar tiempo de estudio a al menos 10 horas semanales');
    }

    // Attendance recommendations
    if (studentProfile.attendanceRate < 0.9) {
      recommendations.push('Mejorar asistencia a clases (objetivo: 90%+)');
    }

    // Course-specific recommendations
    if (factors.examWeight > 0.6) {
      recommendations.push('Enfocarse en preparación para exámenes (60%+ del peso)');
    }

    if (factors.projectWeight > 0.3) {
      recommendations.push('Dedicar tiempo extra a proyectos y tareas');
    }

    if (factors.participationWeight > 0.2) {
      recommendations.push('Participar activamente en clase');
    }

    // Risk-based recommendations
    if (probability.D + probability.F > 30) {
      recommendations.push('Considerar tutoría adicional');
      recommendations.push('Formar grupo de estudio');
    }

    return recommendations;
  }

  // Get success probability for a professor
  getProfessorSuccessRate(professorId: string): {
    successRate: number;
    averageGrade: number;
    totalStudents: number;
    trends: { semester: string; successRate: number }[];
  } {
    const professorData = this.historicalData.filter(data => data.professorId === professorId);
    
    if (professorData.length === 0) {
      return {
        successRate: 0.75, // Default
        averageGrade: 3.0,
        totalStudents: 0,
        trends: []
      };
    }

    const totalStudents = professorData.reduce((sum, data) => sum + data.studentCount, 0);
    const weightedAverage = professorData.reduce((sum, data) => {
      return sum + (data.averageGrade * data.studentCount);
    }, 0) / totalStudents;

    // Success rate = A + B + C grades
    const successRate = professorData.reduce((sum, data) => {
      const success = data.gradeDistribution.A + data.gradeDistribution.B + data.gradeDistribution.C;
      return sum + (success * data.studentCount);
    }, 0) / (totalStudents * 100);

    const trends = professorData.map(data => ({
      semester: data.semester,
      successRate: (data.gradeDistribution.A + data.gradeDistribution.B + data.gradeDistribution.C) / 100
    }));

    return {
      successRate,
      averageGrade: weightedAverage,
      totalStudents,
      trends
    };
  }
}

export const gradeCorrelationEngine = new GradeCorrelationEngine();
export type { GradeData, PredictionFactors, GradePrediction }; 