// Master scraper for Dominican Republic universities
import * as cheerio from 'cheerio';

export interface Professor {
  id: string;
  name: string;
  email?: string;
  department?: string;
  position?: string;
  specialization?: string;
  campus?: string;
  institution: string;
  imageUrl?: string;
  bio?: string;
}

export interface UniversityScraperConfig {
  name: string;
  baseUrl: string;
  professorPages: string[];
  selectors: {
    professorContainer?: string;
    name?: string;
    email?: string;
    department?: string;
    position?: string;
    specialization?: string;
    image?: string;
    bio?: string;
  };
  customParser?: (html: string, baseUrl: string) => Professor[];
}

// University configurations for scraping
export const UNIVERSITY_CONFIGS: Record<string, UniversityScraperConfig> = {
  PUCMM: {
    name: 'PUCMM',
    baseUrl: 'https://www.pucmm.edu.do',
    professorPages: [
      '/profesores',
      '/facultades/ingenieria/profesores',
      '/facultades/ciencias-sociales/profesores'
    ],
    selectors: {
      professorContainer: '.profesor-card',
      name: '.profesor-nombre',
      email: '.profesor-email',
      department: '.profesor-departamento'
    }
  },
  
  INTEC: {
    name: 'INTEC',
    baseUrl: 'https://www.intec.edu.do',
    professorPages: [
      '/en/especialistas'
    ],
    selectors: {},
    customParser: parseIntecProfessors
  },
  
  UASD: {
    name: 'UASD',
    baseUrl: 'https://www.uasd.edu.do',
    professorPages: [
      '/profesores',
      '/facultades'
    ],
    selectors: {
      professorContainer: '.docente',
      name: '.nombre-docente',
      email: '.email-docente'
    }
  },
  
  UNPHU: {
    name: 'UNPHU',
    baseUrl: 'https://www.unphu.edu.do',
    professorPages: [
      '/profesores',
      '/facultad-medicina/profesores',
      '/facultad-ingenieria/profesores'
    ],
    selectors: {
      professorContainer: '.profesor',
      name: '.profesor-name',
      email: '.profesor-email'
    }
  },
  
  UTESA: {
    name: 'UTESA',
    baseUrl: 'https://www.utesa.edu',
    professorPages: [
      '/profesores',
      '/facultades/profesores'
    ],
    selectors: {
      professorContainer: '.faculty-member',
      name: '.faculty-name',
      email: '.faculty-email'
    }
  },
  
  UNIBE: {
    name: 'UNIBE',
    baseUrl: 'https://www.unibe.edu.do',
    professorPages: [
      '/profesores',
      '/facultades/medicina/profesores',
      '/facultades/ingenieria/profesores'
    ],
    selectors: {
      professorContainer: '.profesor-item',
      name: '.profesor-titulo',
      email: '.profesor-contacto'
    }
  },
  
  UNICARIBE: {
    name: 'UNICARIBE',
    baseUrl: 'https://www.unicaribe.edu.do',
    professorPages: [
      '/profesores',
      '/cuerpo-docente'
    ],
    selectors: {
      professorContainer: '.docente-card',
      name: '.docente-nombre',
      email: '.docente-email'
    }
  },
  
  UCSD: {
    name: 'UCSD',
    baseUrl: 'https://www.ucsd.edu.do',
    professorPages: [
      '/profesores',
      '/facultades/profesores'
    ],
    selectors: {
      professorContainer: '.profesor',
      name: '.profesor-name'
    }
  },
  
  UNAPEC: {
    name: 'UNAPEC',
    baseUrl: 'https://www.unapec.edu.do',
    professorPages: [
      '/profesores',
      '/cuerpo-docente'
    ],
    selectors: {
      professorContainer: '.faculty',
      name: '.faculty-name',
      email: '.faculty-email'
    }
  },
  
  UFHEC: {
    name: 'UFHEC',
    baseUrl: 'https://www.ufhec.edu.do',
    professorPages: [
      '/profesores'
    ],
    selectors: {
      professorContainer: '.profesor',
      name: '.profesor-nombre'
    }
  }
};

