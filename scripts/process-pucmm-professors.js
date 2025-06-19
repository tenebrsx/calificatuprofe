const fs = require('fs');
const path = require('path');

// Raw data from user input
const rawProfessorData = `
**Facultad de Ciencias Sociales, Humanidades y Artes**

Nombre: Joel Cruz
Materia: Escuela de Arquitectura y Diseño, CSTI

Nombre: Pura Miguelina García
Materia: Escuela de Arquitectura y Diseño, CSTI

Nombre: Daritza Nicodemo
Materia: Escuela de Arquitectura y Diseño, CSTI

Nombre: Ángela Soto Carrasco
Materia: Escuela de Arquitectura y Diseño, CSD

Nombre: Audelin Henríquez
Materia: Escuela de Arquitectura y Diseño, CSD

Nombre: Raúl Yunén
Materia: Escuela de Comunicación, CSTI

Nombre: Carlos Villamil
Materia: Escuela de Comunicación, CSTI

Nombre: Katiusca Manzur
Materia: Escuela de Comunicación, CSTI

Nombre: Elvira Lora
Materia: Escuela de Comunicación, CSD

Nombre: Francisco Polanco
Materia: Escuela de Derecho, CSTI

Nombre: Cornelia Tejeda
Materia: Escuela de Derecho, CSTI

Nombre: Aldemaro Muñiz
Materia: Escuela de Derecho, CSTI

Nombre: Eduardo Reynoso
Materia: Escuela de Derecho, CSTI

Nombre: Jaime Ángeles
Materia: Escuela de Derecho, CSD

Nombre: Carolina Morales
Materia: Escuela de Derecho, CSD

Nombre: Juan Rosario
Materia: Escuela de Derecho, CSD

Nombre: Heydi Berroa
Materia: Escuela de Derecho, CSD

Nombre: Pablo Martínez
Materia: Escuela de Educación, CSTI

Nombre: Edwin Paniagua
Materia: Escuela de Educación, CSTI

Nombre: Ángel Mirabal
Materia: Escuela de Educación, CSD

Nombre: Natalia Santiago
Materia: Escuela de Educación, CSD

Nombre: Emilio Jáquez
Materia: Escuela de Humanidades y Ciencias Sociales, CSTI

Nombre: Juan Bartolo Domínguez
Materia: Escuela de Humanidades y Ciencias Sociales, CSTI

Nombre: Diego López Luján
Materia: Escuela de Humanidades y Ciencias Sociales, CSTI

Nombre: Dinorah Pereyra
Materia: Escuela de Humanidades y Ciencias Sociales, CSD

Nombre: Edeli Escalante
Materia: Escuela de Humanidades y Ciencias Sociales, CSD

Nombre: Sandra Hernández
Materia: Escuela de Lenguas, CSTI

Nombre: Kelvin Muñoz
Materia: Escuela de Lenguas, CSTI

Nombre: Francia Gómez
Materia: Escuela de Lenguas, CSD

Nombre: María Dania Guance
Materia: Escuela de Lenguas, CSD

Nombre: Samuel Cornielle
Materia: Escuela de Lenguas, CSD

Nombre: Keyla Aybar
Materia: Escuela de Psicología, CSTI

Nombre: Olga Caba
Materia: Escuela de Psicología, CSTI

Nombre: Giovanny Heredia
Materia: Escuela de Psicología, CSTI

Nombre: Paola Montás
Materia: Escuela de Psicología, CSD

Nombre: María Castro
Materia: Escuela de Psicología, CSD

Nombre: Laura Pacheco
Materia: Escuela de Psicología, CSD

Nombre: Daniel Baldera
Materia: Escuela de Psicología, CSD

Nombre: Richard Núñez
Materia: Escuela de Teología, CSTI

Nombre: Carlos Santana
Materia: Escuela de Teología, CSTI

Nombre: Julián Valdez
Materia: Escuela de Teología, CSD

Nombre: Frank Luis de la Cruz
Materia: Escuela de Teología, CSD

Nombre: Juan Peña
Materia: Estudios Generales, CSTI

Nombre: Daniel Domínguez
Materia: Estudios Generales, CSTI

Nombre: Lourdes Tapia
Materia: Estudios Generales, CSTI

Nombre: Ivanovna Cruz
Materia: Estudios Generales, CSD

Nombre: Astrid Gómez
Materia: Departamento de Arte y Cultura, CSTI

**Facultad de Ciencias Económicas y Administrativa**

Nombre: Rita Mena
Materia: Escuela de Economía, CSD

Nombre: Daniel Morales
Materia: Escuela de Economía, CSD

Nombre: Rafael Rodríguez
Materia: Escuela de Economía, CSD

Nombre: Miguel Sang Ben
Materia: Escuela de Economía, CSD

Nombre: Sally Fernández
Materia: Escuela de Negocios, CSTI

Nombre: Miguel Ángel Diaz
Materia: Escuela de Negocios, CSTI

Nombre: José Cristóbal Rodríguez
Materia: Escuela de Negocios, CSTI

Nombre: Rosanna Crespo
Materia: Escuela de Negocios, CSTI

Nombre: Rubén Estrella
Materia: Escuela de Negocios, CSD

Nombre: Rosa Ruiz
Materia: Escuela de Negocios, CSD

Nombre: Eugenio Díaz
Materia: Escuela de Negocios, CSD

Nombre: Laura Melia
Materia: Escuela de Turismo y Gastronomía, CSTI

Nombre: Pilar Constanzo
Materia: Escuela de Turismo y Gastronomía, CSTI

Nombre: Kenia Rodríguez
Materia: Escuela de Turismo y Gastronomía, CSTI

Nombre: Alejandro Abreu
Materia: Escuela de Turismo y Gastronomía, CSD

Nombre: Patricia Tineo
Materia: Escuela de Turismo y Gastronomía, CSD

**Facultad de Ciencias e Ingeniería**

Nombre: Irely Farías
Materia: Escuela de Ciencias Naturales y Exactas, CSTI

Nombre: Alex Rosario
Materia: Escuela de Ciencias Naturales y Exactas, CSTI

Nombre: Natalia Fernández
Materia: Escuela de Ciencias Naturales y Exactas, CSTI

Nombre: Sandra Lagunes
Materia: Escuela de Ciencias Naturales y Exactas, CSD

Nombre: Víctor Haché
Materia: Escuela de Ciencias Naturales y Exactas, CSD

Nombre: Miguelina Santos
Materia: Escuela de Ciencias Naturales y Exactas, CSD

Nombre: Karina Soriano
Materia: Escuela de Ingeniería Civil y Ambiental, CSTI

Nombre: Pedro Reyes
Materia: Escuela de Ingeniería Civil y Ambiental, CSTI

Nombre: Maribel Guzmán
Materia: Escuela de Ingeniería Civil y Ambiental, CSTI

Nombre: Ana María Barranco
Materia: Escuela de Ingeniería Civil y Ambiental, CSTI

Nombre: Lorenzo Tejada
Materia: Escuela de Ingeniería Civil y Ambiental, CSD

Nombre: Letzaiz Ruiz
Materia: Escuela de Ingeniería Civil y Ambiental, CSD

Nombre: Lidia Ynoa
Materia: Escuela de Ingeniería Civil y Ambiental, CSD

Nombre: César Méndez
Materia: Escuela de Ingeniería Civil y Ambiental, CSD

Nombre: José Luis Alonso
Materia: Escuela de Ingeniería en Computación y Telecomunicaciones, CSTI

Nombre: Leonides Rodríguez
Materia: Escuela de Ingeniería Industrial, CSTI

Nombre: Jhonny Mezon
Materia: Escuela de Ingeniería Industrial, CSTI

Nombre: Francisco Ramírez
Materia: Escuela de Ingeniería Industrial, CSD

Nombre: Félix Rodríguez Polanco, MBA
Materia: Escuela de Ingeniería Industrial, CSD

Nombre: Mirmalin Cherubin Vargas, MBA
Materia: Escuela de Ingeniería Industrial, CSD

Nombre: Gregorio Alfonso Castillo Cepín
Materia: Escuela de Ingeniería Mecánica y Eléctrica, CSTI

Nombre: Vladimir del Rosario Guillén
Materia: Escuela de Ingeniería Mecánica y Eléctrica, CSTI

**Facultad de Ciencias de la Salud**

Nombre: Lillibette Alvino
Materia: Escuela de Medicina, CSTI

Nombre: María José Fernández
Materia: Escuela de Medicina, CSTI

Nombre: Elisa D'Angelo
Materia: Escuela de Medicina, CSD

Nombre: Anthony Fernández
Materia: Escuela de Medicina, CSD

Nombre: Miguel Henríquez
Materia: Escuela de Ciencias Aplicadas de la Salud, CSTI

Nombre: Edilma Rodríguez
Materia: Escuela de Ciencias Aplicadas de la Salud, CSTI

**Postgrado**

Nombre: Jenny Rosanna Vásquez
Materia: Postgrado, CSTI

Nombre: Cándida Muñoz
Materia: Postgrado, CSD

Nombre: Lillybeth Poliné
Materia: Dirección de Servicios para la Inclusión, CSTI y CSD
`;

