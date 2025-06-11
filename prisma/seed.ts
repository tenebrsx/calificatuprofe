import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const institutions = [
  {
    name: 'Instituto Tecnológico de Santo Domingo',
    shortName: 'INTEC',
    city: 'Santo Domingo',
    type: 'Universidad',
    website: 'https://www.intec.edu.do'
  },
  {
    name: 'Pontificia Universidad Católica Madre y Maestra',
    shortName: 'PUCMM',
    city: 'Santiago de los Caballeros',
    type: 'Universidad',
    website: 'https://www.pucmm.edu.do'
  },
  {
    name: 'Universidad Autónoma de Santo Domingo',
    shortName: 'UASD',
    city: 'Santo Domingo',
    type: 'Universidad',
    website: 'https://www.uasd.edu.do'
  },
  {
    name: 'Universidad Iberoamericana',
    shortName: 'UNIBE',
    city: 'Santo Domingo',
    type: 'Universidad',
    website: 'https://www.unibe.edu.do'
  },
  {
    name: 'Universidad APEC',
    shortName: 'UNAPEC',
    city: 'Santo Domingo',
    type: 'Universidad',
    website: 'https://www.unapec.edu.do'
  },
  {
    name: 'Universidad Nacional Pedro Henríquez Ureña',
    shortName: 'UNPHU',
    city: 'Santo Domingo',
    type: 'Universidad',
    website: 'https://www.unphu.edu.do'
  },
  {
    name: 'Universidad Tecnológica de Santiago',
    shortName: 'UTESA',
    city: 'Santiago de los Caballeros',
    type: 'Universidad',
    website: 'https://www.utesa.edu'
  },
  {
    name: 'Universidad Organización y Método',
    shortName: 'O&M',
    city: 'Santo Domingo',
    type: 'Universidad',
    website: 'https://www.udoym.edu.do'
  },
  {
    name: 'Universidad Central del Este',
    shortName: 'UCE',
    city: 'San Pedro de Macorís',
    type: 'Universidad',
    website: 'https://www.uce.edu.do'
  },
  {
    name: 'Universidad Católica Santo Domingo',
    shortName: 'UCSD',
    city: 'Santo Domingo',
    type: 'Universidad',
    website: 'https://www.ucsd.edu.do'
  },
  {
    name: 'Universidad del Caribe',
    shortName: 'UNICARIBE',
    city: 'Santo Domingo',
    type: 'Universidad',
    website: 'https://www.unicaribe.edu.do'
  },
  {
    name: 'Barna Business School',
    shortName: 'BARNA',
    city: 'Santo Domingo',
    type: 'Escuela de Negocios',
    website: 'https://www.barna.edu.do'
  },
  {
    name: 'Instituto Tecnológico de Las Américas',
    shortName: 'ITLA',
    city: 'Santo Domingo',
    type: 'Instituto',
    website: 'https://www.itla.edu.do'
  },
  // Add all other institutions here...
];

async function main() {
  console.log('Starting seeding...');

  for (const institution of institutions) {
    const created = await prisma.institution.create({
      data: institution,
    });
    console.log(`Created institution: ${created.name}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 