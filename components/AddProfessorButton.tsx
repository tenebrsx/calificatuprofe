'use client'

import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { PlusIcon } from '@heroicons/react/24/outline'

interface AddProfessorButtonProps {
  searchQuery?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary'
  showIcon?: boolean
  fullWidth?: boolean
}

export default function AddProfessorButton({
  searchQuery = '',
  className = '',
  size = 'md',
  variant = 'primary',
  showIcon = true,
  fullWidth = false
}: AddProfessorButtonProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  const handleClick = async () => {
    if (status === 'loading') return

    if (!session) {
      // For non-authenticated users, redirect to sign in with callback to add professor page
      const callbackUrl = searchQuery 
        ? `/agregar-profesor?search=${encodeURIComponent(searchQuery)}`
        : '/agregar-profesor'
      
      await signIn(undefined, { 
        callbackUrl 
      })
      return
    }

    // For authenticated users, go directly to add professor page
    const url = searchQuery 
      ? `/agregar-profesor?search=${encodeURIComponent(searchQuery)}`
      : '/agregar-profesor'
    
    router.push(url)
  }

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  // Variant classes
  const variantClasses = {
    primary: 'bg-[#2464EB] hover:bg-[#1d4ed8] text-white shadow-md hover:shadow-lg',
    secondary: 'bg-white hover:bg-gray-50 text-[#2464EB] border-2 border-[#2464EB] shadow-sm hover:shadow-md'
  }

  const baseClasses = `
    inline-flex items-center justify-center
    font-semibold rounded-lg
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-[#2464EB] focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className}
  `.trim().replace(/\s+/g, ' ')

  return (
    <button
      onClick={handleClick}
      disabled={status === 'loading'}
      className={baseClasses}
      type="button"
    >
      {status === 'loading' ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
          Cargando...
        </>
      ) : (
        <>
          {showIcon && <PlusIcon className="h-5 w-5 mr-2" />}
          {session ? '+Agrega tu Profesor' : 'Agregar Tu Profesor'}
        </>
      )}
    </button>
  )
} 