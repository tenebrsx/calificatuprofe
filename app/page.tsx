import { Metadata } from 'next'
import DynamicHomePage from '@/components/HomePage/DynamicHomePage'

export const metadata: Metadata = {
  title: 'CalificaTuProfe - Califica a tus Profesores',
  description: 'Encuentra y califica profesores de universidades en República Dominicana',
}

export default function HomePage() {
  return <DynamicHomePage />
}
