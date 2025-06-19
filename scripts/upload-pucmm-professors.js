const admin = require('firebase-admin');

// Import PUCMM professors data
const pucmmProfessorsData = require('../data/pucmm-professors.ts');
const pucmmProfessors = pucmmProfessorsData.pucmmProfessors;

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  const serviceAccount = {
    "type": "service_account",
    "project_id": "ratemyprofessor-e2a5c",
    "private_key_id": "9e8f3c2b6d5a8e1f4c7b9a2e5d8f1c4b7a0e3d6f",
    "private_key": process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": process.env.FIREBASE_CLIENT_ID,
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": process.env.FIREBASE_CLIENT_CERT_URL
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function uploadPucmmProfessors() {
  console.log('🚀 Starting PUCMM professors upload to Firebase...');
  console.log(`Total professors to upload: ${pucmmProfessors.length}`);

  const batch = db.batch();
  let uploadCount = 0;
  let skipCount = 0;

  try {
    for (const professor of pucmmProfessors) {
      const professorRef = db.collection('professors').doc(professor.id);
      
      // Check if professor already exists
      const existingDoc = await professorRef.get();
      
      if (existingDoc.exists) {
        console.log(`⏭️  Skipping ${professor.name} (already exists)`);
        skipCount++;
        continue;
      }

      // Add professor data with additional fields
      const professorData = {
        ...professor,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        averageRating: 0,
        totalRatings: 0,
        verified: false,
        isActive: true
      };

      batch.set(professorRef, professorData);
      uploadCount++;
      
      console.log(`✅ Queued: ${professor.name} (${professor.department})`);
    }

    if (uploadCount > 0) {
      await batch.commit();
      console.log(`\n🎉 Successfully uploaded ${uploadCount} PUCMM professors to Firebase!`);
    }

    console.log(`\n📊 PUCMM Upload Summary:`);
    console.log(`✅ Uploaded: ${uploadCount} professors`);
    console.log(`⏭️  Skipped: ${skipCount} professors (already existed)`);
    console.log(`📚 Total PUCMM professors: ${pucmmProfessors.length}`);

    // Update institution stats
    const institutionRef = db.collection('institutions').doc('pucmm');
    await institutionRef.set({
      id: 'pucmm',
      name: 'Pontificia Universidad Católica Madre y Maestra',
      shortName: 'PUCMM',
      location: 'Santiago de los Caballeros',
      type: 'universidad',
      totalProfessors: pucmmProfessors.length,
      totalRatings: 0,
      campuses: ['Santiago', 'Santo Domingo'],
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    console.log(`🏫 Updated PUCMM institution record`);

  } catch (error) {
    console.error('❌ Error uploading PUCMM professors:', error);
    throw error;
  }
}

// Run the upload
uploadPucmmProfessors()
  .then(() => {
    console.log('\n✨ PUCMM professors upload completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Upload failed:', error);
    process.exit(1);
  }); 