'use client'

import { useState } from 'react'
import { StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'

interface RatingFormProps {
  professorId: string
  professorName: string
  onSubmit: (rating: RatingData) => void
  onCancel: () => void
}

interface RatingData {
  overallRating: number
  difficulty: number
  clarity: number
  helpfulness: number
  course: string
  semester: string
  year: string
  grade: string
  attendance: boolean
  textbook: boolean
  tags: string[]
  review: string
}

const PROFESSOR_TAGS = [
  'CLARO AL EXPLICAR',
  'DISPONIBLE',
  'EXÁMENES JUSTOS',
  'INSPIRADOR',
  'TAREAS ÚTILES',
  'SE PREOCUPA',
  'FLEXIBLE',
  'TRABAJOS GRUPO',
  'RESPETADO',
  'TAREA PESADA',
  'CLASES TEÓRICAS',
  'PARTICIPA CLASE',
  'PUNTAJE EXTRA'
]

const SEMESTERS = ['Enero-Mayo', 'Mayo-Agosto', 'Agosto-Diciembre']
const GRADES = ['A', 'B', 'C', 'D', 'F', 'No aplica']

export default function RatingForm({ professorId, professorName, onSubmit, onCancel }: RatingFormProps) {
  const [formData, setFormData] = useState<RatingData>({
    overallRating: 0,
    difficulty: 0,
    clarity: 0,
    helpfulness: 0,
    course: '',
    semester: '',
    year: new Date().getFullYear().toString(),
    grade: '',
    attendance: false,
    textbook: false,
    tags: [],
    review: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (formData.overallRating === 0) newErrors.overallRating = 'Calificación general requerida'
    if (formData.difficulty === 0) newErrors.difficulty = 'Nivel de dificultad requerido'
    if (formData.clarity === 0) newErrors.clarity = 'Claridad requerida'
    if (formData.helpfulness === 0) newErrors.helpfulness = 'Utilidad requerida'
    if (!formData.course.trim()) newErrors.course = 'Nombre del curso requerido'
    if (!formData.semester) newErrors.semester = 'Semestre requerido'
    if (!formData.year) newErrors.year = 'Año requerido'
    if (formData.review.length < 20) newErrors.review = 'La reseña debe tener al menos 20 caracteres'
    if (formData.review.length > 1000) newErrors.review = 'La reseña no puede exceder 1000 caracteres'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const updateRating = (field: keyof Pick<RatingData, 'overallRating' | 'difficulty' | 'clarity' | 'helpfulness'>, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }))
  }

  const StarRating = ({ 
    value, 
    onChange, 
    label, 
    error 
  }: { 
    value: number
    onChange: (rating: number) => void
    label: string
    error?: string
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
          >
            {star <= value ? (
              <StarIcon className="w-8 h-8 text-yellow-400 hover:text-yellow-500 transition-colors" />
            ) : (
              <StarOutlineIcon className="w-8 h-8 text-gray-300 hover:text-yellow-400 transition-colors" />
            )}
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {value === 0 ? 'Sin calificar' : `${value}/5`}
        </span>
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 rounded-t-lg">
          <h2 className="text-2xl font-bold text-gray-900 font-heading">
            Califica a {professorName}
          </h2>
          <p className="text-gray-600 mt-2">
            Tu opinión ayudará a otros estudiantes a tomar mejores decisiones académicas
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Overall Rating */}
          <StarRating
            value={formData.overallRating}
            onChange={(rating) => updateRating('overallRating', rating)}
            label="Calificación general *"
            error={errors.overallRating}
          />

          {/* Detailed Ratings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StarRating
              value={formData.clarity}
              onChange={(rating) => updateRating('clarity', rating)}
              label="Claridad *"
              error={errors.clarity}
            />
            <StarRating
              value={formData.helpfulness}
              onChange={(rating) => updateRating('helpfulness', rating)}
              label="Utilidad *"
              error={errors.helpfulness}
            />
            <StarRating
              value={formData.difficulty}
              onChange={(rating) => updateRating('difficulty', rating)}
              label="Dificultad *"
              error={errors.difficulty}
            />
          </div>

          {/* Course Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Curso *
              </label>
              <input
                type="text"
                value={formData.course}
                onChange={(e) => setFormData(prev => ({ ...prev, course: e.target.value }))}
                placeholder="ej. Cálculo I, Historia Dominicana"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.course && <p className="text-red-600 text-sm mt-1">{errors.course}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Semestre *
              </label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData(prev => ({ ...prev, semester: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar</option>
                {SEMESTERS.map(semester => (
                  <option key={semester} value={semester}>{semester}</option>
                ))}
              </select>
              {errors.semester && <p className="text-red-600 text-sm mt-1">{errors.semester}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Año *
              </label>
              <input
                type="number"
                min="2020"
                max={new Date().getFullYear()}
                value={formData.year}
                onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.year && <p className="text-red-600 text-sm mt-1">{errors.year}</p>}
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calificación obtenida
              </label>
              <select
                value={formData.grade}
                onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar</option>
                {GRADES.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.attendance}
                  onChange={(e) => setFormData(prev => ({ ...prev, attendance: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Asistencia obligatoria</span>
              </label>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.textbook}
                  onChange={(e) => setFormData(prev => ({ ...prev, textbook: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Libro de texto requerido</span>
              </label>
            </div>
          </div>

          {/* Professor Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Características del profesor (selecciona las que apliquen)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {PROFESSOR_TAGS.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-2 text-xs font-medium rounded-full border transition-colors ${
                    formData.tags.includes(tag)
                      ? 'bg-blue-100 text-blue-800 border-blue-200'
                      : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reseña detallada *
            </label>
            <textarea
              value={formData.review}
              onChange={(e) => setFormData(prev => ({ ...prev, review: e.target.value }))}
              placeholder="Comparte tu experiencia con este profesor. ¿Cómo fueron las clases? ¿Qué puedes decir sobre su estilo de enseñanza?"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="flex justify-between mt-1">
              {errors.review && <p className="text-red-600 text-sm">{errors.review}</p>}
              <p className="text-gray-500 text-sm">
                {formData.review.length}/1000 caracteres
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Publicar reseña
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 