'use client'

interface ProfessorVerificationBadgeProps {
  isVerified: boolean
  verificationSource?: string
  className?: string
}

export default function ProfessorVerificationBadge({ 
  isVerified, 
  verificationSource = 'Universidad', 
  className = '' 
}: ProfessorVerificationBadgeProps) {
  if (!isVerified) {
    return (
      <div className={`inline-flex items-center space-x-1 ${className}`}>
        <div className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center">
          <span className="text-xs text-gray-600">?</span>
        </div>
        <span className="text-xs text-gray-500">No verificado</span>
      </div>
    )
  }

  return (
    <div className={`inline-flex items-center space-x-1 ${className}`}>
      <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <span className="text-xs text-green-700 font-medium">
        Verificado por {verificationSource}
      </span>
    </div>
  )
} 