// Custom parser for INTEC (we know this works)
function parseIntecProfessors(html: string, baseUrl: string): Professor[] {
  const $ = cheerio.load(html);
  const professors: Professor[] = [];
  
  $('.expert-item').each((index, element) => {
    const $element = $(element);
    const name = $element.find('.expert-name').text().trim();
    const email = $element.find('.expert-email').text().trim();
    const department = $element.find('.expert-department').text().trim();
    const position = $element.find('.expert-position').text().trim();
    const specialization = $element.find('.expert-specialization').text().trim();
    
    if (name) {
      professors.push({
        id: `intec-${index + 1}`,
        name,
        email: email || undefined,
        department: department || undefined,
        position: position || undefined,
        specialization: specialization || undefined,
        institution: 'INTEC'
      });
    }
  });
  
  return professors;
}

// Generic scraper function
export async function scrapeProfessors(universityKey: string): Promise<Professor[]> {
  const config = UNIVERSITY_CONFIGS[universityKey];
  if (!config) {
    throw new Error(`University configuration not found: ${universityKey}`);
  }
  
  const allProfessors: Professor[] = [];
  
  for (const page of config.professorPages) {
    try {
      const url = `${config.baseUrl}${page}`;
      console.log(`Scraping: ${url}`);
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (!response.ok) {
        console.warn(`Failed to fetch ${url}: ${response.status}`);
        continue;
      }
      
      const html = await response.text();
      
      let professors: Professor[];
      if (config.customParser) {
        professors = config.customParser(html, config.baseUrl);
      } else {
        professors = parseGenericProfessors(html, config);
      }
      
      allProfessors.push(...professors);
      
      // Add delay to be respectful
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`Error scraping ${page}:`, error);
    }
  }
  
  return allProfessors;
}

// Generic parser for universities with standard selectors
function parseGenericProfessors(html: string, config: UniversityScraperConfig): Professor[] {
  const $ = cheerio.load(html);
  const professors: Professor[] = [];
  
  const containerSelector = config.selectors.professorContainer || '.profesor, .faculty, .docente';
  
  $(containerSelector).each((index, element) => {
    const $element = $(element);
    
    const name = extractText($element, config.selectors.name || '.name, .nombre, .titulo');
    const email = extractText($element, config.selectors.email || '.email, .correo');
    const department = extractText($element, config.selectors.department || '.department, .departamento, .facultad');
    const position = extractText($element, config.selectors.position || '.position, .cargo, .titulo');
    const specialization = extractText($element, config.selectors.specialization || '.specialization, .especializacion');
    
    if (name) {
      professors.push({
        id: `${config.name.toLowerCase()}-${index + 1}`,
        name,
        email: email || undefined,
        department: department || undefined,
        position: position || undefined,
        specialization: specialization || undefined,
        institution: config.name
      });
    }
  });
  
  return professors;
}

function extractText($element: cheerio.Cheerio<any>, selectors: string): string {
  const selectorList = selectors.split(', ');
  for (const selector of selectorList) {
    const text = $element.find(selector).first().text().trim();
    if (text) return text;
  }
  return '';
}

// Scrape all universities
export async function scrapeAllUniversities(): Promise<Record<string, Professor[]>> {
  const results: Record<string, Professor[]> = {};
  
  for (const [key, config] of Object.entries(UNIVERSITY_CONFIGS)) {
    try {
      console.log(`\n=== Scraping ${config.name} ===`);
      const professors = await scrapeProfessors(key);
      results[key] = professors;
      console.log(`Found ${professors.length} professors at ${config.name}`);
    } catch (error) {
      console.error(`Failed to scrape ${config.name}:`, error);
      results[key] = [];
    }
  }
  
  return results;
} 