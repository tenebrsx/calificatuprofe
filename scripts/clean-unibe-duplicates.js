const fs = require('fs');

console.log('🧹 UNIBE Database Cleanup - Removing Duplicates\n');

// Read the duplicate report
const report = JSON.parse(fs.readFileSync('unibe-duplicate-check-report.json', 'utf8'));

// Read the UNIBE professors database
const unibeFile = fs.readFileSync('data/unibe-professors.ts', 'utf8');

console.log(`📊 Current Status:`);
console.log(`- Total professors: ${report.summary.totalProfessors}`);
console.log(`- Duplicate emails: ${report.summary.duplicateEmails}`);
console.log(`- Similar names: ${report.summary.similarNames}`);

// Extract individual professor objects from the TypeScript file
const professorMatches = unibeFile.match(/{\s*id: '[^']+',[\s\S]*?},/g);

if (!professorMatches) {
  console.log('❌ Could not parse professor objects from file');
  process.exit(1);
}

console.log(`\n🔍 Found ${professorMatches.length} professor objects to analyze`);

// Parse each professor object
const professors = [];
professorMatches.forEach((match, index) => {
  try {
    // Extract key fields using regex
    const idMatch = match.match(/id: '([^']+)'/);
    const nameMatch = match.match(/name: '([^']+)'/);
    const emailMatch = match.match(/email: '([^']+)'/);
    const subjectsMatch = match.match(/subjects: (\[[^\]]*\])/);
    
    if (idMatch && nameMatch && emailMatch) {
      professors.push({
        originalText: match,
        id: idMatch[1],
        name: nameMatch[1],
        email: emailMatch[1],
        subjects: subjectsMatch ? subjectsMatch[1] : '[]',
        position: index
      });
    }
  } catch (error) {
    console.log(`⚠️  Could not parse professor at position ${index}: ${error.message}`);
  }
});

console.log(`✅ Successfully parsed ${professors.length} professors`);

// Identify duplicates to remove
const duplicatePositions = new Set();
const emailGroups = new Map();

// Group professors by email
professors.forEach((prof, index) => {
  if (!emailGroups.has(prof.email)) {
    emailGroups.set(prof.email, []);
  }
  emailGroups.get(prof.email).push({ ...prof, originalIndex: index });
});

console.log(`\n🔍 Analyzing ${emailGroups.size} unique emails...`);

let duplicatesFound = 0;
let duplicatesRemoved = 0;

// For each email group with duplicates, keep the first one and mark others for removal
emailGroups.forEach((group, email) => {
  if (group.length > 1) {
    duplicatesFound += group.length - 1;
    console.log(`📧 Email "${email}" has ${group.length} entries:`);
    
    // Sort by position to keep the first occurrence
    group.sort((a, b) => a.position - b.position);
    
    // Keep the first, mark others for removal
    for (let i = 1; i < group.length; i++) {
      duplicatePositions.add(group[i].position);
      duplicatesRemoved++;
      console.log(`   - Removing: ${group[i].name} (${group[i].id}) at position ${group[i].position + 1}`);
    }
    console.log(`   - Keeping: ${group[0].name} (${group[0].id}) at position ${group[0].position + 1}`);
    console.log('');
  }
});

console.log(`📊 Duplicate Analysis:`);
console.log(`- Duplicate entries found: ${duplicatesFound}`);
console.log(`- Entries marked for removal: ${duplicatesRemoved}`);
console.log(`- Final professor count: ${professors.length - duplicatesRemoved}`);

if (duplicatesRemoved === 0) {
  console.log('\n✅ No duplicates to remove. Database is already clean!');
  process.exit(0);
}

// Create cleaned professors array
const cleanedProfessors = professors.filter((prof, index) => !duplicatePositions.has(index));

console.log(`\n🔄 Rebuilding database...`);

// Reassign IDs sequentially
cleanedProfessors.forEach((prof, index) => {
  const newId = `unibe-${String(index + 1).padStart(3, '0')}`;
  prof.originalText = prof.originalText.replace(/id: '[^']+'/, `id: '${newId}'`);
  prof.id = newId;
});

// Rebuild the TypeScript file
const header = `// UNIBE Professors Database
// Total: ${cleanedProfessors.length} professors
// Last updated: ${new Date().toISOString()}

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

export const unibeProfessors: Professor[] = [
`;

const footer = `];

export default unibeProfessors;
`;

const professorsText = cleanedProfessors.map(prof => prof.originalText).join('\n');
const newFileContent = header + professorsText + footer;

// Create backup of original file
const backupFileName = `data/unibe-professors-backup-${Date.now()}.ts`;
fs.writeFileSync(backupFileName, unibeFile);
console.log(`💾 Original file backed up to: ${backupFileName}`);

// Write cleaned file
fs.writeFileSync('data/unibe-professors.ts', newFileContent);

console.log(`\n🎉 Database Cleanup Complete!`);
console.log(`📊 Final Statistics:`);
console.log(`- Original professors: ${professors.length}`);
console.log(`- Duplicates removed: ${duplicatesRemoved}`);
console.log(`- Final professors: ${cleanedProfessors.length}`);
console.log(`- Space saved: ${((unibeFile.length - newFileContent.length) / 1024).toFixed(1)} KB`);

// Generate summary report
const cleanupReport = {
  timestamp: new Date().toISOString(),
  original: {
    totalProfessors: professors.length,
    duplicateEmails: report.summary.duplicateEmails,
    similarNames: report.summary.similarNames
  },
  cleanup: {
    duplicatesRemoved: duplicatesRemoved,
    finalProfessors: cleanedProfessors.length,
    backupFile: backupFileName
  },
  removedEntries: Array.from(duplicatePositions).map(pos => ({
    position: pos + 1,
    professor: professors[pos]
  }))
};

fs.writeFileSync('unibe-cleanup-report.json', JSON.stringify(cleanupReport, null, 2));
console.log(`📄 Detailed cleanup report saved to: unibe-cleanup-report.json`);

console.log(`\n✅ Ready for final verification!`); 