export interface Institution {
  id: string;
  name: string;
  shortName?: string;
  location: string;
  type: 'universidad' | 'instituto' | 'escuela';
  totalProfessors?: number;
  totalRatings?: number;
}

export const institutions: Institution[] = [
  {
    id: 'uasd',
    name: 'Universidad Autónoma de Santo Domingo',
    shortName: 'UASD',
    location: 'Santo Domingo',
    type: 'universidad'
  },
  {
    id: 'pucmm',
    name: 'Pontificia Universidad Católica Madre y Maestra',
    shortName: 'PUCMM',
    location: 'Santiago de los Caballeros',
    type: 'universidad'
  },
  {
    id: 'unibe',
    name: 'Universidad Iberoamericana',
    shortName: 'UNIBE',
    location: 'Santo Domingo',
    type: 'universidad'
  },
  {
    id: 'unphu',
    name: 'Universidad Nacional Pedro Henríquez Ureña',
    shortName: 'UNPHU',
    location: 'Santo Domingo',
    type: 'universidad'
  },
  {
    id: 'unapec',
    name: 'Universidad APEC',
    shortName: 'UNAPEC',
    location: 'Santo Domingo',
    type: 'universidad'
  },
  {
    id: 'utesa',
    name: 'Universidad Tecnológica de Santiago',
    shortName: 'UTESA',
    location: 'Santiago de los Caballeros',
    type: 'universidad'
  },
  {
    id: 'oym',
    name: 'Universidad Dominicana O&M',
    shortName: 'O&M',
    location: 'Santo Domingo',
    type: 'universidad'
  },
  {
    id: 'uce',
    name: 'Universidad Central del Este',
    shortName: 'UCE',
    location: 'San Pedro de Macorís',
    type: 'universidad'
  },
  {
    id: 'ucsd',
    name: 'Universidad Católica Santo Domingo',
    shortName: 'UCSD',
    location: 'Santo Domingo',
    type: 'universidad'
  },
  {
    id: 'ucne',
    name: 'Universidad Católica Nordestana',
    shortName: 'UCNE',
    location: 'San Francisco de Macorís',
    type: 'universidad'
  },
  {
    id: 'uapa',
    name: 'Universidad Abierta Para Adultos',
    shortName: 'UAPA',
    location: 'Santiago de los Caballeros',
    type: 'universidad'
  },
  {
    id: 'ufhec',
    name: 'Universidad Federico Henríquez y Carvajal',
    shortName: 'UFHEC',
    location: 'Santo Domingo',
    type: 'universidad'
  },
  {
    id: 'unev',
    name: 'Universidad Nacional Evangélica',
    shortName: 'UNEV',
    location: 'Santo Domingo',
    type: 'universidad'
  },
  {
    id: 'unicaribe',
    name: 'Universidad del Caribe',
    shortName: 'UNICARIBE',
    location: 'Santo Domingo',
    type: 'universidad'
  },
  {
    id: 'uniremhos',
    name: 'Universidad Eugenio María de Hostos',
    shortName: 'UNIREMHOS',
    location: 'Santo Domingo',
    type: 'universidad'
  },
  {
    id: 'intec',
    name: 'Instituto Tecnológico de Santo Domingo',
    shortName: 'INTEC',
    location: 'Santo Domingo',
    type: 'instituto'
  },
  // ... Adding more institutions
  {
    id: 'enj',
    name: 'Escuela Nacional de la Judicatura',
    shortName: 'ENJ',
    location: 'Santo Domingo',
    type: 'escuela'
  }
]; 