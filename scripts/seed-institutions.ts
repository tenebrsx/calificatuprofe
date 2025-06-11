import { connectToDatabase } from '../src/lib/mongodb.js';

const institutions = [
  {
    name: 'Barna Business School',
    shortName: 'BARNA',
    city: 'Santo Domingo',
    type: 'school',
    departments: ['Business Administration', 'Finance', 'Marketing'],
  },
  {
    name: 'Charles Bekeev International University Puerto Plata Business School',
    shortName: null,
    city: 'Puerto Plata',
    type: 'school',
    departments: ['Business Administration', 'Tourism Management'],
  },
  {
    name: 'Escuela Nacional de la Judicatura',
    shortName: 'ENJ',
    city: 'Santo Domingo',
    type: 'school',
    departments: ['Law', 'Judicial Studies'],
  },
  {
    name: 'Facultad Latinoamericana de Ciencias Sociales',
    shortName: 'FLACSO',
    city: 'Santo Domingo',
    type: 'university',
    departments: ['Social Sciences', 'Research', 'Public Policy'],
  },
  {
    name: 'Instituto de Educación Superior en Formación Diplomática y Consular',
    shortName: null,
    city: 'Santo Domingo',
    type: 'institute',
    departments: ['Diplomacy', 'International Relations'],
  },
  {
    name: 'Instituto Dominicano de Tecnología',
    shortName: 'IDT',
    city: 'Santo Domingo',
    type: 'institute',
    departments: ['Technology', 'Engineering'],
  },
  {
    name: 'Instituto Especializado de Investigación y Formación en Ciencias Jurídicas',
    shortName: null,
    city: 'Santo Domingo',
    type: 'institute',
    departments: ['Law', 'Legal Research'],
  },
  {
    name: 'Instituto Global de Altos Estudios en Ciencias Sociales',
    shortName: 'IGLOBAL',
    city: 'Santo Domingo',
    type: 'institute',
    departments: ['Social Sciences', 'Research'],
  },
  {
    name: 'Instituto Politécnico Loyola',
    shortName: 'IPL',
    city: 'San Cristóbal',
    type: 'institute',
    departments: ['Engineering', 'Technology'],
  },
  {
    name: 'Instituto Superior de Estudios Especializados en Ciencias Sociales y Humanidades',
    shortName: null,
    city: 'Santo Domingo',
    type: 'institute',
    departments: ['Social Sciences', 'Humanities'],
  },
  {
    name: 'Instituto Superior de Formación Docente Salomé Ureña',
    shortName: 'ISFODOSU',
    city: 'Santo Domingo',
    type: 'institute',
    departments: ['Education', 'Teacher Training'],
  },
  {
    name: 'Instituto Superior Pedro Francisco Bonó',
    shortName: null,
    city: 'Santo Domingo',
    type: 'institute',
    departments: ['Social Sciences', 'Humanities'],
  },
  {
    name: 'Instituto Técnico Superior Comunitario',
    shortName: 'ITSC',
    city: 'Santo Domingo',
    type: 'institute',
    departments: ['Technical Studies', 'Vocational Training'],
  },
  {
    name: 'Instituto Técnico Superior Mercy Jácquez',
    shortName: null,
    city: 'Santo Domingo',
    type: 'institute',
    departments: ['Technical Studies', 'Vocational Training'],
  },
  {
    name: 'Instituto Tecnológico de Las Américas',
    shortName: 'ITLA',
    city: 'Santo Domingo',
    type: 'institute',
    departments: ['Technology', 'Engineering', 'Digital Media'],
  },
  {
    name: 'Instituto Tecnológico de Santo Domingo',
    shortName: 'INTEC',
    city: 'Santo Domingo',
    type: 'institute',
    departments: ['Engineering', 'Medicine', 'Business', 'Architecture', 'Social Sciences'],
    website: 'https://www.intec.edu.do'
  },
  {
    name: 'Instituto Tecnológico del Cibao Oriental',
    shortName: 'ITECO',
    city: 'Cotuí',
    type: 'institute',
    departments: ['Engineering', 'Technology', 'Agriculture'],
  },
  {
    name: 'ISAL Institute',
    shortName: 'ISAL',
    city: 'Santo Domingo',
    type: 'institute',
    departments: ['Business', 'Technology'],
  },
  {
    name: 'Pontificia Universidad Católica Madre y Maestra',
    shortName: 'PUCMM',
    city: 'Santiago de los Caballeros',
    type: 'university',
    departments: ['Medicine', 'Engineering', 'Architecture', 'Law', 'Business'],
    website: 'https://www.pucmm.edu.do'
  },
  {
    name: 'Stevens Institute of Technology International',
    shortName: null,
    city: 'Santo Domingo',
    type: 'institute',
    departments: ['Technology', 'Engineering'],
  },
  {
    name: 'Universidad Abierta Para Adultos',
    shortName: 'UAPA',
    city: 'Santiago de los Caballeros',
    type: 'university',
    departments: ['Business', 'Education', 'Technology'],
  },
  {
    name: 'Universidad Adventista Dominicana',
    shortName: 'UNAD',
    city: 'Santo Domingo',
    type: 'university',
    departments: ['Theology', 'Education', 'Business'],
  },
  {
    name: 'Universidad Agroforestal Fernando Arturo de Meriño',
    shortName: 'UAFAM',
    city: 'Jarabacoa',
    type: 'university',
    departments: ['Agriculture', 'Forestry', 'Environmental Sciences'],
  },
  {
    name: 'Universidad Alternativa Medicina',
    shortName: null,
    city: 'Santo Domingo',
    type: 'university',
    departments: ['Alternative Medicine', 'Health Sciences'],
  },
  {
    name: 'Universidad APEC',
    shortName: 'UNAPEC',
    city: 'Santo Domingo',
    type: 'university',
    departments: ['Business', 'Engineering', 'Marketing', 'Design'],
    website: 'https://unapec.edu.do'
  },
  {
    name: 'Universidad Autónoma de Santo Domingo',
    shortName: 'UASD',
    city: 'Santo Domingo',
    type: 'university',
    departments: ['Medicine', 'Engineering', 'Law', 'Education', 'Arts'],
    website: 'https://www.uasd.edu.do'
  },
  {
    name: 'Universidad Católica Nordestana',
    shortName: 'UCNE',
    city: 'San Francisco de Macorís',
    type: 'university',
    departments: ['Medicine', 'Engineering', 'Business'],
  },
  {
    name: 'Universidad Católica Santo Domingo',
    shortName: 'UCSD',
    city: 'Santo Domingo',
    type: 'university',
    departments: ['Theology', 'Education', 'Law', 'Business'],
    website: 'https://www.ucsd.edu.do'
  },
  {
    name: 'Universidad Católica Tecnológica de Barahona',
    shortName: 'UCATEBA',
    city: 'Barahona',
    type: 'university',
    departments: ['Engineering', 'Business', 'Education'],
  },
  {
    name: 'Universidad Católica Tecnológica del Cibao',
    shortName: 'UCATECI',
    city: 'La Vega',
    type: 'university',
    departments: ['Engineering', 'Business', 'Health Sciences'],
  },
  {
    name: 'Universidad Central del Este',
    shortName: 'UCE',
    city: 'San Pedro de Macorís',
    type: 'university',
    departments: ['Medicine', 'Engineering', 'Law', 'Business'],
    website: 'https://www.uce.edu.do'
  },
  {
    name: 'Universidad Central Dominicana de Estudios Profesionales',
    shortName: 'UCDEP',
    city: 'Santo Domingo',
    type: 'university',
    departments: ['Business', 'Technology', 'Education'],
  },
  {
    name: 'Universidad de la Tercera Edad',
    shortName: 'UTE',
    city: 'Santo Domingo',
    type: 'university',
    departments: ['Adult Education', 'Continuing Studies'],
  },
  {
    name: 'Universidad del Caribe',
    shortName: 'UNICARIBE',
    city: 'Santo Domingo',
    type: 'university',
    departments: ['Business', 'Technology', 'Social Sciences'],
  },
  {
    name: 'Universidad Domínico-Americana',
    shortName: 'UNICDA',
    city: 'Santo Domingo',
    type: 'university',
    departments: ['Business', 'Law', 'Languages'],
  },
  {
    name: 'Universidad Eugenio María de Hostos',
    shortName: 'UNIREMHOS',
    city: 'Santo Domingo',
    type: 'university',
    departments: ['Medicine', 'Education', 'Engineering'],
  },
  {
    name: 'Universidad Experimental Félix Adam',
    shortName: 'UNEFA',
    city: 'Santo Domingo',
    type: 'university',
    departments: ['Business', 'Technology', 'Education'],
  },
  {
    name: 'Universidad Federico Henríquez y Carvajal',
    shortName: 'UFHEC',
    city: 'Santo Domingo',
    type: 'university',
    departments: ['Law', 'Education', 'Business'],
  },
  {
    name: 'Universidad Iberoamericana',
    shortName: 'UNIBE',
    city: 'Santo Domingo',
    type: 'university',
    departments: ['Medicine', 'Architecture', 'Law', 'Psychology'],
    website: 'https://www.unibe.edu.do'
  },
  {
    name: 'Universidad Interamericana',
    shortName: 'UNICA',
    city: 'Santo Domingo',
    type: 'university',
    departments: ['Business', 'Technology', 'Health Sciences'],
  },
  {
    name: 'Universidad Nacional Evangélica',
    shortName: 'UNEV',
    city: 'Santo Domingo',
    type: 'university',
    departments: ['Theology', 'Education', 'Business'],
  },
  {
    name: 'Universidad Nacional Pedro Henríquez Ureña',
    shortName: 'UNPHU',
    city: 'Santo Domingo',
    type: 'university',
    departments: ['Medicine', 'Architecture', 'Engineering', 'Law'],
    website: 'https://unphu.edu.do'
  },
  {
    name: 'Universidad Nacional Tecnológica',
    shortName: 'UNNATEC',
    city: 'Santo Domingo',
    type: 'university',
    departments: ['Technology', 'Engineering', 'Business'],
  },
  {
    name: 'Universidad Odontológica Dominicana',
    shortName: 'UOD',
    city: 'Santo Domingo',
    type: 'university',
    departments: ['Dentistry', 'Health Sciences'],
  },
  {
    name: 'Universidad Organización y Método',
    shortName: 'O&M',
    city: 'Santo Domingo',
    type: 'university',
    departments: ['Business', 'Technology', 'Law'],
  },
  {
    name: 'Universidad Psicología Industrial Dominicana',
    shortName: 'UPID',
    city: 'Santo Domingo',
    type: 'university',
    departments: ['Psychology', 'Industrial Psychology'],
  },
  {
    name: 'Universidad Tecnológica de Santiago',
    shortName: 'UTESA',
    city: 'Santiago de los Caballeros',
    type: 'university',
    departments: ['Medicine', 'Engineering', 'Business', 'Architecture'],
    website: 'https://www.utesa.edu'
  },
];

async function seedInstitutions() {
  try {
    const { db } = await connectToDatabase();
    
    // Add verified and createdAt fields to each institution
    const institutionsWithMetadata = institutions.map(institution => ({
      ...institution,
      verified: true, // All institutions in this list are officially recognized
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    // First, delete all existing institutions
    await db.collection('institutions').deleteMany({});

    // Insert all institutions
    const result = await db.collection('institutions').insertMany(institutionsWithMetadata);

    console.log(`Successfully seeded ${result.insertedCount} institutions`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding institutions:', error);
    process.exit(1);
  }
}

seedInstitutions(); 