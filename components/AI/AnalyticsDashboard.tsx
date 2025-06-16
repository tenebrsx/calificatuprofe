'use client'

import { useState, useEffect } from 'react'
import { topicModeler } from '@/lib/ai/topicModeling'
import { gradeCorrelationEngine } from '@/lib/ai/gradeCorrelation'

interface AnalyticsDashboardProps {
  professorId: string
  reviews?: string[]
}

export default function AnalyticsDashboard({ professorId, reviews = [] }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState({
    sentiment: { score: 0, label: 'neutral' as 'positive' | 'negative' | 'neutral' },
    topics: [] as Array<{ name: string; weight: number; sentiment: number }>,
    gradePredict: null as any,
    loading: true
  })

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        // Simulate AI analysis
        const mockSentiment = {
          score: 0.7,
          label: 'positive' as const
        }

        const mockTopics = [
          { name: 'Calidad de Enseñanza', weight: 0.8, sentiment: 0.9 },
          { name: 'Personalidad', weight: 0.6, sentiment: 0.7 },
          { name: 'Evaluación', weight: 0.4, sentiment: 0.3 }
        ]

        const successRate = gradeCorrelationEngine.getProfessorSuccessRate(professorId)

        setAnalytics({
          sentiment: mockSentiment,
          topics: mockTopics,
          gradePredict: successRate,
          loading: false
        })
      } catch (error) {
        console.error('Error loading analytics:', error)
        setAnalytics(prev => ({ ...prev, loading: false }))
      }
    }

    loadAnalytics()
  }, [professorId])

  if (analytics.loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* AI Insights Header */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">AI</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Análisis Inteligente con IA
          </h3>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            BETA
          </span>
        </div>
        <p className="text-gray-600 text-sm">
          Análisis avanzado de reseñas usando inteligencia artificial para predicciones precisas
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Analysis */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Análisis de Sentimientos
          </h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Sentimiento General</span>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${
                  analytics.sentiment.score > 0.3 ? 'text-green-600' :
                  analytics.sentiment.score < -0.3 ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {analytics.sentiment.label === 'positive' ? 'Positivo' :
                   analytics.sentiment.label === 'negative' ? 'Negativo' : 'Neutral'}
                </span>
                <span className="text-lg">
                  {analytics.sentiment.label === 'positive' ? '😊' :
                   analytics.sentiment.label === 'negative' ? '😞' : '😐'}
                </span>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  analytics.sentiment.score > 0.3 ? 'bg-green-500' :
                  analytics.sentiment.score < -0.3 ? 'bg-red-500' : 'bg-yellow-500'
                }`}
                style={{ width: `${Math.abs(analytics.sentiment.score) * 100}%` }}
              ></div>
            </div>

            <div className="text-xs text-gray-500">
              Puntuación: {(analytics.sentiment.score * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Topic Analysis */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-[#1C4ED8] rounded-full"></span>
            Temas Principales
          </h4>
          
          <div className="space-y-3">
            {analytics.topics.map((topic: any, index: number) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{topic.name}</span>
                  <span className="text-xs text-gray-500">
                    {(topic.weight * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="h-1.5 rounded-full bg-[#1C4ED8]"
                    style={{ width: `${topic.weight * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grade Prediction */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
            Predicción de Éxito
          </h4>
          
          {analytics.gradePredict && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-1">
                  {(analytics.gradePredict.successRate * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600">Tasa de Éxito</div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Promedio General</span>
                  <span className="font-medium">
                    {analytics.gradePredict.averageGrade.toFixed(1)}/4.0
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Estudiantes Evaluados</span>
                  <span className="font-medium">
                    {analytics.gradePredict.totalStudents}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-500 text-center">
                  Basado en análisis de datos históricos
                </div>
              </div>
            </div>
          )}
        </div>

        {/* AI Recommendations */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Recomendaciones IA
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <span className="text-green-600 text-sm">✓</span>
              <div className="text-sm text-green-800">
                Excelente para estudiantes que buscan claridad en las explicaciones
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <span className="text-yellow-600 text-sm">⚠</span>
              <div className="text-sm text-yellow-800">
                Requiere dedicación extra para las evaluaciones
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <span className="text-blue-600 text-sm">💡</span>
              <div className="text-sm text-blue-800">
                Ideal para estudiantes con buen historial académico
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Powered Badge */}
      <div className="text-center py-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1C4ED8] to-blue-700 text-white rounded-full text-sm">
          <span className="w-4 h-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <span className="text-xs">🤖</span>
          </span>
          Potenciado por Inteligencia Artificial
        </div>
      </div>
    </div>
  )
} 