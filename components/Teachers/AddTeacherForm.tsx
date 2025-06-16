'use client'

import { useState } from 'react'
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'

interface TeacherFormData {
  name: string
  email: string
  department: string
  university: string
  campus: string
  subjects: string[]
  degree: string
  researchAreas: string[]
  officeLocation: string
  yearsTeaching: number | ''
  bio: string
  linkedinProfile: string
  personalWebsite: string
}

interface AddTeacherFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: TeacherFormData) => void
}

const UNIVERSITIES = [
  'UASD', 'INTEC', 'PUCMM', 'UNPHU', 'UTESA', 'UNICARIBE', 'O&M', 'APEC'
]

const DEPARTMENTS = [
  'Ingeniería',
  'Medicina', 
  'Derecho',
  'Administración',
  'Psicología',
  'Arquitectura',
  'Comunicación',
  'Educación',
  'Humanidades',
  'Ciencias Sociales',
  'Economía',
  'Matemáticas',
  'Física',
  'Química',
  'Biología',
  'Historia',
  'Filosofía',
  'Lenguas Modernas',
  'Arte',
  'Música'
]

export default function AddTeacherForm({ isOpen, onClose, onSubmit }: AddTeacherFormProps) {
  const [formData, setFormData] = useState<TeacherFormData>({
    name: '',
    email: '',
    department: '',
    university: '',
    campus: '',
    subjects: [''],
    degree: '',
    researchAreas: [''],
    officeLocation: '',
    yearsTeaching: '',
    bio: '',
    linkedinProfile: '',
    personalWebsite: ''
  })

  const [errors, setErrors] = useState<Partial<TeacherFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const validateForm = (): boolean => {
    const newErrors: Partial<TeacherFormData> = {}

    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido'
    if (!formData.email.trim()) newErrors.email = 'El email es requerido'
    if (!formData.department) newErrors.department = 'El departamento es requerido'
    if (!formData.university) newErrors.university = 'La universidad es requerida'
    if (!formData.campus.trim()) newErrors.campus = 'El campus es requerido'
    if (!formData.subjects.some(s => s.trim())) newErrors.subjects = ['Al menos una materia es requerida']

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Formato de email inválido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      // Clean up subjects and research areas
      const cleanedData = {
        ...formData,
        subjects: formData.subjects.filter(s => s.trim()),
        researchAreas: formData.researchAreas.filter(r => r.trim())
      }
      
      await onSubmit(cleanedData)
      onClose()
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        department: '',
        university: '',
        campus: '',
        subjects: [''],
        degree: '',
        researchAreas: [''],
        officeLocation: '',
        yearsTeaching: '',
        bio: '',
        linkedinProfile: '',
        personalWebsite: ''
      })
    } catch (error) {
      console.error('Error submitting teacher:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addField = (field: 'subjects' | 'researchAreas') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const removeField = (field: 'subjects' | 'researchAreas', index: number) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }))
    }
  }

  const updateField = (field: 'subjects' | 'researchAreas', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Agregar Profesor</h2>
            <p className="text-gray-600 mt-1">Ayuda a expandir nuestra base de datos académica</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Dr. Juan Pérez"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Institucional *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="juan.perez@universidad.edu.do"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
          </div>

          {/* University Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Universidad *
              </label>
              <select
                value={formData.university}
                onChange={(e) => setFormData(prev => ({ ...prev, university: e.target.value }))}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.university ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar universidad</option>
                {UNIVERSITIES.map(uni => (
                  <option key={uni} value={uni}>{uni}</option>
                ))}
              </select>
              {errors.university && <p className="text-red-500 text-sm mt-1">{errors.university}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departamento *
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.department ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar departamento</option>
                {DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campus *
              </label>
              <input
                type="text"
                value={formData.campus}
                onChange={(e) => setFormData(prev => ({ ...prev, campus: e.target.value }))}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.campus ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Santo Domingo, Santiago, etc."
              />
              {errors.campus && <p className="text-red-500 text-sm mt-1">{errors.campus}</p>}
            </div>
          </div>

          {/* Academic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grado Académico
              </label>
              <input
                type="text"
                value={formData.degree}
                onChange={(e) => setFormData(prev => ({ ...prev, degree: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="PhD, Maestría, Licenciatura"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Años de Experiencia
              </label>
              <input
                type="number"
                value={formData.yearsTeaching}
                onChange={(e) => setFormData(prev => ({ ...prev, yearsTeaching: e.target.value ? parseInt(e.target.value) : '' }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="5"
                min="0"
                max="50"
              />
            </div>
          </div>

          {/* Subjects */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Materias que Imparte *
            </label>
            {formData.subjects.map((subject, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => updateField('subjects', index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Matemáticas I, Física II, etc."
                />
                {formData.subjects.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeField('subjects', index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addField('subjects')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              <PlusIcon className="h-4 w-4" />
              Agregar materia
            </button>
            {errors.subjects && <p className="text-red-500 text-sm mt-1">{errors.subjects[0]}</p>}
          </div>

          {/* Research Areas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Áreas de Investigación
            </label>
            {formData.researchAreas.map((area, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={area}
                  onChange={(e) => updateField('researchAreas', index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Inteligencia Artificial, Biomedicina, etc."
                />
                {formData.researchAreas.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeField('researchAreas', index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addField('researchAreas')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              <PlusIcon className="h-4 w-4" />
              Agregar área
            </button>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ubicación de Oficina
              </label>
              <input
                type="text"
                value={formData.officeLocation}
                onChange={(e) => setFormData(prev => ({ ...prev, officeLocation: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Edificio A, Oficina 201"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn
              </label>
              <input
                type="url"
                value={formData.linkedinProfile}
                onChange={(e) => setFormData(prev => ({ ...prev, linkedinProfile: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://linkedin.com/in/profesor"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sitio Web Personal
            </label>
            <input
              type="url"
              value={formData.personalWebsite}
              onChange={(e) => setFormData(prev => ({ ...prev, personalWebsite: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://profesor.ejemplo.com"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Biografía / Información Adicional
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Información adicional sobre el profesor, logros académicos, publicaciones importantes, etc."
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 bg-blue-600 text-white rounded-lg transition-colors ${
                isSubmitting 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? 'Enviando...' : 'Agregar Profesor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 