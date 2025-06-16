import { config } from 'dotenv';
import { MongoClient } from 'mongodb';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
config({ path: path.resolve(__dirname, '../.env.local') });

async function testConnection() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not defined in .env.local');
    process.exit(1);
  }

  try {
    console.log('Attempting to connect to MongoDB...');
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    console.log('Successfully connected to MongoDB!');
    
    // Test querying the institutions collection
    const db = client.db();
    const institutions = await db.collection('institutions').find({}).limit(1).toArray();
    console.log('Found institutions:', institutions.length);
    
    await client.close();
    console.log('Connection closed successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

testConnection(); 