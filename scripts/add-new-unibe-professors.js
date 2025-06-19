const fs = require('fs');

// Read the existing professors database
const existingFile = fs.readFileSync('data/unibe-professors.ts', 'utf8');

// Read the new professors list from our analysis
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

console.log(`Found ${newProfessors.length} professors to process`);

// Helper function to create email from name
function createEmail(name) {
  const nameParts = name.toLowerCase()
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/ñ/g, 'n')
    .replace(/[^a-z\s]/g, '')
    .split(' ')
    .filter(part => part.length > 0);
  
  const firstName = nameParts[0] || 'profesor';
  const lastName = nameParts[1] || 'unibe';
  
  return `${firstName}.${lastName}@unibe.edu.do`;
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

newProfessors.forEach(prof => {
  const subjectCodes = getSubjectCodes(prof.subject);
  const department = getDepartment(prof.subject);
  
  const entry = `  {
    id: 'unibe-${String(nextId).padStart(3, '0')}',
    name: '${prof.name}',
    email: '${createEmail(prof.name)}',
    department: '${department}',
    position: 'Profesor',
    specialization: '${prof.subject}',
    subjects: [${subjectCodes.map(s => `'${s}'`).join(', ')}],
    university: 'UNIBE',
    campus: 'Santo Domingo',
    credentials: 'Especialidad en ${prof.subject}',
    description: 'Profesor especializado en ${prof.subject.toLowerCase()}.'
  }`;
  
  newProfessorEntries.push(entry);
  nextId++;
});

console.log(`Generated ${newProfessorEntries.length} new professor entries (unibe-321 to unibe-${nextId-1})`);

// Add the new professors to the existing file
const newContent = existingFile.replace(
  '];',
  ',\n' + newProfessorEntries.join(',\n') + '\n];'
);

// Write the updated file
fs.writeFileSync('data/unibe-professors.ts', newContent);

console.log(`\nSuccessfully added ${newProfessorEntries.length} new professors to data/unibe-professors.ts`);
console.log(`UNIBE database now contains ${320 + newProfessorEntries.length} professors total!`);
console.log(`New professors have IDs from unibe-321 to unibe-${nextId-1}`); 