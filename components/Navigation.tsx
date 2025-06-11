'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, ChevronDown } from 'lucide-react'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container-xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              CalificaTuProfe
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center space-x-4">
            {session ? (
              <div className="relative group">
                <button className="flex items-center space-x-1 text-sm font-medium text-gray-600 hover:text-gray-900">
                  <span>Mi Cuenta</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="px-4 py-3">
                    <p className="text-sm text-gray-900">{session.user?.name}</p>
                    <p className="text-sm font-medium text-gray-500 truncate">
                      {session.user?.email}
                    </p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/perfil"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Mi Perfil
                    </Link>
                    <Link
                      href="/mis-calificaciones"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Mis Calificaciones
                    </Link>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => signOut()}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/signin"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Crear cuenta
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <span className="sr-only">Open menu</span>
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden bg-white border-t border-gray-200 ${
          isOpen ? 'block animate-slide-down' : 'hidden'
        }`}
      >
        <div className="pt-4 pb-3">
          {session ? (
            <div className="px-2 space-y-1">
              <div className="px-3 py-2">
                <p className="text-base font-medium text-gray-800">{session.user?.name}</p>
                <p className="text-sm font-medium text-gray-500">{session.user?.email}</p>
              </div>
              <Link
                href="/perfil"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                Mi Perfil
              </Link>
              <Link
                href="/mis-calificaciones"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                Mis Calificaciones
              </Link>
              <button
                onClick={() => signOut()}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <div className="px-2 space-y-2">
              <Link
                href="/auth/signin"
                className="block w-full px-3 py-2 text-center rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/auth/signup"
                className="block w-full px-3 py-2 text-center rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700"
              >
                Crear cuenta
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
} 