const fs = require('fs');

console.log('🔍 UNIBE Database Duplicate Check\n');

// Read the UNIBE professors database
const unibeFile = fs.readFileSync('data/unibe-professors.ts', 'utf8');

// Extract all professor data
const professors = [];
const idPattern = /id: '([^']+)'/g;
const namePattern = /name: '([^']+)'/g;
const emailPattern = /email: '([^']+)'/g;

let match;

// Extract IDs
const ids = [];
while ((match = idPattern.exec(unibeFile)) !== null) {
  ids.push(match[1]);
}

// Reset regex
idPattern.lastIndex = 0;

// Extract names
const names = [];
while ((match = namePattern.exec(unibeFile)) !== null) {
  names.push(match[1]);
}

// Reset regex
namePattern.lastIndex = 0;

// Extract emails
const emails = [];
while ((match = emailPattern.exec(unibeFile)) !== null) {
  emails.push(match[1]);
}

console.log(`📊 Database Summary:`);
console.log(`- Total IDs found: ${ids.length}`);
console.log(`- Total names found: ${names.length}`);
console.log(`- Total emails found: ${emails.length}`);

// Check for duplicate IDs
const duplicateIds = [];
const seenIds = new Map();
ids.forEach((id, index) => {
  if (seenIds.has(id)) {
    const existing = seenIds.get(id);
    duplicateIds.push({ id, positions: [existing, index] });
  } else {
    seenIds.set(id, index);
  }
});

// Check for duplicate names
const duplicateNames = [];
const seenNames = new Map();
names.forEach((name, index) => {
  const normalizedName = name.toLowerCase().trim();
  if (seenNames.has(normalizedName)) {
    const existing = seenNames.get(normalizedName);
    duplicateNames.push({ 
      name, 
      positions: [existing.index, index],
      originalNames: [existing.original, name]
    });
  } else {
    seenNames.set(normalizedName, { original: name, index });
  }
});

// Check for duplicate emails
const duplicateEmails = [];
const seenEmails = new Map();
emails.forEach((email, index) => {
  const normalizedEmail = email.toLowerCase().trim();
  if (seenEmails.has(normalizedEmail)) {
    const existing = seenEmails.get(normalizedEmail);
    duplicateEmails.push({ 
      email, 
      positions: [existing.index, index],
      originalEmails: [existing.original, email]
    });
  } else {
    seenEmails.set(normalizedEmail, { original: email, index });
  }
});

// Check ID sequence
const expectedIds = [];
for (let i = 1; i <= ids.length; i++) {
  expectedIds.push(`unibe-${String(i).padStart(3, '0')}`);
}

const missingIds = expectedIds.filter(id => !ids.includes(id));
const unexpectedIds = ids.filter(id => !expectedIds.includes(id));

console.log(`\n🔍 Duplicate Check Results:\n`);

// Report duplicate IDs
if (duplicateIds.length > 0) {
  console.log(`❌ DUPLICATE IDs FOUND: ${duplicateIds.length}`);
  duplicateIds.forEach((dup, index) => {
    console.log(`${index + 1}. ID "${dup.id}" appears multiple times`);
  });
} else {
  console.log(`✅ No duplicate IDs found`);
}

// Report duplicate names
if (duplicateNames.length > 0) {
  console.log(`\n❌ DUPLICATE NAMES FOUND: ${duplicateNames.length}`);
  duplicateNames.slice(0, 10).forEach((dup, index) => {
    console.log(`${index + 1}. "${dup.originalNames[0]}" vs "${dup.originalNames[1]}" (positions ${dup.positions[0] + 1}, ${dup.positions[1] + 1})`);
  });
  if (duplicateNames.length > 10) {
    console.log(`   ... and ${duplicateNames.length - 10} more duplicates`);
  }
} else {
  console.log(`\n✅ No duplicate names found`);
}

// Report duplicate emails
if (duplicateEmails.length > 0) {
  console.log(`\n❌ DUPLICATE EMAILS FOUND: ${duplicateEmails.length}`);
  duplicateEmails.slice(0, 10).forEach((dup, index) => {
    console.log(`${index + 1}. "${dup.originalEmails[0]}" vs "${dup.originalEmails[1]}" (positions ${dup.positions[0] + 1}, ${dup.positions[1] + 1})`);
  });
  if (duplicateEmails.length > 10) {
    console.log(`   ... and ${duplicateEmails.length - 10} more duplicates`);
  }
} else {
  console.log(`\n✅ No duplicate emails found`);
}

