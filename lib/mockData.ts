export interface Professor {
  id: string;
  name: string;
  university: string;
  department: string;
  subjects: string[];
  rating: number;
  totalRatings: number;
  email?: string;
  bio?: string;
  imageUrl?: string;
  tags?: string[];
}

// NO FAKE PROFESSORS - ONLY REAL ONES WILL BE ADDED HERE
export const mockProfessors: Professor[] = [];

export const mockUniversities = [
  {
    id: 'intec',
    name: 'Instituto Tecnológico de Santo Domingo',
    shortName: 'INTEC',
    location: 'Santo Domingo',
    website: 'https://www.intec.edu.do',
    description: 'Universidad privada de excelencia académica en República Dominicana.',
    imageUrl: '/images/universities/intec.jpg',
    professorCount: 0,
    averageRating: 0,
    establishedYear: 1972
  },
  {
    id: 'pucmm',
    name: 'Pontificia Universidad Católica Madre y Maestra',
    shortName: 'PUCMM',
    location: 'Santiago',
    website: 'https://www.pucmm.edu.do',
    description: 'Universidad católica privada con campus en Santiago y Santo Domingo.',
    imageUrl: '/images/universities/pucmm.jpg',
    professorCount: 0,
    averageRating: 0,
    establishedYear: 1962
  },
  {
    id: 'uasd',
    name: 'Universidad Autónoma de Santo Domingo',
    shortName: 'UASD',
    location: 'Santo Domingo',
    website: 'https://www.uasd.edu.do',
    description: 'La primera universidad de América, fundada en 1538.',
    imageUrl: '/images/universities/uasd.jpg',
    professorCount: 0,
    averageRating: 0,
    establishedYear: 1538
  },
  {
    id: 'unphu',
    name: 'Universidad Nacional Pedro Henríquez Ureña',
    shortName: 'UNPHU',
    location: 'Santo Domingo',
    website: 'https://www.unphu.edu.do',
    description: 'Universidad privada con enfoque en ciencias de la salud y tecnología.',
    imageUrl: '/images/universities/unphu.jpg',
    professorCount: 0,
    averageRating: 0,
    establishedYear: 1966
  }
];

// NO FAKE REVIEWS - ONLY REAL ONES WILL BE ADDED HERE
export const mockReviews = []; 