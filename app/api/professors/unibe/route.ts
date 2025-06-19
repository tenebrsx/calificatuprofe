import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { unibeProfessors } from '@/data/unibe-professors';

export async function POST() {
  try {
    const professorsCollection = collection(db, 'professors');
    let addedCount = 0;
    let skippedCount = 0;

    for (const professor of unibeProfessors) {
      // Check if professor already exists
      const existingQuery = query(
        professorsCollection,
        where('email', '==', professor.email)
      );
      const existingDocs = await getDocs(existingQuery);

      if (existingDocs.empty) {
        await addDoc(professorsCollection, {
          ...professor,
          createdAt: new Date(),
          updatedAt: new Date(),
          ratings: [],
          averageRating: 0,
          totalRatings: 0,
          verified: false
        });
        addedCount++;
      } else {
        skippedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `UNIBE professors processed: ${addedCount} added, ${skippedCount} skipped`,
      total: unibeProfessors.length
    });

  } catch (error) {
    console.error('Error adding UNIBE professors:', error);
    return NextResponse.json(
      { error: 'Failed to add UNIBE professors' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const professorsCollection = collection(db, 'professors');
    const unibeQuery = query(
      professorsCollection,
      where('university', '==', 'UNIBE')
    );
    
    const querySnapshot = await getDocs(unibeQuery);
    const professors = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({
      success: true,
      professors,
      count: professors.length
    });

  } catch (error) {
    console.error('Error fetching UNIBE professors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch UNIBE professors' },
      { status: 500 }
    );
  }
} 