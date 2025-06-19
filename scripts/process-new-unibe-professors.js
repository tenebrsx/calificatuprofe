const fs = require('fs');

// Read the existing professors database
const existingProfessorsFile = fs.readFileSync('data/unibe-professors.ts', 'utf8');

// Extract existing professor names for duplicate checking
const existingNames = [];
const nameMatches = existingProfessorsFile.match(/name: '([^']+)'/g);
if (nameMatches) {
  nameMatches.forEach(match => {
    const name = match.replace("name: '", "").replace("'", "");
    existingNames.push(name.toLowerCase().trim());
  });
}

console.log(`Found ${existingNames.length} existing professors in database`);

// Read the new professors list
const newProfessorsFile = fs.readFileSync('data/profesores unibe', 'utf8');

// Parse the new professors
const newProfessors = [];
const lines = newProfessorsFile.split('\n');
let currentName = '';
let currentSubject = '';

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  
  if (line.startsWith('Nombre: ')) {
    currentName = line.replace('Nombre: ', '').trim();
  } else if (line.startsWith('Materia: ')) {
    currentSubject = line.replace('Materia: ', '').trim();
    
    if (currentName && currentSubject) {
      newProfessors.push({
        name: currentName,
        subject: currentSubject
      });
      currentName = '';
      currentSubject = '';
    }
  }
}

console.log(`Parsed ${newProfessors.length} professors from new list`);

// Check for duplicates and filter out existing professors
const uniqueNewProfessors = [];
const duplicates = [];

newProfessors.forEach(prof => {
  const nameForComparison = prof.name.toLowerCase().trim();
  
  if (existingNames.includes(nameForComparison)) {
    duplicates.push(prof.name);
  } else {
    uniqueNewProfessors.push(prof);
  }
});

console.log(`Found ${duplicates.length} duplicates`);
console.log(`Found ${uniqueNewProfessors.length} unique new professors to add`);

// Show some duplicates
if (duplicates.length > 0) {
  console.log('\nFirst 10 duplicates found:');
  duplicates.slice(0, 10).forEach(name => console.log(`- ${name}`));
}

// Show some new professors
if (uniqueNewProfessors.length > 0) {
  console.log('\nFirst 10 new professors to add:');
  uniqueNewProfessors.slice(0, 10).forEach(prof => console.log(`- ${prof.name} (${prof.subject})`));
}

// Function to convert subject to array of subject codes
function getSubjectCodes(subject) {
  const subjectMap = {
    'medicina': ['medicina'],
    'odontología': ['odontologia'],
    'odontologia': ['odontologia'],
    'derecho': ['derecho'],
    'psicología': ['psicologia'],
    'psicologia': ['psicologia'],
    'arquitectura': ['arquitectura'],
    'administración de empresas': ['administracion-empresas'],
    'mercadeo': ['mercadeo'],
    'comunicación': ['comunicacion'],
    'comunicacion': ['comunicacion'],
    'comunicación publicitaria': ['comunicacion', 'publicidad'],
    'ingeniería civil': ['ingenieria-civil'],
    'ingenieria civil': ['ingenieria-civil'],
    'ingeniería industrial': ['ingenieria-industrial'],
    'ingenieria industrial': ['ingenieria-industrial'],
    'ingeniería en tecnologías de la información y la comunicación': ['ingenieria-sistemas', 'tecnologia'],
    'educación temprana': ['educacion'],
    'educacion temprana': ['educacion'],
    'ciclo de estudios generales': ['estudios-generales'],
    'ciclo básico': ['estudios-generales'],
    'ciclo basico': ['estudios-generales'],
    'diseño de interiores': ['diseno-interiores'],
    'diseno de interiores': ['diseno-interiores'],
    'turismo': ['turismo'],
    'administración de empresas turísticas y hoteleras': ['turismo', 'administracion-empresas'],
    'administración de empresas, mención negocios internacionales': ['administracion-empresas', 'negocios-internacionales'],
    'decanato de estudiantes': ['administracion'],
    'decanato de investigación académica': ['investigacion'],
    'escuela de graduados de unibe': ['posgrado'],
    'unidad de idiomas': ['idiomas']
  };

  const lowerSubject = subject.toLowerCase();
  
  // Try exact match first
  if (subjectMap[lowerSubject]) {
    return subjectMap[lowerSubject];
  }
  
  // Try partial matches for specialties
  if (lowerSubject.includes('especialidad')) {
    if (lowerSubject.includes('ortopedia') || lowerSubject.includes('rehabilitacion') || lowerSubject.includes('endodoncia') || lowerSubject.includes('cirugia') || lowerSubject.includes('periodoncia') || lowerSubject.includes('odontopediatria')) {
      return ['odontologia'];
    }
    if (lowerSubject.includes('psicoterapia') || lowerSubject.includes('crisis') || lowerSubject.includes('traumas')) {
      return ['psicologia'];
    }
  }
  
  if (lowerSubject.includes('maestría') || lowerSubject.includes('maestria')) {
    return ['posgrado'];
  }
  
  // Default mapping based on keywords
  if (lowerSubject.includes('medicina')) return ['medicina'];
  if (lowerSubject.includes('odonto')) return ['odontologia'];
  if (lowerSubject.includes('psicol')) return ['psicologia'];
  if (lowerSubject.includes('derecho')) return ['derecho'];
  if (lowerSubject.includes('arquitectura')) return ['arquitectura'];
  if (lowerSubject.includes('administra') && lowerSubject.includes('empresa')) return ['administracion-empresas'];
  if (lowerSubject.includes('mercadeo')) return ['mercadeo'];
  if (lowerSubject.includes('comunicaci')) return ['comunicacion'];
  if (lowerSubject.includes('ingenieria') || lowerSubject.includes('ingeniería')) {
    if (lowerSubject.includes('civil')) return ['ingenieria-civil'];
    if (lowerSubject.includes('industrial')) return ['ingenieria-industrial'];
    if (lowerSubject.includes('tecnolog') || lowerSubject.includes('información')) return ['ingenieria-sistemas'];
    return ['ingenieria'];
  }
  if (lowerSubject.includes('educaci')) return ['educacion'];
  if (lowerSubject.includes('turismo')) return ['turismo'];
  if (lowerSubject.includes('diseño') || lowerSubject.includes('diseno')) return ['diseno-interiores'];
  
  return ['general'];
}

