'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import AddProfessorButton from '@/components/AddProfessorButton'

export default function Navbar() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link
              href="/"
              className="flex items-center space-x-2 group"
            >
              <div className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                CalificaTuProfe
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/instituciones"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
            >
              Instituciones
            </Link>
            {session ? (
              <>
                <AddProfessorButton 
                  size="sm"
                  variant="primary"
                  className="mr-2"
                />
                <span className="text-gray-700">
                  {session.user?.name || session.user?.email}
                </span>
                <button
                  onClick={() => signOut()}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/instituciones"
              className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Instituciones
            </Link>
            {session ? (
              <>
                <div className="px-3 py-2">
                  <AddProfessorButton 
                    size="sm"
                    variant="primary"
                    fullWidth={true}
                    className="mb-3"
                  />
                </div>
                <span className="block px-3 py-2 text-gray-700">
                  {session.user?.name || session.user?.email}
                </span>
                <button
                  onClick={() => {
                    signOut()
                    setIsMenuOpen(false)
                  }}
                  className="block w-full text-left text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/auth/signup"
                  className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
} 