function parseProfessorData(rawData) {
  const professors = [];
  const lines = rawData.split('\n');
  let currentProfessor = {};
  let id = 1;

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    if (trimmedLine.startsWith('Nombre:')) {
      if (currentProfessor.name) {
        // Save previous professor
        professors.push(createProfessorObject(currentProfessor, id));
        id++;
      }
      currentProfessor = {
        name: trimmedLine.replace('Nombre:', '').trim()
      };
    } else if (trimmedLine.startsWith('Materia:')) {
      const materiaInfo = trimmedLine.replace('Materia:', '').trim();
      const parts = materiaInfo.split(',');
      currentProfessor.department = parts[0]?.trim();
      currentProfessor.campus = parts[1]?.trim() === 'CSTI' ? 'Santiago' : 'Santo Domingo';
    }
  }

  // Don't forget the last professor
  if (currentProfessor.name) {
    professors.push(createProfessorObject(currentProfessor, id));
  }

  return professors;
}

function createProfessorObject(prof, id) {
  const departmentMappings = {
    'Escuela de Arquitectura y Diseño': {
      subjects: ['arquitectura', 'diseno'],
      specialization: 'Arquitectura y Diseño'
    },
    'Escuela de Comunicación': {
      subjects: ['comunicacion', 'periodismo'],
      specialization: 'Comunicación Social'
    },
    'Escuela de Derecho': {
      subjects: ['derecho', 'leyes'],
      specialization: 'Derecho'
    },
    'Escuela de Educación': {
      subjects: ['educacion', 'pedagogia'],
      specialization: 'Educación'
    },
    'Escuela de Humanidades y Ciencias Sociales': {
      subjects: ['humanidades', 'ciencias-sociales'],
      specialization: 'Humanidades y Ciencias Sociales'
    },
    'Escuela de Lenguas': {
      subjects: ['lenguas', 'idiomas'],
      specialization: 'Lenguas Extranjeras'
    },
    'Escuela de Psicología': {
      subjects: ['psicologia'],
      specialization: 'Psicología'
    },
    'Escuela de Teología': {
      subjects: ['teologia', 'religion'],
      specialization: 'Teología'
    },
    'Estudios Generales': {
      subjects: ['estudios-generales'],
      specialization: 'Estudios Generales'
    },
    'Departamento de Arte y Cultura': {
      subjects: ['arte', 'cultura'],
      specialization: 'Arte y Cultura'
    },
    'Escuela de Economía': {
      subjects: ['economia', 'finanzas'],
      specialization: 'Economía'
    },
    'Escuela de Negocios': {
      subjects: ['negocios', 'administracion'],
      specialization: 'Administración de Negocios'
    },
    'Escuela de Turismo y Gastronomía': {
      subjects: ['turismo', 'gastronomia'],
      specialization: 'Turismo y Gastronomía'
    },
    'Escuela de Ciencias Naturales y Exactas': {
      subjects: ['ciencias', 'matematicas'],
      specialization: 'Ciencias Naturales y Exactas'
    },
    'Escuela de Ingeniería Civil y Ambiental': {
      subjects: ['ingenieria-civil', 'ingenieria-ambiental'],
      specialization: 'Ingeniería Civil y Ambiental'
    },
    'Escuela de Ingeniería en Computación y Telecomunicaciones': {
      subjects: ['ingenieria-sistemas', 'telecomunicaciones'],
      specialization: 'Ingeniería en Computación'
    },
    'Escuela de Ingeniería Industrial': {
      subjects: ['ingenieria-industrial'],
      specialization: 'Ingeniería Industrial'
    },
    'Escuela de Ingeniería Mecánica y Eléctrica': {
      subjects: ['ingenieria-mecanica', 'ingenieria-electrica'],
      specialization: 'Ingeniería Mecánica y Eléctrica'
    },
    'Escuela de Medicina': {
      subjects: ['medicina'],
      specialization: 'Medicina'
    },
    'Escuela de Ciencias Aplicadas de la Salud': {
      subjects: ['ciencias-salud'],
      specialization: 'Ciencias Aplicadas de la Salud'
    },
    'Postgrado': {
      subjects: ['postgrado'],
      specialization: 'Estudios de Postgrado'
    },
    'Dirección de Servicios para la Inclusión': {
      subjects: ['inclusion', 'servicios-estudiantiles'],
      specialization: 'Servicios para la Inclusión'
    }
  };

  const mapping = departmentMappings[prof.department] || {
    subjects: ['general'],
    specialization: prof.department
  };

  const emailName = prof.name.toLowerCase()
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/ñ/g, 'n')
    .split(' ')
    .slice(0, 2)
    .join('.');

  return {
    id: `pucmm-${id.toString().padStart(3, '0')}`,
    name: prof.name,
    email: `${emailName}@pucmm.edu.do`,
    department: prof.department,
    position: 'Profesor',
    specialization: mapping.specialization,
    subjects: mapping.subjects,
    university: 'PUCMM',
    campus: prof.campus,
    credentials: `Profesor de ${mapping.specialization}`,
    description: `Especialista en ${mapping.specialization.toLowerCase()}.`
  };
}

