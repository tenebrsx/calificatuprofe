import { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '@/lib/firebase/admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        const snapshot = await adminDb.collection('professors').get();
        const professors = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        return res.status(200).json(professors);

      case 'POST':
        if (!req.body) {
          return res.status(400).json({ error: 'No data provided' });
        }
        const docRef = await adminDb.collection('professors').add(req.body);
        const newProfessor = await docRef.get();
        return res.status(201).json({
          id: newProfessor.id,
          ...newProfessor.data()
        });

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Firebase error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 