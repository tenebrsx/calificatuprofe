import { connectToDatabase } from '../src/lib/mongodb';

async function setupIndexes() {
  try {
    console.log('Setting up MongoDB indexes...');
    const { db, client } = await connectToDatabase();

    // Indexes for institutions collection
    await db.collection('institutions').createIndexes([
      { key: { name: 1 }, name: 'name_idx' },
      { key: { shortName: 1 }, name: 'shortName_idx' },
      { key: { city: 1 }, name: 'city_idx' },
      { key: { verified: 1 }, name: 'verified_idx' }
    ]);

    // Indexes for professors collection
    await db.collection('professors').createIndexes([
      { key: { 'institutions.id': 1 }, name: 'institution_idx' },
      { key: { name: 1 }, name: 'name_idx' },
      { key: { departments: 1 }, name: 'departments_idx' },
      { key: { averageRating: -1 }, name: 'rating_idx' }
    ]);

    // Indexes for reviews collection
    await db.collection('reviews').createIndexes([
      { key: { institutionId: 1 }, name: 'institution_idx' },
      { key: { professorId: 1 }, name: 'professor_idx' },
      { key: { createdAt: -1 }, name: 'created_idx' }
    ]);

    console.log('Successfully created indexes');
    await client.close();
  } catch (error) {
    console.error('Error setting up indexes:', error);
    process.exit(1);
  }
}

setupIndexes(); 