// Function to get department from subject
function getDepartment(subject) {
  const lowerSubject = subject.toLowerCase();
  
  if (lowerSubject.includes('medicina')) return 'Medicina';
  if (lowerSubject.includes('odonto')) return 'Odontología';
  if (lowerSubject.includes('psicol')) return 'Psicología';
  if (lowerSubject.includes('derecho')) return 'Derecho';
  if (lowerSubject.includes('arquitectura')) return 'Arquitectura';
  if (lowerSubject.includes('administra') && lowerSubject.includes('empresa')) return 'Administración de Empresas';
  if (lowerSubject.includes('mercadeo')) return 'Mercadeo';
  if (lowerSubject.includes('comunicaci')) return 'Comunicación';
  if (lowerSubject.includes('ingenieria') || lowerSubject.includes('ingeniería')) {
    if (lowerSubject.includes('civil')) return 'Ingeniería Civil';
    if (lowerSubject.includes('industrial')) return 'Ingeniería Industrial';
    if (lowerSubject.includes('tecnolog') || lowerSubject.includes('información')) return 'Ingeniería en Tecnologías de la Información y la Comunicación';
    return 'Ingeniería';
  }
  if (lowerSubject.includes('educaci')) return 'Educación';
  if (lowerSubject.includes('turismo')) return 'Turismo';
  if (lowerSubject.includes('diseño') || lowerSubject.includes('diseno')) return 'Diseño de Interiores';
  if (lowerSubject.includes('decanato')) return subject;
  if (lowerSubject.includes('escuela de graduados')) return 'Escuela de Graduados de UNIBE';
  if (lowerSubject.includes('unidad de idiomas')) return 'Unidad de Idiomas';
  
  return subject;
}

// Generate new professor entries
let nextId = 321; // Starting from the next available ID
const newProfessorEntries = [];

uniqueNewProfessors.forEach(prof => {
  const subjectCodes = getSubjectCodes(prof.subject);
  const department = getDepartment(prof.subject);
  
  const entry = {
    id: `unibe-${String(nextId).padStart(3, '0')}`,
    name: prof.name,
    email: `${prof.name.toLowerCase().split(' ')[0]}.${prof.name.toLowerCase().split(' ')[1] || 'professor'}@unibe.edu.do`,
    department: department,
    position: 'Profesor',
    specialization: prof.subject,
    subjects: subjectCodes,
    university: 'UNIBE',
    campus: 'Santo Domingo',
    credentials: `Especialidad en ${prof.subject}`,
    description: `Profesor especializado en ${prof.subject.toLowerCase()}.`
  };
  
  newProfessorEntries.push(entry);
  nextId++;
});

console.log(`\nSummary:`);
console.log(`- Existing professors: ${existingNames.length}`);
console.log(`- Professors in new list: ${newProfessors.length}`);
console.log(`- Duplicates found: ${duplicates.length}`);
console.log(`- New professors to add: ${uniqueNewProfessors.length}`);
console.log(`- Final total would be: ${existingNames.length + uniqueNewProfessors.length}`);

// Save results to files for review
fs.writeFileSync('duplicates-found.json', JSON.stringify(duplicates, null, 2));
fs.writeFileSync('new-professors-to-add.json', JSON.stringify(newProfessorEntries.slice(0, 50), null, 2)); // First 50 for review

console.log('\nFiles created:');
console.log('- duplicates-found.json (list of duplicate names)');
console.log('- new-professors-to-add.json (first 50 new professors formatted for database)'); 