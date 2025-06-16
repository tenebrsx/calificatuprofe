import { AcademicCapIcon } from '@heroicons/react/24/outline'

interface ProfessorSearchItemProps {
  professor: {
    id: number
    name: string
    department: string
    institution: string
    totalRatings: number
  }
  searchTerm: string
  isHighlighted: boolean
  onClick: () => void
  highlightMatch: (text: string, searchTerm: string) => React.ReactNode
}

export default function ProfessorSearchItem({
  professor,
  searchTerm,
  isHighlighted,
  onClick,
  highlightMatch
}: ProfessorSearchItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-3 rounded-md hover:bg-gray-50 transition-colors ${
        isHighlighted ? 'bg-blue-50 border-blue-200' : ''
      }`}
    >
      <div className="flex items-center">
        <AcademicCapIcon className="h-5 w-5 text-blue-600 mr-3" />
        <div className="flex-1">
          <div className="font-semibold text-gray-900">
            {highlightMatch(professor.name, searchTerm)}
          </div>
          <div className="text-sm text-gray-600">
            {highlightMatch(professor.department, searchTerm)} • {professor.institution}
          </div>
          <div className="text-xs text-gray-500">
            {professor.totalRatings} calificaciones
          </div>
        </div>
      </div>
    </button>
  )
} 