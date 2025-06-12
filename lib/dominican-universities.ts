// Comprehensive list of Dominican Republic Universities
export interface University {
  id: string;
  name: string;
  shortName: string;
  location: string;
  type: 'public' | 'private';
  website?: string;
  founded?: number;
  description?: string;
}

export const DOMINICAN_UNIVERSITIES: University[] = [
  // Major Universities (already in system)
  {
    id: 'pucmm',
    name: 'Pontificia Universidad Católica Madre y Maestra',
    shortName: 'PUCMM',
    location: 'Santiago de los Caballeros',
    type: 'private',
    website: 'https://www.pucmm.edu.do',
    founded: 1962,
    description: 'Leading private Catholic university with campuses in Santiago and Santo Domingo'
  },
  {
    id: 'intec',
    name: 'Instituto Tecnológico de Santo Domingo',
    shortName: 'INTEC',
    location: 'Santo Domingo',
    type: 'private',
    website: 'https://www.intec.edu.do',
    founded: 1972,
    description: 'Premier technological institute focused on engineering and sciences'
  },
  {
    id: 'uasd',
    name: 'Universidad Autónoma de Santo Domingo',
    shortName: 'UASD',
    location: 'Santo Domingo',
    type: 'public',
    website: 'https://www.uasd.edu.do',
    founded: 1538,
    description: 'The oldest university in the Americas, main public university of the Dominican Republic'
  },
  
  // Additional Major Universities
  {
    id: 'utesa',
    name: 'Universidad Tecnológica de Santiago',
    shortName: 'UTESA',
    location: 'Santiago de los Caballeros',
    type: 'private',
    website: 'https://www.utesa.edu',
    founded: 1974,
    description: 'Technological university with multiple campuses across the country'
  },
  {
    id: 'unphu',
    name: 'Universidad Nacional Pedro Henríquez Ureña',
    shortName: 'UNPHU',
    location: 'Santo Domingo',
    type: 'private',
    website: 'https://www.unphu.edu.do',
    founded: 1966,
    description: 'National university with strong programs in medicine and engineering'
  },
  {
    id: 'unibe',
    name: 'Universidad Iberoamericana',
    shortName: 'UNIBE',
    location: 'Santo Domingo',
    type: 'private',
    website: 'https://www.unibe.edu.do',
    founded: 1982,
    description: 'Ibero-American university with focus on business and health sciences'
  },
  {
    id: 'unicaribe',
    name: 'Universidad del Caribe',
    shortName: 'UNICARIBE',
    location: 'Santo Domingo',
    type: 'private',
    website: 'https://www.unicaribe.edu.do',
    founded: 1995,
    description: 'Caribbean university with diverse academic programs'
  },
  
  // Complete List from User's Request
  {
    id: 'unapec',
    name: 'APEC University',
    shortName: 'UNAPEC',
    location: 'Santo Domingo',
    type: 'private',
    website: 'https://www.unapec.edu.do',
    description: 'Business-focused university with strong industry connections'
  },
  {
    id: 'barna',
    name: 'Barna Management School',
    shortName: 'Barna Business School',
    location: 'Santo Domingo',
    type: 'private',
    description: 'Specialized business school offering management programs'
  },
  {
    id: 'ucsd',
    name: 'Universidad Católica de Santo Domingo',
    shortName: 'UCSD',
    location: 'Santo Domingo',
    type: 'private',
    website: 'https://www.ucsd.edu.do',
    description: 'Catholic university with comprehensive academic programs'
  },
  {
    id: 'unad',
    name: 'Universidad Adventista Dominicana',
    shortName: 'UNAD',
    location: 'Villa Sonador (near Bonao)',
    type: 'private',
    description: 'Adventist university with Christian values-based education'
  },
  {
    id: 'uod',
    name: 'Universidad Odontológica Dominicana',
    shortName: 'UOD',
    location: 'Santo Domingo',
    type: 'private',
    description: 'Specialized university focused on dental and oral health sciences'
  },
  {
    id: 'udom',
    name: 'Universidad Dominicana O&M',
    shortName: 'O&M',
    location: 'Santo Domingo',
    type: 'private',
    website: 'https://www.udom.edu.do',
    description: 'Dominican university with diverse academic offerings'
  },
  {
    id: 'uce',
    name: 'Universidad Central del Este',
    shortName: 'UCE',
    location: 'San Pedro de Macorís',
    type: 'private',
    website: 'https://www.uce.edu.do',
    description: 'Eastern central university serving the eastern region'
  },
  {
    id: 'flacso',
    name: 'Facultad Latinoamericana de Ciencias Sociales',
    shortName: 'FLACSO',
    location: 'Santo Domingo',
    type: 'private',
    description: 'Latin American faculty specializing in social sciences'
  },
  {
    id: 'uafam',
    name: 'Universidad Agroforestal Fernando Arturo de Meriño',
    shortName: 'UAFAM',
    location: 'Jarabacoa',
    type: 'private',
    description: 'Agroforestry university focused on agricultural and environmental sciences'
  },
  {
    id: 'gihess',
    name: 'Global Institute of Higher Studies in Social Sciences',
    shortName: 'GIHESS',
    location: 'Santo Domingo',
    type: 'private',
    description: 'Global institute specializing in social sciences'
  },
  {
    id: 'isd',
    name: 'Instituto Superior para la Defensa',
    shortName: 'ISD',
    location: 'Santo Domingo',
    type: 'public',
    description: 'Higher institute for defense studies'
  },
  {
    id: 'ice',
    name: 'Instituto de Ciencias Exactas',
    shortName: 'ICE',
    location: 'Santo Domingo',
    type: 'private',
    description: 'Institute specializing in exact sciences'
  },
  {
    id: 'ipl',
    name: 'Instituto Politécnico Loyola',
    shortName: 'IPL',
    location: 'San Cristóbal',
    type: 'private',
    website: 'https://www.ipl.edu.do',
    description: 'Polytechnic institute with technical and engineering programs'
  },
  {
    id: 'ies_lhb',
    name: 'Instituto Superior de Estudios Especializados en Ciencias Sociales y Humanidades, Luis Heredia Bonetti',
    shortName: 'IES-LHB',
    location: 'Santo Domingo',
    type: 'private',
    description: 'Specialized institute for social sciences and humanities'
  },
  {
    id: 'iteco',
    name: 'Instituto Tecnológico del Cibao Oriental',
    shortName: 'ITECO',
    location: 'Cotuí',
    type: 'private',
    website: 'https://www.iteco.edu.do',
    description: 'Technological institute serving the eastern Cibao region'
  },
  {
    id: 'mjsti',
    name: 'Mercy Jacquez Superior Technical Institute',
    shortName: 'MJSTI',
    location: 'Santo Domingo',
    type: 'private',
    description: 'Technical institute offering specialized programs'
  },
  {
    id: 'enj',
    name: 'Escuela Nacional de la Judicatura',
    shortName: 'ENJ',
    location: 'Santo Domingo',
    type: 'public',
    website: 'https://www.enj.org',
    description: 'National judicial college for legal education'
  },
  {
    id: 'unev',
    name: 'Universidad Nacional Evangélica',
    shortName: 'UNEV',
    location: 'Santo Domingo',
    type: 'private',
    website: 'https://www.unev.edu.do',
    description: 'National evangelical university with Christian values'
  },
  {
    id: 'unnatec',
    name: 'Universidad Nacional de Tecnología',
    shortName: 'UNNATEC',
    location: 'Santo Domingo',
    type: 'private',
    description: 'National technology university'
  },
  {
    id: 'uapa',
    name: 'Universidad Abierta para Adultos',
    shortName: 'UAPA',
    location: 'Santiago de los Caballeros',
    type: 'private',
    website: 'https://www.uapa.edu.do',
    description: 'Open university for adults with distance learning programs'
  },
  {
    id: 'isfodosu',
    name: 'Instituto Superior de Formación Docente Salomé Ureña',
    shortName: 'ISFODOSU',
    location: 'Multiple campuses',
    type: 'public',
    website: 'https://www.isfodosu.edu.do',
    description: 'Higher institute for teacher training with multiple campuses'
      },
    {
    id: 'itla',
    name: 'Instituto Tecnológico de las Américas',
    shortName: 'ITLA',
    location: 'Santo Domingo',
    type: 'public',
    website: 'https://www.itla.edu.do',
    description: 'Technological institute of the Americas'
  },
  {
    id: 'ufhec',
    name: 'Universidad Federico Henríquez y Carvajal',
    shortName: 'UFHEC',
    location: 'Santo Domingo',
    type: 'private',
    website: 'https://www.ufhec.edu.do',
    description: 'University with multiple campuses across the country'
  }
];

// Helper functions
export function getUniversityById(id: string): University | undefined {
  return DOMINICAN_UNIVERSITIES.find(uni => uni.id === id);
}

export function getUniversitiesByLocation(location: string): University[] {
  return DOMINICAN_UNIVERSITIES.filter(uni => 
    uni.location.toLowerCase().includes(location.toLowerCase())
  );
}

export function getUniversitiesByType(type: 'public' | 'private'): University[] {
  return DOMINICAN_UNIVERSITIES.filter(uni => uni.type === type);
}

export function searchUniversities(query: string): University[] {
  const searchTerm = query.toLowerCase();
  return DOMINICAN_UNIVERSITIES.filter(uni =>
    uni.name.toLowerCase().includes(searchTerm) ||
    uni.shortName.toLowerCase().includes(searchTerm) ||
    uni.location.toLowerCase().includes(searchTerm)
  );
} 