// Report ID sequence issues
if (missingIds.length > 0) {
  console.log(`\n⚠️  MISSING IDs: ${missingIds.length}`);
  console.log(`Missing IDs: ${missingIds.slice(0, 10).join(', ')}${missingIds.length > 10 ? '...' : ''}`);
}

if (unexpectedIds.length > 0) {
  console.log(`\n⚠️  UNEXPECTED IDs: ${unexpectedIds.length}`);
  console.log(`Unexpected IDs: ${unexpectedIds.slice(0, 10).join(', ')}${unexpectedIds.length > 10 ? '...' : ''}`);
}

if (missingIds.length === 0 && unexpectedIds.length === 0) {
  console.log(`\n✅ ID sequence is correct (unibe-001 to unibe-${String(ids.length).padStart(3, '0')})`);
}

// Check for professors with very similar names (potential duplicates)
console.log(`\n🔍 Checking for similar names (potential duplicates)...`);
const similarNames = [];

for (let i = 0; i < names.length; i++) {
  for (let j = i + 1; j < names.length; j++) {
    const name1 = names[i].toLowerCase().replace(/[^a-z\s]/g, '').trim();
    const name2 = names[j].toLowerCase().replace(/[^a-z\s]/g, '').trim();
    
    // Check for very similar names (same words, different order)
    const words1 = name1.split(/\s+/).sort();
    const words2 = name2.split(/\s+/).sort();
    
    if (words1.length >= 2 && words2.length >= 2) {
      const intersection = words1.filter(word => words2.includes(word));
      const similarity = intersection.length / Math.max(words1.length, words2.length);
      
      if (similarity >= 0.8 && similarity < 1.0) {
        similarNames.push({
          name1: names[i],
          name2: names[j],
          similarity: Math.round(similarity * 100),
          positions: [i + 1, j + 1]
        });
      }
    }
  }
}

if (similarNames.length > 0) {
  console.log(`⚠️  SIMILAR NAMES FOUND: ${similarNames.length} (potential duplicates)`);
  similarNames.slice(0, 5).forEach((sim, index) => {
    console.log(`${index + 1}. "${sim.name1}" vs "${sim.name2}" (${sim.similarity}% similar, positions ${sim.positions[0]}, ${sim.positions[1]})`);
  });
  if (similarNames.length > 5) {
    console.log(`   ... and ${similarNames.length - 5} more similar names`);
  }
} else {
  console.log(`✅ No similar names found`);
}

// Final summary
console.log(`\n📋 FINAL SUMMARY:`);
console.log(`- Total professors: ${ids.length}`);
console.log(`- Duplicate IDs: ${duplicateIds.length}`);
console.log(`- Duplicate names: ${duplicateNames.length}`);
console.log(`- Duplicate emails: ${duplicateEmails.length}`);
console.log(`- Similar names: ${similarNames.length}`);
console.log(`- Missing IDs: ${missingIds.length}`);
console.log(`- Unexpected IDs: ${unexpectedIds.length}`);

const totalIssues = duplicateIds.length + duplicateNames.length + duplicateEmails.length + missingIds.length + unexpectedIds.length;

if (totalIssues === 0) {
  console.log(`\n🎉 DATABASE IS CLEAN! No duplicates or ID issues found.`);
} else {
  console.log(`\n⚠️  TOTAL ISSUES FOUND: ${totalIssues}`);
  if (similarNames.length > 0) {
    console.log(`📝 ${similarNames.length} similar names require manual review`);
  }
}

// Save detailed results
const report = {
  summary: {
    totalProfessors: ids.length,
    duplicateIds: duplicateIds.length,
    duplicateNames: duplicateNames.length,
    duplicateEmails: duplicateEmails.length,
    similarNames: similarNames.length,
    missingIds: missingIds.length,
    unexpectedIds: unexpectedIds.length,
    totalIssues
  },
  duplicates: {
    ids: duplicateIds,
    names: duplicateNames,
    emails: duplicateEmails,
    similar: similarNames
  },
  idIssues: {
    missing: missingIds,
    unexpected: unexpectedIds
  }
};

fs.writeFileSync('unibe-duplicate-check-report.json', JSON.stringify(report, null, 2));
console.log(`\n📄 Detailed report saved to: unibe-duplicate-check-report.json`); 