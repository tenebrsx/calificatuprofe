import { Metadata } from 'next'
import Providers from './providers'
import Navigation from '@/components/Navigation'
import './globals.css'

export const metadata: Metadata = {
  title: 'CalificaTuProfe - Califica a tus Profesores',
  description: 'Encuentra y califica profesores de universidades en República Dominicana',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="bg-gray-50 antialiased">
        <Providers>
          <Navigation />
          {children}
        </Providers>
      </body>
    </html>
  )
} 