function generateTypeScriptFile(professors) {
  let content = `// PUCMM Professors Database
// Total: ${professors.length} professors
// Last updated: ${new Date().toISOString().split('T')[0]}
// Campuses: Santiago (CSTI), Santo Domingo (CSD)

export interface Professor {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  specialization: string;
  subjects: string[];
  university: string;
  campus: string;
  credentials: string;
  description: string;
}

export const pucmmProfessors: Professor[] = [
${professors.map(prof => {
  return `  {
    id: '${prof.id}',
    name: '${prof.name}',
    email: '${prof.email}',
    department: '${prof.department}',
    position: '${prof.position}',
    specialization: '${prof.specialization}',
    subjects: ${JSON.stringify(prof.subjects)},
    university: '${prof.university}',
    campus: '${prof.campus}',
    credentials: '${prof.credentials}',
    description: '${prof.description}'
  }`;
}).join(',\n')}
];`;

  return content;
}

// Main execution
console.log('Processing PUCMM professor data...');

const professors = parseProfessorData(rawProfessorData);
console.log(`Parsed ${professors.length} professors`);

const tsContent = generateTypeScriptFile(professors);
const outputPath = path.join(__dirname, '..', 'data', 'pucmm-professors.ts');

fs.writeFileSync(outputPath, tsContent);
console.log(`✅ PUCMM professors data saved to: ${outputPath}`);

// Generate summary report
const campusStats = professors.reduce((acc, prof) => {
  acc[prof.campus] = (acc[prof.campus] || 0) + 1;
  return acc;
}, {});

const departmentStats = professors.reduce((acc, prof) => {
  acc[prof.department] = (acc[prof.department] || 0) + 1;
  return acc;
}, {});

console.log('\n📊 PUCMM Professors Summary:');
console.log(`Total professors: ${professors.length}`);
console.log('\nBy Campus:');
Object.entries(campusStats).forEach(([campus, count]) => {
  console.log(`  ${campus}: ${count} professors`);
});

console.log('\nBy Department:');
Object.entries(departmentStats).forEach(([dept, count]) => {
  console.log(`  ${dept}: ${count} professors`);
}); 